import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState('users'); // users, posts, communities
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/search?q=${encodeURIComponent(searchQuery)}&type=${searchType}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setResults(response.data.results || []);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (userId) => {
    navigate(`/user/${userId}`);
  };

  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`);
  };

  return (
    <div className="search-page">
      <div className="container">
        {/* Search Bar */}
        <div className="search-header">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search users, posts, communities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <button type="submit" className="button button-primary">
              Search
            </button>
          </form>

          {/* Search Type Filter */}
          <div className="search-filters">
            <button
              className={`filter-btn ${searchType === 'users' ? 'active' : ''}`}
              onClick={() => {
                setSearchType('users');
                handleSearch({ preventDefault: () => {} });
              }}
            >
              👥 Users
            </button>
            <button
              className={`filter-btn ${searchType === 'posts' ? 'active' : ''}`}
              onClick={() => {
                setSearchType('posts');
                handleSearch({ preventDefault: () => {} });
              }}
            >
              📝 Posts
            </button>
            <button
              className={`filter-btn ${searchType === 'communities' ? 'active' : ''}`}
              onClick={() => {
                setSearchType('communities');
                handleSearch({ preventDefault: () => {} });
              }}
            >
              🏘️ Communities
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="search-results">
          {loading ? (
            <div className="loading">Searching...</div>
          ) : results.length === 0 && searchQuery ? (
            <div className="empty-state">
              <p>No results found for "{searchQuery}"</p>
            </div>
          ) : results.length === 0 ? (
            <div className="empty-state">
              <p>Start typing to search</p>
            </div>
          ) : (
            <div className="results-grid">
              {searchType === 'users' && (
                results.map((user) => (
                  <div
                    key={user._id}
                    className="result-card user-card"
                    onClick={() => handleUserClick(user._id)}
                  >
                    <div className="result-avatar">
                      {user.name?.[0] || 'U'}
                    </div>
                    <h3>{user.name}</h3>
                    <p className="username">@{user.username || user.email?.split('@')[0]}</p>
                    <p className="bio">{user.bio || 'No bio'}</p>
                    <div className="user-stats">
                      <span>{user.followers?.length || 0} followers</span>
                    </div>
                  </div>
                ))
              )}

              {searchType === 'posts' && (
                results.map((post) => (
                  <div
                    key={post._id}
                    className="result-card post-card"
                    onClick={() => handlePostClick(post._id)}
                  >
                    <div className="post-author">
                      <span className="author-avatar">
                        {post.author?.name?.[0] || 'U'}
                      </span>
                      <span className="author-name">{post.author?.name}</span>
                    </div>
                    <p className="post-content">{post.content.substring(0, 100)}...</p>
                    <div className="post-stats">
                      <span>👍 {post.likes?.length || 0}</span>
                      <span>💬 {post.comments?.length || 0}</span>
                    </div>
                  </div>
                ))
              )}

              {searchType === 'communities' && (
                results.map((community) => (
                  <div key={community._id} className="result-card community-card">
                    <h3>{community.name}</h3>
                    <p className="description">{community.description}</p>
                    <div className="community-stats">
                      <span>{community.members?.length || 0} members</span>
                    </div>
                    <button className="button button-primary">Join</button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Search;
