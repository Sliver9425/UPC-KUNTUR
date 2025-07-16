from fastapi import FastAPI, WebSocket, UploadFile, File, Form, Depends, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import Optional
import os
import requests

from .services.ia import estimar_unidades_y_codigo
from .services.backblaze import subir_archivo_backblaze, subir_archivo_local_backblaze
from .services.geolocalizacion import obtener_direccion_desde_coordenadas
from .ws.manager import WebSocketManager
from .deps import get_db
from .models.denuncia import Denuncia, Base
from .database import engine
from .routers.denuncias import router as denuncias_router
from fpdf import FPDF
import tempfile
import uuid
import cv2
# Crear instancia de la app
app = FastAPI()

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ⚠️ En producción, limitar a dominios confiables
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Crear tablas si no existen
Base.metadata.create_all(bind=engine)

# Incluir rutas adicionales
app.include_router(denuncias_router)

# WebSocket manager
ws_manager = WebSocketManager()

@app.post("/denuncia")
async def recibir_denuncia(
    descripcion: str = Form(...),
    ubicacion: Optional[str] = Form(None),      # Texto libre
    latitud: Optional[float] = Form(None),      # Coordenadas
    longitud: Optional[float] = Form(None),     # Coordenadas
    archivo: Optional[UploadFile] = File(None),
    url: Optional[str] = Form(None),
    url_stream: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    # Procesar ubicación
    if latitud is not None and longitud is not None:
        direccion_final = obtener_direccion_desde_coordenadas(latitud, longitud)
    elif ubicacion:
        direccion_final = ubicacion
    else:
        direccion_final = "Ubicación no especificada"

    # Usar Backblaze si se subió archivo
    if archivo:
        url_evidencia = await subir_archivo_backblaze(archivo)
    else:
        url_evidencia = url

    # Estimar unidades y código policial
    resultado = estimar_unidades_y_codigo(descripcion, direccion_final, str(url_evidencia))
    unidades = resultado.get("unidades", 1)
    codigo = resultado.get("codigo", "N/A")
    mensaje = resultado.get("mensaje", "")
    significado = resultado.get("significado", "")

    # Guardar denuncia en la base de datos
    denuncia = Denuncia(
        descripcion=descripcion,
        ubicacion=direccion_final,
        latitud=latitud,
        longitud=longitud,
        url=url_evidencia,
        unidades=unidades,
        codigo=codigo,
        mensaje=mensaje,
        significado=significado,
        url_stream=url_stream
    )
    db.add(denuncia)
    db.commit()
    db.refresh(denuncia)

    # --- INICIO BLOQUE PDF Y ENVÍO ---
    import tempfile
    import uuid
    import os
    import requests

    # 1. Generar PDF temporalmente
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        generar_pdf_denuncia(denuncia, tmp.name)
        tmp_path = tmp.name

    # 2. Subir PDF a Backblaze y obtener la URL
    file_key = f"partes_policiales/{uuid.uuid4()}.pdf"
    url_pdf = subir_archivo_local_backblaze(tmp_path, file_key)

    # 3. Eliminar el archivo temporal
    os.remove(tmp_path)

    # 4. Enviar la URL al endpoint externo
    payload = {
        "id_denuncia": denuncia.id,
        "url_pdf": url_pdf,
        # Puedes agregar más datos si lo necesitas
    }
    try:
        # Cambia la URL por la del backend externo cuando esté disponible
        response = requests.post("https://url.de.la.otra.app/endpoint", json=payload)
        response.raise_for_status()  # Lanza error si la respuesta no es 2xx
    except Exception as e:
        print("Error enviando el PDF al endpoint externo:", e)
        # Aquí puedes decidir si solo loguear, reintentar, o notificar de alguna forma
    # --- FIN BLOQUE PDF Y ENVÍO ---

    # Enviar notificación por WebSocket
    await ws_manager.broadcast({
        "tipo": "nueva_denuncia",
        "descripcion": descripcion,
        "ubicacion": direccion_final,
        "latitud": latitud,
        "longitud": longitud,
        "url": url_evidencia,
        "unidades": unidades,
        "codigo": codigo,
        "significado": significado,
        "mensaje": mensaje,
        "url_stream": url_stream
    })

    return {
        "status": "ok",
        "unidades": unidades,
        "codigo": codigo,
        "id": denuncia.id,
        "ubicacion": direccion_final,
        "latitud": latitud,
        "longitud": longitud
    }

# 🛰 WebSocket para notificaciones en tiempo real
@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    await ws_manager.connect(ws)
    try:
        while True:
            await ws.receive_text()
    except:
        await ws_manager.disconnect(ws)

# Función auxiliar para generar el PDF del parte policial
def generar_pdf_denuncia(denuncia, output_path):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)

    # Logo centrado
    logo_path = os.path.join(os.path.dirname(__file__), "static", "kunturlogo.png")
    if not os.path.exists(logo_path):
        raise FileNotFoundError(f"Logo no encontrado en: {logo_path}")

    # Centrar el logo (asumiendo ancho de página 210mm y logo de 30mm)
    page_width = pdf.w
    logo_width = 30
    x_logo = (page_width - logo_width) / 2
    pdf.image(logo_path, x=x_logo, y=8, w=logo_width)

    pdf.ln(30)  # Espacio después del logo
    pdf.set_font("Arial", "B", 16)
    pdf.cell(0, 10, "KUNTUR UPC", ln=True, align="C")
    pdf.set_font("Arial", size=12)
    pdf.cell(0, 10, "Unidad: UPC Kuntur 1", ln=True, align="C")
    pdf.ln(10)

    # Usar multi_cell para todos los campos
    pdf.set_font("Arial", size=12)
    pdf.cell(0, 10, "Ubicación:", ln=True)
    pdf.multi_cell(0, 10, denuncia.ubicacion or "-")
    pdf.cell(0, 10, "ID Denuncia:", ln=True)
    pdf.multi_cell(0, 10, str(denuncia.id))
    pdf.cell(0, 10, "Mensaje:", ln=True)
    pdf.multi_cell(0, 10, denuncia.mensaje or "-")
    pdf.cell(0, 10, "Evidencia:", ln=True)
    pdf.multi_cell(0, 10, denuncia.url or "-")
    pdf.cell(0, 10, "Fecha:", ln=True)
    pdf.multi_cell(0, 10, str(denuncia.fecha))
    pdf.cell(0, 10, "Disposición final:", ln=True)
    pdf.multi_cell(0, 10, "Dirigido a JusticIA")

    pdf.output(output_path)

# Endpoint para generar y subir el PDF del parte policial a Backblaze
@app.get("/denuncia/{id}/parte_pdf")
def generar_parte_pdf(id: int, db: Session = Depends(get_db)):
    denuncia = db.query(Denuncia).get(id)
    if not denuncia:
        raise HTTPException(status_code=404, detail="Denuncia no encontrada")

    # Generar PDF temporalmente
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        generar_pdf_denuncia(denuncia, tmp.name)
        tmp_path = tmp.name

    # Subir a Backblaze
    file_key = f"partes_policiales/{uuid.uuid4()}.pdf"
    url_pdf = subir_archivo_local_backblaze(tmp_path, file_key)

    # Eliminar archivo temporal
    os.remove(tmp_path)

    return {"url_pdf": url_pdf}

@app.get("/video_feed/{denuncia_id}")
def video_feed(denuncia_id: int, db: Session = Depends(get_db)):
    # 1. Buscar la denuncia
    denuncia = db.query(Denuncia).get(denuncia_id)
    if not denuncia:
        raise HTTPException(status_code=404, detail="Denuncia no encontrada")
    
    # 2. Obtener la URL de la cámara
    url_stream = denuncia.url_stream
    if not url_stream:
        raise HTTPException(status_code=400, detail="La denuncia no tiene cámara asociada")
    
    # 3. Usar la URL en gen_frames
    def gen_frames(url):
        stream = requests.get(url, stream=True)
        bytes_data = b''
        for chunk in stream.iter_content(chunk_size=1024):
            bytes_data += chunk
            a = bytes_data.find(b'\xff\xd8')
            b = bytes_data.find(b'\xff\xd9')
            if a != -1 and b != -1:
                jpg = bytes_data[a:b+2]
                bytes_data = bytes_data[b+2:]
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + jpg + b'\r\n')
    
    return StreamingResponse(gen_frames(url_stream), media_type='multipart/x-mixed-replace; boundary=frame')
