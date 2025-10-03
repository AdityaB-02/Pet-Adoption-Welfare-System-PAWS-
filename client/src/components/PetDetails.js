import React, { useState, useEffect } from 'react';
import axios from 'axios';

// This is a new component for the message form
const ContactShelterModal = ({ shelterId, petId, onClose }) => {
    const [content, setContent] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            };
            const body = { recipient_id: shelterId, pet_id: petId, content };
            
            await axios.post('/api/messages', body, config);
            
            alert('Your message has been sent!');
            onClose(); // Close the modal
        } catch (err) {
            alert('Failed to send message. Please try again.');
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h3>Send a Message to the Shelter</h3>
                <form onSubmit={handleSubmit}>
                    <textarea 
                        rows="5" 
                        placeholder="Ask a question about this pet..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    ></textarea>
                    <button type="submit">Send Message</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
};


// In your main PetDetails component
const PetDetails = ({ pet }) => {
    const [showModal, setShowModal] = useState(false);

    return (
        <div>
            {/* ... all pet details like name, breed, etc. ... */}
            <h1>{pet.name}</h1>
            <p>Shelter: {pet.shelter_name}</p>

            <button onClick={() => setShowModal(true)}>
                Contact Shelter
            </button>

            {showModal && (
                <ContactShelterModal 
                    shelterId={pet.shelter_id} 
                    petId={pet.id} 
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
};
