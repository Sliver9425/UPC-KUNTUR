# Frontend UPC

Este directorio contiene el frontend de la aplicación, desarrollado con ReactJS.

## Estructura
- `src/`: Código fuente principal.
  - `components/`: Componentes reutilizables (formularios, listas, modales, etc).
  - `pages/`: Páginas principales de la app.
  - `styles/`: Archivos de estilos CSS.
- `public/`: Archivos públicos y recursos estáticos.
- `package.json`: Dependencias y scripts de npm.

## Instalación

```bash
npm install
```

## Ejecución

```bash
npm start
```

## Dependencias principales

- **react-icons**: Iconografía moderna y consistente para React.
  - Instalación: `npm install react-icons`
  - [Documentación oficial](https://react-icons.github.io/react-icons/)
- **framer-motion**: Animaciones y transiciones fluidas en React.
  - Instalación: `npm install framer-motion`
  - [Documentación oficial](https://www.framer.com/motion/)
- **react-dropzone**: Drag & drop para subida de archivos.
  - Instalación: `npm install react-dropzone`
  - [Documentación oficial](https://react-dropzone.js.org/)
- **date-fns-tz**: Conversión y formateo de fechas en zonas horarias específicas (usado para mostrar la hora de Ecuador correctamente en las denuncias).
  - Instalación: `npm install date-fns-tz`
  - [Documentación oficial](https://date-fns.org/v3.6.0/docs/Time-Zones)

## Notas
- Requiere Node.js y npm instalados.
- Puedes personalizar los estilos en `src/styles/`.
- Consulta la documentación de cada librería para ejemplos avanzados.
- Las fechas de las denuncias se muestran en la zona horaria de Ecuador (America/Guayaquil) usando `date-fns-tz`.
