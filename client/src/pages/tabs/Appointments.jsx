// Appointments.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Appointments.css";

export default function Appointments({ userId }) {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/appointments/user/${userId}`)
      .then(res => setAppointments(res.data))
      .catch(err => console.error("Failed to fetch appointments", err));
  }, [userId]);

  const cancelAppointment = async (id) => {
    if (window.confirm("Cancel this appointment?")) {
      try {
        await axios.delete(`http://localhost:5000/api/appointments/${id}`);
        setAppointments(prev => prev.filter(a => a.id !== id));
      } catch (err) {
        alert("Failed to cancel appointment");
      }
    }
  };

  const rescheduleAppointment = (appt) => {
    navigate(`/edit-appointment/${appt.id}`, { state: appt });
  };

  return (
    <div className="appointments-section">
      <h3>My Appointments</h3>
      <div className="appointments-list">
        {appointments.length === 0 ? <p>No appointments yet.</p> : appointments.map(appt => (
          <div className="appointment-card" key={appt.id}>
            <p><strong>Vet:</strong> {appt.vet_name}</p>
            <p><strong>Date:</strong> {new Date(appt.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> {appt.time}</p>
            <p><strong>Status:</strong> {appt.status}</p>
            <div className="actions">
              <button onClick={() => rescheduleAppointment(appt)}>Edit</button>
              <button className="cancel-btn" onClick={() => cancelAppointment(appt.id)}>Cancel</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
