import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// You can reuse the form styling from AddPetPage.css
import './css/AddPetPage.css';

const AddActivityPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    activity_date: '',
    location: ''
  });

  const { title, description, activity_date, location } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { 'x-auth-token': token } };
      await axios.post('http://localhost:5000/api/shelters/activities', formData, config);
      alert('Activity added successfully!');
      navigate('/shelter/dashboard/activities'); // Redirect to the activities list
    } catch (err) {
      alert('Error adding activity: ' + (err.response?.data?.msg || 'Server Error'));
    }
  };

  return (
    <div className="form-container">
      <form className="pet-form" onSubmit={onSubmit}>
        <h2>Add a New Activity</h2>
        <div className="form-group">
          <label>Activity Title</label>
          <input type="text" name="title" value={title} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label>Date of Activity</label>
          <input type="date" name="activity_date" value={activity_date} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label>Location</label>
          <input type="text" name="location" value={location} onChange={onChange} />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={description} onChange={onChange} required></textarea>
        </div>
        <button type="submit">Add Activity</button>
      </form>
    </div>
  );
};

export default AddActivityPage;