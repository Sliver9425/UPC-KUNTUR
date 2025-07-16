# Changelog

Todos los cambios importantes en este proyecto se documentarán en este archivo.

## [Unreleased]
- Estructura inicial de documentación en Markdown.
- El endpoint de video ahora es dinámico: `/video_feed/{denuncia_id}` usa la URL de cámara almacenada en la denuncia.
- Tras registrar una denuncia, se genera el PDF del parte policial, se sube a Backblaze y se envía automáticamente la URL pública del PDF a un backend externo. 