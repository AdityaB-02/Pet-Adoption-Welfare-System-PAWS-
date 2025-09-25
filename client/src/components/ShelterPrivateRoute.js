// In client/src/components/ShelterPrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ShelterPrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  // If a token exists, render the child component (the dashboard)
  // In a more complex app, you'd also verify the token's role (user vs. shelter)
  if (token) {
    return children;
  }

  // If no token, redirect to the shelter login page
  return <Navigate to="/shelter/login" />;
};

export default ShelterPrivateRoute;