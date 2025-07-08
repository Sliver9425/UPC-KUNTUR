import React from 'react';
import Header from './components/Header';
import './components/Header.css';

function App() {
  return (
    <div>
      <Header />
      <main style={{ padding: '2rem' }}>
        <h2>Bienvenido a KUNTUR</h2>
        <p>
          Plataforma para la gestión y visualización de denuncias.
        </p>
      </main>
    </div>
  );
}

export default App;
