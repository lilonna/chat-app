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

  // This function will update a single post in the state after like/comment
  const handlePostUpdate = (updatedPost) => {
    setPosts(prevPosts =>
      prevPosts.map(post => post._id === updatedPost._id ? updatedPost : post)
    );
  };

return (
  <div className="p-3">
    <h3 className="mb-4">📢 Home Feed</h3>

    {loading ? (
      <div className="text-muted">Loading posts...</div>
    ) : posts.length > 0 ? (
      <div className="row">
        {posts.map(post => (
          <div key={post._id} className="col-12 col-sm-6 col-md-3 mb-4">
            <PostCard
              post={post}
              currentUser={currentUser}
              onPostUpdate={handlePostUpdate}
            />
          </div>
        ))}
      </div>
    ) : (
      <div className="text-muted">No posts to show.</div>
    )}
  </div>
);

};

export default HomeFeed;
