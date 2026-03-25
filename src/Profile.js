import React, { useEffect, useState } from "react";

function Profile() {
  const [user, setUser] = useState(null);

  const getProfile = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("https://novaplus-social.onrender.com/api/auth/me", {
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    const data = await res.json();
    setUser(data);
  };

  useEffect(() => {
    getProfile();
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Profile 👤</h2>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
    </div>
  );
}

export default Profile;
