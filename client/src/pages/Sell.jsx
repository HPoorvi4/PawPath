// Step 1: Sell.jsx (Form Page for Listing a Pet)

import React, { useState } from 'react';
import "../styles/Sell.css"
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import FeatureNav from '../components/FeatureNav';
import Navbar from '../components/Navbar';

const Sell = () => {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    breed: '',
    age: '',
    gender: '',
    description: '',
    location: '',
    photo: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePhotoChange = (e) => {
    setFormData({ ...formData, photo: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId'); // Must be stored at login
    const data = new FormData();
    for (let key in formData) {
      data.append(key, formData[key]);
    }
    data.append('owner_id', userId);

    try {
      const res = await axios.post('http://localhost:5000/api/pets', data);
      alert("Listed Successfully")
      navigate("/home");
    } catch (err) {
      console.error(err);
      alert('Failed to list pet');
    }
  };

  return (
    <div>
    <Navbar />
    <FeatureNav />
    <div className="sell-container">
      <h2>List Your Pet for Adoption</h2>
      <form className="sell-form" onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="text" name="name" placeholder="Pet Name" onChange={handleChange} required />
        <input type="text" name="species" placeholder="Species (Dog, Cat...)" onChange={handleChange} />
        <input type="text" name="breed" placeholder="Breed" onChange={handleChange} />
        <input type="number" name="age" placeholder="Age (in years)" onChange={handleChange} />
        <select name="gender" onChange={handleChange} required>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <textarea name="description" placeholder="Pet Description" onChange={handleChange} />
        <input type="text" name="location" placeholder="Location" onChange={handleChange} />
        <input type="file" accept="image/*" name="photo" onChange={handlePhotoChange} required />
        <button type="submit">List Pet</button>
      </form>
    </div>
    </div>
  );
};

export default Sell;