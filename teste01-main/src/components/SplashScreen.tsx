import React from 'react';
import logo from '../logo.png';
import './SplashScreen.css';

export default function SplashScreen() {
  return (
    <div className="splash-screen">
      <div className="splash-card">
        <img src={logo} alt="Etervalis" className="splash-logo" />
        <div className="splash-text">
          <p className="splash-welcome">Bem-vindo ao</p>
          <h1>ETERVALIS</h1>
          <div className="splash-loader">
            <span>Carregando...</span>
            <div className="splash-progress">
              <div className="progress-bar" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
