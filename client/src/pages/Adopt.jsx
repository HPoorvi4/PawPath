import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "../components/Card";
import "../styles/Adopt.css"
import FeatureNav from '../components/FeatureNav';
import Navbar from '../components/Navbar';

function Adopt() {
  const [filters, setFilters] = useState({
    species: "", breed: "", gender: "", location: ""
  });
  const [dropdowns, setDropdowns] = useState({
    species: [], breed: [], gender: [], location: []
  });
  const [pets, setPets] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/pets/dropdowns")
      .then(res => setDropdowns(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    const params = new URLSearchParams(filters);
    axios.get(`http://localhost:5000/api/pets?${params.toString()}`)
      .then(res => setPets(res.data))
      .catch(err => console.error(err));
  };

  return (
    <div>
          <Navbar />
          <FeatureNav />
    <div className="adopt-page">
      <h2>Find a Pet</h2>
      <div className="search-filters">
        {["species", "breed", "gender", "location"].map(field => (
          <select name={field} onChange={handleChange} key={field}>
            <option value="">{field.charAt(0).toUpperCase() + field.slice(1)}</option>
            {dropdowns[field].map(value => <option key={value} value={value}>{value}</option>)}
          </select>
        ))}
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="cards-container">
        {pets.length === 0 ? <p>No pets found</p> :
          pets.map(pet => <Card key={pet.id} pet={pet} />)}
      </div>
    </div>
    </div>
  );
}

export default Adopt;
