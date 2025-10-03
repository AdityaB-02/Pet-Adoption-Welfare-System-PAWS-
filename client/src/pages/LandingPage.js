// In client/src/pages/LandingPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import './css/LandingPage.css'; // We'll create this for styling

const LandingPage = () => {
  return (
    <div className="landing-container">
      <header className="landing-header">
        <h1>Welcome to Pet-Adopt</h1>
        <p>Connecting loving homes with pets in need.</p>
      </header>

      <div className="choice-container">
        <div className="choice-card">
          <h2>For Adopters</h2>
          <p>Find your new best friend. Browse pets available for adoption from shelters near you.</p>
          <Link to="/login" className="choice-button">
            User Login
          </Link>
        </div>

        <div className="choice-card">
          <h2>For Shelters</h2>
          <p>Manage your pet listings, review adoption applications, and find loving homes for your animals.</p>
          <Link to="/shelter/login" className="choice-button shelter-button">
            Shelter Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;