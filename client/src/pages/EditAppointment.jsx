// src/pages/EditAppointment.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/EditAppointment.css";

// Helper to format YYYY-MM-DD
function formatDateLocal(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function EditAppointment() {
  const { id } = useParams();
  const locationState = useLocation().state || {};
  const navigate = useNavigate();

  const [appt, setAppt] = useState(locationState);
  const [vet, setVet] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date(appt.date));
  const [chosenTime, setChosenTime] = useState(appt.time);

  // 1) Fetch vet info
  useEffect(() => {
    if (!appt.vet_id) return;
    axios
      .get(`http://localhost:5000/api/vets/${appt.vet_id}`)
      .then(res => setVet(res.data))
      .catch(console.error);
  }, [appt.vet_id]);

  // 2) Fetch booked slots on date change
  useEffect(() => {
    if (!appt.vet_id) return;
    const dateStr = formatDateLocal(selectedDate);
    axios
      .get("http://localhost:5000/api/appointments/booked", {
        params: { vetId: appt.vet_id, date: dateStr }
      })
      .then(res => setBookedSlots(res.data))
      .catch(console.error);
  }, [selectedDate, appt.vet_id]);

  // Helpers
  const allSlots = vet?.available_time
    ? vet.available_time.split(",").map(t => t.trim())
    : [];
  const categorize = time => {
    const hr = parseInt(time.split(":")[0], 10);
    return hr < 12 ? "Morning" : hr < 17 ? "Afternoon" : "Evening";
  };
  const available = allSlots.filter(s => !bookedSlots.includes(s));
  const grouped = { Morning: [], Afternoon: [], Evening: [] };
  available.forEach(s => grouped[categorize(s)].push(s));

  // Save changes
  const handleSave = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/appointments/${id}`,
        {
          date: formatDateLocal(selectedDate),
          time: chosenTime
        }
      );
      alert("Appointment updated!");
      navigate("/myprofile");
    } catch {
      alert("Failed to update appointment — slot may be taken.");
    }
  };

  if (!vet) return <p style={{ textAlign: "center" }}>Loading vet info…</p>;

  return (
    <div className="edit-appointment">
      <h2>Reschedule Appointment with {vet.name}</h2>
      <p><strong>Specialization:</strong> {vet.specialization}</p>
      <p><strong>Contact:</strong> {vet.email}, {vet.phone}</p>
      <p><strong>Location:</strong> {vet.location}</p>
      <p>
        <strong>Current Date:</strong>{" "}
        { /* show only date part */ }
        {formatDateLocal(new Date(appt.date))}
      </p>

      <label>Select New Date</label>
      <DatePicker
        selected={selectedDate}
        onChange={setSelectedDate}
        minDate={new Date()}
      />

      <div className="slots">
        {Object.entries(grouped).map(([period, slots]) => (
          <div key={period} className="slot-group">
            <h4>{period}</h4>
            <div className="slot-buttons">
              {slots.length === 0 ? (
                <p className="no-slots">No slots</p>
              ) : (
                slots.map(time => (
                  <button
                    key={time}
                    className={time === chosenTime ? "selected" : ""}
                    onClick={() => setChosenTime(time)}
                  >
                    {time}
                  </button>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {chosenTime && (
        <button className="confirm-btn" onClick={handleSave}>
          Save Changes
        </button>
      )}
    </div>
  );
}
