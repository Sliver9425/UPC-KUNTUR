import React, { useState } from 'react';
import ReportForm from '../components/ReportForm';

export default function Home() {
  // Solo mostramos el formulario centrado en pantalla
  return (
    <div className="report-form-outer">
      <ReportForm />
    </div>
  );
}