import React, { useState } from "react";

// ✅ API from .env
const API = process.env.REACT_APP_API;

function Signup({ goToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    if (!name || !email || !password) {
      alert("Fill all fields");
      return;
    }

    try {
      const res = await fetch(`${API}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();

      if (res.ok) {
        alert("Signup successful ✅");
        goToLogin();
      } else {
        alert(data.msg || "Signup failed ❌");
      }

    } catch (err) {
      alert("Server error ❌");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h2>Sign Up 🚀</h2>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      /><br />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br />

      <button onClick={handleSignup}>Sign Up 🔥</button>

      <p>
        Already have an account?{" "}
        <span
          style={{ color: "blue", cursor: "pointer" }}
          onClick={goToLogin}
        >
          Login
        </span>
      </p>
    </div>
  );
}

export default Signup;
