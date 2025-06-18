// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const userId = localStorage.getItem('userId');

  return (
    <nav className="main-navbar">
      <div className="nav-left">
        <img src="/logo.jpg" alt="PawPath Logo" className="logo" />
        <h2>PawPath</h2>
      </div>

      <div className="nav-links">
        <Link to="/about">About</Link>
        <Link to="/service">Services</Link>
        <Link to="/review">Reviews</Link>
        <Link to="/contact">Contact</Link>

        {userId
          ? <Link to="/myprofile" className="profile-icon">👤</Link>
          : (
            <>
              <Link to="/login" className="btn small">Login</Link>
              <Link to="/register" className="btn small secondary">Register</Link>
            </>
          )
        }
      </div>
    </nav>
  );
}
