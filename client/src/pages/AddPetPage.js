// In client/src/pages/AddPetPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/AddPetPage.css';

const AddPetPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    breed: '',
    age: '',
    gender: 'Male', // Default value
    description: '',
    image_url: ''
  });

  const { name, species, breed, age, gender, description, image_url } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token
        }
      };
      await axios.post('http://localhost:5000/api/pets', formData, config);
      alert('Pet added successfully!');
      navigate('/shelter/dashboard');
    } catch (err) {
      alert('Error adding pet: ' + (err.response?.data?.msg || 'Server Error'));
    }
  };

  return (
    <div className="form-container">
      <form className="pet-form" onSubmit={onSubmit}>
        <h2>Add a New Pet for Adoption</h2>
        <div className="form-group">
          <label>Pet's Name</label>
          <input type="text" name="name" value={name} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label>Species</label>
          <input type="text" name="species" value={species} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label>Breed</label>
          <input type="text" name="breed" value={breed} onChange={onChange} />
        </div>
        <div className="form-group">
          <label>Age (years)</label>
          <input type="number" name="age" value={age} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label>Gender</label>
          <select name="gender" value={gender} onChange={onChange}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={description} onChange={onChange} required></textarea>
        </div>
        <div className="form-group">
          <label>Image URL</label>
          <input type="text" name="image_url" value={image_url} onChange={onChange} />
        </div>
        <button type="submit">Add Pet</button>
      </form>
    </div>
  );
};

export default AddPetPage;