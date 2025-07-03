import React, { useState } from 'react';
import axios from 'axios';
import User from "../images/user.png";

const PostCard = ({ post, currentUser, onPostUpdate }) => {
  const [commentText, setCommentText] = useState('');
  const [loadingLike, setLoadingLike] = useState(false);
  const [loadingComment, setLoadingComment] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false); // 👈 toggle this

  const likes = Array.isArray(post.likes) ? post.likes : [];
  const comments = Array.isArray(post.comments) ? post.comments : [];
  const author = post.author || {};
  const likedByCurrentUser = likes.includes(currentUser?._id);

  const handleLike = async () => {
    if (loadingLike) return;
    setLoadingLike(true);
    try {
      const res = await axios.post(`http://localhost:3001/api/posts/post/like/${post._id}`, {
        userId: currentUser._id,
      });
      onPostUpdate(res.data);
    } catch (error) {
      console.error('Error liking post:', error);
    } finally {
      setLoadingLike(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || loadingComment) return;
    setLoadingComment(true);
    try {
      const res = await axios.post(`http://localhost:3001/api/posts/post/comment/${post._id}`, {
        userId: currentUser._id,
        text: commentText.trim(),
      });
      onPostUpdate(res.data);
      setCommentText('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setLoadingComment(false);
    }
  };

  return (
    <div className="card mb-4 shadow-sm border-0 rounded-4">
      <div className="card-body">
        <div className="d-flex align-items-center mb-2">
          <img
            src={author.avatar || User}
            alt="Avatar"
            className="rounded-circle me-2"
            style={{ width: "40px", height: "40px", objectFit: "cover" }}
          />
          <h6 className="mb-0 fw-bold text-primary">{author.username || author}</h6>
        </div>

        {post.image && (
          <div
            style={{
              width: '150px',
              height: '150px',
              overflow: 'hidden',
              borderRadius: '15px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              marginBottom: '10px',
            }}
          >
            <img
              src={`http://localhost:3001/${post.image.replace(/\\/g, '/')}`}
              alt="Post"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        )}

        <p className="text-dark mb-2" style={{ fontSize: "1rem" }}>{post.content}</p>

        {/* Likes and Comments display */}
        <div className="d-flex align-items-center gap-3 mb-2" style={{ fontSize: '0.9rem', color: '#555' }}>
          <div
            className="d-flex align-items-center"
            style={{ cursor: 'pointer' }}
            onClick={handleLike}
          >
            <span style={{ marginRight: 6, color: likedByCurrentUser ? 'red' : 'gray' }}>
              ❤️
            </span>
            {likes.length}
          </div>
          <div
            className="d-flex align-items-center"
            style={{ cursor: 'pointer' }}
            onClick={() => setShowCommentBox(!showCommentBox)}
          >
            <span style={{ marginRight: 6 }}>💬</span> {comments.length}
          </div>
        </div>

        <small className="text-muted">{new Date(post.timestamp).toLocaleString()}</small>

        {/* Only show input if user clicked 💬 */}
     {showCommentBox && (
  <>
    <div className="mt-3">
      {comments.length > 0 ? (
        comments.map((comment, idx) => (
          <div key={idx} className="mb-2">
            <strong className="text-primary">
              @{comment.user?.username || 'user'}:
            </strong>{" "}
            <span>{comment.text}</span>
          </div>
        ))
      ) : (
        <div className="text-muted">No comments yet.</div>
      )}
    </div>

    <form onSubmit={handleCommentSubmit} className="mt-2">
      <input
        type="text"
        placeholder="Write a comment..."
        className="form-control"
        value={commentText}
        onChange={e => setCommentText(e.target.value)}
      />
    </form>
  </>
)}

      </div>
    </div>
  );
};

export default PostCard;
