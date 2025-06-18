// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }) {
  const isLoggedIn = Boolean(localStorage.getItem("userId"));
  return isLoggedIn
    ? children
    : <Navigate to="/login" replace />;
}
