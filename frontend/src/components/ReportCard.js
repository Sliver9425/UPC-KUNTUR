import React from 'react';

export default function ReportCard({ descripcion, ubicacion, fecha, codigo, significado, mensaje, unidades, url }) {
  return (
    <div className="report-card">
      <div className="report-info">
        <div><b>Descripción:</b> {descripcion}</div>
        <div><b>Ubicación:</b> {ubicacion}</div>
        <div>
          <b>Fecha:</b> {new Date(fecha).toLocaleString('es-EC', { timeZone: 'America/Guayaquil' })}
        </div>
        <div>
          <b>Código:</b> {codigo} {significado && `- ${significado}`}
        </div>
        <div><b>Unidades:</b> {unidades}</div>
        {mensaje && (
          <div style={{ marginTop: '0.5rem', fontStyle: 'italic', color: '#384C81' }}>
            <b>Mensaje:</b> {mensaje}
          </div>
        )}
        {url && (
          <div>
            <b>Evidencia:</b> <a href={url} target="_blank" rel="noopener noreferrer">Ver archivo</a>
          </div>
        )}
      </div>
    </div>
  );
}