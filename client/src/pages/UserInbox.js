import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChatBox from '../components/ChatBox';
import './css/Inbox.css';

const UserInbox = () => {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedConversation, setSelectedConversation] = useState(null);

    useEffect(() => {
        fetchConversations();
        
        // Refresh inbox every 5 seconds
        const interval = setInterval(fetchConversations, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchConversations = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            const config = { headers: { 'x-auth-token': token } };
            
            // Get all messages where user is sender or recipient
            const response = await axios.get('/api/messages/user-inbox', config);
            
            // Group by shelter and pet
            const grouped = response.data.reduce((acc, msg) => {
                const shelterId = msg.sender_id === msg.user_id ? msg.recipient_id : msg.sender_id;
                const key = `${shelterId}_${msg.pet_id || 'general'}`;
                
                if (!acc[key]) {
                    acc[key] = {
                        shelter_id: shelterId,
                        shelter_name: msg.shelter_name,
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

            const conversationsList = Object.values(grouped).sort((a, b) => 
                new Date(b.lastMessage) - new Date(a.lastMessage)
            );

            setConversations(conversationsList);
        } catch (error) {
            console.error('Error fetching conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="inbox-container"><p>Loading your messages...</p></div>;
    }

    if (!localStorage.getItem('token')) {
        return (
            <div className="inbox-container">
                <h2>My Messages</h2>
                <p>Please log in to view your messages.</p>
            </div>
        );
    }

    return (
        <div className="inbox-container">
            <h2>My Messages</h2>
            {conversations.length === 0 ? (
                <p>You have no messages yet. Start chatting with shelters about pets you're interested in!</p>
            ) : (
                <div className="conversations-list">
                    {conversations.map((conversation, index) => (
                        <div key={index} className="conversation-card">
                            <div className="conversation-header">
                                <div className="sender-info">
                                    <h3>{conversation.shelter_name}</h3>
                                </div>
                                <div className="conversation-meta">
                                    <span className="message-count">
                                        {conversation.messages.length} message{conversation.messages.length > 1 ? 's' : ''}
                                    </span>
                                    <span className="last-message-time">
                                        {new Date(conversation.lastMessage).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                            
                            {conversation.pet_name && (
                                <div className="pet-inquiry-details">
                                    <span className="inquiry-label">About:</span>
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
                                💬 View Conversation
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {selectedConversation && (
                <ChatBox
                    shelterId={selectedConversation.shelter_id}
                    shelterName={selectedConversation.shelter_name}
                    petId={selectedConversation.pet_id}
                    petName={selectedConversation.pet_name}
                    onClose={() => setSelectedConversation(null)}
                />
            )}
        </div>
    );
};

export default UserInbox;
