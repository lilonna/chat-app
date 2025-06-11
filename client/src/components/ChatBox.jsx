import React, { useState } from 'react';

const ChatBox = ({ currentUser, users, selectedUser, onSelectUser, messages, socket, setMessages }) => {
  const [inputMessage, setInputMessage] = useState('');

  const sendMessage = () => {
    const msg = {
      sender: currentUser,
      recipient: selectedUser,
      text: inputMessage
    };
    socket.emit('message', msg);
    setMessages(prev => [...prev, { ...msg, timestamp: new Date() }]);
    setInputMessage('');
  };

  return (
    <div style={{ display: 'flex' }}>
  
      <div style={{ width: '30%', borderRight: '1px solid gray' }}>
        <h3>Users</h3>
        {users.map((user) => (
          <div key={user._id} onClick={() => onSelectUser(user)} style={{ cursor: 'pointer' }}>
            {user.username}
          </div>
        ))}
      </div>

    
      <div style={{ flex: 1, padding: '1rem' }}>
        <h3>Chat with {selectedUser}</h3>
        <div style={{ height: '300px', overflowY: 'scroll' }}>
          {messages.map((m, i) => (
            <div key={i} style={{ textAlign: m.sender === currentUser ? 'right' : 'left' }}>
              <p><strong>{m.sender}:</strong> {m.text}</p>
            </div>
          ))}
        </div>
        <input
          value={inputMessage}
          onChange={e => setInputMessage(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;
