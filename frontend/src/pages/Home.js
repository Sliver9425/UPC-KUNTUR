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
    <div className="main-layout">
      <section className="left-column">
        <h2>Últimas denuncias</h2>
        <ReportList refresh={refreshReports} onNewAlert={handleNewAlert} />
      </section>
      <section className="right-column">
        <h2>Crear nueva denuncia</h2>
        <ReportForm />
      </section>
      <AlertLogo alertActive={alertActive} alertData={alertData} onClose={handleCloseAlert} />
    </div>
  );
}