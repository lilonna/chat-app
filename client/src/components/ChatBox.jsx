import React, { useState, useEffect, useRef } from 'react';
import { searchUsers } from "../services/api";


const ChatBox = ({ currentUser, users, selectedUser, onSelectUser, messages, socket, setMessages }) => {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  const sendMessage = () => {
    if (!inputMessage.trim()) return;
    const msg = {
      sender: currentUser,
      recipient: selectedUser.username,
      text: inputMessage
    };
    socket.emit('message', msg);
    setMessages(prev => [...prev, { ...msg, timestamp: new Date() }]);
    setInputMessage('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  const [searchTerm, setSearchTerm] = useState('');
const [searchResults, setSearchResults] = useState([]);

const handleSearch = async () => {
  const res = await searchUsers(searchTerm, currentUser);
  setSearchResults(res.data);
};



  return (
    <div className="container-fluid py-3" style={{ height: '90vh' }}>
      <div className="row h-100 border rounded shadow">
        
   

   <div className="col-3 border-end bg-light p-3 overflow-auto">
  <h5>Users</h5>

  <input
    type="text"
    className="form-control mb-2"
    placeholder="Search users..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
  />

  {searchResults.map(user => (
    <div
      key={user._id}
      onClick={() => onSelectUser(user)}
      className="p-2 rounded mb-2 bg-info text-white border"
      style={{ cursor: 'pointer' }}
    >
      {user.username}
    </div>
  ))}

  {/* Conversation user list */}
  {users.map((user) => (
    <div
      key={user._id}
      onClick={() => onSelectUser(user)}
      className={`p-2 rounded mb-2 ${user.username === selectedUser?.username ? 'bg-secondary text-white' : 'bg-white'} border`}
      style={{ cursor: 'pointer' }}
    >
      {user.username}
    </div>
  ))}
</div>


        {/* Chat Section */}
        <div className="col d-flex flex-column p-3">
          <h5>Chat with {selectedUser?.username || '...'}</h5>
          
          {/* Messages Area */}
          <div className="flex-grow-1 bg-body-secondary p-3 rounded overflow-auto mb-3" style={{ height: '100%', maxHeight: '60vh' }}>
            {messages.map((m, i) => (
              <div
                key={i}
                className={`d-flex mb-2 ${m.sender === currentUser ? 'justify-content-end' : 'justify-content-start'}`}
              >
             <div className="d-flex mb-2 align-items-end">
  {m.sender !== currentUser && (
    <img
      src={m.avatarUrl || '/default-avatar.png'}  // fallback if no avatar
      alt={m.sender}
      className="rounded-circle me-2"
      style={{ width: '32px', height: '32px' }}
    />
  )}
  <div className={`p-2 rounded ${m.sender === currentUser ? 'bg-primary text-white' : 'bg-light text-dark'}`} style={{ maxWidth: '75%' }}>
    <div><strong>{m.sender}</strong></div>
    <div>{m.text}</div>
    <div className="text-end">
      <small className="text-muted">
        {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </small>
    </div>
  </div>
</div>

        
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Type a message..."
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
            />
            <button className="btn btn-primary" onClick={sendMessage}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
