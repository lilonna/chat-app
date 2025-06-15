import React from 'react';
import Sidebar from '../components/Sidebar';
import ChatBox from '../components/ChatBox';

const ChatPage = ({ currentUser }) => (
  <div className="d-flex">
    <Sidebar currentUser={currentUser} />
    <div className="flex-grow-1">
      <ChatBox currentUser={currentUser} />
    </div>
  </div>
);

export default ChatPage;