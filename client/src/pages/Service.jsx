// src/pages/Service.jsx
import React from 'react';
import Navbar from '../components/Navbar';
import FeatureNav from '../components/FeatureNav';
import Footer from '../components/Footer';
import '../styles/Service.css';

export default function Service() {
  const services = [
    { title: 'Pet Adoption', desc: 'Browse and adopt pets near you.' },
    { title: 'List Your Pet', desc: 'Rehome or sell your pet safely.' },
    { title: 'Vet Appointments', desc: 'Schedule with trusted vets.' },
    { title: 'Lost & Found', desc: 'Report or search for lost pets.' },
    { title: 'Name Generator', desc: 'Find the perfect pet name.' },
  ];

  return (
    <>
      <Navbar />
      <FeatureNav />

      <div className="service-container">
        <h1>Our Services</h1>
        <div className="service-grid">
          {services.map(s => (
            <div key={s.title} className="service-card">
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}
