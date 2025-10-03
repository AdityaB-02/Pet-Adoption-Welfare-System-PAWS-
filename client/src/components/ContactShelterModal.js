import React, { useState } from 'react';
import axios from 'axios';
import './css/ContactShelterModal.css';

const ContactShelterModal = ({ shelterId, petId, petName, onClose }) => {
    const [content, setContent] = useState('');
    const [isSent, setIsSent] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // --- THIS IS THE NEW DEBUGGING LINE ---
        console.log("'Send Message' button clicked! Form is being submitted.");

        setError(''); 
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('You must be logged in to send a message.');
                return;
            }

            const config = { headers: { 'x-auth-token': token } };
            const body = { recipient_id: shelterId, pet_id: petId, content };
            
            await axios.post('/api/messages', body, config);
            
            setIsSent(true);
        } catch (err) {
            if (err.response && err.response.data && err.response.data.msg) {
                setError(err.response.data.msg);
            } else if (err.request) {
                setError('Network Error: Could not connect to the server.');
            } else {
                setError('An unexpected error occurred.');
            }
            console.error("Full error object:", err);
        }
    };

    if (isSent) {
        return (
            <div className="modal-backdrop" onClick={onClose}>
                <div className="modal-content success-message" onClick={e => e.stopPropagation()}>
                    <h3>✔️ Message Sent!</h3>
                    <p>The shelter has received your inquiry about {petName}.</p>
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        );
    }

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h3>Send an Inquiry about {petName}</h3>
                <form onSubmit={handleSubmit}>
                    <textarea 
                        rows="6" 
                        placeholder="Ask a question..."
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

