import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function UserProfile() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const userResponse = await axios.get(`${API_URL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(userResponse.data.user);
      setIsFollowing(userResponse.data.user.isFollowing || false);

      const postsResponse = await axios.get(`${API_URL}/users/${userId}/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(postsResponse.data.posts || []);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await axios.post(
          `${API_URL}/users/${userId}/unfollow`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          `${API_URL}/users/${userId}/follow`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Failed to toggle follow:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  if (!user) {
    return <div className="container"><p>User not found</p></div>;
  }

  return (
    <div className="user-profile">
      <div className="container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-cover" style={{ height: '200px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }} />
          
          <div className="profile-info">
            <div className="profile-avatar" style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: '#1877f2',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px',
              fontWeight: 'bold',
              marginTop: '-60px',
              marginBottom: '16px'
            }}>
              {user.name?.[0] || 'U'}
            </div>

            <div className="profile-details">
              <h1>{user.name}</h1>
              <p className="username">@{user.username || user.email?.split('@')[0]}</p>
              <p className="bio">{user.bio || 'No bio yet'}</p>

              <div className="profile-stats">
                <div className="stat">
                  <span className="stat-value">{posts.length}</span>
                  <span className="stat-label">Posts</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{user.followers?.length || 0}</span>
                  <span className="stat-label">Followers</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{user.following?.length || 0}</span>
                  <span className="stat-label">Following</span>
                </div>
              </div>

              <button 
                className={`button ${isFollowing ? 'button-secondary' : 'button-primary'}`}
                onClick={handleFollowToggle}
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            </div>
          </div>
        </div>

        {/* User Posts */}
        <div className="user-posts">
          <h2>Posts</h2>
          {posts.length === 0 ? (
            <p>No posts yet</p>
          ) : (
            <div className="posts-list">
              {posts.map((post) => (
                <div key={post._id} className="post-card">
                  <div className="post-content">
                    <p>{post.content}</p>
                  </div>
                  <div className="post-actions">
                    <button className="action-btn">
                      👍 Like ({post.likes?.length || 0})
                    </button>
                    <button className="action-btn">
                      💬 Comment ({post.comments?.length || 0})
                    </button>
                  </div>
                  <small>{new Date(post.createdAt).toLocaleDateString()}</small>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
