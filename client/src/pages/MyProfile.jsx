// src/pages/MyProfile.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/MyProfile.css';
import FavoritePets from './tabs/FavoritePets';
import AdoptedPets from './tabs/AdoptedPets';
import ListedPets from './tabs/ListedPets';
import Appointments from './tabs/Appointments';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function MyProfile() {
  const [activeTab, setActiveTab] = useState('favorites');
  const [user, setUser] = useState(null);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/users/${userId}`)
      .then(res => setUser(res.data))
      .catch(err => console.error("Failed to fetch user", err));
  }, [userId]);

  const handleEditClick = () => {
    navigate('/edit-profile');
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    navigate('/', { replace: true });
  };

  return (
    <div>
      <Navbar />
      <div className="profile-container">
        <div className="profile-header">
          {/* <img src="/default-avatar.png" alt="avatar" className="profile-avatar" /> */}
          <div className="profile-details">
            <h2>{user?.name}</h2>
            <p>📞 {user?.phone}</p>
            <p>📧 {user?.email}</p>
            <div className="profile-header-actions">
              <button className="edit-btn" onClick={handleEditClick}>Edit Profile</button>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>

        <div className="profile-tabs">
          {['favorites', 'adopted', 'listed', 'appointments'].map(tab => (
            <button
              key={tab}
              className={activeTab === tab ? 'active' : ''}
              onClick={() => setActiveTab(tab)}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)
                .replace("listed", "My Listed Pets")
                .replace("appointments", "My Appointments")}
            </button>
          ))}
        </div>

        <div className="profile-tab-content">
          {activeTab === 'favorites' && <FavoritePets userId={userId} />}
          {activeTab === 'adopted'   && <AdoptedPets userId={userId} />}
          {activeTab === 'listed'    && <ListedPets userId={userId} />}
          {activeTab === 'appointments' && <Appointments userId={userId} />}
        </div>
      </div>
    </div>
  );
}
