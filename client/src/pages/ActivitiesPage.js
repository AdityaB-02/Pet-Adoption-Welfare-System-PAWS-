import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../pages/css/ShelterDashboard.css';
import { Link } from 'react-router-dom';

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
    <div className="content-card">
      <div className="dashboard-header">
        <h1>Local Activities Conducted</h1>
        <Link to="/shelter/add-activity" className="add-pet-button">Add Activity</Link>
      </div>
      
      {activities.length > 0 ? (
        <div className="activity-list">
          {activities.map(activity => (
            <div key={activity.activity_id} className="activity-card">
              <h3>{activity.title}</h3>
              <div className="activity-details">
                <span><strong>Date:</strong> {new Date(activity.activity_date).toLocaleDateString()}</span>
                <span><strong>Location:</strong> {activity.location}</span>
              </div>
              <p className="activity-description">{activity.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No activities have been recorded yet.</p>
      )}
    </div>
  );
};

export default ActivitiesList;