import os
import json
import re
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

Código: <código más adecuado>- <significado del código policial
Mensaje: <mensaje formal dirigido al operador, indicando cuántas unidades han sido despachadas y el motivo, usando lenguaje policial>
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

    resultado = {"codigo": "N/A", "unidades": 1, "significado": "", "mensaje": ""}

    try:
        # Extraer la línea de código y significado
        match_codigo = re.search(r'Código:\s*(\d+-\d+)\s*-\s*(.+)', response)
        if match_codigo:
            resultado["codigo"] = match_codigo.group(1).strip()
            resultado["significado"] = match_codigo.group(2).strip()
        else:
            # Fallback: solo código
            match_codigo_simple = re.search(r'Código:\s*(\d+-\d+)', response)
            if match_codigo_simple:
                resultado["codigo"] = match_codigo_simple.group(1).strip()
            else:
                # Último recurso: captura cualquier número
                match_codigo_num = re.search(r'Código:\s*(\d+)', response)
                if match_codigo_num:
                    resultado["codigo"] = match_codigo_num.group(1).strip()    

        # Extraer el mensaje formal
        match_mensaje = re.search(r'Mensaje:\s*(.+)', response, re.DOTALL)
        if match_mensaje:
            resultado["mensaje"] = match_mensaje.group(1).strip()

            # Extraer número de unidades del mensaje (busca "unidades" seguido de un número o palabra)
            match_unidades = re.search(r'(\d+)\s+unidades|una unidad|dos unidades|tres unidades|cuatro unidades|cinco unidades', resultado["mensaje"], re.IGNORECASE)
            if match_unidades:
                # Si es número
                if match_unidades.group(1):
                    resultado["unidades"] = int(match_unidades.group(1))
                else:
                    # Si es palabra, mapea a número
                    palabras_a_numeros = {
                        "una unidad": 1,
                        "dos unidades": 2,
                        "tres unidades": 3,
                        "cuatro unidades": 4,
                        "cinco unidades": 5
                    }
                    for palabra, numero in palabras_a_numeros.items():
                        if palabra in resultado["mensaje"].lower():
                            resultado["unidades"] = numero
                            break
    except Exception as e:
        print(f"[WARN] No se pudo parsear la respuesta correctamente: {e}")

    return resultado
