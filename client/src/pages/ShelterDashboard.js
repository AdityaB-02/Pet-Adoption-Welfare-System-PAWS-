import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './css/ShelterDashboard.css'; // <-- Import the new CSS

const ShelterDashboard = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { 'x-auth-token': token } };
        const response = await axios.get('http://localhost:5000/api/shelters/pets', config);
        setPets(response.data);
      } catch (error) {
        console.error("Error fetching shelter pets:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPets();
  }, []);

  const handleDelete = async (petId) => {
    // Confirm with the user before deleting
    if (window.confirm('Are you sure you want to delete this pet listing?')) {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { 'x-auth-token': token } };
        
        await axios.delete(`http://localhost:5000/api/pets/${petId}`, config);
        
        // Update the UI by removing the deleted pet from the state
        setPets(pets.filter(pet => pet.pet_id !== petId));
        alert('Pet deleted successfully.');

      } catch (error) {
        console.error("Error deleting pet:", error);
        alert('Failed to delete pet.');
      }
    }
  };

  if (loading) return <p>Loading your pets...</p>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Shelter Dashboard</h1>
        <Link to="/shelter/add-pet" className="add-pet-button">Add New Pet</Link>
      </header>

      {pets.length === 0 ? (
        <p>You have no pets listed yet. Add one to get started!</p>
      ) : (
        <div className="pet-grid-shelter">
          {pets.map(pet => (
            <div key={pet.pet_id} className="pet-card-shelter">
              <img src={pet.image_url || 'https://via.placeholder.com/300'} alt={pet.name} />
              <div className="pet-card-content">
                <h3>{pet.name}</h3>
                <p>{pet.breed} ({pet.species})</p>
                <p>
                  <span className={`status status-${pet.adoption_status.toLowerCase()}`}>
                    {pet.adoption_status}
                  </span>
                </p>
                <div className="pet-card-actions">
                  <Link to={`/shelter/edit-pet/${pet.pet_id}`} className="edit-btn-link">
                  <button>Edit</button>
                  </Link>
                  <button className="delete-btn" onClick={() => handleDelete(pet.pet_id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShelterDashboard;