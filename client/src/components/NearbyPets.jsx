import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Card from './Card';
import './NearbyPets.css';

export default function NearbyPets() {
  const [pets, setPets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNearby = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const userRes = await axios.get(`http://localhost:5000/api/users/${userId}`);
          
        const loc = userRes.data.location;
        console.log("User location:", loc);

        const petsRes = await axios.get('http://localhost:5000/api/pets/nearby', {
          params: { location: loc, limit: 6 }

        });
        setPets(petsRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNearby();


  }, []);

  return (
    <section className="nearby-pets">
      <h2>Pets Near You</h2>
      <div className="nearby-grid">
        {pets.map(pet => (
          <Card key={pet.id} pet={pet} />
        ))}
      </div>
      <button className="see-more" onClick={() => navigate('/adopt')}>
        See more →
      </button>
    </section>
  );
}
