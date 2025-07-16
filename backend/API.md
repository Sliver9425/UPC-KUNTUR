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
- **Descripción:** Recibe una nueva denuncia, procesa la información, almacena en la base de datos y notifica por WebSocket.
- **Parámetros (form-data):**
  - descripcion (str, requerido): Descripción de la denuncia.
  - ubicacion (str, opcional): Ubicación textual.
  - latitud (float, opcional): Coordenada.
  - longitud (float, opcional): Coordenada.
  - archivo (UploadFile, opcional): Evidencia como archivo.
  - url (str, opcional): Evidencia como URL.
  - url_stream (str, opcional): URL de stream de video.
- **Respuesta:**
  - status, unidades, codigo, id, ubicacion, latitud, longitud

### GET /denuncia/{id}/parte_pdf
- **Descripción:** Genera y sube el PDF del parte policial de una denuncia específica a Backblaze.
- **Parámetros:**
  - id (int, path): ID de la denuncia.
- **Respuesta:**
  - url_pdf: URL pública del PDF generado.

### GET /video_feed
- **Descripción:** Devuelve un stream de video MJPEG desde una fuente configurada.
- **Respuesta:**
  - StreamingResponse con frames JPEG.

### WebSocket /ws
- **Descripción:** Canal WebSocket para notificaciones en tiempo real de nuevas denuncias.
- **Uso:**
  - Conectar al endpoint para recibir mensajes JSON cuando se registre una nueva denuncia.

## Esquemas de datos
- Ver los archivos en `app/schemas/` para la estructura de los datos enviados y recibidos.

## Notas
- Actualmente, solo existe el router de denuncias y los endpoints definidos en main.py. Si se agregan más routers, documentar aquí sus endpoints. 