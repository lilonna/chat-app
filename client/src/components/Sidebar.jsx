import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ currentUser }) => (
  <div className="p-3 bg-light border-end" style={{ minHeight: '100vh' }}>
    <h5>{currentUser.username}</h5>
    <ul className="list-unstyled">
      <li><Link to="/">Home</Link></li>
      <li><Link to={`/profile/${currentUser.username}`}>Profile</Link></li>
      <li><Link to="/chat">Chat</Link></li>
    </ul>
  </div>
);

export default Sidebar;