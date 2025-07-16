# Documentación de la API

Este archivo describe todos los endpoints disponibles en el backend.

## Endpoints

### GET /denuncias
- **Descripción:** Lista todas las denuncias ordenadas por fecha descendente.
- **Respuesta:** Lista de objetos DenunciaOut.

### GET /denuncias/ultimas
- **Descripción:** Lista las 3 denuncias más recientes.
- **Respuesta:** Lista de objetos DenunciaOut.

### POST /denuncia
- **Descripción:** Recibe una nueva denuncia, procesa la información, almacena en la base de datos, genera el PDF del parte policial, lo sube a Backblaze y notifica por WebSocket. Además, envía automáticamente la URL pública del PDF generado a un backend externo.
- **Parámetros (form-data):**
  - descripcion (str, requerido): Descripción de la denuncia.
  - ubicacion (str, opcional): Ubicación textual.
  - latitud (float, opcional): Coordenada.
  - longitud (float, opcional): Coordenada.
  - archivo (UploadFile, opcional): Evidencia como archivo.
  - url (str, opcional): Evidencia como URL.
  - url_stream (str, opcional): URL de stream de video (puede ser la URL/IP de una cámara IP).
- **Respuesta:**
  - status, unidades, codigo, id, ubicacion, latitud, longitud

### GET /denuncia/{id}/parte_pdf
- **Descripción:** Genera y sube el PDF del parte policial de una denuncia específica a Backblaze.
- **Parámetros:**
  - id (int, path): ID de la denuncia.
- **Respuesta:**
  - url_pdf: URL pública del PDF generado.

### GET /video_feed/{denuncia_id}
- **Descripción:** Devuelve un stream de video MJPEG desde la cámara IP asociada a la denuncia indicada. Usa la URL almacenada en el campo `url_stream` de la denuncia.
- **Parámetros:**
  - denuncia_id (int, path): ID de la denuncia.
- **Respuesta:**
  - StreamingResponse con frames JPEG.
- **Errores:**
  - 400 si la denuncia no tiene cámara asociada (campo `url_stream` vacío o nulo).
  - 404 si la denuncia no existe.

### WebSocket /ws
- **Descripción:** Canal WebSocket para notificaciones en tiempo real de nuevas denuncias.
- **Uso:**
  - Conectar al endpoint para recibir mensajes JSON cuando se registre una nueva denuncia.

## Esquemas de datos
- Ver los archivos en `app/schemas/` para la estructura de los datos enviados y recibidos.

## Notas
- Actualmente, solo existe el router de denuncias y los endpoints definidos en main.py. Si se agregan más routers, documentar aquí sus endpoints.
- El PDF del parte policial se sube automáticamente a Backblaze y su URL se envía a un backend externo tras cada nueva denuncia. 