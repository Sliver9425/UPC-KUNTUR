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
    # Campos adicionales para el formulario mejorado:
    categoria: str | None = 'general'
    prioridad: str | None = 'normal'

    class Config:
        from_attributes = True
