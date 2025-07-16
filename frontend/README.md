## 🧠 ¿Qué es "Kuntur UPC"?

Es una plataforma de *seguridad ciudadana asistida por IA* que permite:

* Recibir denuncias vía web.
* Subir evidencias multimedia.
* Usar *IA generativa (Gemini)* para interpretar el incidente.
* Clasificarlo por *código policial*.
* Generar y subir automáticamente un *PDF* del parte policial.
* Enviar alertas en *tiempo real a la policía (UPC)* y a *JusticIA*.
* Integrarse con cámaras IP (streaming en vivo).

---

## 🔄 Análisis del Diagrama (imagen)

### 1. *Origen de datos*

* *Cámaras, **micrófonos*, o formularios web son las fuentes de denuncia.
* Se visualiza una interfaz web de usuario con botones de alerta y formularios.

### 2. *Monitoreo en tiempo real*

* Los eventos se procesan en el dashboard "Kuntur Web", que se comunica con:

  * *Backblaze B2*: para guardar evidencia.
  * *IA (Gemini)*: para analizar la denuncia.
  * *MongoDB*: almacenamiento de resultados (solo si se activa esa persistencia).
  * *UPC*: recepción de alertas y opción para enviar agentes.

### 3. *Actores clave*

* *MongoDB*: almacena resultados enriquecidos.
* *Pantalla UPC*: muestra video + botón para "enviar agentes".
* *JusticIA*: recibe automáticamente el parte en PDF.

---

## 📁 Estructura y propósito de carpetas

### 📂 backend/ → FastAPI (Python)

| Archivo/Carpeta               | Función                                                           |
| ----------------------------- | ----------------------------------------------------------------- |
| main.py                     | Entrada principal: recibe denuncias, genera PDF, lanza WebSocket. |
| routers/denuncias.py        | Endpoints /denuncias, /denuncia/{id}/parte_pdf.               |
| schemas/                    | Validación Pydantic (entrada y salida).                           |
| models/denuncia.py          | Modelo de base de datos denuncias.                              |
| services/ia.py              | Usa LangChain + Gemini para interpretar denuncias.                |
| services/backblaze.py       | Sube archivos y PDFs a Backblaze B2.                              |
| services/geolocalizacion.py | Usa OpenStreetMap para obtener dirección desde coordenadas.       |
| services/pdf.py             | Alternativa para generar parte policial en PDF.                   |
| vectorestore/codigos.json   | Códigos policiales disponibles para la IA.                        |
| ws/manager.py               | Maneja conexiones WebSocket (clientes UPC/JusticIA).              |
| test_opencv_ffmpeg.py       | Prueba de compatibilidad con streams MJPEG vía OpenCV.            |
| requirements.txt            | Librerías requeridas.                                             |

---

### 📂 frontend/ → ReactJS

| Archivo/Carpeta                 | Función                                             |
| ------------------------------- | --------------------------------------------------- |
| components/                   | Componentes reutilizables como:                     |
| ReportForm.js                 | Formulario para ingresar nueva denuncia.            |
| ReportList.js                 | Muestra últimas denuncias.                          |
| ReportCard.js                 | Cada denuncia mostrada con detalles y descarga PDF. |
| AlertModal.js                 | Modal emergente cuando hay alerta nueva.            |
| AlertLogo.js                  | Botón flotante que activa AlertModal.             |
| pages/Home.js                 | Página principal que une todo.                      |
| public/                       | Archivos estáticos como index.html.               |
| styles/colors.css y App.css | Estilos visuales.                                   |
| package.json                  | Dependencias y scripts del frontend.                |

---

## 🔧 Flujo resumido (desde el formulario hasta JusticIA)

mermaid
graph TD
A[Formulario Web (usuario)] -->|POST /denuncia| B[FastAPI backend]
B --> C[IA Gemini (análisis)]
B --> D[Backblaze B2 (subida evidencia)]
B --> E[PostgreSQL (registro)]
B --> F[WebSocket: Enviar alerta]
F --> G[Pantalla UPC (video + botón)]
E --> H[PDF parte generado y subido]
H --> I[JusticIA (recibe PDF)]


---

## 📦 Tecnologías usadas

* *Backend*: FastAPI, SQLAlchemy, PostgreSQL, boto3, LangChain, Gemini, WebSocket.
* *Frontend*: React, framer-motion, react-icons, WebSocket client.
* *Otros*: Backblaze B2 (almacenamiento), OpenCV (video), FPDF (PDF), MongoDB (opcional).

---

## 🧩 Casos de uso clave

* *Vecino* sube evidencia → *IA analiza y genera parte* → *UPC recibe alerta y decide acción* → *JusticIA recibe documentación formal*.

---
