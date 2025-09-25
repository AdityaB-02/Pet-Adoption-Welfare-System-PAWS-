import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const ShelterRegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    shelter_name: '',
    email: '',
    password: '',
    password2: '',
    address: '',
    capacity: ''
  });

  const { shelter_name, email, password, password2, address, capacity } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      alert('Passwords do not match');
    } else {
      try {
        const newShelter = { shelter_name, email, password, address, capacity };
        const response = await axios.post('http://localhost:5000/api/shelters/register', newShelter);
        
        localStorage.setItem('token', response.data.token);
        alert('Registration successful! Welcome.');
        navigate('/shelter/dashboard'); // Redirect to a future dashboard page

      } catch (err) {
        alert('Error: ' + err.response.data.msg);
      }
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={onSubmit}>
        <h2>Shelter Registration</h2>
        <div className="form-group">
          <label>Shelter Name</label>
          <input type="text" name="shelter_name" value={shelter_name} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={email} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" value={password} onChange={onChange} minLength="6" required />
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input type="password" name="password2" value={password2} onChange={onChange} minLength="6" required />
        </div>
         <div className="form-group">
          <label>Address</label>
          <textarea name="address" value={address} onChange={onChange} required></textarea>
        </div>
        <div className="form-group">
          <label>Capacity (Number of Animals)</label>
          <input type="number" name="capacity" value={capacity} onChange={onChange} required />
        </div>
        <button type="submit">Register Shelter</button>
        <p className="form-footer">
          Already have a shelter account? <Link to="/shelter/login">Login here</Link>
        </p>
      </form>
    </div>
  );
};

export default ShelterRegisterPage;