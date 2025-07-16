import React, { useState } from 'react';
import AlertModal from './AlertModal';

export default function AlertLogo({ alertActive, alertData, onClose }) {
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    if (alertActive) setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    onClose();
  };

  return (
    <>
      <div
        className={`alert-logo floating-alert-icon${alertActive ? ' active' : ''}`}
        onClick={handleClick}
        title="Alerta Kuntur"
      >
        <img
          src={alertActive ? "/kunturlogo-red.svg" : "/kunturlogo.svg"}
          alt="Kuntur Logo"
        />
      </div>
      {showModal && <AlertModal data={alertData} onClose={handleClose} />}
    </>
  );
}