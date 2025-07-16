# Backend UPC

Este directorio contiene el backend de la aplicación, desarrollado con FastAPI.

## Estructura
- `app/`: Código principal de la aplicación.
  - `database.py`: Configuración de la base de datos.
  - `models/`: Modelos de datos.
  - `routers/`: Rutas/endpoints de la API.
  - `schemas/`: Esquemas Pydantic para validación.
  - `services/`: Servicios auxiliares (IA, PDF, geolocalización, etc).
  - `static/`: Archivos estáticos.
  - `ws/`: Websockets.
- `requirements.txt`: Dependencias de Python.

## Instalación

```bash
pip install -r requirements.txt
```

## Ejecución

```bash
uvicorn app.main:app --reload
```

## Notas
- Requiere Python 3.8 o superior.
- Configura las variables de entorno necesarias para la base de datos y servicios externos. 