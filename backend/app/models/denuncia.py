from sqlalchemy import Column, Integer, String, DateTime, Float
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime, timezone

Base = declarative_base()

class Denuncia(Base):
    __tablename__ = 'denuncias'

    id = Column(Integer, primary_key=True, index=True)
    descripcion = Column(String, nullable=False)
    ubicacion = Column(String, nullable=False)
    url = Column(String, nullable=False)
    unidades = Column(Integer, nullable=False)
    codigo = Column(String(200), nullable=True)
    fecha = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    # NUEVO:
    mensaje = Column(String, nullable=True)
    significado = Column(String, nullable=True)
    url_stream = Column(String, nullable=True)
    latitud = Column(Float, nullable=True)
    longitud = Column(Float, nullable=True)