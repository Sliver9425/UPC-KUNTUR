import React, { useEffect, useState, useRef } from 'react';
import ReportCard from './ReportCard';

export default function ReportList({ refresh, onNewAlert }) {
  const [reports, setReports] = useState([]);
  const ws = useRef(null);

  // Función para obtener las 3 últimas denuncias
  const fetchReports = () => {
    fetch('http://localhost:8000/denuncias/ultimas')
      .then(res => res.json())
      .then(data => setReports(data))
      .catch(() => setReports([]));
  };

  useEffect(() => {
    fetchReports();

    ws.current = new WebSocket('ws://localhost:8000/ws');
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.tipo === 'nueva_denuncia') {
        fetchReports(); // Actualiza el listado cuando llega una nueva denuncia
        if (onNewAlert) onNewAlert(data); // Activa la alerta
      }
    };

    return () => {
      if (ws.current) ws.current.close();
    };
  }, [refresh]);

  return (
    <div>
      {reports.map(report => (
        <ReportCard key={report.id} {...report} />
      ))}
    </div>
  );
}