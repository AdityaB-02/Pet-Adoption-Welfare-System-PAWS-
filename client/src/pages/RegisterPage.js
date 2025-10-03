import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link for navigation
import './css/RegisterPage.css'; // We'll create this CSS file

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '', // 1. ADDED THIS LINE
    password: '',
    password2: '', // For password confirmation
    address: ''
  });

  // 2. ADDED phone_number HERE
  const { full_name, email, phone_number, password, password2, address } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      alert('Passwords do not match');
    } else {
      try {
        // 3. ADDED phone_number TO THE newUser OBJECT
        const newUser = { full_name, email, phone_number, password, address };
        const response = await axios.post('http://localhost:5000/api/users/register', newUser);
        
        console.log('Registration successful!', response.data);
        alert('Registration successful! You can now log in.');

        // In a real app, you might automatically log the user in and redirect:
        // localStorage.setItem('token', response.data.token);
        // window.location.href = '/';

      } catch (err) {
        console.error(err.response.data);
        alert('Error: ' + err.response.data.msg);
      }
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={onSubmit}>
        <h2>Create an Account</h2>
        <div className="form-group">
          <label htmlFor="full_name">Full Name</label>
          <input type="text" name="full_name" value={full_name} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input type="email" name="email" value={email} onChange={onChange} required />
        </div>
        
        {/* 4. ADDED THIS ENTIRE FORM GROUP BLOCK */}
        <div className="form-group">
          <label htmlFor="phone_number">Phone Number</label>
          <input type="tel" name="phone_number" value={phone_number} onChange={onChange} />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" name="password" value={password} onChange={onChange} minLength="6" required />
        </div>
        <div className="form-group">
          <label htmlFor="password2">Confirm Password</label>
          <input type="password" name="password2" value={password2} onChange={onChange} minLength="6" required />
        </div>
         <div className="form-group">
          <label htmlFor="address">Address</label>
          <textarea name="address" value={address} onChange={onChange}></textarea>
        </div>
        <button type="submit">Register</button>
        <p className="form-footer">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
