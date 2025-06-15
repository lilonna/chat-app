import React from 'react';
import Sidebar from '../components/Sidebar';
import HomeFeed from '../components/HomeFeed';

const HomePage = ({ currentUser }) => (
  <div className="d-flex">
    <Sidebar currentUser={currentUser} />
    <div className="flex-grow-1">
      <HomeFeed currentUser={currentUser} />
    </div>
  </div>
);

export default HomePage;