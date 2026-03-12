// server.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// -----------------------
// MongoDB Connection
// -----------------------
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected ✅"))
.catch(err => console.log("MongoDB connection error ❌", err));

// -----------------------
// Models
// -----------------------
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  followers: [String],
  following: [String],
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model("User", UserSchema);

const PostSchema = new mongoose.Schema({
  userId: String,
  text: String,
  image: String,
  likes: [String],
  createdAt: { type: Date, default: Date.now }
});
const Post = mongoose.model("Post", PostSchema);

// -----------------------
// Auth Routes
// -----------------------
app.post("/api/auth/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ msg: "User created successfully", user: newUser });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ msg: "Login successful", token, user });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err });
  }
});

// -----------------------
// Middleware: JWT Auth
// -----------------------
const auth = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

// -----------------------
// Posts Routes
// -----------------------
app.post("/api/posts", auth, async (req, res) => {
  const { text, image } = req.body;
  try {
    const newPost = new Post({ userId: req.user.id, text, image });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err });
  }
});

app.get("/api/posts", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err });
  }
});

// -----------------------
// Follow / Unfollow Routes
// -----------------------
app.post("/api/users/:id/follow", auth, async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!targetUser || !currentUser) return res.status(404).json({ msg: "User not found" });

    if (!targetUser.followers.includes(currentUser._id.toString())) {
      targetUser.followers.push(currentUser._id);
      currentUser.following.push(targetUser._id);
      await targetUser.save();
      await currentUser.save();
      return res.json({ msg: "Followed successfully" });
    } else {
      targetUser.followers = targetUser.followers.filter(f => f.toString() !== currentUser._id.toString());
      currentUser.following = currentUser.following.filter(f => f.toString() !== targetUser._id.toString());
      await targetUser.save();
      await currentUser.save();
      return res.json({ msg: "Unfollowed successfully" });
    }
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err });
  }
});

// -----------------------
// Test Route
// -----------------------
app.get("/", (req, res) => res.send("NovaPlus Social Backend Running 🚀"));

// -----------------------
// Start Server
// -----------------------
app.listen(PORT, () => console.log(`Server running on port ${PORT} ✅`));
