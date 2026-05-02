import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function Profile() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_URL}/users/${userId}`);
        setProfile(response.data.user);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  if (!profile) {
    return <div>Profile not found</div>;
  }

  return (
    <div className="profile">
      <div className="container">
        <div className="profile-header">
          <img src={profile.profilePicture} alt={profile.username} />
          <h2>{profile.username}</h2>
          <p>{profile.bio}</p>
          <div className="stats">
            <div>
              <strong>{profile.followers?.length || 0}</strong>
              <span>Followers</span>
            </div>
            <div>
              <strong>{profile.following?.length || 0}</strong>
              <span>Following</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
