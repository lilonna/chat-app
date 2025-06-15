import React, { useEffect, useState } from 'react';
import { getUserProfile } from '../services/api';
import { useParams } from 'react-router-dom';
import PostCard from './PostCard';

const UserProfile = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    getUserProfile(username).then(res => setProfile(res.data));
  }, [username]);

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="p-3">
      <h3>{profile.username}</h3>
      <img
        src={profile.avatar || '/default-avatar.png'}
        alt="avatar"
        style={{ width: 60, height: 60, borderRadius: '50%' }}
      />
      <p>{profile.bio}</p>
      <h5>Posts</h5>
      {profile.posts.map(post => <PostCard key={post._id} post={post} />)}
    </div>
  );
};
export default UserProfile;