import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import './css/ShelterDashboard.css'; 

const ShelterDashboard = () => {
  const location = useLocation();

  // Helper to determine if a link is active
  const isActive = (path) => location.pathname === path;

  return (
    <div className="shelter-dashboard">
      <nav className="dashboard-sidebar">
        <h3>Shelter Menu</h3>
        <ul>
          {/* We'll add an "Add Pet" link here for convenience */}
          
          <li className={isActive('/shelter/dashboard') ? 'active' : ''}>
            <Link to="/shelter/dashboard">My Pets</Link>
          </li>
          <li className={isActive('/shelter/dashboard/inbox') ? 'active' : ''}>
            <Link to="/shelter/dashboard/inbox">Inbox</Link>
          </li>
          <li className={isActive('/shelter/dashboard/profile') ? 'active' : ''}>
            <Link to="/shelter/dashboard/profile">Profile</Link>
          </li>
        </ul>
      </nav>

      <main className="dashboard-content">
        {/* The Outlet will render the correct component for the route, like ShelterPetList or ShelterInbox */}
        <Outlet />
      </main>
    </div>
  );
};

export default ShelterDashboard;

