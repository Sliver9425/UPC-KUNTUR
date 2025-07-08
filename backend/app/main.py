from fastapi import FastAPI, WebSocket, UploadFile, File, Form, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import Optional
import os

from .services.ia import estimar_unidades_y_codigo
from .services.backblaze import subir_archivo_backblaze
from .ws.manager import WebSocketManager
from .deps import get_db
from .models.denuncia import Denuncia, Base
from .database import engine
from .routers.denuncias import router as denuncias_router

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

# 📌 Endpoint para recibir denuncias con evidencia como archivo o URL
@app.post("/denuncia")
async def recibir_denuncia(
    descripcion: str = Form(...),
    ubicacion: str = Form(...),
    archivo: Optional[UploadFile] = File(None),
    url: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    # Validar entrada
    if not archivo and not url:
        raise HTTPException(status_code=400, detail="Debe enviar una evidencia como archivo o como URL")
    if archivo and url:
        raise HTTPException(status_code=400, detail="No puede enviar archivo y URL al mismo tiempo")

    # Usar Backblaze si se subió archivo
    if archivo:
        url_evidencia = await subir_archivo_backblaze(archivo)
    else:
        url_evidencia = url

    # Estimar unidades y código policial
    resultado = estimar_unidades_y_codigo(descripcion, ubicacion, url_evidencia)
    unidades = resultado.get("unidades", 1)
    codigo = resultado.get("codigo", "N/A")

    # Guardar denuncia en la base de datos
    denuncia = Denuncia(
        descripcion=descripcion,
        ubicacion=ubicacion,
        url=url_evidencia,
        unidades=unidades,
        codigo=codigo
    )
    db.add(denuncia)
    db.commit()
    db.refresh(denuncia)

    # Enviar notificación por WebSocket
    await ws_manager.broadcast({
        "tipo": "nueva_denuncia",
        "descripcion": descripcion,
        "ubicacion": ubicacion,
        "url": url_evidencia,
        "unidades": unidades,
        "codigo": codigo
    })

    return {
        "status": "ok",
        "unidades": unidades,
        "codigo": codigo,
        "id": denuncia.id
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
