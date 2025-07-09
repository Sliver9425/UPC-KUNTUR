import React from 'react';

export default function AlertModal({ data, onClose }) {
  if (!data) return null;

  return (
    <div className="alert-modal-overlay">
      <div className="alert-modal">
        <img src="/kunturlogo-red.svg" alt="Kuntur Alerta" className="alert-modal-logo" />
        <h2>🚨 Nueva Alerta de Denuncia</h2>
        <div className="alert-modal-details">
          <div><b>Descripción:</b> {data.descripcion}</div>
          <div><b>Ubicación:</b> {data.ubicacion}</div>
          <div>
            <b>Código:</b> {data.codigo} - {data.significado}
          </div>
          <div><b>Unidades:</b> {data.unidades}</div>
          {data.mensaje && (
            <div style={{ marginTop: '0.5rem', fontStyle: 'italic', color: '#384C81' }}>
              <b>Mensaje:</b> {data.mensaje}
            </div>
          )}
          <div>
            <b>Evidencia:</b> <a href={data.url} target="_blank" rel="noopener noreferrer">Ver archivo</a>
          </div>
        </div>
        <button className="btn-submit" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
}