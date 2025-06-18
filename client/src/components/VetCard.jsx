// src/components/VetCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./VetCard.css";

// local formatter at top
function formatDateLocal(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const VetCard = ({ vet, date }) => {
  const navigate = useNavigate();

  const handleBook = () => {
    const localDate = formatDateLocal(date);
    navigate(`/vet/${vet.id}?date=${localDate}`);
  };

  return (
    <div className="vet-card">
      <div className="vet-info">
        <h3>{vet.name}</h3>
        <p>Specialization: {vet.specialization}</p>
        <p>Rating: {vet.rating?.toFixed(1) ?? "N/A"} ⭐</p>
      </div>
      <button onClick={handleBook}>Book</button>
    </div>
  );
};

export default VetCard;
