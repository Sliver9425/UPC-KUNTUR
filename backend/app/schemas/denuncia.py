from pydantic import BaseModel
from datetime import datetime

class DenunciaOut(BaseModel):
    id: int
    descripcion: str
    ubicacion: str
    url: str
    unidades: int
    fecha: datetime

    class Config:
        orm_mode = True
