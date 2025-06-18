// src/pages/Home.jsx
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import FeatureNav from '../components/FeatureNav';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Home.css';
import NearbyPets from '../components/NearbyPets';

export default function Home() {
  const navigate = useNavigate();
  const [petName, setPetName] = useState('');
  const [loadingName, setLoadingName] = useState(false);

  const toSell = () => navigate('/sell');

  const fetchRandomName = async () => {
    setLoadingName(true);
    setPetName('');
    try {
      const res = await axios.get('http://localhost:5000/api/pet-names/random');
      setPetName(res.data.name);
    } catch (err) {
      console.error(err);
      setPetName('Buddy');
    } finally {
      setLoadingName(false);
    }
  };

  return (
    <>
      <Navbar />
      <FeatureNav />

      <div className="home-container">
        <div className="left-content">
          <h1>PawPath</h1>
          <p>
            At PawPath, we specialize in connecting families with pets in need of loving homes.
          </p>
          <p>Discover a variety of pets waiting to join your family.</p>
          <ul>
            <li>Local Adoptable Pets</li>
            <li>Personalized Adoption Experience to Match Families with Pets</li>
            <li>Support Your Local Animal Shelters</li>
          </ul>

          <button onClick={toSell} className="register-btn">
            Register Your Pet
          </button>

          {/* ==== New Generate-Name Section ==== */}
          <div className="generate-name">
            <button
              onClick={fetchRandomName}
              className="name-btn"
            >
              Generate a Pet Name
            </button>
            {petName && (
              <p className="pet-name-result">
                Suggested Name: <strong>{petName}</strong>
              </p>
            )}
          </div>
        </div>

        <div className="right-image">
        <img src="/cat1.jpg" alt="Happy pet duo" />
        </div>
      </div>

      <NearbyPets />
      <Footer />
    </>
  );
}
