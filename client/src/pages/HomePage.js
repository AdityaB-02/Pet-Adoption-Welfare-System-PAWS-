import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../components/Modal'; 
import ContactShelterModal from '../components/ContactShelterModal'; 
import ChatBox from '../components/ChatBox';
import PetCard from '../components/PetCard';
import './css/HomePage.css';
import { Link } from 'react-router-dom';

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
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);

  useEffect(() => {
    const fetchPets = async () => {
      setLoading(true);
      try {
        const queryString = new URLSearchParams(filters).toString();
        const response = await axios.get(`/api/pets?${queryString}`);
        setPets(response.data);
      } catch (error) {
        console.error("Error fetching pets:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPets();
  }, [filters]);

  const handleViewDetails = async (petId) => {
    try {
      const response = await axios.get(`/api/pets/${petId}`);
      setSelectedPet(response.data);
      setIsDetailsModalOpen(true);
    } catch (error) {
      console.error("Error fetching pet details:", error);
      alert("Could not load pet details.");
    }
  };

  const handleAdoptClick = () => {
    if (selectedPet) {
      setIsDetailsModalOpen(false);
      setIsContactModalOpen(true);
    }
  };

  const handleChatClick = () => {
    setIsDetailsModalOpen(false);
    setIsChatOpen(true);
  };
  
  const closeDetailsModal = () => setIsDetailsModalOpen(false);
  const closeContactModal = () => setIsContactModalOpen(false);
  const closeChatBox = () => setIsChatOpen(false);

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
      <div className="filter-search-section">
        <input
          type="text"
          name="search"
          placeholder="Search by name, species, breed..."
          value={filters.search}
          onChange={handleFilterChange}
          className="search-input"
        />
        <div className="filters-grid">
          {/* <select name="species" value={filters.species} onChange={handleFilterChange}>
            <option value="">All Species</option>
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
            <option value="Bird">Parakeet</option>
            <option value="Rabbit">Rabbit</option>
          </select> */}
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
        </div>
        <button onClick={handleClearFilters} className="clear-filters-button">Clear</button>
      </div>
      {loading ? (
        <p className="loading-message">Finding amazing pets...</p>
      ) : pets.length === 0 ? (
        <p className="no-pets-message">No pets found. Try adjusting your filters!</p>
      ) : (
        <div className="pet-grid">
          {pets.filter(pet => pet && pet.pet_id).map(pet => {
            console.log("Rendering pet:", pet);
            return (
              <PetCard 
                key={pet.pet_id} 
                pet={pet} 
                onViewDetailsClick={handleViewDetails} 
              />
            );
          })}
        </div>
      )}
      <Modal isOpen={isDetailsModalOpen} onClose={closeDetailsModal}>
        {selectedPet && (
          <div className="pet-details-modal-content">
            <div className="modal-left-column">
              <img 
                src={selectedPet.image_url || 'https://via.placeholder.com/600x400'} 
                alt={selectedPet.name}
                className="pet-details-image-landscape"
              />
              <div className="pet-primary-info">
                <span className={`status-tag status-${selectedPet.adoption_status.toLowerCase()}`}>
                  {selectedPet.adoption_status}
                </span>
                <h1>{selectedPet.name}</h1>
                <p className="breed-info">{selectedPet.breed} ({selectedPet.species})</p>
                <div className="details-grid">
                  <div><strong>AGE</strong>{selectedPet.age} years</div>
                  <div><strong>GENDER</strong>{selectedPet.gender}</div>
                </div>
                <h3>About {selectedPet.name}</h3>
                <p className="pet-description-full">{selectedPet.description}</p>
              </div>
            </div>

            <div className="modal-right-column">
              <div className="health-info">
                <h3>Health Information</h3>
                <p><strong>Neutered/Spayed:</strong> {selectedPet.is_neutered ? 'Yes' : 'No'}</p>
                
                <h4>Vaccinations</h4>
                <div className="vaccine-tags">
                  {selectedPet.vaccines && selectedPet.vaccines.length > 0 ? (
                    selectedPet.vaccines.map((vaccine, index) => (
                        <span key={index} className="vaccine-tag">
                          {vaccine.vaccine_name}
                        </span>
                    ))
                  ) : (
                    <p className="no-records">Contact shelter for records.</p>
                  )}
                </div>
              </div>
              {/* ======================================= */}
              
              <div className="shelter-info">
                <h3>Shelter Information</h3>
                <p><strong>Name:</strong> {selectedPet.shelter_name}</p>
                <p><strong>Address:</strong> {selectedPet.shelter_address}</p>
                <p><strong>Contact:</strong> <a href={`mailto:${selectedPet.shelter_email}`}>{selectedPet.shelter_email}</a></p>
                <Link to={`/shelters/${selectedPet.shelter_id}`} className="shelter-link">
                  Learn more about this shelter
                </Link>
              </div>

              <button className="chat-button" onClick={handleChatClick}>
                💬 Chat with Shelter
              </button>
            </div>

          </div>
        )}
      </Modal>

      {isContactModalOpen && selectedPet && (
        <ContactShelterModal
          shelterId={selectedPet.shelter_id}
          petId={selectedPet.pet_id}
          petName={selectedPet.name}
          onClose={closeContactModal}
        />
      )}

      {isChatOpen && selectedPet && (
        <ChatBox
          shelterId={selectedPet.shelter_id}
          shelterName={selectedPet.shelter_name}
          petId={selectedPet.pet_id}
          petName={selectedPet.name}
          onClose={closeChatBox}
        />
      )}
    </div>
  );
};

export default HomePage;