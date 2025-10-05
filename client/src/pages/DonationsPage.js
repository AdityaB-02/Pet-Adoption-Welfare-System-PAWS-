import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../pages/css/ShelterDashboard.css';

const DonationsList = () => {
    // ... (your existing state and useEffect logic) ...
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDonations = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { 'x-auth-token': token } };
                const res = await axios.get('/api/shelters/donations', config);
                setDonations(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDonations();
    }, []);


    if (loading) return <p>Loading donations...</p>;

    return (
        // Add this wrapper div
        <div className="content-card">
            <div className="dashboard-header">
                <h1>Donations Received</h1>
            </div>
            {donations.length > 0 ? (
                <table className="dashboard-table">
                    {/* ... table content ... */}
                </table>
            ) : (
                <p>No donations have been recorded yet.</p>
            )}
        </div>
    );
};

export default DonationsList;