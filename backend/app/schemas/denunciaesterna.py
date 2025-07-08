from pydantic import BaseModel, HttpUrl
from typing import Optional

class DenunciaExternaIn(BaseModel):
    """
    Esquema de entrada para denuncias externas.

    - Si se envía evidencia como archivo, NO incluir el campo 'url'.
    - Si se envía evidencia como URL, NO incluir el campo 'archivo'.
    - El campo 'archivo' no se modela aquí porque FastAPI lo recibe como UploadFile en el endpoint.
    """
    descripcion: str  # Descripción de la denuncia
    ubicacion: str    # Ubicación del incidente
    url: Optional[HttpUrl] = None  # Evidencia como URL (opcional)

    class Config:
        schema_extra = {
            "examples": {
                "con_url": {
                    "summary": "Ejemplo con URL de evidencia",
                    "value": {
                        "descripcion": "Robo en la calle principal",
                        "ubicacion": "Calle Principal 123",
                        "url": "https://ejemplo.com/evidencia.jpg"
                    }
                },
                "con_archivo": {
                    "summary": "Ejemplo con archivo de evidencia",
                    "description": "En este caso, el campo 'url' se omite y se adjunta un archivo en el formulario.",
                    "value": {
                        "descripcion": "Vandalismo en parque",
                        "ubicacion": "Parque Central"
                        # El archivo se adjunta como parte del formulario, no como campo del JSON.
                    }
                }
            }
        }