import React from 'react';
import './css/PetCard.css'; // We will create this CSS file

const PetCard = ({ pet, onViewDetailsClick }) => {
  // This component receives the 'pet' object and the 'onViewDetailsClick' function from HomePage.js
  
  if (!pet) return null; // Don't render anything if there's no pet data

  return (
    <div className="pet-card">
      <img src={pet.image_url || 'https://placehold.co/400x300/EEE/31343C?text=No+Image'} alt={pet.name} />
      <div className="pet-card-content">
        <h3>{pet.name}</h3>
        <p><strong>Breed:</strong> {pet.breed}</p>
        <p className="pet-description">{pet.description.substring(0, 80)}...</p> {/* Show a short snippet */}
        
        {/* When this button is clicked, it calls the function passed down from HomePage,
          sending the specific pet's ID back up to the parent.
        */}
        <button className="view-details-button" onClick={() => onViewDetailsClick(pet.pet_id)}>
          View Details
        </button>
      </div>
    </div>
  );
};

export default PetCard;

