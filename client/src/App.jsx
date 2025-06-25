import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import io from 'socket.io-client';
import LoginForm from './components/LoginForm';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import ChatPage from './pages/ChatPage';
import { getConversations, getConversation } from './services/api';
import ChatBox from './components/ChatBox';
import CreatePostPage from './pages/CreatePostPage';

const socket = io('http://localhost:3001');

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);

useEffect(() => {
  if (currentUser) {
    const username = typeof currentUser === 'string' ? currentUser : currentUser.username;
    console.log('Fetching conversations for:', username); // Debug line
    getConversations(username).then(res => {
      console.log('Fetched conversation users:', res.data);
      setUsers(res.data);
    });
  }
}, [currentUser]);


  useEffect(() => {
    socket.on('message', (msg) => {
      if (msg.sender === selectedUser?.username || msg.recipient === selectedUser?.username) {
        setMessages(prev => [...prev, msg]);
      }
    });
    return () => socket.off('message');
  }, [selectedUser]);

  const handleSelectUser = async (user) => {
    setSelectedUser(user);
    const res = await getConversation(currentUser, user.username);
    setMessages(res.data);
  };

  if (!currentUser) {
    return <LoginForm setCurrentUser={setCurrentUser} />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<HomePage currentUser={currentUser} />} />
        <Route path="/profile/:username" element={<ProfilePage currentUser={currentUser} />} />
        <Route path="/create-post" element={<CreatePostPage currentUser={currentUser} />} />

        <Route path="/chat" element={
          <ChatBox
            currentUser={currentUser}
            users={users}
            selectedUser={selectedUser}
            onSelectUser={handleSelectUser}
            messages={messages}
            socket={socket}
            setMessages={setMessages}
          />
        } />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
