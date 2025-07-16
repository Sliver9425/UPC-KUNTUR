import React from 'react';
import { FiMapPin, FiClock, FiFileText, FiVideo, FiDownload } from 'react-icons/fi';

// Función para mapear código policial a gravedad
function getGravedadPorCodigo(codigo) {
  if (!codigo) return "baja";
  const match = (codigo + '').match(/(\d+(?:-\d+)?)/);
  const cleanCodigo = match ? match[1] : '';
  console.log('codigo recibido:', codigo, '| cleanCodigo extraído:', cleanCodigo);
  const urgente = [
    "8-01", "8-27", "8-85", "8-15", "3-05", "3-06", "12-70", "5-42", "5-39"
  ];
  const media = [
    "5-12", "6-01", "6-06", "6-18", "6-19", "5-26", "5-13", "5-25", "5-24",
    "12-34", "12-54", "8-33", "8-34", "5-03","5-11"
  ];
  if (urgente.includes(codigo)) return "urgente";
  if (media.includes(codigo)) return "media";
  return "baja";
}

// Función para asignar color según gravedad
function getPriorityColor(gravedad) {
  if (gravedad === "urgente") return "var(--primary-red)";
  if (gravedad === "media") return "var(--warning-amber)";
  return "var(--success-green)";
}

export default function ReportCard({
  id,
  descripcion,
  ubicacion,
  fecha,
  codigo,
  significado,
  mensaje,
  unidades,
  url,
  url_stream
}) {
  // Determina la gravedad y el color
  const gravedad = getGravedadPorCodigo(codigo);

  // Descargar PDF del parte policial
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

  return (
    <div
      className="report-card"
      style={{
        borderLeft: `6px solid ${getPriorityColor(gravedad)}`,
        boxShadow: "0 2px 8px rgba(56, 76, 129, 0.08)",
        marginBottom: "1.5rem",
        padding: "1.5rem",
        borderRadius: "16px",
        background: "var(--card-background)",
        transition: "box-shadow 0.2s, transform 0.2s"
      }}
      tabIndex={0}
      aria-label={`Denuncia: ${descripcion}`}
    >
      {/* Título y descripción */}
      <div className="report-title" style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
        <FiFileText style={{ marginRight: 8, color: "var(--primary-purple)" }} />
        <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>{descripcion}</span>
      </div>

      {/* Metadatos */}
      <div className="report-meta" style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: 8, display: "flex", gap: "1.5rem" }}>
        <span><FiMapPin style={{ marginRight: 4 }} />{ubicacion}</span>
        <span><FiClock style={{ marginRight: 4 }} />{new Date(fecha).toLocaleString('es-EC', { timeZone: 'America/Guayaquil' })}</span>
      </div>

      {/* Badges */}
      <div className="report-badges" style={{ marginBottom: 8 }}>
        <span
          className="badge"
          style={{
            display: "inline-block",
            background: "var(--background-light)",
            color: "var(--primary-purple)",
            borderRadius: 8,
            padding: "0.2rem 0.7rem",
            fontSize: "0.9rem",
            marginRight: 8,
            fontWeight: 600
          }}
        >
          {codigo} {significado && `- ${significado}`}
        </span>
        <span
          className="badge badge-unidades"
          style={{
            display: "inline-block",
            background: "var(--success-green)",
            color: "#fff",
            borderRadius: 8,
            padding: "0.2rem 0.7rem",
            fontSize: "0.9rem",
            fontWeight: 600
          }}
        >
          {unidades} unidades
        </span>
        <span
          className="badge"
          style={{
            display: "inline-block",
            background: gravedad === "urgente" ? "var(--primary-red)" : gravedad === "media" ? "var(--warning-amber)" : "var(--success-green)",
            color: "#fff",
            borderRadius: 8,
            padding: "0.2rem 0.7rem",
            fontSize: "0.9rem",
            fontWeight: 600
          }}
        >
          {gravedad.charAt(0).toUpperCase() + gravedad.slice(1)}
        </span>
      </div>

      {/* Mensaje */}
      {mensaje && (
        <div
          className="report-message"
          style={{
            marginTop: 8,
            fontStyle: "italic",
            color: "var(--primary-purple)"
          }}
        >
          {mensaje}
        </div>
      )}

      {/* Evidencia */}
      {url && (
        <div style={{ marginTop: 8 }}>
          <b>Evidencia:</b>{" "}
          <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary-purple)", textDecoration: "underline" }}>
            Ver archivo
          </a>
        </div>
      )}

      {/* PDF */}
      {id && (
        <div style={{ marginTop: 8 }}>
          <b>Parte Policial (PDF):</b>{" "}
          <a
            href="#"
            onClick={handleDownloadPDF}
            style={{ color: "var(--primary-purple)", fontWeight: "bold", display: "inline-flex", alignItems: "center" }}
            aria-label="Descargar PDF"
          >
            <FiDownload style={{ marginRight: 4 }} />
            Descargar PDF
          </a>
        </div>
      )}

      {/* Transmisión en vivo */}
      {url_stream && (
        <div style={{ marginTop: 8 }}>
          <b>Transmisión:</b>{" "}
          <a
            href={url_stream}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--primary-purple)", fontWeight: "bold", display: "inline-flex", alignItems: "center" }}
            aria-label="Ver transmisión en vivo"
          >
            <FiVideo style={{ marginRight: 4 }} />
            Ver en vivo
          </a>
        </div>
      )}
    </div>
  );
}