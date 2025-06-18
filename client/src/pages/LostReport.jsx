// LostReport.jsx
import React, { useState } from 'react';
import axios from 'axios';
import '../styles/LostReport.css';
import Navbar from '../components/Navbar';
import FeatureNav from '../components/FeatureNav';


 function LostReport() {
  const [formData, setFormData] = useState({
    pet_name: '',
    details: '',
    location: '',
    status: 'lost',
    photo: null,
  });
  const userId = localStorage.getItem('userId');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoto = (e) => {
    setFormData({ ...formData, photo: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('pet_name', formData.pet_name);
    data.append('details', formData.details);
    data.append('location', formData.location);
    data.append('status', formData.status);
    data.append('photo', formData.photo);
    data.append('reporter_id', userId);

    try {
      await axios.post('http://localhost:5000/api/lost-found', data);
      alert('Lost/Found report submitted successfully!');
    } catch (err) {
      alert('Failed to submit the report');
      console.error(err);
    }
  };

  return (
    <div>
      <Navbar />
      <FeatureNav />
      <div className="lost-form-container">
        <h2>Report Lost/Found Pet</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <input type="text" name="pet_name" placeholder="Pet Name" required onChange={handleChange} />
          <textarea name="details" placeholder="Details" required onChange={handleChange}></textarea>
          <input type="text" name="location" placeholder="Location Found/Lost" required onChange={handleChange} />

          <select name="status" onChange={handleChange}>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>

          <input type="file" name="photo" accept="image/*" onChange={handlePhoto} required />
          <button type="submit">Submit Report</button>
        </form>
      </div>
    </div>
  );
}

export default LostReport;