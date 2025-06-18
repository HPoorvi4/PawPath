# 🐾 PawPath

**PawPath** is a full-stack web application that helps users adopt pets, report lost and found animals, and connect with local veterinary services. It serves as a community-driven platform to support pet lovers, shelters, and rescuers—all in one place.

---

## 🚀 Features

- 🔐 Secure User Authentication (JWT-based)
- 🐶 Pet Listings for Adoption (Add, View, Search)
- 📍 Report Lost & Found Pets with Location
- 🏥 Vet and Shelter Directory Integration
- 💬 Community Forum for Pet Owners
- 📩 Contact Pet Owners via In-App Messaging
- 📥 RESTful Backend API with Express.js
- ⚛️ Responsive Frontend with React

---

## 🛠️ Tech Stack

![React](https://img.shields.io/badge/Frontend-React-blue)
![Node](https://img.shields.io/badge/Backend-Node.js-green)
![Express](https://img.shields.io/badge/Server-Express.js-white)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue)

### Frontend:
- React
- React Router
- Axios
- Context API (for auth & global state)

### Backend:
- Node.js
- Express.js
- JWT for authentication
- Bcrypt for password hashing
- CORS & Helmet for security

### Database:
- PostgreSQL
- Structured schemas with relationships
- User, Pet, Report, Vet, Message tables

---

## 🧰 Getting Started

### 🔹 Clone the Repository

```bash
git clone https://github.com/Chinmaym6/PawPath.git
cd PawPath

### 🔹 Set Up the Backend

```bash
cd backend
npm install

### 🔹 Create a .env file in backend/

```bash
PORT=5000
JWT_SECRET=your_jwt_secret
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=pawpath

### 🔹 Start Backend Server

```bash
node index.js

### 🔹 Set Up the Frontend

```bash
cd frontend
npm install
npm start

### 🔹 Visit the App
Open your browser and navigate to:

```bash
http://localhost:300

