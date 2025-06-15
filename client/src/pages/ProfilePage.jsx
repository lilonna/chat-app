import React from 'react';
import Sidebar from '../components/Sidebar';
import UserProfile from '../components/UserProfile';

const ProfilePage = ({ currentUser }) => (
  <div className="d-flex">
    <Sidebar currentUser={currentUser} />
    <div className="flex-grow-1">
      <UserProfile />
    </div>
  </div>
);

export default ProfilePage;