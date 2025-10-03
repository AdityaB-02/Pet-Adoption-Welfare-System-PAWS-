import React, { useState } from 'react';
import axios from 'axios';
import './css/LoginPage.css';
import { Link, useNavigate } from 'react-router-dom'; // We will create this file for styling

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();
  const { email, password } = formData;

  // A single handler to update state for any form field
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handler for form submission
  const onSubmit = async (e) => {
    e.preventDefault(); // Prevents the default browser refresh on submit
    
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', formData);

      console.log('Login successful!', response.data);
      //alert('Login successful!');
        localStorage.setItem('token', response.data.token);
        navigate('/pets');
      // In a real app, you would do something with the token, like this:
      // localStorage.setItem('token', response.data.token);
      // And then redirect the user:
      // window.location.href = '/dashboard';

    } catch (err) {
      console.error(err.response.data);
      alert('Error: ' + err.response.data.msg);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={onSubmit}>
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={onChange}
            minLength="6"
            required
          />
        </div>
        <button type="submit">Login</button>
        <p className="form-footer">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;