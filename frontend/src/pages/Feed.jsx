import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [posting, setPosting] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
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

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    try {
      setPosting(true);
      const response = await axios.post(
        `${API_URL}/posts/create`,
        { content: newPost },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts([response.data.post, ...posts]);
      setNewPost('');
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setPosting(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      await axios.post(
        `${API_URL}/posts/${postId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPosts();
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading feed...</div>;
  }

  return (
    <div className="feed">
      <div className="container">
        {/* Post Creation */}
        <div className="post-creator">
          <h2>What's on your mind?</h2>
          <form onSubmit={handleCreatePost}>
            <textarea
              placeholder="Share your thoughts..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              rows="4"
            />
            <button type="submit" disabled={posting || !newPost.trim()}>
              {posting ? 'Posting...' : 'Post'}
            </button>
          </form>
        </div>

        {/* Posts Feed */}
        <div className="posts-list">
          {posts.length === 0 ? (
            <div className="empty-state">
              <p>No posts yet. Be the first to share!</p>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post._id} className="post-card">
                <div className="post-header">
                  <div className="user-info">
                    <div className="avatar">{post.author?.name?.[0] || 'U'}</div>
                    <div>
                      <h3>{post.author?.name || 'Unknown User'}</h3>
                      <span className="timestamp">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="post-content">
                  <p>{post.content}</p>
                </div>

                <div className="post-actions">
                  <button
                    className="action-btn"
                    onClick={() => handleLike(post._id)}
                  >
                    👍 Like ({post.likes?.length || 0})
                  </button>
                  <button className="action-btn">
                    💬 Comment ({post.comments?.length || 0})
                  </button>
                  <button className="action-btn">
                    ↗️ Share
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Feed;
