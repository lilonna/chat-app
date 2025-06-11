import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import LoginForm from './components/LoginForm';
import ChatBox from './components/ChatBox';
import { getUsers, getMessages } from './services/api';

const socket = io('http://localhost:3001');

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (currentUser) {
      socket.emit('login', currentUser);
      getUsers(currentUser).then(res => setUsers(res.data));
    }
  }, [currentUser]);

  useEffect(() => {
    socket.on('message', (msg) => {
      if (msg.sender === selectedUser || msg.recipient === selectedUser) {
        setMessages(prev => [...prev, msg]);
      }
    });
    return () => socket.off('message');
  }, [selectedUser]);

  const handleSelectUser = async (user) => {
    setSelectedUser(user.username);
    const res = await getMessages(currentUser, user.username);
    setMessages(res.data);
  };

  return (
    <div>
      {currentUser ? (
        <ChatBox
          currentUser={currentUser}
          users={users}
          selectedUser={selectedUser}
          onSelectUser={handleSelectUser}
          messages={messages}
          socket={socket}
          setMessages={setMessages}
        />
      ) : (
        <LoginForm setCurrentUser={setCurrentUser} />
      )}
    </div>
  );
}

export default App;
