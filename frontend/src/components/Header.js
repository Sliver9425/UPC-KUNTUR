// frontend/src/components/Header.js
import React from 'react';
import './Header.css';

export default function Header() {
  return (
    <header className="app-header">
      <img src="/kunturlogo-white.svg" alt="Kuntur Logo" className="logo" />
      <div>
        <div className="app-title">Kuntur UPC</div>
        <div className="app-subtitle">Seguridad desde las nubes</div>
      </div>
    </header>
  );
}