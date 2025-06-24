import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ currentUser }) => (
  <div className="p-4 bg-light border-end d-flex flex-column" style={{ minHeight: '100vh' }}>
    <div className="mb-4 text-center">
      <img
        src={currentUser.avatar || '/default-avatar.png'}
        alt="User"
        className="rounded-circle mb-2"
        style={{ width: '70px', height: '70px', objectFit: 'cover' }}
      />
      <h6 className="fw-bold">@{currentUser.username}</h6>
    </div>
    <ul className="list-unstyled">
      <li className="mb-3">
        <Link to="/" className="text-decoration-none text-dark fw-medium">
          🏠 Home
        </Link>
      </li>
      <li className="mb-3">
        <Link to={`/profile/${currentUser.username}`} className="text-decoration-none text-dark fw-medium">
          👤 Profile
        </Link>
      </li>
      <li className="mb-3">
        <Link to="/chat" className="text-decoration-none text-dark fw-medium">
          💬 Chat
        </Link>
      </li>
    </ul>
  </div>
);

export default Sidebar;
