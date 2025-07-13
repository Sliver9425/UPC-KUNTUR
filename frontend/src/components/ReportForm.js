import React, { useState, useRef } from 'react';
import './ReportForm.css';

export default function ReportForm({ onSubmitSuccess }) {
  const [formData, setFormData] = useState({
    description: '',
    location: '',
    evidenceType: 'file', // 'file' or 'url'
    evidenceFile: null,
    evidenceUrl: '',
    priority: 'normal', // 'low', 'normal', 'high', 'urgent'
    category: 'general' // 'general', 'traffic', 'security', 'environment'
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fileInputRef = useRef(null);

  const categories = [
    { value: 'general', label: 'General', icon: '🚨' },
    { value: 'traffic', label: 'Tránsito', icon: '🚗' },
    { value: 'security', label: 'Seguridad', icon: '👮' },
    { value: 'environment', label: 'Medio Ambiente', icon: '🌱' }
  ];

  const priorities = [
    { value: 'low', label: 'Baja', color: '#28a745' },
    { value: 'normal', label: 'Normal', color: '#ffc107' },
    { value: 'high', label: 'Alta', color: '#fd7e14' },
    { value: 'urgent', label: 'Urgente', color: '#dc3545' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es obligatoria';
    } else if (formData.description.length < 10) {
      newErrors.description = 'La descripción debe tener al menos 10 caracteres';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'La ubicación es obligatoria';
    }

    if (formData.evidenceType === 'file' && !formData.evidenceFile) {
      newErrors.evidence = 'Debe seleccionar un archivo';
    } else if (formData.evidenceType === 'url' && !formData.evidenceUrl.trim()) {
      newErrors.evidence = 'Debe ingresar una URL válida';
    } else if (formData.evidenceType === 'url' && formData.evidenceUrl) {
      try {
        new URL(formData.evidenceUrl);
      } catch {
        newErrors.evidence = 'URL inválida';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, evidence: 'El archivo no puede ser mayor a 10MB' }));
        return;
      }
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/avi', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, evidence: 'Tipo de archivo no permitido' }));
        return;
      }

      setFormData(prev => ({ 
        ...prev, 
        evidenceFile: file, 
        evidenceType: 'file',
        evidenceUrl: '' 
      }));
      setErrors(prev => ({ ...prev, evidence: '' }));
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setFormData(prev => ({ 
      ...prev, 
      evidenceUrl: url, 
      evidenceType: 'url',
      evidenceFile: null 
    }));
    setErrors(prev => ({ ...prev, evidence: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    const formDataToSend = new FormData();
    formDataToSend.append('descripcion', formData.description);
    formDataToSend.append('ubicacion', formData.location);
    formDataToSend.append('categoria', formData.category);
    formDataToSend.append('prioridad', formData.priority);

    if (formData.evidenceType === 'file' && formData.evidenceFile) {
      formDataToSend.append('archivo', formData.evidenceFile);
    } else if (formData.evidenceType === 'url' && formData.evidenceUrl) {
      formDataToSend.append('url', formData.evidenceUrl);
    }

    try {
      const response = await fetch('http://localhost:8000/denuncia', {
        method: 'POST',
        body: formDataToSend,
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setIsSubmitted(true);
        if (onSubmitSuccess) onSubmitSuccess();
        
        // Reset form after successful submission
        setTimeout(() => {
          setFormData({
            description: '',
            location: '',
            evidenceType: 'file',
            evidenceFile: null,
            evidenceUrl: '',
            priority: 'normal',
            category: 'general'
          });
          setErrors({});
          setIsSubmitted(false);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }, 2000);
        
      } else {
        setErrors({ submit: data.detail || 'Error al enviar la denuncia' });
      }
    } catch (err) {
      setErrors({ submit: 'Error de conexión. Intente nuevamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  const getFilePreview = () => {
    if (!formData.evidenceFile) return null;
    
    if (formData.evidenceFile.type.startsWith('image/')) {
      return URL.createObjectURL(formData.evidenceFile);
    }
    return null;
  };

  return (
    <div className="report-form-container">
      <div className="form-header">
        <h3>🚨 Nueva Denuncia</h3>
        <p>Complete los datos para crear una nueva denuncia</p>
      </div>

      {isSubmitted && (
        <div className="success-message">
          <div className="success-icon">✅</div>
          <div>
            <h4>¡Denuncia enviada exitosamente!</h4>
            <p>Su denuncia ha sido registrada y será procesada.</p>
          </div>
        </div>
      )}

      {errors.submit && (
        <div className="error-message">
          <div className="error-icon">❌</div>
          <span>{errors.submit}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="report-form">
        {/* Categoría y Prioridad */}
        <div className="form-row">
          <div className="form-group">
            <label>Categoría</label>
            <div className="category-selector">
              {categories.map(cat => (
                <button
                  key={cat.value}
                  type="button"
                  className={`category-option ${formData.category === cat.value ? 'active' : ''}`}
                  onClick={() => handleInputChange('category', cat.value)}
                >
                  <span className="category-icon">{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Prioridad</label>
            <div className="priority-selector">
              {priorities.map(priority => (
                <button
                  key={priority.value}
                  type="button"
                  className={`priority-option ${formData.priority === priority.value ? 'active' : ''}`}
                  style={{ '--priority-color': priority.color }}
                  onClick={() => handleInputChange('priority', priority.value)}
                >
                  {priority.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Descripción */}
        <div className="form-group">
          <label>
            Descripción <span className="required">*</span>
            <span className="char-count">{formData.description.length}/500</span>
          </label>
          <textarea
            placeholder="Describa detalladamente el incidente o situación..."
            value={formData.description}
            onChange={e => handleInputChange('description', e.target.value)}
            maxLength={500}
            className={errors.description ? 'error' : ''}
            rows={4}
          />
          {errors.description && <span className="error-text">{errors.description}</span>}
        </div>

        {/* Ubicación */}
        <div className="form-group">
          <label>
            Ubicación <span className="required">*</span>
          </label>
          <input
            type="text"
            placeholder="Dirección exacta o punto de referencia..."
            value={formData.location}
            onChange={e => handleInputChange('location', e.target.value)}
            className={errors.location ? 'error' : ''}
          />
          {errors.location && <span className="error-text">{errors.location}</span>}
        </div>

        {/* Evidencia */}
        <div className="form-group">
          <label>
            Evidencia <span className="required">*</span>
          </label>
          
          <div className="evidence-tabs">
            <button
              type="button"
              className={`evidence-tab ${formData.evidenceType === 'file' ? 'active' : ''}`}
              onClick={() => handleInputChange('evidenceType', 'file')}
            >
              📁 Subir archivo
            </button>
            <button
              type="button"
              className={`evidence-tab ${formData.evidenceType === 'url' ? 'active' : ''}`}
              onClick={() => handleInputChange('evidenceType', 'url')}
            >
              🔗 URL
            </button>
          </div>

          {formData.evidenceType === 'file' ? (
            <div className="file-upload-area">
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                accept="image/*,video/*,application/pdf"
                className="file-input"
              />
              <div className="file-upload-content">
                <div className="upload-icon">📁</div>
                <p>Haga clic para seleccionar un archivo</p>
                <span className="file-types">Imágenes, videos o PDF (máx. 10MB)</span>
              </div>
              
              {formData.evidenceFile && (
                <div className="file-preview">
                  {getFilePreview() ? (
                    <img src={getFilePreview()} alt="Preview" />
                  ) : (
                    <div className="file-info">
                      <span className="file-name">{formData.evidenceFile.name}</span>
                      <span className="file-size">
                        {(formData.evidenceFile.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  )}
                  <button
                    type="button"
                    className="remove-file"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, evidenceFile: null }));
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          ) : (
            <input
              type="url"
              placeholder="https://ejemplo.com/evidencia.jpg"
              value={formData.evidenceUrl}
              onChange={handleUrlChange}
              className={errors.evidence ? 'error' : ''}
            />
          )}
          
          {errors.evidence && <span className="error-text">{errors.evidence}</span>}
        </div>

        {/* Botón de envío */}
        <div className="form-actions">
          <button
            type="submit"
            className={`submit-btn ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                Enviando...
              </>
            ) : (
              <>
                📤 Enviar Denuncia
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}