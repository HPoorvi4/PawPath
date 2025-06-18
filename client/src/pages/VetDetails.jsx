// VetDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/VetDetails.css";

const VetDetails = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const selectedDate = searchParams.get("date");
  const [vet, setVet] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [chosenTime, setChosenTime] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/vets/${id}`).then(res => setVet(res.data));
    axios.get(`http://localhost:5000/api/appointments/booked`, {
      params: { vetId: id, date: selectedDate }
    }).then(res => setBookedSlots(res.data));
  }, [id, selectedDate]);

  const getSlotsFromVet = () => {
    if (!vet?.available_time) return [];
    return vet.available_time.split(",").map(t => t.trim());
  };

  const getSlotCategory = (time) => {
    const hour = parseInt(time.split(":"[0]));
    if (hour < 12) return "Morning";
    if (hour < 17) return "Afternoon";
    return "Evening";
  };

  const handleConfirm = async () => {
    try {
      const userId = localStorage.getItem("userId");
      await axios.post("http://localhost:5000/api/appointments", {
        user_id: userId,
        vet_id: id,
        vet_name: vet.name,
        date: selectedDate,
        time: chosenTime,
      });
      navigate("/booking/confirmation", { state: {
        vet, date: selectedDate, time: chosenTime
      }});
    } catch (err) {
      alert("Booking failed. Time slot might already be taken.");
    }
  };

  const availableSlots = getSlotsFromVet().filter(slot => !bookedSlots.includes(slot));
  const grouped = { Morning: [], Afternoon: [], Evening: [] };
  availableSlots.forEach(slot => grouped[getSlotCategory(slot)].push(slot));

  if (!vet) return <p>Loading...</p>;

  return (
    <div className="vet-details">
      <h2>{vet.name}</h2>
      <p><strong>Specialization:</strong> {vet.specialization}</p>
      <p><strong>Contact:</strong> {vet.email}, {vet.phone}</p>
      <p><strong>Location:</strong> {vet.location}</p>
      <p><strong>Date:</strong> {selectedDate}</p>

      <div className="slots">
        {Object.entries(grouped).map(([category, slots]) => (
          <div key={category}>
            <h4>{category}</h4>
            <div className="slot-buttons">
              {slots.length === 0 ? <p>No slots</p> : slots.map(slot => (
                <button
                  key={slot}
                  className={chosenTime === slot ? "selected" : ""}
                  onClick={() => setChosenTime(slot)}>
                  {slot}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {chosenTime && <button className="confirm-btn" onClick={handleConfirm}>Confirm Booking</button>}
    </div>
  );
};

export default VetDetails;
