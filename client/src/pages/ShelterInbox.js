import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ShelterChatBox from '../components/ShelterChatBox';
import './css/Inbox.css'; // For styling

const ShelterInbox = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedConversation, setSelectedConversation] = useState(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const config = {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                };
                const res = await axios.get('/api/messages/inbox', config);
                
                // Group messages by sender AND pet (each inquiry is separate)
                const grouped = res.data.reduce((acc, msg) => {
                    const key = `${msg.sender_id}_${msg.pet_id || 'general'}`;
                    if (!acc[key]) {
                        acc[key] = {
                            sender_id: msg.sender_id,
                            sender_name: msg.sender_name,
                            sender_email: msg.sender_email,
                            phone_number: msg.phone_number,
                            pet_name: msg.pet_name,
                            pet_id: msg.pet_id,
                            pet_image_url: msg.pet_image_url,
                            messages: [],
                            lastMessage: msg.created_at
                        };
                    }
                    acc[key].messages.push(msg);
                    if (new Date(msg.created_at) > new Date(acc[key].lastMessage)) {
                        acc[key].lastMessage = msg.created_at;
                    }
                    return acc;
                }, {});

                // Convert to array and sort by most recent
                const conversations = Object.values(grouped).sort((a, b) => 
                    new Date(b.lastMessage) - new Date(a.lastMessage)
                );

                setMessages(conversations);
                console.log(conversations);
            } catch (err) {
                console.error("Failed to fetch messages", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMessages();
        
        // Refresh inbox every 5 seconds
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);
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
                <div className="conversations-list">
                    {messages.map((conversation, index) => (
                        <div key={`${conversation.sender_id}_${conversation.pet_id || 'general'}_${index}`} className="conversation-card">
                            <div className="conversation-header">
                                <div className="sender-info">
                                    <h3>{conversation.sender_name}</h3>
                                    <p className="sender-email">{conversation.sender_email}</p>
                                    {conversation.phone_number && (
                                        <p className="sender-phone">📞 {conversation.phone_number}</p>
                                    )}
                                </div>
                                <div className="conversation-meta">
                                    <span className="message-count">{conversation.messages.length} message{conversation.messages.length > 1 ? 's' : ''}</span>
                                    <span className="last-message-time">
                                        {new Date(conversation.lastMessage).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                            
                            {conversation.pet_name && (
                                <div className="pet-inquiry-details">
                                    <span className="inquiry-label">Inquiry about:</span>
                                    <div className="pet-info">
                                        <img 
                                            src={conversation.pet_image_url || 'https://placehold.co/50x50/EEE/31343C?text=Pet'} 
                                            alt={conversation.pet_name} 
                                        />
                                        <span className="pet-name">{conversation.pet_name}</span>
                                    </div>
                                </div>
                            )}

                            <div className="latest-message">
                                <strong>Latest message:</strong>
                                <p>{conversation.messages[conversation.messages.length - 1].content}</p>
                            </div>

                            <button 
                                className="reply-button"
                                onClick={() => setSelectedConversation(conversation)}
                            >
                                💬 Reply
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {selectedConversation && (
                <ShelterChatBox
                    userId={selectedConversation.sender_id}
                    userName={selectedConversation.sender_name}
                    petId={selectedConversation.pet_id}
                    petName={selectedConversation.pet_name}
                    onClose={() => setSelectedConversation(null)}
                />
            )}
        </div>
    );
};

export default ShelterInbox;

