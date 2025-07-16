# Explicación de dependencias (requirements.txt)

Este archivo describe brevemente el propósito de cada librería utilizada en el backend.

| Librería                | Propósito                                                                 |
|-------------------------|--------------------------------------------------------------------------|
| fastapi                 | Framework web moderno y rápido para construir APIs con Python.            |
| uvicorn[standard]       | Servidor ASGI para ejecutar aplicaciones FastAPI.                         |
| sqlalchemy              | ORM para interactuar con bases de datos relacionales desde Python.        |
| psycopg2-binary         | Driver para conectar Python con bases de datos PostgreSQL.                |
| python-dotenv           | Carga variables de entorno desde archivos .env.                           |
| boto3                   | SDK de AWS para Python (usado para servicios como S3, Backblaze, etc).    |
| python-multipart        | Manejo de formularios y archivos subidos vía HTTP.                        |
| langchain               | Framework para construir aplicaciones con modelos de lenguaje (IA).        |
| langchain-google-genai  | Integración de LangChain con modelos generativos de Google.               |
| fpdf                    | Generación de archivos PDF desde Python.                                  |
| opencv-python           | Procesamiento de imágenes y video.                                        |
| requests                | Realización de peticiones HTTP de manera sencilla.                        |

Puedes ampliar esta tabla si agregas nuevas dependencias o si alguna cambia de propósito en el futuro. 