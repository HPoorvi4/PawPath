// ListedPets.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ListedPets.css";

export default function ListedPets({ userId }) {
  const [pets, setPets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/pets/listed/${userId}`)
      .then(res => setPets(res.data))
      .catch(err => console.error("Failed to fetch listed pets", err));
  }, [userId]);

  const handleEdit = (petId) => {
    navigate(`/edit-pet/${petId}`);
  };

  const handleRemove = async (petId) => {
    if (window.confirm("Are you sure you want to remove this pet from listing?")) {
      try {
        await axios.delete(`http://localhost:5000/api/pets/${petId}`);
        setPets(pets.filter(p => p.id !== petId));
      } catch (err) {
        alert("Failed to remove listing");
      }
    }
  };

  return (
    <div className="listed-pets">
      <div className="listed-header">
        <h3>My Listed Pets</h3>
        <button className="list-btn" onClick={() => navigate('/sell')}>List a New Pet</button>
      </div>
      <div className="listed-pet-grid">
        {pets.map(pet => (
          <div className="listed-card" key={pet.id}>
            <img src={`http://localhost:5000${pet.photo_url}`} alt={pet.name} />

            <div className="card-info">
              <h4>{pet.name}</h4>
              <p>{pet.breed} • {pet.age} yrs • {pet.gender}</p>
              <p>Listed on: {new Date(pet.listed_at).toLocaleDateString()}</p>
              <p>Status: {pet.is_adopted ? "Adopted" : "Available"}</p>
              <div className="card-actions">
                <button onClick={() => handleEdit(pet.id)}>Edit</button>
                <button onClick={() => handleRemove(pet.id)} className="remove-btn">Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
