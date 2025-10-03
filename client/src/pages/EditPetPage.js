import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './css/AddPetPage.css'; 

const EditPetPage = () => {
  const { id } = useParams(); // Gets the pet's ID from the URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    breed: '',
    age: '',
    gender: '',
    description: '',
    image_url: '',
    adoption_status: ''
  });

  // Fetch the pet's current data when the component loads
  useEffect(() => {
    const fetchPetData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/pets/${id}`);
        setFormData(response.data); // Pre-fill the form with existing data
      } catch (error) {
        console.error("Error fetching pet data:", error);
      }
    };
    fetchPetData();
  }, [id]);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { 'x-auth-token': token } };
      await axios.put(`http://localhost:5000/api/pets/${id}`, formData, config);
      alert('Pet updated successfully!');
      navigate('/shelter/dashboard');
    } catch (err) {
      alert('Error updating pet: ' + (err.response?.data?.msg || 'Server Error'));
    }
  };

  // The value of each input is now tied to the component's state
  return (
    <div className="form-container">
      <form className="pet-form" onSubmit={onSubmit}>
        <h2>Edit Pet Details</h2>
        <div className="form-group">
          <label>Pet's Name</label>
          <input type="text" name="name" value={formData.name} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label>Species</label>
          <input type="text" name="species" value={formData.species} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label>Breed</label>
          <input type="text" name="breed" value={formData.breed} onChange={onChange} />
        </div>
        <div className="form-group">
          <label>Age (years)</label>
          <input type="number" name="age" value={formData.age} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label>Gender</label>
          <select name="gender" value={formData.gender} onChange={onChange}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={onChange} required></textarea>
        </div>
        <div className="form-group">
          <label>Image URL</label>
          <input type="text" name="image_url" value={formData.image_url} onChange={onChange} />
        </div>
        <div className="form-group">
          <label>Adoption Status</label>
          <select name="adoption_status" value={formData.adoption_status} onChange={onChange}>
            <option value="Available">Available</option>
            <option value="Pending">Pending</option>
            <option value="Adopted">Adopted</option>
          </select>
        </div>
        <button type="submit">Update Pet</button>
      </form>
    </div>
  );
};

export default EditPetPage;