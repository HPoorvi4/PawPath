import React from 'react';
import { NavLink } from 'react-router-dom';
import './FeatureNav.css';

const FeatureNav = () => {
  return (
    <div className="feature-nav">
      <NavLink to="/home" className="feature-link">Home</NavLink>
      <NavLink to="/adopt" className="feature-link">Adopt</NavLink>
      <NavLink to="/sell" className="feature-link">Sell</NavLink>
      <NavLink to="/lost-report" className="feature-link">Report Lost/Found</NavLink>
      <NavLink to="/doc-appointment" className="feature-link">Doc Appointment</NavLink>
      <NavLink to="/lost-search" className="feature-link">Search Your lost pet</NavLink>
    </div>
  );
};

export default FeatureNav;
