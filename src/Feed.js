import React, { useEffect, useState } from "react";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");
  const [category, setCategory] = useState("all");

  // -----------------------
  // Get Posts
  // -----------------------
  const getPosts = async () => {
    try {
      const res = await fetch("https://novaplus-social.onrender.com/api/posts");
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.log("Error loading posts");
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  // -----------------------
  // Create Post
  // -----------------------
  const createPost = async () => {
    const token = localStorage.getItem("token");

    if (!text) return alert("Write something!");

    try {
      const res = await fetch("https://novaplus-social.onrender.com/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
          text,
          image: "",
          video: "",
          category
        })
      });

      const data = await res.json();

      if (res.ok) {
        setText("");
        getPosts();
      } else {
        alert(data.msg || "Error creating post");
      }
    } catch (err) {
      alert("Server error");
    }
  };

  // -----------------------
  // Like Post
  // -----------------------
  const likePost = async (postId) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `https://novaplus-social.onrender.com/api/posts/${postId}/like`,
        {
          method: "PUT",
          headers: {
            "Authorization": "Bearer " + token
          }
        }
      );

      if (res.ok) {
        getPosts();
      }
    } catch (err) {
      console.log("Like error");
    }
  };

  // -----------------------
  // FILTER (YouTube style)
  // -----------------------
  const filteredPosts =
    category === "all"
      ? posts
      : posts.filter((p) => p.category === category);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>

      <h2>NovaPlus Feed 🚀</h2>

      {/* ---------------- CATEGORY BAR (YouTube style) ---------------- */}
      <div style={{ marginBottom: "15px" }}>
        {["all", "news", "funny", "gaming", "music", "education"].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            style={{
              margin: "5px",
              padding: "6px 12px",
              borderRadius: "20px",
              border: "none",
              background: category === cat ? "black" : "#ccc",
              color: category === cat ? "white" : "black",
              cursor: "pointer"
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ---------------- CREATE POST ---------------- */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="What's on your mind?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ padding: "10px", width: "250px" }}
        />

        <button onClick={createPost} style={{ marginLeft: "10px" }}>
          Post 🚀
        </button>
      </div>

      {/* ---------------- POSTS FEED ---------------- */}
      {filteredPosts.length === 0 ? (
        <p>No posts found 😢</p>
      ) : (
        filteredPosts.map((post) => (
          <div
            key={post._id}
            style={{
              maxWidth: "500px",
              margin: "15px auto",
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "15px",
              textAlign: "left",
              background: "#fff"
            }}
          >

            {/* USER CONTENT */}
            <p style={{ fontSize: "16px" }}>{post.text}</p>

            {/* VIDEO SUPPORT (YouTube style ready) */}
            {post.video && (
              <video width="100%" controls style={{ borderRadius: "10px" }}>
                <source src={post.video} />
              </video>
            )}

            {/* IMAGE SUPPORT (Instagram style ready) */}
            {post.image && (
              <img
                src={post.image}
                alt=""
                style={{ width: "100%", borderRadius: "10px" }}
              />
            )}

            <small style={{ color: "gray" }}>
              {new Date(post.createdAt).toLocaleString()}
            </small>

            <br />

            {/* LIKE BUTTON */}
            <button
              onClick={() => likePost(post._id)}
              style={{
                marginTop: "10px",
                padding: "5px 10px",
                border: "none",
                background: "#ff4444",
                color: "white",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              ❤️ Like ({post.likes.length})
            </button>

          </div>
        ))
      )}

    </div>
  );
}

export default Feed;
