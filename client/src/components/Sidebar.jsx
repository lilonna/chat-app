import React from 'react';
import { Link,useNavigate } from 'react-router-dom';
import User from "../images/user.png";

const Sidebar = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
     navigate('/');
  };

  return (
    <div className="p-4 bg-light border-end d-flex flex-column" style={{ minHeight: '100vh' }}>
      <div className="mb-4 text-center">
        <img
          src={currentUser.avatar || User}
          alt="User"
          className="rounded-circle mb-2"
          style={{ width: '70px', height: '70px', objectFit: 'cover' }}
        />
        <h6 className="fw-bold">{currentUser.username}</h6>
      </div>
      <ul className="list-unstyled flex-grow-1">
        <li className="mb-3">
          <Link to="/home" className="text-decoration-none text-dark fw-medium">🏠 Home</Link>
        </li>
        <li className="mb-3">
          <Link to={`/profile/${currentUser.username}`} className="text-decoration-none text-dark fw-medium">👤 Profile</Link>
        </li>
        <li className="mb-3">
          <Link to="/chat" className="text-decoration-none text-dark fw-medium">💬 Chat</Link>
        </li>
        <li className="mb-3">
          <Link to="/create-post" className="text-decoration-none text-dark fw-medium">✍️ Create Post</Link>
        </li>
        <li className="mb-3">
           <button onClick={logout} className="btn btn-outline-danger w-100 mt-auto">🚪 Logout</button>
         </li>
      </ul>
     
    </div>
  );
};

export default Sidebar;
