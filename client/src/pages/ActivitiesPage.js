import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../pages/css/ShelterDashboard.css';

const ActivitiesList = () => {
    // ... (your existing state and useEffect logic) ...
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActivities = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { 'x-auth-token': token } };
                const res = await axios.get('/api/shelters/activities', config);
                setActivities(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchActivities();
    }, []);

    if (loading) return <p>Loading activities...</p>;

    return (
        // Add this wrapper div
        <div className="content-card">
            <div className="dashboard-header">
                <h1>Local Activities Conducted</h1>
            </div>
            {activities.length > 0 ? (
                <div className="activity-list">
                    {/* ... list of activity cards ... */}
                </div>
            ) : (
                <p>No activities have been recorded yet.</p>
            )}
        </div>
    );
};

export default ActivitiesList;