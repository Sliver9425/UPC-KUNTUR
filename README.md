# Proyecto UPC

Este repositorio contiene una aplicación web compuesta por un backend (Python/FastAPI) y un frontend (ReactJS). El objetivo principal es gestionar denuncias, incluyendo almacenamiento, geolocalización y procesamiento de archivos.

## Estructura del proyecto

- `backend/`: API, lógica de negocio, servicios y modelos de datos.
- `frontend/`: Aplicación web en React para la interacción con usuarios.

## Instalación y ejecución

### Backend

1. Instala las dependencias:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
2. Ejecuta el servidor:
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend

1. Instala las dependencias:
   ```bash
   cd frontend
   npm install
   ```
2. Ejecuta la aplicación:
   ```bash
   npm start
   ```

## Notas
- Asegúrate de tener Python 3.8+ y Node.js instalados.
- El frontend utiliza librerías npm adicionales para UI/UX modernas (ver README del frontend).
- Consulta los README de cada subcarpeta para más detalles. 