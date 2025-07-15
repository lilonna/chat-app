import React, { useState, useEffect, useRef } from 'react';
import { searchUsers } from "../services/api";
import User from "../images/user.png";
import { Link } from 'react-router-dom';


const ChatBox = ({ currentUser, users, selectedUser, onSelectUser, messages, socket, setMessages }) => {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  const sendMessage = () => {
    if (!inputMessage.trim()) return;
  const msg = {
  sender: currentUser.username,
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
    
<div className="container-fluid py-3" style={{ height: '100vh' }}>
  <div>
   
    <Link to="/home" className="text-decoration-none text-dark fw-medium">
              home
            </Link>
  </div>
  <div className="row h-100 border rounded shadow overflow-hidden">
    {/* Sidebar */}
    <div className="col-md-3 col-12 border-end bg-light p-3 d-flex flex-column" style={{ overflowY: 'auto' }}>
      <div className="mb-4 text-center">
       
        <img
          src={currentUser.avatarUrl || User}
          alt="Profile"
          className="rounded-circle"
          style={{ width: '60px', height: '60px' }}
        />
      </div>

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
    <div className="col-md-9 col-12 d-flex flex-column p-3" style={{ minHeight: '0' }}>
      <h5>Chat with {selectedUser?.username || '...'}</h5>

     <div className="flex-grow-1 bg-body-secondary p-3 rounded mb-3" style={{ overflowY: 'auto', height: 'calc(100vh - 200px)' }}>
        {messages.map((m, i) => (
         <div key={i} className={`d-flex mb-2 ${m.sender === currentUser.username ? 'justify-content-end' : 'justify-content-start'}`}>
            <div className="d-flex align-items-end">
              {m.sender !== currentUser.username && (
                <img
                  src={m.avatarUrl || User}
                  alt={m.sender}
                  className="rounded-circle me-2"
                  style={{ width: '32px', height: '32px' }}
                />
              )}
              <div className={`p-2 rounded ${m.sender === currentUser.username ? 'bg-primary text-white' : 'bg-light text-dark'}`} style={{ maxWidth: '75%' }}>
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
             <input
  type="file"
  className="form-control mt-2"
  onChange={handleFileChange}
/>
    </div>
  </div>
</div>

        
              
  );
};

export default ChatBox;
