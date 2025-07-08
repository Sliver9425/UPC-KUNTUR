from fastapi import FastAPI, WebSocket, UploadFile, File, Form, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import os

from .services.ia import estimar_unidades_y_codigo  # 👈 función que usa LangChain + Gemini
from .services.backblaze import subir_archivo_backblaze
from .ws.manager import WebSocketManager
from .deps import get_db
from .models.denuncia import Denuncia, Base
from .database import engine
from .routers.denuncias import router as denuncias_router

# Crear instancia de la app
app = FastAPI()

# Configurar CORS para permitir conexiones desde cualquier origen (útil para pruebas)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Cambiar en producción
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Crear las tablas en la base de datos
Base.metadata.create_all(bind=engine)

# Incluir rutas del router de denuncias si se usa archivo aparte
app.include_router(denuncias_router)

# Inicializar WebSocket manager
ws_manager = WebSocketManager()

# Endpoint principal de recepción de denuncias
@app.post("/denuncia")
async def recibir_denuncia(
    descripcion: str = Form(...),
    ubicacion: str = Form(...),
    archivo: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # 1. Subir archivo a Backblaze
    url = await subir_archivo_backblaze(archivo)

    # 2. Generar prompt para IA
    prompt = f"""
    Clasifica el tipo de delito y responde SOLO en este formato:

    Unidades: <número de unidades policiales>
    Código: <código policial real más adecuado>

    Reporte: {descripcion}
    Ubicación: {ubicacion}
    Evidencia: {url}
    """

    # 3. Estimar unidades y código con LangChain + Gemini
    resultado = estimar_unidades_y_codigo(descripcion, ubicacion, url)
    unidades = resultado.get("unidades", 1)
    codigo = resultado.get("codigo", "N/A")

    # 4. Guardar en base de datos
    denuncia = Denuncia(
        descripcion=descripcion,
        ubicacion=ubicacion,
        url=url,
        unidades=unidades,
        codigo=codigo  # 👈 Asegúrate que este campo exista en el modelo
    )
    db.add(denuncia)
    db.commit()
    db.refresh(denuncia)

    # 5. Notificar a clientes WebSocket conectados
    await ws_manager.broadcast({
        "tipo": "nueva_denuncia",
        "descripcion": descripcion,
        "ubicacion": ubicacion,
        "url": url,
        "unidades": unidades,
        "codigo": codigo
    })

    # 6. Respuesta
    return {
        "status": "ok",
        "unidades": unidades,
        "codigo": codigo,
        "id": denuncia.id
    }

# WebSocket para alertas en tiempo real
@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    await ws_manager.connect(ws)
    try:
        while True:
            await ws.receive_text()  # No se usa entrada, pero permite mantener conexión
    except:
        await ws_manager.disconnect(ws)

