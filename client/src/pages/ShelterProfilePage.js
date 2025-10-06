import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './css/ShelterProfilePage.css'; // We will create this

const ShelterProfilePage = () => {
    const { id } = useParams(); // Gets shelter ID from the URL
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/shelters/${id}`);
                setProfile(res.data);
            } catch (error) {
                console.error("Error fetching shelter profile", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [id]);

    if (loading) return <p className="loading-message">Loading shelter profile...</p>;
    if (!profile) return <p className="loading-message">Shelter not found.</p>;

    const { details, pets, activities, donations } = profile;

    return (
        <div className="profile-container">
            

            <section className="profile-section">
                <h2>Our Adoptable Pets</h2>
                <div className="profile-pet-grid">
                    {pets.length > 0 ? (
                        pets.map(pet => (
                            <Link to={`/pets/${pet.pet_id}`} key={pet.pet_id} className="profile-pet-card">
                                <img src={pet.image_url || 'https://via.placeholder.com/300'} alt={pet.name} />
                                <h3>{pet.name}</h3>
                                <p>{pet.breed}</p>
                            </Link>
                        ))
                    ) : (
                        <p>This shelter has no available pets listed right now.</p>
                    )}
                </div>
            </section>

            <div className="profile-details-grid">
                <section className="profile-section">
                    <h2>Recent Activities</h2>
                    {activities.length > 0 ? (
                        <ul className="details-list">
                            {activities.map((activity, index) => (
                                <li key={index}>
                                    <strong>{activity.title}</strong> ({new Date(activity.activity_date).toLocaleDateString()})
                                    <p>{activity.description}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No recent activities to show.</p>
                    )}
                </section>

                <section className="profile-section">
                    <h2>How You Can Help</h2>
                    <p>This shelter gratefully accepts the following types of donations. Your support makes a difference!</p>
                    {donations.length > 0 ? (
                        <div className="donation-tags">
                            {/* We use a Set to only show unique donation types */}
                            {[...new Set(donations.map(d => d.donation_type))].map((type, index) => (
                                <span key={index} className="donation-tag">{type}</span>
                            ))}
                        </div>
                    ) : (
                        <p>Contact the shelter directly to see how you can help.</p>
                    )}
                </section>

                <section className="profile-header">
                <h1>{details.name}</h1>
                <p>{details.address}</p>
                <a href={`mailto:${details.email}`} className="contact-button">Contact Us</a>
            </section>
            </div>
        </div>
    );
};

export default ShelterProfilePage;