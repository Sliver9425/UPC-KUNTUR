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
      <div className="left-column">
        <h2>Ultimas denuncias</h2>
        <ReportList onNewAlert={handleNewAlert} />
      </div>
      <div className="right-column">
        <h2>Crear nueva denuncia</h2>
        <ReportForm />
      </div>
      <AlertLogo alertActive={alertActive} alertData={alertData} onClose={handleCloseAlert} />
    </div>
  );
}