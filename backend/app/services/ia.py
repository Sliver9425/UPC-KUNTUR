import os
import json
from dotenv import load_dotenv  # ✅ para cargar la API key
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.output_parsers import StrOutputParser

# ✅ Carga las variables del .env
load_dotenv()

# Ruta absoluta al archivo de códigos policiales
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CODES_PATH = os.path.normpath(os.path.join(BASE_DIR, "..", "vectorestore", "codigos.json"))

# Leer los códigos
with open(CODES_PATH, "r", encoding="utf-8") as f:
    codigos_policiales = json.load(f)

# Formatear los códigos en texto plano para el prompt
codigos_texto = "\n".join(f"{c['codigo']}: {c['descripcion']}" for c in codigos_policiales)

# Inicializar modelo Gemini 1.5 Flash
llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",
    google_api_key=os.getenv("GEMINI_API_KEY"),  # ✅ se toma desde el .env
    temperature=0.2
)

# Output parser para respuestas de texto
parser = StrOutputParser()

# Template del prompt con variables
template = """
Eres un asistente especializado en coordinación de emergencias. Con base en la denuncia recibida, responde usando los CÓDIGOS POLICIALES.

CÓDIGOS POLICIALES DISPONIBLES:
{codigos}

DENUNCIA:
Descripción: {descripcion}
Ubicación: {ubicacion}
Evidencia: {url}

RESPONDE SOLO en el siguiente formato:

Código: <código más adecuado>
Unidades: <número de unidades necesarias>
"""

prompt = ChatPromptTemplate.from_template(template)

# Función principal llamada desde main.py
def estimar_unidades_y_codigo(descripcion: str, ubicacion: str, url: str) -> dict:
    chain = prompt | llm | parser

    response = chain.invoke({
        "codigos": codigos_texto,
        "descripcion": descripcion,
        "ubicacion": ubicacion,
        "url": url
    })

    # Procesar respuesta: ejemplo -> "Código: 5-11\nUnidades: 3"
    resultado = {"codigo": "N/A", "unidades": 1}
    try:
        for line in response.splitlines():
            if "Código" in line:
                resultado["codigo"] = line.split(":")[1].strip()
            if "Unidades" in line:
                resultado["unidades"] = int(''.join(filter(str.isdigit, line)))
    except Exception as e:
        print(f"[WARN] No se pudo parsear la respuesta correctamente: {e}")

    return resultado
