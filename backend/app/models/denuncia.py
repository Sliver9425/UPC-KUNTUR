from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Denuncia(Base):
    __tablename__ = 'denuncias'

    id = Column(Integer, primary_key=True, index=True)
    descripcion = Column(String, nullable=False)
    ubicacion = Column(String, nullable=False)
    url = Column(String, nullable=False)
    unidades = Column(Integer, nullable=False)
    codigo = Column(String(200), nullable=True)  # 👈 Nuevo campo
    fecha = Column(DateTime, default=datetime.utcnow)
