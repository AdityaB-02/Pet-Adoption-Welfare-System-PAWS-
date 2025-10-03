import React, { useState } from 'react';
import axios from 'axios';
import './css/ContactShelterModal.css'; // We will create this CSS file next

const ContactShelterModal = ({ shelterId, petId, petName, onClose }) => {
    const [content, setContent] = useState('');
    const [isSent, setIsSent] = useState(false); // State to track if message was sent
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('You must be logged in to send a message.');
                return;
            }

            const config = { headers: { 'x-auth-token': token } };
            const body = { recipient_id: shelterId, pet_id: petId, content };
            
            await axios.post('http://localhost:5000/api/messages', body, config);
            
            setIsSent(true); // Set state to true on success
        } catch (err) {
            setError('Failed to send message. Please try again later.');
            console.error(err);
        }
    };

    // If the message is sent, show the success view
    if (isSent) {
        return (
            <div className="modal-backdrop" onClick={onClose}>
                <div className="modal-content success-message" onClick={e => e.stopPropagation()}>
                    <h3>✔️ Message Sent!</h3>
                    <p>The shelter has received your inquiry about {petName}. They will get back to you soon.</p>
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        );
    }

    // Otherwise, show the message form
    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h3>Send an Inquiry about {petName}</h3>
                <form onSubmit={handleSubmit}>
                    <textarea 
                        rows="6" 
                        placeholder="Ask a question, express your interest, or arrange a visit..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    ></textarea>
                    {error && <p className="error-text">{error}</p>}
                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-submit">Send Message</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ContactShelterModal;

