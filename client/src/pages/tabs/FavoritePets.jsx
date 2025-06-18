// FavoritePets.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./FavoritePets.css";
import { useNavigate } from "react-router-dom";

export default function FavoritePets({ userId }) {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/favorites/${userId}`)
      .then(res => setFavorites(res.data))
      .catch(err => console.error("Failed to load favorites", err));
  }, [userId]);

  return (
    <div className="favorite-pets">
      <h3>My Favorite Pets</h3>
      <div className="favorite-pet-grid">
        {favorites.map(pet => (
          <div className="fav-card" key={pet.id}>
            <img src={`http://localhost:5000${pet.photo_url}`} alt={pet.name} />

            <div className="card-info">
              <h4>{pet.name}</h4>
              <p>{pet.breed} • {pet.age} years old</p>
              <p>{pet.gender}</p>
              <button onClick={() => navigate(`/pet/${pet.id}`)}>View Details</button>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
