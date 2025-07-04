import React from 'react';
import Sidebar from '../components/Sidebar';
import HomeFeed from '../components/HomeFeed';

const HomePage = ({ currentUser, setCurrentUser }) => (
  <div className="d-flex">
  <Sidebar currentUser={currentUser} setCurrentUser={setCurrentUser} />
    <div className="flex-grow-1">
      <HomeFeed currentUser={currentUser} />
    </div>
  </div>
);

export default HomePage;