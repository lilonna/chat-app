import React from 'react';

const PostCard = ({ post }) => (
  <div className="card mb-3">
    <div className="card-body">
      <h6>@{post.author}</h6>
      <p>{post.content}</p>
      <small className="text-muted">{new Date(post.timestamp).toLocaleString()}</small>
    </div>
  </div>
);

export default PostCard;