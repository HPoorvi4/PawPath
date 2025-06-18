// src/pages/ReviewsHome.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import FeatureNav from '../components/FeatureNav';
import Footer from '../components/Footer';
import '../styles/Review.css';
import { useNavigate } from 'react-router-dom';


export default function ReviewsHome() {
  const [top5, setTop5] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/reviews/top5')
      .then(res => setTop5(res.data))
      .catch(console.error);
  }, []);

  return (
    <>
      <Navbar /><FeatureNav />
      <div className="reviews-home">

        <h1>User Reviews</h1>
        <div className="reviews-carousel">
          {top5.map(r => (
            <div key={r.id} className="review-card">
              <div className="stars">{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</div>
              <p className="comment">“{r.comment}”</p>
              <p className="username">— {r.username}</p>
            </div>
          ))}
        </div>
        <Link to="/review/all" className="view-all-btn">View All Reviews</Link>
        <p>Help us to improve by giving rating!</p>
        <button 
          className="rate-us-btn" 
          onClick={() => navigate('/review/new')}
        >
          Rate Us
        </button>
      </div>
      <Footer />
    </>
  );
}
