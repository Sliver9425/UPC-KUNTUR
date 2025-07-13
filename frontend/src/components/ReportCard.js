import React from 'react';

export default function ReportCard({ id, descripcion, ubicacion, fecha, codigo, significado, mensaje, unidades, url, url_stream, categoria, prioridad }) {
  // Función para descargar el PDF del parte policial
  const handleDownloadPDF = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:8000/denuncia/${id}/parte_pdf`);
      const data = await res.json();
      if (data.url_pdf) {
        window.open(data.url_pdf, "_blank");
      } else {
        alert("No se pudo generar el PDF.");
      }
    } catch {
      alert("Error al solicitar el PDF.");
    }
  };

  // Mapeo de categorías con iconos
  const getCategoryInfo = (cat) => {
    const categories = {
      'general': { icon: '🚨', label: 'General', color: '#74409B' },
      'traffic': { icon: '🚗', label: 'Tránsito', color: '#384C81' },
      'security': { icon: '👮', label: 'Seguridad', color: '#dc3545' },
      'environment': { icon: '🌱', label: 'Medio Ambiente', color: '#28a745' }
    };
    return categories[cat] || categories['general'];
  };

  // Mapeo de prioridades con colores
  const getPriorityInfo = (priority) => {
    const priorities = {
      'low': { label: 'Baja', color: '#28a745' },
      'normal': { label: 'Normal', color: '#ffc107' },
      'high': { label: 'Alta', color: '#fd7e14' },
      'urgent': { label: 'Urgente', color: '#dc3545' }
    };
    return priorities[priority] || priorities['normal'];
  };

  const categoryInfo = getCategoryInfo(categoria);
  const priorityInfo = getPriorityInfo(prioridad);

  return (
    <div className="report-card">
      <div className="report-info">
        {/* Header con categoría y prioridad */}
        <div className="report-header">
          <div className="category-badge" style={{ backgroundColor: categoryInfo.color }}>
            <span className="category-icon">{categoryInfo.icon}</span>
            <span>{categoryInfo.label}</span>
          </div>
          <div className="priority-badge" style={{ backgroundColor: priorityInfo.color }}>
            {priorityInfo.label}
          </div>
        </div>

        <div><b>Descripción:</b> {descripcion}</div>
        <div><b>Ubicación:</b> {ubicacion}</div>
        <div>
          <b>Fecha:</b> {new Date(fecha).toLocaleString('es-EC', { timeZone: 'America/Guayaquil' })}
        </div>
        <div>
          <b>Código:</b> {codigo} {significado && `- ${significado}`}
        </div>
        <div><b>Unidades:</b> {unidades}</div>
        {mensaje && (
          <div style={{ marginTop: '0.5rem', fontStyle: 'italic', color: '#384C81' }}>
            <b>Mensaje:</b> {mensaje}
          </div>
        )}
        {url && (
          <div>
            <b>Evidencia:</b> <a href={url} target="_blank" rel="noopener noreferrer">Ver archivo</a>
          </div>
        )}
        {/* NUEVO: Botón para descargar el PDF */}
        {id && (
          <div style={{ marginTop: '0.5rem' }}>
            <b>Parte Policial (PDF):</b>{" "}
            <a href="#" onClick={handleDownloadPDF} style={{ color: "#74409B", fontWeight: "bold" }}>
              Descargar PDF
            </a>
          </div>
        )}
        {/* NUEVO: Mostrar si hay transmisión disponible */}
        {url_stream && (
          <div style={{ marginTop: '0.5rem' }}>
            <b>Transmisión:</b> <a href={url_stream} target="_blank" rel="noopener noreferrer" style={{ color: "#74409B", fontWeight: "bold" }}>
              Ver en vivo
            </a>
          </div>
        )}
      </div>
    </div>
  );
}