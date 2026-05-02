import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function Messages() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/messages/conversations`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setConversations(response.data.conversations || []);
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();

    // Initialize socket
    const newSocket = io(API_URL, {
      auth: {
        token: localStorage.getItem('token'),
      },
    });
    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/messages/send`,
        {
          receiverId: selectedConversation.participantId,
          content: newMessage,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading messages...</div>;
  }

  return (
    <div className="messages">
      <div className="container">
        <div className="messages-layout">
          <div className="conversations-list">
            <h3>Conversations</h3>
            {conversations.map((conv) => (
              <div
                key={conv._id}
                className={`conversation-item ${selectedConversation?._id === conv._id ? 'active' : ''}`}
                onClick={() => setSelectedConversation(conv)}
              >
                <img src={conv.participantAvatar} alt={conv.participantName} />
                <div>
                  <p>{conv.participantName}</p>
                  <small>{conv.lastMessage}</small>
                </div>
              </div>
            ))}
          </div>

          {selectedConversation && (
            <div className="chat-window">
              <div className="chat-header">
                <h3>{selectedConversation.participantName}</h3>
              </div>
              <div className="messages-list">
                {messages.map((msg) => (
                  <div key={msg._id} className={`message ${msg.sender === 'me' ? 'sent' : 'received'}`}>
                    <p>{msg.content}</p>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendMessage} className="message-input">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="submit" className="button button-primary">
                  Send
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Messages;
