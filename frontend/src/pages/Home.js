import React, { useState, useRef } from 'react';
import ReportList from '../components/ReportList';
import ReportForm from '../components/ReportForm';
import AlertLogo from '../components/AlertLogo';

export default function Home() {
  const [refreshReports, setRefreshReports] = useState(false);
  const [alertActive, setAlertActive] = useState(false);
  const [alertData, setAlertData] = useState(null); // Guarda los datos de la denuncia recibida


  const handleManualReport = () => {
    setRefreshReports(prev => !prev); // Cambia el valor para forzar el refetch
  };

  // Recibe la data de la nueva denuncia desde ReportList
  const handleNewAlert = (data) => {
    setAlertActive(true);
    setAlertData(data);
    setRefreshReports(prev => !prev);    
  };

  // Cuando se cierra el modal, resetea la alerta
  const handleCloseAlert = () => {
    setAlertActive(false);
    setAlertData(null);
  };

  return (
    <div className="main-layout main-layout-centered">
      <div className="centered-content-row">
        <div className="centered-image-container">
          <img
            src="/kuntur-edificio.jpg"
            alt="Kuntur UPC Edificio"
            className="centered-image"
          />
        </div>
        <div className="centered-form-container">
          <div className="form-card">
            <h2 style={{ textAlign: 'center', margin: '1.2rem 0 1.5rem 0' }}>Crear nueva denuncia</h2>
            <ReportForm />
          </div>
        </div>
      </div>
      <section className="left-column">
        <h2>Últimas denuncias</h2>
        <ReportList refresh={refreshReports} onNewAlert={handleNewAlert} />
      </section>
      <AlertLogo alertActive={alertActive} alertData={alertData} onClose={handleCloseAlert} />
    </div>
  );
}