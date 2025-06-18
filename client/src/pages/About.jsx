// src/pages/About.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import FeatureNav from '../components/FeatureNav';
import Footer from '../components/Footer';
import '../styles/About.css';

export default function About() {
  return (
    <>
      <Navbar />
      <FeatureNav />

      <div className="about-container">
        <h1>About PawPath</h1>
        <p>
          PawPath was born out of a love for animals and a desire to make
          pet adoption, care, and community connections as seamless as possible.
          Our mission is to  
          <strong> connect loving families with pets in need</strong>  
          and to provide tools for ongoing pet wellness.
        </p>
        <p>
          Whether you’re adopting your first pet, listing a beloved animal
          for rehoming, or booking appointments with top-rated vets, PawPath
          has you covered—end to end.
        </p>
        <Link to="/contact" className="cta-button">Contact Us</Link>
      </div>

      <Footer />
    </>
  );
}
