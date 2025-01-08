import React from 'react';
import './Footer.css';
import { FaInstagram, FaFacebookF, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-section about">
          <h2>Gimnasio XYZ</h2>
          <p>Entrena con los mejores equipos y personal capacitado. ¡Transforma tu cuerpo y mente con nosotros!</p>
        </div>
        <div className="footer-section contact">
          <h3>Contacto</h3>
          <p><strong>Dirección:</strong> Av. Los Fit 123, Ciudad Deportiva</p>
          <p><strong>Teléfono:</strong> +56 9 1234 5678</p>
          <p><strong>Email:</strong> contacto@gimnasioxyz.com</p>
        </div>
        <div className="footer-section social">
          <h3>Síguenos</h3>
          <div className="social-links">
            <a href="https://www.instagram.com/axehaker/?next=%2F" target="_blank" rel="noopener noreferrer">
              <FaInstagram /> Instagram
            </a>
            <a href="https://www.facebook.com/sebastian.morales.3150/" target="_blank" rel="noopener noreferrer">
              <FaFacebookF /> Facebook
            </a>
            <a href="https://wa.me/56912345678" target="_blank" rel="noopener noreferrer">
              <FaWhatsapp /> WhatsApp
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Gimnasio XYZ. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;

