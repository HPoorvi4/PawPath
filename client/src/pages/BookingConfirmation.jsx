// BookingConfirmation.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/BookingConfirmation.css";

const BookingConfirmation = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) return <p>Invalid Booking Data</p>;

  const { vet, date, time } = state;

  return (
    <div className="booking-confirmation">
      <h2>Appointment Confirmed! ✅</h2>
      <div className="summary-card">
        <p><strong>Vet Name:</strong> {vet.name}</p>
        <p><strong>Specialization:</strong> {vet.specialization}</p>
        <p><strong>Location:</strong> {vet.location}</p>
        <p><strong>Contact:</strong> {vet.email} | {vet.phone}</p>
        <p><strong>Date:</strong> {date}</p>
        <p><strong>Time Slot:</strong> {time}</p>
      </div>
      <button onClick={() => navigate("/home")}>Go to Home</button>
    </div>
  );
};

export default BookingConfirmation;
