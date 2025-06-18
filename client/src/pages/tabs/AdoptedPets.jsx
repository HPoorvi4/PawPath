// AdoptedPets.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdoptedPets.css";

export default function AdoptedPets({ userId }) {
  const [adopted, setAdopted] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/adoptions/${userId}`)
      .then(res => setAdopted(res.data))
      .catch(err => console.error("Failed to fetch adopted pets", err));
  }, [userId]);

  return (
    <div className="adopted-pets">
      <h3>Adopted Pets</h3>
      <div className="adopted-pet-grid">
        {adopted.length === 0 ? <p>No pets adopted yet.</p> : adopted.map(pet => (
          <div className="adopted-card" key={pet.id}>
            <img src={`http://localhost:5000${pet.photo_url}`} alt={pet.name} />

            <div className="card-info">
              <h4>{pet.name}</h4>
              <p>{pet.breed} • {pet.age} yrs • {pet.gender}</p>
              <p>Adopted on: {new Date(pet.adopted_at).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
