import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const ShelterLoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { email, password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/shelters/login', formData);
      localStorage.setItem('token', response.data.token);
      alert('Login successful!');
      navigate('/shelter/dashboard'); // Redirect to dashboard
    } catch (err) {
      alert('Error: ' + err.response.data.msg);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={onSubmit}>
        <h2>Shelter Login</h2>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={email} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" value={password} onChange={onChange} required />
        </div>
        <button type="submit">Login</button>
        <p className="form-footer">
          Don't have a shelter account? <Link to="/shelter/register">Register here</Link>
        </p>
      </form>
    </div>
  );
};

export default ShelterLoginPage;