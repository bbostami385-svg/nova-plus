import React, { useState } from "react";
import LoginLogo from "../assets/login_logo.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log("Login clicked", email, password);
    // TODO: Firebase Auth integration
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <img src={LoginLogo} alt="Login Logo" style={{ width: "150px" }} />
      <h2>Login</h2>
      <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
