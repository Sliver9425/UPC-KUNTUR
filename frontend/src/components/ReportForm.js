import React, { useState } from 'react';
import { FiSend, FiImage } from 'react-icons/fi';

export default function ReportForm({ onSubmitSuccess }) {
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [evidenceFile, setEvidenceFile] = useState(null);
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);

  const validate = () => {
    const newErrors = {};
    if (!description.trim()) newErrors.description = 'La descripción es obligatoria.';
    if (!location.trim()) newErrors.location = 'La ubicación es obligatoria.';
    if (!evidenceFile && !evidenceUrl) newErrors.evidence = 'Debes subir un archivo o ingresar una URL como evidencia.';
    if (evidenceUrl && !/^https?:\/\//.test(evidenceUrl)) newErrors.evidenceUrl = 'La URL debe ser válida.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setEvidenceFile(file);
    setEvidenceUrl('');
    setErrors((prev) => ({ ...prev, evidence: undefined, evidenceUrl: undefined }));
    if (file && file.type.startsWith('image/')) {
      const reader = new window.FileReader();
      reader.onload = (ev) => setPreviewUrl(ev.target.result);
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleUrlChange = (e) => {
    setEvidenceUrl(e.target.value);
    setEvidenceFile(null);
    setErrors((prev) => ({ ...prev, evidence: undefined, evidenceUrl: undefined }));
    setPreviewUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    if (!validate()) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('descripcion', description);
    formData.append('ubicacion', location);
    if (evidenceFile) {
      formData.append('archivo', evidenceFile);
    } else if (evidenceUrl) {
      formData.append('url', evidenceUrl);
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
        setSuccessMsg('¡Denuncia enviada correctamente!');
        setErrors({});
      } else {
        setErrors({ form: data.detail || 'Error al enviar la denuncia' });
      }
    } catch (err) {
      setErrors({ form: 'Error de red al enviar la denuncia' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="report-form" onSubmit={handleSubmit} autoComplete="off">
      {errors.form && <div className="error-message">{errors.form}</div>}
      {successMsg && <div className="success-message">{successMsg}</div>}
      <label>Descripción</label>
      <textarea
        placeholder="Ingresa la descripción de la denuncia"
        value={description}
        onChange={e => setDescription(e.target.value)}
        className={errors.description ? 'input-error' : ''}
        rows={3}
      />
      {errors.description && <div className="error-message">{errors.description}</div>}
      <div className="form-separator" />
      <label>Ubicación</label>
      <input
        type="text"
        placeholder="Ingresa la ubicación de la denuncia"
        value={location}
        onChange={e => setLocation(e.target.value)}
        className={errors.location ? 'input-error' : ''}
      />
      {errors.location && <div className="error-message">{errors.location}</div>}
      <div className="form-separator" />
      <label>Evidencia (subir archivo)</label>
      <input
        type="file"
        onChange={handleFileChange}
        accept="image/*,application/pdf,video/*,audio/*,text/plain,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        disabled={!!evidenceUrl}
        className={errors.evidence ? 'input-error' : ''}
      />
      {previewUrl && (
        <div className="image-preview-container">
          <img src={previewUrl} alt="Vista previa" className="image-preview" />
        </div>
      )}
      <label>Evidencia (URL)</label>
      <input
        type="url"
        placeholder="https://example.com/evidence.jpg"
        value={evidenceUrl}
        onChange={handleUrlChange}
        disabled={!!evidenceFile}
        className={errors.evidenceUrl ? 'input-error' : ''}
      />
      {(errors.evidence || errors.evidenceUrl) && (
        <div className="error-message">{errors.evidence || errors.evidenceUrl}</div>
      )}
      <button type="submit" className="btn-submit" disabled={loading} style={{ marginTop: '1.2rem', width: '100%', fontSize: '1.15rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        {loading ? (
          <span className="spinner" />
        ) : (
          <FiSend style={{ marginRight: 6, fontSize: 20 }} />
        )}
        {loading ? 'Enviando...' : 'Ingresar'}
      </button>
    </form>
  );
}