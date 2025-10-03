import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/Inbox.css'; // For styling

const ShelterInbox = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const config = {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                };
                const res = await axios.get('/api/messages/inbox', config);
                setMessages(res.data);
            } catch (err) {
                console.error("Failed to fetch messages", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMessages();
    }, []);

    if (loading) {
        return <div>Loading messages...</div>;
    }

    return (
        <div className="inbox-container">
            <h2>Your Inbox</h2>
            {messages.length === 0 ? (
                <p>You have no messages.</p>
            ) : (
                <ul className="message-list">
                    {messages.map(msg => (
                        <li key={msg.id} className={!msg.is_read ? 'unread' : ''}>
                            <div className="message-header">
                                <span>{new Date(msg.created_at).toLocaleString()}</span>
                            </div>
                            
                            {/* --- THIS IS THE NEW SECTION THAT DISPLAYS THE PET --- */}
                            {/* It will only display if the message is linked to a pet */}
                            {msg.pet_name && (
                                <div className="pet-inquiry-details">
                                    <h4>Inquiry For:</h4>
                                    <div className="pet-info">
                                        <img 
                                            src={msg.pet_image_url || 'https://placehold.co/60x60/EEE/31343C?text=Pet'} 
                                            alt={msg.pet_name} 
                                        />
                                        <span>{msg.pet_name}</span>
                                    </div>
                                </div>
                            )}

                            <div className="sender-details">
                                <h4>Sender Information</h4>
                                <p><strong>Name:</strong> {msg.sender_name}</p>
                                <p><strong>Email:</strong> <a href={`mailto:${msg.sender_email}`}>{msg.sender_email}</a></p>
                                <p><strong>Phone:</strong> {msg.sender_phone || 'Not provided'}</p>
                            </div>

                            <div className="message-content">
                                <h4>Message</h4>
                                <p>{msg.content}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ShelterInbox;

