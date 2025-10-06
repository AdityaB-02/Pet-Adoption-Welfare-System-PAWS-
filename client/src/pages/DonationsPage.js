import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../pages/css/ShelterDashboard.css'; // Reuse the same CSS

const DonationsList = () => {
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
    <div className="content-card">
      <div className="dashboard-header">
        <h1>Donations Received</h1>
        <Link to="/shelter/add-donation" className="add-pet-button">Log New Donation</Link>
      </div>
      
      {donations.length > 0 ? (
        <table className="donations-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Donor</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {donations.map(donation => (
              <tr key={donation.donation_id}>
                <td>{new Date(donation.donation_date).toLocaleDateString()}</td>
                <td>{donation.donor_name}</td>
                <td>{donation.donation_type}</td>
                <td>{donation.amount ? `$${donation.amount}` : 'N/A'}</td>
                <td>{donation.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No donations have been recorded yet.</p>
      )}
    </div>
  );
};

export default DonationsList;