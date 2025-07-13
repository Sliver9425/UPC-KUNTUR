# 🛡️ **Kuntur UPC** 👮‍♂️📡

*Sistema inteligente para recepción, análisis y despacho de denuncias en tiempo real desde una Unidad de Policía Comunitaria.*

🎯 **Recibe evidencias, clasifícalas con IA, y genera partes policiales automáticamente para la pantalla JusticIA.**

---

## 📌 Descripción

**Kuntur UPC** es un sistema integrado dentro del ecosistema Kuntur que centraliza la recepción de evidencias (video, imágenes, archivos PDF), las analiza con inteligencia artificial y genera partes policiales estructurados según normativa ecuatoriana.
El sistema se comunica con una pantalla operativa en la UPC, que permite tomar decisiones (enviar agentes, emitir alertas), y sincroniza con la pantalla **JusticIA**, donde se muestran los partes procesados.

Las evidencias son almacenadas en **Backblaze B2**, el análisis semántico es procesado por **Gemini (Google GenAI)** y toda la información queda persistida en **MongoDB**.

---

## 🎯 Objetivos del módulo UPC

✅ Automatizar la generación de partes policiales.
✅ Clasificar denuncias usando lenguaje natural e IA policial.
✅ Permitir el envío de video en tiempo real desde dispositivos externos.
✅ Habilitar panel de control UPC con botón de despacho.
✅ Transmitir parte final a pantalla central de JusticIA.

---

## 🛠️ Tecnologías utilizadas

### ⚙️ Backend

| Herramienta                                                                              | Descripción                                   |
| ---------------------------------------------------------------------------------------- | --------------------------------------------- |
| ![FastAPI](https://img.shields.io/badge/FastAPI-Framework-teal?logo=fastapi)             | API REST principal                            |
| ![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-ORM-red?logo=python)               | ORM para modelo `Denuncia`                    |
| ![MongoDB](https://img.shields.io/badge/MongoDB‑Atlas-NoSQL-brightgreen?logo=mongodb)    | Persistencia general (parte integrada global) |
| ![Backblaze](https://img.shields.io/badge/Backblaze-B2%20Storage-black?logo=backblaze)   | Almacenamiento de evidencias multimedia       |
| ![Gemini](https://img.shields.io/badge/Google%20Gemini-IA%20Policial-yellow?logo=google) | Clasificación automática de denuncias         |
| ![FPDF](https://img.shields.io/badge/FPDF-PDF--gen-blue?logo=adobeacrobatreader)         | Generación de partes policiales PDF           |
| ![OpenCV](https://img.shields.io/badge/OpenCV-Video%20Stream-red?logo=opencv)            | Soporte a transmisión MJPEG                   |
| ![Uvicorn](https://img.shields.io/badge/Uvicorn-ASGI-blue?logo=python)                   | Server ASGI para FastAPI                      |

### 🎨 Frontend

| Herramienta                                                                                | Descripción                     |
| ------------------------------------------------------------------------------------------ | ------------------------------- |
| ![React](https://img.shields.io/badge/React-JSX-blue?logo=react)                           | Interfaz SPA para monitoreo     |
| ![WebSockets](https://img.shields.io/badge/WebSocket-RealTime-blueviolet?logo=websocket)   | Alerta de nueva denuncia        |
| ![Fetch API](https://img.shields.io/badge/Fetch-API%20REST%20calls-orange?logo=javascript) | Envío de formularios y archivos |

---

## 📂 Estructura del repositorio

```
sliver9425-upc-kuntur/
├── backend/
│   ├── test_env.py              # Carga de variables de entorno
│   ├── requirements.txt         # Dependencias Python
│   └── app/
│       ├── main.py              # Rutas principales (denuncia, PDF, WS)
│       ├── database.py          # Conexión PostgreSQL
│       ├── deps.py              # Dependency injection para DB
│       ├── models/denuncia.py   # Modelo ORM de denuncia
│       ├── schemas/             # Esquemas Pydantic
│       ├── services/
│       │   ├── ia.py            # IA con Gemini para clasificar denuncias
│       │   ├── pdf.py           # Generador de parte policial
│       │   ├── backblaze.py     # Conector Backblaze
│       │   └── geolocalizacion.py# Dirección desde coordenadas
│       ├── vectorestore/codigos.json  # Códigos policiales utilizados
│       └── ws/manager.py        # WebSocket manager
├── frontend/
│   ├── src/
│   │   ├── components/          # ReportCard, ReportForm, AlertModal
│   │   ├── pages/Home.js        # Layout principal UPC
│   │   └── styles/colors.css    # Paleta visual institucional
│   └── public/                  # Static assets
└── docker-compose.yml           # (opcional)
```

---

## 🚀 Instalación y ejecución

### 📋 Requisitos previos

- **Python 3.10+**
- **Node 18+**
- **MongoDB Atlas o local**
- **Cuenta Backblaze B2**
- Variables de entorno:

```env
DATABASE_URL=postgresql://usuario:pass@localhost:5432/kuntur
B2_KEY_ID=<tu_clave>
B2_SECRET_KEY=<tu_secreto>
B2_BUCKET=kuntur-evidencias
GEMINI_API_KEY=<api_google_genai>
```

---

### ⚙️ Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 🌐 Frontend

```bash
cd frontend
npm install
npm start        # http://localhost:3000
```

---

## 📊 Funcionalidades destacadas

- 📦 Recepción de denuncias con archivos o URLs.
- 🔍 Clasificación automática con IA (código policial, unidades, mensaje).
- 🛰️ Transmisión en tiempo real desde cámaras móviles o fijas (MJPEG).
- 📄 Generación de partes policiales en PDF y subida a la nube.
- ⚡ Notificaciones instantáneas en la pantalla UPC con botón de “Enviar agentes”.
- 🧠 Visualización final del parte en la pantalla central de **JusticIA**.

---

## 🧪 Ejemplo rápido

```bash
curl -X POST http://localhost:8000/denuncia \
     -F 'descripcion=Robo en el parque' \
     -F 'ubicacion=Parque El Ejido' \
     -F 'archivo=@/ruta/a/foto.jpg'
```

Respuesta esperada:

```json
{
  "status": "ok",
  "unidades": 2,
  "codigo": "5-11",
  "id": 21,
  "ubicacion": "Parque El Ejido"
}
```

---

## 🧱 Dependencias clave

```txt
# backend/requirements.txt (extracto)
fastapi
uvicorn[standard]
sqlalchemy
psycopg2-binary
boto3
langchain
langchain-google-genai
fpdf
opencv-python
```

```jsonc
// frontend/package.json (extracto)
"react": "^19",
"web-vitals": "^2.1.4"
```

---

## 🌟 Mejoras futuras

🚨 Autenticación por operador con roles.
🎥 Soporte a múltiples cámaras con selección dinámica.
📡 WebRTC para streaming más eficiente.
🧾 Registro histórico de partes firmados digitalmente.
🧪 Pruebas automatizadas y métricas de respuesta.

---

## 🧑‍💻 **Autores módulo UPC**

📧 [daquezadal@uce.edu.ec](mailto:daquezadal@uce.edu.ec)
📧 [esherrera@uce.edu.ec](mailto:esherrera@uce.edu.ec)
📧 [jaquimba@uce.edu.ec](mailto:jaquimba@uce.edu.ec)

---

## 📃 Licencia

Distribuido bajo licencia **MIT** — revisa el archivo `LICENSE`.

---

🔐 **Kuntur UPC — Tu Unidad Policial conectada con IA.**
🛰️ _Justicia más ágil, más inteligente, más humana._
