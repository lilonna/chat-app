import React from 'react';

const PostCard = ({ post }) => (
  <div className="card mb-4 shadow-sm border-0 rounded-4">
    <div className="card-body">
      <div className="d-flex align-items-center mb-2">
        <img
          src={post.author?.avatar || "/default-avatar.png"}
          alt="Avatar"
          className="rounded-circle me-2"
          style={{ width: "40px", height: "40px", objectFit: "cover" }}
        />
        <h6 className="mb-0 fw-bold text-primary">@{post.author?.username || post.author}</h6>
      </div>
      <p className="text-dark mb-2" style={{ fontSize: "1rem" }}>{post.content}</p>
    {post.image && (
  <img
    src={`http://localhost:3001/${post.image.replace(/\\/g, '/')}`}
    alt="Post"
    className="img-fluid rounded mb-2"
  />
)}

      <small className="text-muted">{new Date(post.timestamp).toLocaleString()}</small>
    </div>
  </div>
);

export default PostCard;
