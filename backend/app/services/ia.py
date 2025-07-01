import os
import openai

openai.api_key = os.getenv("OPENAI_API_KEY")

def estimar_unidades(prompt: str) -> int:
    if not openai.api_key:
        print("[SIMULACIÓN] No se encontró OPENAI_API_KEY, devolviendo valor fijo.")
        return 2  # valor simulado por defecto
    
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}]
        )
        unidades = int(''.join(filter(str.isdigit, response.choices[0].message.content)))
        return unidades
    except Exception as e:
        print(f"Error con OpenAI: {e}")
        return 1  # Valor de respaldo en caso de error
