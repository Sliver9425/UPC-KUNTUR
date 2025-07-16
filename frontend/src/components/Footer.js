import React from 'react';
import { FiGithub, FiTwitter } from 'react-icons/fi'; // O los iconos que prefieras

export default function Footer() {
  return (
    <footer className="footer">
      <div>
        © {new Date().getFullYear()} Kuntur UPC
      </div>
      <div>
        <a href="https://github.com/tuusuario" className="social-icon" target="_blank" rel="noopener noreferrer">
          <FiGithub size={22} />
        </a>
        <a href="https://twitter.com/tuusuario" className="social-icon" target="_blank" rel="noopener noreferrer">
          <FiTwitter size={22} />
        </a>
      </div>
    </footer>
  );
}