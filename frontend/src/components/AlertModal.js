// src/components/AlertModal.js
import React from 'react';

export default function AlertModal({ onClose }) {
  return (
    <div className="alert-modal-overlay">
      <div className="alert-modal">
        <img src="/kunturlogo-red.svg" alt="Kuntur Alerta" className="alert-modal-logo" />
        <h2>🚨 Nueva Alerta de Denuncia</h2>
        <div className="alert-modal-details">
          <div><b>Título:</b> Robo en Solanda</div>
          <div><b>Fecha:</b> 2024-07-03</div>
          <div><b>Estado:</b> En análisis</div>
          <div><b>Ubicación:</b> Quito</div>
        </div>
        <button className="btn-submit" onClick={onClose}>Ver resultado de análisis IA</button>
      </div>
    </div>
  );
}