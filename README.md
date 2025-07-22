# KUNTUR UPC - Sistema de Gestión de Denuncias Policiales

## 📋 Descripción del Proyecto

KUNTUR UPC es un sistema web integral para la gestión y procesamiento automático de denuncias policiales. El sistema utiliza inteligencia artificial para clasificar denuncias, generar códigos policiales, y coordinar el despacho de unidades de emergencia en tiempo real.

## 🎯 Características Principales

- **Recepción de Denuncias Multimodal**: Acepta texto, imágenes, videos y coordenadas GPS
- **Clasificación Inteligente con IA**: Utiliza Google Gemini para asignar códigos policiales automáticamente
- **Geolocalización Automática**: Convierte coordenadas GPS en direcciones legibles
- **Streaming de Video en Tiempo Real**: Soporte para cámaras IP con transmisión MJPEG
- **Generación Automática de Documentos**: Crea partes policiales en formato PDF
- **Almacenamiento en la Nube**: Integración con Backblaze B2 para evidencias y documentos
- **Notificaciones en Tiempo Real**: Sistema WebSocket para actualizaciones instantáneas
- **Integración con Sistemas Externos**: Envío automático de documentos a backend externo

## 🏗️ Arquitectura del Sistema

### Backend (FastAPI)

```
backend/
├── app/
│   ├── main.py                 # Punto de entrada y endpoints principales
│   ├── database.py            # Configuración de base de datos PostgreSQL
│   ├── deps.py                # Dependencias de la aplicación
│   ├── models/
│   │   └── denuncia.py        # Modelo de datos para denuncias
│   ├── routers/
│   │   └── denuncias.py       # Rutas adicionales para denuncias
│   ├── schemas/
│   │   ├── denuncia.py        # Esquemas Pydantic para validación
│   │   └── denunciaesterna.py # Esquemas para integración externa
│   ├── services/
│   │   ├── ia.py              # Servicio de IA con Google Gemini
│   │   ├── backblaze.py       # Servicio de almacenamiento en la nube
│   │   ├── geolocalizacion.py # Servicio de geolocalización
│   │   └── pdf.py             # Generación de documentos PDF
│   ├── static/
│   │   └── kunturlogo.png     # Logo para documentos
│   ├── vectorestore/
│   │   └── codigos.json       # Base de datos de códigos policiales
│   └── ws/
│       └── manager.py         # Gestor de WebSockets
└── requirements.txt           # Dependencias del proyecto
```

### Frontend

El frontend está desarrollado en ReactJS  y se comunica con el backend a través de la API REST y WebSockets.

## 🔧 Tecnologías Utilizadas

### Backend
- **FastAPI**: Framework web moderno y rápido
- **SQLAlchemy + PostgreSQL**: ORM y base de datos relacional
- **Google Gemini**: IA para clasificación y análisis de denuncias
- **LangChain**: Framework para aplicaciones de IA
- **OpenCV**: Procesamiento de video e imágenes
- **Boto3**: Cliente para servicios de almacenamiento (Backblaze)
- **FPDF**: Generación de documentos PDF
- **WebSockets**: Comunicación en tiempo real

### Almacenamiento y Servicios
- **Backblaze B2**: Almacenamiento de evidencias y documentos
- **OpenStreetMap/Nominatim**: Servicio de geolocalización
- **PostgreSQL**: Base de datos principal

## 📊 Modelo de Datos

### Entidad Denuncia

```python
- id: Integer (Primary Key)
- descripcion: String (Requerido)
- ubicacion: String (Requerido)
- url: String (URL de evidencia)
- unidades: Integer (Número de unidades despachadas)
- codigo: String (Código policial asignado)
- fecha: DateTime (Timestamp de creación)
- mensaje: String (Mensaje del operador)
- significado: String (Significado del código policial)
- url_stream: String (URL de cámara IP)
- latitud: Float (Coordenada GPS)
- longitud: Float (Coordenada GPS)
```

## 🚀 API Endpoints

### Gestión de Denuncias
- `POST /denuncia` - Crear nueva denuncia con procesamiento IA
- `GET /denuncias` - Listar todas las denuncias (ordenadas por fecha)
- `GET /denuncias/ultimas` - Obtener las 3 denuncias más recientes
- `GET /denuncia/{id}/parte_pdf` - Generar y obtener PDF del parte policial

### Streaming de Video
- `GET /video_feed/{denuncia_id}` - Stream de video MJPEG de cámara IP

### Tiempo Real
- `WebSocket /ws` - Canal de notificaciones en tiempo real

## 🧠 Sistema de Inteligencia Artificial

El sistema utiliza Google Gemini 1.5 Flash para:

- **Análisis de Contexto**: Procesa descripción, ubicación y evidencia
- **Clasificación Automática**: Asigna códigos policiales según base de datos interna
- **Estimación de Recursos**: Determina número de unidades necesarias
- **Generación de Mensajes**: Crea comunicaciones formales para operadores

### Códigos Policiales Soportados

El sistema incluye 34+ códigos policiales estándar:

- **Emergencias**: Homicidio (8-01), Robo armado (5-39)
- **Accidentes**: Tránsito (6-01), Choque (6-06)
- **Situaciones especiales**: Bomba (8-85), Secuestro (8-15)
- **Servicios**: Refuerzo (12-70), Bomberos (12-34)

## 💾 Instalación y Configuración

### Requisitos Previos
- Python 3.8+
- PostgreSQL 12+
- Node.js 16+ (para frontend)

### Variables de Entorno (.env)

```env
DATABASE_URL=postgresql://usuario:password@localhost/kuntur_db
GEMINI_API_KEY=tu_clave_api_gemini
B2_KEY_ID=tu_key_id_backblaze
B2_SECRET_KEY=tu_secret_key_backblaze
B2_BUCKET=nombre_bucket_backblaze
```

### Instalación del Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Instalación del Frontend

```bash
cd frontend
npm install
npm start
```

## 🔄 Flujo de Procesamiento de Denuncias

1. **Recepción**: La denuncia llega vía API con datos multimodales
2. **Geolocalización**: Convierte coordenadas GPS en direcciones legibles
3. **Almacenamiento de Evidencia**: Sube archivos a Backblaze B2
4. **Análisis con IA**: Gemini procesa y clasifica la denuncia
5. **Persistencia**: Guarda en PostgreSQL con códigos asignados
6. **Generación PDF**: Crea parte policial automáticamente
7. **Notificación Externa**: Envía documento a sistema externo
8. **Broadcast**: Notifica en tiempo real vía WebSocket

## 🔐 Seguridad y Consideraciones

### Aspectos de Seguridad Implementados
- Validación de esquemas con Pydantic
- Manejo seguro de archivos subidos
- Sanitización de URLs de cámaras IP
- Control de errores en servicios externos

### Consideraciones de Producción
- CORS configurado para desarrollo (`allow_origins=["*"]`)
- Manejo de timeouts en servicios externos
- Cleanup automático de archivos temporales
- Logging de errores en integraciones

## 📱 Características Avanzadas

### Streaming de Video
- Soporte para cámaras IP con protocolo MJPEG
- Streaming en tiempo real sin almacenamiento local
- Integración directa con sistemas de videovigilancia

### Integración con Sistemas Externos
- Envío automático de documentos a backend externo
- Webhooks para notificaciones de estado
- API REST compatible con sistemas legacy

### Tiempo Real
- WebSocket manager para múltiples conexiones
- Notificaciones instantáneas de nuevas denuncias
- Broadcast de actualizaciones de estado

## 🛠️ Desarrollo y Mantenimiento

### Testing

```bash
cd backend
python app/test_opencv_ffmpeg.py  # Test de video streaming
python test_env.py               # Test de variables de entorno
```

### Estructura de Logs

El sistema registra:
- Errores de integración con servicios externos
- Fallos en procesamiento de IA
- Problemas de conectividad con cámaras IP

### Escalabilidad
- Arquitectura modular con servicios desacoplados
- Base de datos optimizada con índices
- Almacenamiento distribuido en la nube
- WebSockets con gestión eficiente de conexiones

## 🤝 Contribución

Para contribuir al proyecto:

1. Fork del repositorio
2. Crear branch feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit de cambios (`git commit -m 'Agregar nueva característica'`)
4. Push al branch (`git push origin feature/nueva-caracteristica`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo desarrollo para la Universidad Central del Ecuador (UCE).

---

**Equipo de Desarrollo**: KUNTUR UPC  
**Versión**: 1.0.0  
**Última Actualización**: 2025