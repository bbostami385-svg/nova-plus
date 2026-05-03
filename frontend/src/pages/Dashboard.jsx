import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [topPosts, setTopPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, recentRes, topRes] = await Promise.all([
        axios.get(`${API_URL}/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/dashboard/recent-posts`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/dashboard/top-posts`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setStats(statsRes.data.stats);
      setRecentPosts(recentRes.data.posts || []);
      setTopPosts(topRes.data.posts || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <div className="container">
        <h1>Dashboard</h1>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📝</div>
            <div className="stat-info">
              <h3>Total Posts</h3>
              <p className="stat-value">{stats?.totalPosts || 0}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>Followers</h3>
              <p className="stat-value">{stats?.followers || 0}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">👍</div>
            <div className="stat-info">
              <h3>Total Likes</h3>
              <p className="stat-value">{stats?.totalLikes || 0}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💬</div>
            <div className="stat-info">
              <h3>Total Comments</h3>
              <p className="stat-value">{stats?.totalComments || 0}</p>
            </div>
          </div>
        </div>

        {/* Recent Posts */}
        <div className="dashboard-section">
          <h2>Recent Posts</h2>
          <div className="posts-table">
            {recentPosts.length === 0 ? (
              <p>No posts yet</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Content</th>
                    <th>Likes</th>
                    <th>Comments</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPosts.map((post) => (
                    <tr key={post._id}>
                      <td>{post.content.substring(0, 50)}...</td>
                      <td>{post.likes?.length || 0}</td>
                      <td>{post.comments?.length || 0}</td>
                      <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Top Posts */}
        <div className="dashboard-section">
          <h2>Top Posts</h2>
          <div className="top-posts-grid">
            {topPosts.length === 0 ? (
              <p>No posts yet</p>
            ) : (
              topPosts.map((post) => (
                <div key={post._id} className="top-post-card">
                  <p className="post-content">{post.content}</p>
                  <div className="post-metrics">
                    <span>👍 {post.likes?.length || 0} likes</span>
                    <span>💬 {post.comments?.length || 0} comments</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
