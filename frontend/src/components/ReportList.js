import React, { useEffect, useState, useRef } from 'react';
import ReportCard from './ReportCard';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReportList({ refresh, onNewAlert }) {
  const [reports, setReports] = useState([]);
  const ws = useRef(null);

  // Función para obtener las 3 últimas denuncias
  const fetchReports = () => {
    fetch('http://localhost:8000/denuncias/ultimas')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setReports(data);
        } else {
          setReports([]); // O maneja el error como prefieras
        }
      })
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
    <div className="reports-grid">
      <AnimatePresence>
        {Array.isArray(reports) && reports.map(report => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ReportCard {...report} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}