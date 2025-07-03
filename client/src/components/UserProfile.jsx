import React, { useEffect, useState } from 'react';
import { getUserProfile } from '../services/api';
import { useParams } from 'react-router-dom';
import PostCard from './PostCard';
import User from "../images/user.png";

const UserProfile = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    getUserProfile(username).then(res => setProfile(res.data));
  }, [username]);

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="p-3">
      <div className="d-flex align-items-center gap-3 mb-3">
        <img
          src={profile.avatar || User}
          alt="avatar"
          style={{ width: 60, height: 60, borderRadius: '50%' }}
        />
        <div className="w-100">
          <div className="d-flex justify-content-between">
            <h3>{profile.username}</h3>
            <p className="mb-0">
              <strong>Followers:</strong> {profile.followers?.length || 0} |{" "}
              <strong>Following:</strong> {profile.following?.length || 0}
            </p>
          </div>
          <p className="mb-0 text-muted"><em>{profile.bio || " "}</em></p>
        </div>
      </div>

      <hr />
      <h5>Posts</h5>
      {profile.posts.length === 0 ? (
        <p>This user has no posts yet.</p>
      ) : (
        <div className="row">
          {profile.posts.map(post => (
            <div key={post._id} className="col-md-6 mb-2">
              <PostCard post={post} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
