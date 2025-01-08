import React from 'react';
import './HomePage.css';
import img1 from '../../../../GestorGymPro/src/assets/Equipamiento.png';
import img2 from '../../../../GestorGymPro/src/assets/Clases_grupales.png';
import img3 from '../../../../GestorGymPro/src/assets/Personal_Trainer.png';
import img4 from '../../../../GestorGymPro/src/assets/Suplementos.png';
import planImg from '../../../../GestorGymPro/src/assets/t600x362.jpg';
import renuevaImg from '../../../../GestorGymPro/src/assets/smart-fit.jpg';
import semaforoImg from '../../../../GestorGymPro/src/assets/entrenador-personal-madrid.jpg';
import gratisImg from '../../../../GestorGymPro/src/assets/reserva.png';

const HomePage = () => {
  console.log("HomePage montado");
  
  return (
    <div className="homepage-container">
      <h1>Bienvenido al Gimnasio</h1>
      <div className="features-container">
        <div className="feature-item">
          <img src={img1} alt="Clubes full equipados" />
          <p>CLUBES FULL EQUIPADOS</p>
        </div>
        <div className="feature-item">
          <img src={img2} alt="Clases grupales" />
          <p>CLASES GRUPALES</p>
        </div>
        <div className="feature-item">
          <img src={img3} alt="Personal trainer" />
          <p>PERSONAL TRAINER</p>
        </div>
        <div className="feature-item">
          <img src={img4} alt="Medicina deportiva" />
          <p>TIENDA DE SUPLEMENTOS</p>
        </div>
      </div>

      {/* Nueva sección para el diseño en cuadrícula */}
      <div className="promo-section">
        <h2>SOMOS LOS QUE ENTRENAMOS CON TODO Y CON TOD@S</h2>
        <div className="promo-grid">
          <div className="promo-item">
            <img src={planImg} alt="Planes de gimnasio" />
            <p>PLANES DE GIMNASIO</p>
          </div>
          <div className="promo-item">
            <img src={renuevaImg} alt="Renueva tu plan" />
            <p>OBTEN DESCUENTOS EN SUPLEMENTOS</p>
          </div>
          <div className="promo-item">
            <img src={semaforoImg} alt="Semáforo nutricional" />
            <p>ESCOGE A TU PERSONAL TRAINER</p>
          </div>
          <div className="promo-item">
            <img src={gratisImg} alt="5 días gratis" />
            <p>RESERVA TU HORARIO DE ENTRENAMIENTO</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
