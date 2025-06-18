import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Card.css";

const Card = ({ pet }) => {
  const navigate = useNavigate();

  const handleFavorite = async () => {
    try {
      const userId = localStorage.getItem("userId");
      await axios.post("http://localhost:5000/api/favorites", {
        userId,
        petId: pet.id,
      });
      alert("Added to favorites!");
    } catch (error) {
      alert("Already in favorites or failed.");
    }
  };

  return (
    <div className="pet-card">
      <img src={`http://localhost:5000${pet.photo_url}`} alt={pet.name} />

      <h3>{pet.name}</h3>
      <p>{pet.gender}</p>
      <p className="desc">{pet.description?.slice(0, 60)}...</p>
      <div className="card-buttons">
        <button onClick={handleFavorite}>❤️</button>
        <button onClick={() => navigate(`/pet/${pet.id}`)}>View Details</button>
      </div>
    </div>
  );
};

export default Card;
