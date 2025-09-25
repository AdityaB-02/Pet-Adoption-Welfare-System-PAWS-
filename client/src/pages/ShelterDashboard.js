// In client/src/pages/ShelterDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ShelterDashboard = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        // Get the token from local storage
        const token = localStorage.getItem('token');

        // Set up headers with the token
        const config = {
          headers: {
            'x-auth-token': token
          }
        };

        // Fetch pets from the new protected endpoint
        const response = await axios.get('http://localhost:5000/api/shelters/pets', config);
        setPets(response.data);
      } catch (error) {
        console.error("Error fetching shelter pets:", error);
        // Handle error (e.g., redirect to login if token is invalid)
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  if (loading) {
    return <p>Loading your pets...</p>;
  }

  return (
    <div className="dashboard-container">
      <h1>Shelter Dashboard</h1>
      <p>Welcome! Here are your current listings.</p>
      <Link to="/shelter/add-pet" className="add-pet-button">Add New Pet</Link>

      <div className="pet-listings">
        {pets.length === 0 ? (
          <p>You have no pets listed yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Species</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pets.map(pet => (
                <tr key={pet.pet_id}>
                  <td>{pet.name}</td>
                  <td>{pet.species}</td>
                  <td>{pet.adoption_status}</td>
                  <td>
                    <button>Edit</button>
                    <button>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ShelterDashboard;