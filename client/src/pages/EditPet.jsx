// EditPet.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/EditPet.css";

export default function EditPet() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});

  useEffect(() => {
    axios.get(`http://localhost:5000/api/pets/${id}`)
      .then(res => {
        if (res.data.pet) setFormData(res.data.pet);
      })
      .catch(err => console.error("Failed to load pet info", err));
  }, [id]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:5000/api/pets/${id}`, formData);
      alert("Pet details updated");
      navigate("/myprofile");
    } catch (err) {
      alert("Update failed");
    }
  };

  return (
    <div className="edit-pet-form">
      <h2>Edit Pet Details</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={formData.name || ""} onChange={handleChange} />
        <input name="breed" placeholder="Breed" value={formData.breed || ""} onChange={handleChange} />
        <input name="age" type="number" placeholder="Age" value={formData.age || ""} onChange={handleChange} />
        <input name="gender" placeholder="Gender" value={formData.gender || ""} onChange={handleChange} />
        <input name="location" placeholder="Location" value={formData.location || ""} onChange={handleChange} />
        <textarea name="description" placeholder="Description" value={formData.description || ""} onChange={handleChange} />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}
