import React, { useState } from 'react';
import AlertModal from './AlertModal';

export default function AlertLogo() {
  const [showModal, setShowModal] = useState(false);
  const [alertActive, setAlertActive] = useState(false); // Cambia a true cuando haya alerta

  return (
    <>
      <div
        className={`alert-logo ${alertActive ? 'active' : ''}`}
        onClick={() => alertActive && setShowModal(true)}
        title="Alerta Kuntur"
      >
        <img
          src={alertActive ? "/kunturlogo-red.svg" : "/kunturlogo.svg"}
          alt="Kuntur Logo"
        />
      </div>
      {showModal && <AlertModal onClose={() => setShowModal(false)} />}
    </>
  );
}