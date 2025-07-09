import React from 'react';

export default function ReportCard({ descripcion, ubicacion, fecha, codigo, unidades, url }) {
  return (
    <div className="report-card">
      <div className="report-info">
        <div><b>Descripción:</b> {descripcion}</div>
        <div><b>Ubicación:</b> {ubicacion}</div>
        <div><b>Fecha:</b> {new Date(fecha).toLocaleString()}</div>
        <div><b>Código:</b> {codigo ?? 'N/A'}</div>
        <div><b>Unidades:</b> {unidades}</div>
        {url && (
          <div>
            <b>Evidencia:</b> <a href={url} target="_blank" rel="noopener noreferrer">Ver archivo</a>
          </div>
        )}
      </div>
    </div>
  );
}