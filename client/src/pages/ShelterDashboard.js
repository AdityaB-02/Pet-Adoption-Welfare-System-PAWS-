// In client/src/pages/ShelterDashboard.js

import React from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import './css/ShelterDashboard.css'; 

const ShelterDashboard = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;
    return (
        <div className="shelter-dashboard">
            <nav className="dashboard-sidebar">
                <h3>Shelter Menu</h3>
                <ul>
                    {/* The sidebar now uses NavLink, which is like Link but can be styled when active */}
                     <li className={isActive('/shelter/dashboard') ? 'active' : ''}>
                        <Link to="/shelter/dashboard">My Pets</Link>
                    </li>
                    <li className={isActive('/shelter/dashboard/inbox') ? 'active' : ''}>
                        <Link to="/shelter/dashboard/inbox">Inbox</Link>
                    </li>
                    <li className={isActive('/shelter/dashboard/profile') ? 'active' : ''}>
                        <Link to="/shelter/dashboard/profile">Profile</Link>
                    </li>
                    {/* New links for the pages */}
                    <li className ={isActive('/shelter/dashboard/donations') ? 'active' : ''}>
                        <Link to="/shelter/dashboard/donations">Donations</Link>
                    </li>
                    <li className ={isActive('/shelter/dashboard/activities') ? 'active' : ''}>
                        <Link to="/shelter/dashboard/activities">Activities</Link>
                    </li>
                </ul>
            </nav>

            <main className="dashboard-content">
                {/* The Outlet will render the correct page based on the URL */}
                <Outlet />
            </main>
        </div>
    );
};

export default ShelterDashboard;