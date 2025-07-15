import React, { useState, useEffect, useRef } from 'react';
import { searchUsers } from "../services/api";
import axios from 'axios';
import User from "../images/user.png";
import { Link } from 'react-router-dom';

const ChatBox = ({ currentUser, users, selectedUser, onSelectUser, messages, socket, setMessages }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const messagesEndRef = useRef(null);

  const sendMessage = async () => {
    if (!inputMessage.trim() && !selectedFile) return;

    let fileData = null;

    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        const response = await axios.post('/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        fileData = {
          name: selectedFile.name,
          url: response.data.url,
          type: selectedFile.type
        };
      } catch (err) {
        console.error('File upload failed', err);
        return;
      }
    }

    const msg = {
      sender: currentUser.username,
      recipient: selectedUser.username,
      ...(inputMessage && { text: inputMessage }),
      ...(fileData && { file: fileData }),
    };

    socket.emit('message', msg);
    setMessages(prev => [...prev, { ...msg, timestamp: new Date() }]);
    setInputMessage('');
    setSelectedFile(null);
  };

  const handleSearch = async () => {
    const res = await searchUsers(searchTerm, currentUser);
    setSearchResults(res.data);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="container-fluid py-3" style={{ height: '100vh' }}>
      <div>
        <Link to="/home" className="text-decoration-none text-dark fw-medium">home</Link>
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

          {users.map(user => (
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

                    {m.file ? (
                      <>
                        {m.file.type.startsWith('image') && <img src={m.file.url} alt="image" className="img-fluid rounded" />}
                        {m.file.type.startsWith('audio') && <audio controls src={m.file.url} />}
                        {m.file.type.startsWith('video') && <video controls src={m.file.url} className="w-100 rounded" />}
                        {!m.file.type.startsWith('image') && !m.file.type.startsWith('audio') && !m.file.type.startsWith('video') && (
                          <a href={m.file.url} target="_blank" rel="noopener noreferrer">{m.file.name}</a>
                        )}
                      </>
                    ) : (
                      <div>{m.text}</div>
                    )}

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
            <input
              type="file"
              className="form-control"
              onChange={handleFileChange}
            />
            <button className="btn btn-primary" onClick={sendMessage}>Send</button>
          </div>

          {selectedFile && (
            <div className="mt-2">
              <small className="text-muted">Selected file: {selectedFile.name}</small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
