// src/pages/Landing.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/Landing.css';
import Footer from '../components/Footer';

export default function Landing() {
  return (
    <>
      {/* Hide “My Profile” on landing, icon links to /login instead */}
      <Navbar showProfile={false} />

      <div className="landing-hero">
        <div className="landing-content">
          <h1>🐾 Welcome to PawPath</h1>
          <p>Your journey to find a furry friend starts right here.</p>
          <div className="landing-buttons">
            <Link to="/login" className="btn primary">Login</Link>
            <Link to="/register" className="btn secondary">Register</Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
