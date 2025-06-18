# 🐾 PawPath

**PawPath** is a full-stack web application that helps users adopt pets, report lost & found animals, and connect with local veterinary services. It’s a community-driven platform supporting pet lovers, shelters, and rescuers.

---

## 🗂 Table of Contents

1. [Demo Screenshots](#demo-screenshots)  
2. [Features](#features)  
3. [Tech Stack](#tech-stack)  
4. [Getting Started](#getting-started)  
5. [Project Structure](#project-structure)  
6. [Environment Variables](#environment-variables)  
7. [License](#license)  

---

## 🔍 Demo Screenshots

<div align="center">
  <img src="./assets/Landing.png" alt="Landing Page" width="200" />
  <img src="./assets/Home.png" alt="Home Page" width="200" />
  <img src="./assets/Adopt.png" alt="Adopt Pets" width="200" />
  <img src="./assets/Search_Lost.png" alt="Search Lost & Found" width="200" />
  <img src="./assets/Book_Vet.png" alt="Book Vet/Shelter" width="200" />
  <img src="./assets/Doc_Appo.png" alt="Doctor Appointment" width="200" />
  <img src="./assets/Reviews.png" alt="Community Reviews" width="200" />
  <img src="./assets/My_Profile.png" alt="My Profile" width="200" />
</div>

---

## 🚀 Features

- 🔐 **Secure Authentication** (JWT-based)  
- 🐶 **Pet Listings**: Add, view, and search adoptable pets  
- 📍 **Lost & Found**: Report and search for lost or found animals  
- 🏥 **Vet & Shelter Directory**  
- 💬 **Community Forum & Reviews**  
- ✉️ **In-App Messaging** between users  
- ⚙️ **RESTful API** powered by Express.js  
- ⚛️ **Responsive UI** built in React  

---

## 🛠 Tech Stack

![React](https://img.shields.io/badge/Frontend-React-blue)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![Express.js](https://img.shields.io/badge/Server-Express.js-lightgrey)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue)

**Frontend**  
- React  
- React Router  
- Axios  
- Context API (Auth & Global State)  

**Backend**  
- Node.js & Express.js  
- JWT for auth  
- Bcrypt for password hashing  
- CORS & Helmet for security  

**Database**  
- PostgreSQL  
- Schemas: `User`, `Pet`, `Report`, `Vet`, `Message`  

---

## 📥 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/Chinmaym6/PawPath.git
cd PawPath
2. Backend Setup
bash
Copy
Edit
cd backend
npm install
Create a .env file in the backend/ folder:

env
Copy
Edit
PORT=5000
JWT_SECRET=your_jwt_secret
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=pawpath
Start the backend server:

bash
Copy
Edit
npm run dev
3. Frontend Setup
bash
Copy
Edit
cd ../frontend
npm install
npm start
Visit the app in your browser:
http://localhost:3000

🗂 Project Structure
text
Copy
Edit
PawPath/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   └── index.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
└── README.md
🔧 Environment Variables
text
Copy
Edit
Key           | Description
--------------|-----------------------------------
PORT          | Port on which the backend runs (e.g. 5000)
JWT_SECRET    | Secret key for signing JWTs
DB_HOST       | PostgreSQL host (e.g. localhost)
DB_PORT       | PostgreSQL port (e.g. 5432)
DB_USER       | PostgreSQL username
DB_PASSWORD   | PostgreSQL password
DB_NAME       | PostgreSQL database name
