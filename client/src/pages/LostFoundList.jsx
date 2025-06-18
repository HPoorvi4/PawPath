import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import FeatureNav from '../components/FeatureNav';
import LostFoundCard from '../components/LostFoundCard';
import '../styles/LostFoundList.css';

export default function LostFoundList() {
  const [userLocation, setUserLocation] = useState('');
  const [lostPets, setLostPets] = useState([]);
  const [foundPets, setFoundPets] = useState([]);
  const [foundLocation, setFoundLocation] = useState('');
  const [foundName, setFoundName] = useState('');
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    axios.get(`http://localhost:5000/api/users/${userId}`)
      .then(res => {
        const loc = res.data.location;
        setUserLocation(loc);
        setFoundLocation(loc);
        return axios.get('http://localhost:5000/api/lost-found/lost', { params: { location: loc } });
      })
      .then(res => setLostPets(res.data))
      .catch(console.error);

    axios.get('http://localhost:5000/api/lost-found/locations')
      .then(res => setLocations(res.data))
      .catch(console.error);
  }, []);

  const handleFoundSearch = () => {
    axios.get('http://localhost:5000/api/lost-found/found', {
      params: { location: foundLocation, pet_name: foundName }
    })
    .then(res => setFoundPets(res.data))
    .catch(console.error);
  };

  return (
    <div>
      <Navbar />
      <FeatureNav />
      <div className="lf-list">
        {/* // Found Pets Search First */}
        <section className="section found-section">
          <h2>Search Found Pets</h2>
          <div className="search-bar">
            <select
              value={foundLocation}
              onChange={e => setFoundLocation(e.target.value)}
            >
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Pet Name (optional)"
              value={foundName}
              onChange={e => setFoundName(e.target.value)}
            />
            <button onClick={handleFoundSearch}>Search</button>
          </div>
          <div className="lf-grid">
            {foundPets.length
              ? foundPets.map(p => (
                  <LostFoundCard key={p.id} record={p} type="found" />
                ))
              : <p className="empty-msg">No found-pet results. Try another search.</p>
            }
          </div>
        </section>

        {/*  Lost Pets Near You */}
        <section className="section lost-section">
          <h2>Lost Pets Near You</h2>
          <div className="lf-grid">
            {lostPets.length
              ? lostPets.map(p => (
                  <LostFoundCard key={p.id} record={p} type="lost" />
                ))
              : <p className="empty-msg">No lost pets reported in your area.</p>
            }
          </div>
        </section>
      </div>
    </div>
  );
}
