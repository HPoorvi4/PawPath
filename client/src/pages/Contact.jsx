// src/pages/Contact.jsx
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import FeatureNav from '../components/FeatureNav';
import Footer from '../components/Footer';
import '../styles/Contact.css';
import axios from 'axios';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState("");

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus(""); // clear previous
    try {
      const res = await axios.post("http://localhost:5000/api/contact", form);
      if (res.data.success) {
        setStatus("Thanks! We will reach back to you in 2-3 days.");
        setForm({ name: '', email: '', message: '' });
      } else {
        setStatus("Oops—couldn't send your message.");
      }
    } catch (err) {
      console.error(err);
      setStatus("Server error. Please try again later.");
    }
  };

  return (
    <>
      <Navbar />
      <FeatureNav />

      <div className="contact-container">
        <h1>Contact Us</h1>
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            placeholder="How can we help you?"
            value={form.message}
            onChange={handleChange}
            required
          />
          <button type="submit">Send Message</button>
        </form>
        {status && <p className="status">{status}</p>}
      </div>

      <Footer />
    </>
  );
}
