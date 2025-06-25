// src/pages/CreatePostPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreatePostPage = ({ currentUser }) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
   console.log('typeof currentUser:', typeof currentUser);
console.log('currentUser:', currentUser);

    const formData = new FormData();
    formData.append('author', currentUser._id);
    formData.append('content', content);
    if (image) formData.append('image', image);

   await axios.post('http://localhost:3001/api/posts/post', formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

  };

  return (
    <div className="container p-4">
      <h4>Create Post</h4>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <textarea
            className="form-control"
            placeholder="What's on your mind?"
            rows="4"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <input type="file" className="form-control" onChange={(e) => setImage(e.target.files[0])} />
        </div>
        <button type="submit" className="btn btn-primary">Post</button>
      </form>
    </div>
  );
};

export default CreatePostPage;
