const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// 🔥 NEW
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const users = {}; // store online users

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // user register
  socket.on("addUser", (userId) => {
    users[userId] = socket.id;
    io.emit("getUsers", Object.keys(users));
  });

  // send message
  socket.on("sendMessage", (data) => {
    const receiverSocket = users[data.receiverId];

    if (receiverSocket) {
      io.to(receiverSocket).emit("receiveMessage", data);
    }
  });

  // typing
  socket.on("typing", (data) => {
    const receiverSocket = users[data.receiverId];

    if (receiverSocket) {
      io.to(receiverSocket).emit("typing", data);
    }
  });

  socket.on("disconnect", () => {
    for (const userId in users) {
      if (users[userId] === socket.id) {
        delete users[userId];
        break;
      }
    }
    io.emit("getUsers", Object.keys(users));
  });
});

// -----------------------
// MongoDB
// -----------------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch(err => console.log("MongoDB error ❌", err));

// -----------------------
// MODELS
// -----------------------
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,

  followers: [String],
  following: [String],

  friendRequests: [String],
  sentRequests: [String],
  friends: [String],

  notifications: [
    {
      text: String,
      createdAt: { type: Date, default: Date.now }
    }
  ],

  isProfessional: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model("User", UserSchema);

// -----------------------
// AUTH MIDDLEWARE
// -----------------------
const auth = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ msg: "Invalid token" });
  }
};

// -----------------------
// AUTH ROUTES
// -----------------------
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ msg: "Email exists" });

    const hash = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hash });

    await user.save();
    res.json({ msg: "Signup success", user });

  } catch {
    res.status(500).json({ msg: "Server error" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ msg: "Wrong password" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ msg: "Login success", token, user });

  } catch {
    res.status(500).json({ msg: "Server error" });
  }
});

// -----------------------
// USERS
// -----------------------
app.post("/api/users/:id/follow", auth, async (req, res) => {
  const user = await User.findById(req.params.id);
  const me = await User.findById(req.user.id);

  if (!user.followers.includes(me._id.toString())) {
    user.followers.push(me._id);
    me.following.push(user._id);
  } else {
    user.followers = user.followers.filter(f => f !== me._id.toString());
    me.following = me.following.filter(f => f !== user._id.toString());
  }

  await user.save();
  await me.save();

  res.json({ msg: "Follow updated" });
});

// FRIEND REQUEST
app.post("/api/users/:id/add-friend", auth, async (req, res) => {
  const target = await User.findById(req.params.id);
  const me = await User.findById(req.user.id);

  if (!target.friendRequests.includes(me._id)) {
    target.friendRequests.push(me._id);
    me.sentRequests.push(target._id);
  }

  await target.save();
  await me.save();

  res.json({ msg: "Request sent" });
});

// ACCEPT FRIEND
app.post("/api/users/:id/accept", auth, async (req, res) => {
  const me = await User.findById(req.user.id);
  const sender = await User.findById(req.params.id);

  me.friends.push(sender._id);
  sender.friends.push(me._id);

  await me.save();
  await sender.save();

  res.json({ msg: "Friend added" });
});

// PROFESSIONAL MODE
app.put("/api/users/professional", auth, async (req, res) => {
  const user = await User.findById(req.user.id);

  user.isProfessional = !user.isProfessional;
  await user.save();

  res.json({ isProfessional: user.isProfessional });
});

// -----------------------
// POSTS ROUTES
// -----------------------
const postRoutes = require("./routes/postRoutes");
app.use("/api/posts", postRoutes);

// -----------------------
// 🔥 SOCKET LOGIC
// -----------------------
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("sendMessage", (data) => {
    io.emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// -----------------------
app.get("/", (req, res) => {
  res.send("NovaPlus Social Backend 🚀");
});

// -----------------------
// 🔥 IMPORTANT CHANGE
// -----------------------
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
