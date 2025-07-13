from pydantic import BaseModel
from datetime import datetime

class DenunciaOut(BaseModel):
    id: int
    descripcion: str
    ubicacion: str
    url: str
    unidades: int
    codigo: str | None
    fecha: datetime
    # NUEVO:
    mensaje: str | None = None
    significado: str | None = None
    url_stream: str | None = None
    latitud: float | None = None
    longitud: float | None = None

    class Config:
        from_attributes = True
