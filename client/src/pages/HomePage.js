import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import './HomePage.css'; // Optional: for styling

const HomePage = () => {
  const [pets, setPets] = useState([]); // 1. Start with an empty array
  const [loading, setLoading] = useState(true);

  // 2. useEffect runs once after the component mounts
  useEffect(() => {
    const fetchPets = async () => {
      try {
        // 3. Make a GET request to your backend API endpoint
        const response = await axios.get('http://localhost:5000/api/pets');
        // 4. Update the state with the data from the API
        setPets(response.data);
      } catch (error) {
        console.error("Error fetching pets:", error);
      } finally {
        setLoading(false); // Stop showing loading message
      }
    };

    fetchPets();
  }, []); // The empty [] ensures this runs only once

  if (loading) {
    return <p>Loading pets...</p>;
  }

  return (
    <div className="home-container">
      <h1>Pets Available for Adoption 🐾</h1>
      <div className="pet-grid">
        {/* 5. The component now maps over the real pet data */}
        {pets.map(pet => (
          <div key={pet.pet_id} className="pet-card">
            <img src={pet.image_url || 'https://via.placeholder.com/150'} alt={pet.name} />
            <h3>{pet.name}</h3>
            <p>{pet.breed}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;