import React, { useEffect, useState } from 'react';
import { getFeed } from '../services/api';
import PostCard from './PostCard';

const HomeFeed = ({ currentUser }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getFeed(currentUser.username).then(res => setPosts(res.data));
  }, [currentUser]);

  return (
    <div className="p-3">
      <h4>Home Feed</h4>
      {posts.map(post => <PostCard key={post._id} post={post} />)}
    </div>
  );
};

export default HomeFeed;