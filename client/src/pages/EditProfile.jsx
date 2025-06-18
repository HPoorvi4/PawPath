// EditProfile.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/EditProfile.css";

export default function EditProfile() {
  const userId = localStorage.getItem("userId");
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/users/${userId}`)
      .then(res => setFormData({ name: res.data.name, email: res.data.email, phone: res.data.phone }))
      .catch(err => console.error("Failed to load user info", err));
  }, [userId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/users/${userId}`, formData);
      alert("Profile updated successfully!");
      navigate("/myprofile");
    } catch (err) {
      alert("Failed to update profile");
    }
  };

  return (
    <div className="edit-profile">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input name="name" value={formData.name} onChange={handleChange} required />
        <label>Email</label>
        <input name="email" value={formData.email} onChange={handleChange} type="email" required />
        <label>Phone</label>
        <input name="phone" value={formData.phone} onChange={handleChange} required />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}
