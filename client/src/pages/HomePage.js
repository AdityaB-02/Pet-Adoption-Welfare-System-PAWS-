// In client/src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Modal from '../components/Modal';
import './css/HomePage.css'; // <-- Import the new CSS

const HomePage = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    species: '',
    breed: '',
    min_age: '',
    max_age: '',
    gender: '',
    search: ''
  });

  const fetchPets = async () => {
    setLoading(true);
    try {
      // Build query string from filters
      const queryString = new URLSearchParams(filters).toString();
      const response = await axios.get(`http://localhost:5000/api/pets?${queryString}`);
      setPets(response.data);
    } catch (error) {
      console.error("Error fetching pets:", error);
    } finally {
      setLoading(false);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);

  // Fetch pets whenever filters change
  useEffect(() => {
    fetchPets();
  }, [filters]); // Dependency array: re-run when filters state changes

  const handleViewDetails = async (petId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/pets/${petId}`);
      setSelectedPet(response.data); // Store the full pet details
      setIsModalOpen(true); // Open the modal
    } catch (error) {
      console.error("Error fetching pet details:", error);
      alert("Could not load pet details.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPet(null);
  };
  
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleClearFilters = () => {
    setFilters({
      species: '',
      breed: '',
      min_age: '',
      max_age: '',
      gender: '',
      search: ''
    });
  };

  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <h1>Find Your New Best Friend</h1>
        <p>Browse pets available for adoption from shelters near you.</p>
      </header>

      {/* Filter and Search Section */}
      <div className="filter-search-section">
        <input
          type="text"
          name="search"
          placeholder="Search by name, species, breed or description..."
          value={filters.search}
          onChange={handleFilterChange}
          className="search-input"
        />
        <div className="filters-grid">
          <select name="species" value={filters.species} onChange={handleFilterChange}>
            <option value="">All Species</option>
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
            <option value="Bird">Bird</option>
            <option value="Rabbit">Rabbit</option>
            {/* Add more species as needed */}
          </select>

          <input
            type="text"
            name="breed"
            placeholder="Breed"
            value={filters.breed}
            onChange={handleFilterChange}
          />

          <input
            type="number"
            name="min_age"
            placeholder="Min Age"
            value={filters.min_age}
            onChange={handleFilterChange}
          />
          <input
            type="number"
            name="max_age"
            placeholder="Max Age"
            value={filters.max_age}
            onChange={handleFilterChange}
          />
          <select name="gender" value={filters.gender} onChange={handleFilterChange}>
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <button onClick={handleClearFilters} className="clear-filters-button">Clear Filters</button>
        </div>
      </div>

      {loading ? (
        <p className="loading-message">Loading amazing pets...</p>
      ) : pets.length === 0 ? (
        <p className="no-pets-message">No pets found matching your criteria. Try adjusting your filters!</p>
      ) : (
        <div className="pet-grid">
          {pets.map(pet => (
            <div key={pet.pet_id} className="pet-card">
              <img src={pet.image_url || 'https://via.placeholder.com/400x300'} alt={pet.name} />
              <div className="pet-card-content">
                <h3>{pet.name}</h3>
                <p><strong>Species:</strong> {pet.species}</p>
                {pet.breed && <p><strong>Breed:</strong> {pet.breed}</p>}
                <p><strong>Age:</strong> {pet.age} years</p>
                <p><strong>Gender:</strong> {pet.gender}</p>
                <p>{pet.description.substring(0, 100)}...</p> {/* Shorten description */}
                <button className="view-details-button" onClick={() => handleViewDetails(pet.pet_id)}>
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Conditionally render the Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {selectedPet && (
          <div className="pet-details-modal-content">
            <img src={selectedPet.image_url || 'https://via.placeholder.com/600x400'} alt={selectedPet.name} />
            <div className="pet-info-section">
              <h1>{selectedPet.name}</h1>
              <p className="breed-info">{selectedPet.breed} ({selectedPet.species})</p>
              <div className="details-grid">
                <div><strong>Age:</strong> {selectedPet.age} years</div>
                <div><strong>Gender:</strong> {selectedPet.gender}</div>
              </div>
              <h3>About {selectedPet.name}</h3>
              <p>{selectedPet.description}</p>
              <div className="shelter-info">
                <h3>Shelter Information</h3>
                <p><strong>Name:</strong> {selectedPet.shelter_name}</p>
                <p><strong>Address:</strong> {selectedPet.shelter_address}</p>
                <p><strong>Contact:</strong> {selectedPet.shelter_email}</p>
              </div>
              <button className="adopt-button">Adopt Me!</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default HomePage;