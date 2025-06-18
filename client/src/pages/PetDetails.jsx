import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/PetDetails.css";

function PetDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [owner, setOwner] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/pets/${id}`)
      .then(res => {
        setPet(res.data.pet);
        setOwner(res.data.owner);
      })
      .catch(err => console.error(err));
  }, [id]);

  const handleAdopt = async () => {
    try {
      const userId = localStorage.getItem("userId");
      await axios.post("http://localhost:5000/api/adoptions", {
        userId,
        petId: pet.id,
      });
      alert("Adopted Request sent Successfully!");
      navigate("/adopt");
    } catch (error) {
      alert("Adoption failed or already adopted.");
    }
  };

  if (!pet) return <div>Loading...</div>;

  return (
    <div className="pet-details">
     <img src={`http://localhost:5000${pet.photo_url}`} alt={pet.name} className="pet-image" />
      <div className="pet-info">
        <h2>{pet.name}</h2>
        <p><strong>Species:</strong> {pet.species}</p>
        <p><strong>Breed:</strong> {pet.breed}</p>
        <p><strong>Age:</strong> {pet.age}</p>
        <p><strong>Gender:</strong> {pet.gender}</p>
        <p><strong>Location:</strong> {pet.location}</p>
        <p><strong>Description:</strong> {pet.description}</p>
        {owner && (
          <>
            <h3>Owner Contact</h3>
            <p><strong>Email:</strong> {owner.email}</p>
            <p><strong>Phone:</strong> {owner.phone_number}</p>
          </>
        )}
        <button className="adopt-button" onClick={handleAdopt} disabled={pet.is_adopted}>
          {pet.is_adopted ? "Already Adopted" : "Adopt"}
        </button>
      </div>
    </div>
  );
}

export default PetDetails;
