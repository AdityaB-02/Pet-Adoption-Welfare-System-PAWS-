import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/AddPetPage.css'; // Reuse form styling

const AddDonationPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    donor_name: 'Anonymous',
    amount: '',
    donation_type: 'Money',
    donation_date: '',
    notes: ''
  });

  const { donor_name, amount, donation_type, donation_date, notes } = formData;
  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { 'x-auth-token': token } };
      await axios.post('http://localhost:5000/api/shelters/donations', formData, config);
      alert('Donation logged successfully!');
      navigate('/shelter/dashboard/donations');
    } catch (err) {
      alert('Error logging donation: ' + (err.response?.data?.msg || 'Server Error'));
    }
  };

  return (
    <div className="form-container">
      <form className="pet-form" onSubmit={onSubmit}>
        <h2>Log a New Donation</h2>
        <div className="form-group">
          <label>Donor Name (optional)</label>
          <input type="text" name="donor_name" value={donor_name} onChange={onChange} />
        </div>
        <div className="form-group">
          <label>Donation Type</label>
          <select name="donation_type" value={donation_type} onChange={onChange} required>
            <option value="Money">Money</option>
            <option value="Food">Food</option>
            <option value="Supplies">Supplies</option>
            <option value="Service">Service</option>
          </select>
        </div>
        <div className="form-group">
          <label>Amount (if money)</label>
          <input type="number" name="amount" value={amount} onChange={onChange} step="0.01" />
        </div>
        <div className="form-group">
          <label>Date of Donation</label>
          <input type="date" name="donation_date" value={donation_date} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label>Notes (optional)</label>
          <textarea name="notes" value={notes} onChange={onChange}></textarea>
        </div>
        <button type="submit">Log Donation</button>
      </form>
    </div>
  );
};

export default AddDonationPage;