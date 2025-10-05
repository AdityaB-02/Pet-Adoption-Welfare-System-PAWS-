import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './css/LandingPage.css'; // Using your existing CSS path

const LandingPage = () => {
    const [stats, setStats] = useState({ shelterCount: 0, petCount: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch statistics from the backend API
        fetch('http://localhost:5000/api/app/stats')
            .then(response => response.json())
            .then(data => {
                setStats(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching stats:", error);
                setLoading(false);
            });
    }, []);

    return (
        <div className="landing-container">
            <header className="landing-header">
                <h1>Welcome to Pet-Adopt</h1>
                <p>Connecting loving homes with pets in need.</p>
            </header>

            <section className="stats-section">
                <h2>Our Growing Community</h2>
                <div className="stats-cards-container">
                    <div className="stat-card">
                        <h3>{loading ? '...' : stats.shelterCount}</h3>
                        <p>Partner Shelters</p>
                    </div>
                    <div className="stat-card">
                        <h3>{loading ? '...' : stats.petCount}</h3>
                        <p>Pets Awaiting a Home</p>
                    </div>
                </div>
            </section>

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
                    <p>Manage your pet listings, review applications, and find loving homes for your animals.</p>
                    <Link to="/shelter/login" className="choice-button shelter-button">
                        Shelter Login
                    </Link>
                </div>
            </div>

            {/* Combined Mission & Vision Section */}
            <section className="info-section alternate-bg">
                <div className="mission-vision-container">
                    <div className="info-card">
                        <h2>Our Mission</h2>
                        <p>To bridge the gap between animal shelters and compassionate individuals through technology, creating a streamlined platform that simplifies adoption and builds a supportive community for animal welfare.</p>
                    </div>
                    <div className="info-card">
                        <h2>Our Vision</h2>
                        <p>A world where every pet has a loving, forever home.</p>
                    </div>
                </div>
            </section>
            
            <section className="info-section">
                <h2>Our Features</h2>
                <ul>
                    <li>✓ Advanced Pet Search: Filter by breed, age, size, and location.</li>
                    <li>✓ Detailed Shelter Profiles: Connect with local rescue organizations.</li>
                    <li>✓ Seamless Adoption Process: Apply directly through the platform.</li>
                    <li>✓ Personalized User Accounts: Save your favorites and track applications.</li>
                </ul>
            </section>

            {/* Community Impact Section Added */}
            <section className="info-section alternate-bg">
                 <h2>Our Community Impact</h2>
                <p>Pet-Adopt directly helps reduce shelter overcrowding by increasing the visibility of adoptable animals. We provide shelters with a powerful, free tool to reach a wider audience, ultimately leading to more pets finding the loving homes they deserve.</p>
            </section>
        </div>
    );
};

export default LandingPage;