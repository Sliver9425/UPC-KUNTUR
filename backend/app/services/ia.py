# services/ia.py
import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def estimar_unidades_y_codigo(prompt: str) -> dict:
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(prompt)

    # Inicializamos valores por defecto
    unidades = 1
    codigo = "Desconocido"

    if response.text:
        for line in response.text.splitlines():
            line = line.strip().lower()
            if line.startswith("unidades:"):
                unidades = int(''.join(filter(str.isdigit, line)))
            elif line.startswith("código:") or line.startswith("codigo:"):
                codigo = line.split(":")[1].strip().upper()

    return {"unidades": unidades, "codigo": codigo}
