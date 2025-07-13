import requests

def obtener_direccion_desde_coordenadas(lat, lng):
    url = "https://nominatim.openstreetmap.org/reverse"
    params = {
        "lat": lat,
        "lon": lng,
        "format": "json",
        "accept-language": "es"
    }
    headers = {
        "User-Agent": "UPCApp/1.0 (damianalejandro.9422@gmail.com)"  
    }
    try:
        response = requests.get(url, params=params, headers=headers, timeout=10)
        data = response.json()
        if response.status_code == 200 and "display_name" in data:
            return data["display_name"]
        else:
            return f"Coordenadas: {lat}, {lng}"
    except Exception as e:
        print(f"Error obteniendo dirección: {e}")
        return f"Coordenadas: {lat}, {lng}"