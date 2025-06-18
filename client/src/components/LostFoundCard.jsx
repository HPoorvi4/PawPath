// src/components/LostFoundCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LostFoundCard.css';

export default function LostFoundCard({ record, type }) {
  const navigate = useNavigate();
  const handleClick = () => {
    if (type === 'lost') navigate(`/lost/${record.id}`);
    else navigate(`/found/${record.id}`);
  };

  return (
    <div className="lf-card">
      <img
        src={`http://localhost:5000${record.photo_url}`}
        alt={record.pet_name}
      />
      <div className="info">
        <h4>{record.pet_name || 'Unnamed Pet'}</h4>
        <p>{record.location}</p>
        <p>{new Date(record.reported_at).toLocaleDateString()}</p>
        <button onClick={handleClick}>View Details</button>
      </div>
    </div>
  );
}
