from fastapi import FastAPI, WebSocket, UploadFile, File, Form, Depends
from fastapi.middleware.cors import CORSMiddleware
import os

from .services.ia import estimar_unidades_y_codigo  # 🔁 Usa nueva función LangChain
from .services.backblaze import subir_archivo_backblaze
from .ws.manager import WebSocketManager

from .deps import get_db
from sqlalchemy.orm import Session
from .models.denuncia import Denuncia, Base
from .database import engine

from .routers.denuncias import router as denuncias_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ws_manager = WebSocketManager()
Base.metadata.create_all(bind=engine)
app.include_router(denuncias_router)

@app.post("/denuncia")
async def recibir_denuncia(
    descripcion: str = Form(...),
    ubicacion: str = Form(...),
    archivo: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # Subir archivo a Backblaze
    url = await subir_archivo_backblaze(archivo)

    # Prompt con contexto y formato requerido
    prompt = f"""
    Clasifica el tipo de delito y responde SOLO en este formato:
    
    Unidades: <número de unidades policiales>
    Código: <código policial real más adecuado>

    Reporte: {descripcion}
    Ubicación: {ubicacion}
    Evidencia: {url}
    """

    resultado = estimar_unidades_y_codigo(prompt)
    unidades = resultado["unidades"]
    codigo = resultado["codigo"]

    # Guardar la denuncia en base de datos
    denuncia = Denuncia(
        descripcion=descripcion,
        ubicacion=ubicacion,
        url=url,
        unidades=unidades,
        codigo=codigo  # Asegúrate de que el modelo tenga este campo
    )
    db.add(denuncia)
    db.commit()
    db.refresh(denuncia)

    # Enviar alerta a WebSocket
    await ws_manager.broadcast({
        "tipo": "nueva_denuncia",
        "descripcion": descripcion,
        "ubicacion": ubicacion,
        "url": url,
        "unidades": unidades,
        "codigo": codigo
    })

    return {"status": "ok", "unidades": unidades, "codigo": codigo, "id": denuncia.id}

@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    await ws_manager.connect(ws)
    try:
        while True:
            await ws.receive_text()
    except:
        await ws_manager.disconnect(ws)

