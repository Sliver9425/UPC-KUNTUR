import React, { useState } from 'react';

export default function ReportForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [evidence, setEvidence] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes manejar el envío del formulario, incluyendo el archivo
    // Por ejemplo, usando FormData para enviar el archivo al backend
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('location', location);
    if (evidence) formData.append('evidence', evidence);

    // fetch o axios para enviar formData...
  };

  return (
    <form className="report-form" onSubmit={handleSubmit}>
      <label>Title</label>
      <input
        type="text"
        placeholder="Enter report title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <label>Description</label>
      <textarea
        placeholder="Enter description"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      <label>Location</label>
      <input
        type="text"
        placeholder="Enter location"
        value={location}
        onChange={e => setLocation(e.target.value)}
      />
      <label>Evidence (file upload)</label>
      <input
        type="file"
        onChange={e => setEvidence(e.target.files[0])}
        accept="image/*,application/pdf,video/*"
      />
      <button type="submit" className="btn-submit">Submit</button>
    </form>
  );
}