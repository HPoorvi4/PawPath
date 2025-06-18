import React, { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import VetCard from "../components/VetCard";
import "../styles/DocAppointment.css";
import FeatureNav from '../components/FeatureNav';
import Navbar from '../components/Navbar';

const DocAppointment = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [vets, setVets] = useState([]);
  const [userLocation, setUserLocation] = useState("");
  const [searched, setSearched] = useState(false); // Track if search has been made

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    axios.get(`http://localhost:5000/api/users/${userId}`).then(res => {
      setUserLocation(res.data.location);
    });
  }, []);

  const fetchVets = () => {
    const formattedDate = selectedDate.toISOString().split("T")[0];
    axios.get("http://localhost:5000/api/vets", {
      params: { location: userLocation, date: formattedDate },
    })
      .then(res => {
        setVets(res.data);
        setSearched(true);
      })
      .catch(err => console.error(err));
  };

  return (
    <div>
      <Navbar />
      <FeatureNav />
      <div className="doc-appointment">
        <h2>Find a Vet</h2>
        <div className="date-picker-section">
          <label>Select Appointment Date: </label>
          <DatePicker selected={selectedDate} onChange={setSelectedDate} minDate={new Date()} />
          <button onClick={fetchVets}>Search</button>
        </div>

        <div className="vet-list">
          {searched && vets.length === 0 ? (
            <p className="no-vets">😔 No vets available on this day in your area. Try another date.</p>
          ) : (
            vets.map(vet => (
              <VetCard key={vet.id} vet={vet} date={selectedDate} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DocAppointment;
