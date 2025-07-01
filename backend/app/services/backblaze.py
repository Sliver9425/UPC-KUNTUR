import os
import uuid
import boto3
from fastapi import UploadFile
from dotenv import load_dotenv

load_dotenv()  # Carga variables de entorno del .env

# Cliente boto3 para Backblaze B2
s3 = boto3.client(
    's3',
    endpoint_url='https://s3.us-east-005.backblazeb2.com',
    aws_access_key_id=os.getenv("B2_KEY_ID"),
    aws_secret_access_key=os.getenv("B2_SECRET_KEY"),
)

BUCKET_NAME = os.getenv("B2_BUCKET")

async def subir_archivo_backblaze(archivo: UploadFile) -> str:
    file_id = str(uuid.uuid4())
    extension = archivo.filename.split(".")[-1]
    file_key = f"evidencias/{file_id}.{extension}"

    # Sube el archivo a Backblaze
    try:
        s3.upload_fileobj(
    archivo.file,
    BUCKET_NAME,
    file_key,
    ExtraArgs={"ContentType": archivo.content_type, "ContentDisposition": "inline"}
)

    except Exception as e:
        print("Error subiendo archivo a Backblaze:", e)
        raise e

    url = f"https://{BUCKET_NAME}.s3.us-east-005.backblazeb2.com/{file_key}"
    return url
