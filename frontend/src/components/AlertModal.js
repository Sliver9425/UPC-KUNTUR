import React from 'react';

export default function AlertModal({ data, onClose }) {
  if (!data) return null;

  // Usa la URL de transmisión si está disponible, si no, oculta el visor
  const streamUrl = data.url_stream; // Este campo debe venir desde el backend

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
          {/* NUEVO: Visor MJPEG en tiempo real */}
          {streamUrl && (
            <div style={{ marginTop: '0.5rem' }}>
              <b>Cámara en vivo:</b>
              <div>
                <img
                  src={streamUrl}
                  alt="Cámara en tiempo real"
                  style={{ width: '100%', maxWidth: 400, borderRadius: 8, border: '2px solid #74409B', marginTop: 8 }}
                />
              </div>
            </div>
          )}
        </div>
        <button className="btn-submit" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
}