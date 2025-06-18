// src/pages/AllReviews.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import FeatureNav from '../components/FeatureNav';
import Footer from '../components/Footer';
import '../styles/AllReviews.css';

export default function AllReviews() {
  const [all, setAll] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/reviews')
      .then(res => setAll(res.data))
      .catch(console.error);
  }, []);

  return (
    <>
      <Navbar /><FeatureNav />
      <div className="all-reviews">
        <h1>All User Reviews</h1>
        <button 
          className="rate-us-btn" 
          onClick={() => navigate('/review/new')}
        >
          Rate Us
        </button>
        <ul className="reviews-list">
          {all.map(r => (
            <li key={r.id}>
              <div className="rev-header">
                <span className="stars">{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</span>
                <strong className="username">{r.username}</strong>
                <span className="date">{new Date(r.created_at).toLocaleDateString()}</span>
              </div>
              <p className="rev-comment">{r.comment}</p>
            </li>
          ))}
        </ul>
      </div>
      <Footer />
    </>
  );
}
