// In client/src/pages/ShelterDashboard.js

import React from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import './css/ShelterDashboard.css'; 

const ShelterDashboard = () => {
    return (
        <div className="shelter-dashboard">
            <nav className="dashboard-sidebar">
                <h3>Shelter Menu</h3>
                <div className="sidebar-action">
                    <Link to="/shelter/add-pet" className="add-pet-button-sidebar">Add New Pet</Link>
                </div>

                <ul>
                    {/* The sidebar now uses NavLink, which is like Link but can be styled when active */}
                    <li>
                        <NavLink to="/shelter/dashboard" end>My Pets</NavLink>
                    </li>
                    <li>
                        <NavLink to="/shelter/dashboard/inbox">Inbox</NavLink>
                    </li>
                    <li>
                        <NavLink to="/shelter/dashboard/profile">Profile</NavLink>
                    </li>
                    {/* New links for the pages */}
                    <li>
                        <NavLink to="/shelter/dashboard/donations">Donations</NavLink>
                    </li>
                    <li>
                        <NavLink to="/shelter/dashboard/activities">Activities</NavLink>
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