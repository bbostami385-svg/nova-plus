import React, { useState } from "react";

function Login({ goToSignup, goToFeed }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // temporary login simulation
    if (email && password) {
      goToFeed();
    } else {
      alert("Enter email and password");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h2>Login</h2>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /><br />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} /><br />
      <button onClick={handleLogin}>Login</button>
      <p>
        Don't have an account? <span style={{color:"blue", cursor:"pointer"}} onClick={goToSignup}>Sign Up</span>
      </p>
    </div>
  );
}

export default Login;
