import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <h3>🐾 PawPath</h3>
          <p>Connecting pets with loving homes.</p>
        </div>
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/service">Services</Link></li>
            <li><Link to="/review">Reviews</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        <div className="footer-contact">
          <h4>Contact</h4>
          <p>Email: pawpath15@gmail.com</p>
          <p>Phone: +91-8660316451</p>
          <p>Location: Bengaluru, India</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} PawPath. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;