import React, { useEffect, useState } from 'react';
import { getFeed } from '../services/api';
import PostCard from './PostCard';

const HomeFeed = ({ currentUser }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  if (currentUser?._id) {
    getFeed(currentUser._id).then(res => {
      setPosts(res.data);
      setLoading(false);
    });
  }
}, [currentUser]);


  return (
    <div className="p-4">
      <h3 className="mb-4">📢 Home Feed</h3>
      {loading ? (
        <div className="text-muted">Loading posts...</div>
      ) : posts.length > 0 ? (
        posts.map(post => <PostCard key={post._id} post={post} />)
      ) : (
        <div className="text-muted">No posts to show.</div>
      )}
    </div>
  );
};

export default HomeFeed;
