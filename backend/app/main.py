from fastapi import FastAPI, WebSocket, UploadFile, File, Form, Depends
from fastapi.middleware.cors import CORSMiddleware
import os

from .services.ia import estimar_unidades
from .services.backblaze import subir_archivo_backblaze
from .ws.manager import WebSocketManager  # 👈 importación clara

from .deps import get_db
from sqlalchemy.orm import Session
from .models.denuncia import Denuncia, Base
from .database import engine

from .routers.denuncias import router as denuncias_router

app = FastAPI()

# CORS para frontend local u otros orígenes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inicializamos el WebSocket manager
ws_manager = WebSocketManager()

# Crear tablas en la base de datos si no existen
Base.metadata.create_all(bind=engine)

# Incluir rutas del router de denuncias (si lo usas aparte)
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

    # Consultar IA para estimar número de unidades
    prompt = f"""
    Delito reportado: {descripcion}
    Ubicación: {ubicacion}
    Evidencia: {url}
    Responde con el número estimado de unidades policiales necesarias.
    """
    unidades = estimar_unidades(prompt)

    # Guardar la denuncia en base de datos
    denuncia = Denuncia(
        descripcion=descripcion,
        ubicacion=ubicacion,
        url=url,
        unidades=unidades
    )
    db.add(denuncia)
    db.commit()
    db.refresh(denuncia)

    # Enviar alerta a todos los clientes WebSocket conectados
    await ws_manager.broadcast({
        "tipo": "nueva_denuncia",
        "descripcion": descripcion,
        "ubicacion": ubicacion,
        "url": url,
        "unidades": unidades
    })

    return {"status": "ok", "unidades": unidades, "id": denuncia.id}

@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    await ws_manager.connect(ws)
    try:
        while True:
            await ws.receive_text()  # Recibimos aunque no se use
    except:
        await ws_manager.disconnect(ws)

