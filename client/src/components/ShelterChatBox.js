import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './css/ChatBox.css';

const ShelterChatBox = ({ userId, userName, petId, petName, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    fetchMessages();
    // Poll for new messages every 3 seconds
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [userId]);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const config = { headers: { 'x-auth-token': token } };
      const response = await axios.get(`/api/messages/conversation/${userId}/${petId || 'null'}`, config);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { 'x-auth-token': token } };
      
      console.log('Sending reply:', { recipient_id: userId, pet_id: petId, content: newMessage });
      
      const response = await axios.post('/api/messages/reply', {
        recipient_id: userId,
        pet_id: petId,
        content: newMessage
      }, config);

      console.log('Reply sent successfully:', response.data);
      setNewMessage('');
      fetchMessages(); // Refresh messages immediately
    } catch (error) {
      console.error('Error sending message:', error);
      console.error('Error response:', error.response);
      console.error('Error details:', error.response?.data);
      console.error('Error status:', error.response?.status);
      alert(`Failed to send message: ${error.response?.data?.msg || error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="chatbox-overlay">
      <div className="chatbox-container">
        <div className="chatbox-header">
          <div className="chatbox-header-info">
            <h3>{userName}</h3>
            {petName && <p className="chatbox-pet-name">About: {petName}</p>}
          </div>
          <button className="chatbox-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="chatbox-messages">
          {messages.length === 0 ? (
            <div className="chatbox-empty">
              <p>No messages yet with {userName}</p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const showDate = index === 0 || 
                formatDate(messages[index - 1].created_at) !== formatDate(msg.created_at);
              
              // Use is_shelter flag to determine message direction
              const isSentByUser = msg.is_shelter === 0 || msg.is_shelter === false;
              
              return (
                <React.Fragment key={msg.message_id}>
                  {showDate && (
                    <div className="chatbox-date-divider">
                      {formatDate(msg.created_at)}
                    </div>
                  )}
                  <div className={`chatbox-message ${isSentByUser ? 'received' : 'sent'}`}>
                    <div className="chatbox-message-content">
                      <p>{msg.content}</p>
                      <span className="chatbox-message-time">{formatTime(msg.created_at)}</span>
                    </div>
                  </div>
                </React.Fragment>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="chatbox-input-container" onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Type your reply..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={loading}
            className="chatbox-input"
          />
          <button type="submit" disabled={loading || !newMessage.trim()} className="chatbox-send-btn">
            {loading ? '...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShelterChatBox;
