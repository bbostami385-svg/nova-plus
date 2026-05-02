import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/posts/feed`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(response.data.posts || []);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div className="loading">Loading feed...</div>;
  }

  return (
    <div className="feed">
      <div className="container">
        <h2>Your Feed</h2>
        {posts.length === 0 ? (
          <p>No posts yet. Follow users to see their posts!</p>
        ) : (
          <div className="posts">
            {posts.map((post) => (
              <div key={post._id} className="post">
                <h3>{post.author?.username}</h3>
                <p>{post.content}</p>
                <small>{new Date(post.createdAt).toLocaleDateString()}</small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Feed;
