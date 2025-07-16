import React, { useState } from 'react';

export default function ReportForm({ onSubmitSuccess }) {
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [evidenceFile, setEvidenceFile] = useState(null);
  const [evidenceUrl, setEvidenceUrl] = useState('');

  const handleFileChange = (e) => {
    setEvidenceFile(e.target.files[0]);
    setEvidenceUrl('');
  };

  const handleUrlChange = (e) => {
    setEvidenceUrl(e.target.value);
    setEvidenceFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('descripcion', description); // Usa description o title
    formData.append('ubicacion', location);

     // Solo uno de los dos: archivo o url
    if (evidenceFile) {
      formData.append('archivo', evidenceFile);
    } else if (evidenceUrl) {
      formData.append('url', evidenceUrl);
    } else {
      alert('Debes subir un archivo o ingresar una URL como evidencia.');
      return;
    }


    try {
      const response = await fetch('http://localhost:8000/denuncia', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        if (onSubmitSuccess) onSubmitSuccess();
        setDescription('');
        setLocation('');
        setEvidenceFile(null);
        setEvidenceUrl('');
        alert('Denuncia enviada correctamente');
      } else {
        alert(data.detail || 'Error al enviar la denuncia');
      }
    } catch (err) {
      alert('Error de red al enviar la denuncia');
    }
  };

  return (
    <form className="report-form" onSubmit={handleSubmit}>
      <label>Descripción</label>
      <textarea
        placeholder="Ingresa la descripción de la denuncia"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      <label>Ubicación</label>
      <input
        type="text"
        placeholder="Ingresa la ubicación de la denuncia"
        value={location}
        onChange={e => setLocation(e.target.value)}
      />
      <label>Evidencia (subir archivo)</label>
      <input
        type="file"
        onChange={handleFileChange}
        accept="image/*,application/pdf,video/*"
        disabled={!!evidenceUrl}
      />
      <label>Evidencia (URL)</label>
      <input
        type="url"
        placeholder="https://example.com/evidence.jpg"
        value={evidenceUrl}
        onChange={handleUrlChange}
        disabled={!!evidenceFile}
      />      
      <button type="Ingresar" className="btn-submit">Ingresar</button>
    </form>
  );
}