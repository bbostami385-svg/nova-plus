import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home">
      <div className="hero">
        <h1>Welcome to NovaPlus Social</h1>
        <p>Connect, Share, and Create with the World</p>
        <div className="cta-buttons">
          <Link to="/login" className="button button-primary">
            Login
          </Link>
          <Link to="/signup" className="button button-secondary">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
