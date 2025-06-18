// src/pages/RateUs.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import FeatureNav from '../components/FeatureNav';
import Footer from '../components/Footer';
import '../styles/RateUs.css';

export default function RateUs() {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/reviews', {
        userId, rating, comment
      });
      alert("Thanks for your review! We'll use it to improve PawPath.");
      navigate('/review/all');
    } catch {
      setStatus('Failed to submit review, please try again.');
    }
  };

  return (
    <>
      <Navbar /><FeatureNav />
      <div className="rate-us">
        <h1>Rate Your Experience</h1>
        <form onSubmit={handleSubmit}>
          <label>Rating:</label>
          <select value={rating} onChange={e => setRating(+e.target.value)}>
            {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} ★</option>)}
          </select>
          <label>Your Review:</label>
          <textarea 
            rows="4" 
            value={comment} 
            onChange={e => setComment(e.target.value)} 
            required 
          />
          <button type="submit">Submit Review</button>
          {status && <p className="status">{status}</p>}
        </form>
      </div>
      <Footer />
    </>
  );
}
