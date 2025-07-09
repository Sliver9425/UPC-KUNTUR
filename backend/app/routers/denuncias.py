from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..models.denuncia import Denuncia
from ..schemas.denuncia import DenunciaOut
from ..deps import get_db
from typing import List

router = APIRouter()

@router.get("/denuncias", response_model=List[DenunciaOut])
def listar_denuncias(db: Session = Depends(get_db)):
    return db.query(Denuncia).order_by(Denuncia.fecha.desc()).all()

@router.get("/denuncias/ultimas", response_model=List[DenunciaOut])
def ultimas_denuncias(db: Session = Depends(get_db)):
    return db.query(Denuncia).order_by(Denuncia.fecha.desc()).limit(3).all()
