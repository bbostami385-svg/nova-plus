import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const API = process.env.REACT_APP_API;
const socket = io(API);

function Messenger() {
  const [userId, setUserId] = useState("");
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUser, setTypingUser] = useState("");
  const [videoFile, setVideoFile] = useState(null);

  const token = localStorage.getItem("token");
  const myId = localStorage.getItem("userId");

  // 🎥 Video Call refs
  const localVideo = useRef();
  const remoteVideo = useRef();

  // -----------------------
  // SOCKET
  // -----------------------
  useEffect(() => {
    if (myId) {
      socket.emit("addUser", myId);
    }

    socket.on("getUsers", setOnlineUsers);

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("typing", (data) => {
      setTypingUser(data.senderId);
      setTimeout(() => setTypingUser(""), 1000);
    });

    // 🎥 receive call
    socket.on("callUser", async (data) => {
      await startCamera();

      alert("Incoming Call 📞");

      socket.emit("answerCall", {
        to: data.from,
        signal: "accepted"
      });
    });

    return () => {
      socket.off();
    };
  }, [myId]);

  // -----------------------
  // LOAD MESSAGES
  // -----------------------
  const loadMessages = async () => {
    const res = await fetch(`${API}/api/messages/${userId}`, {
      headers: { Authorization: "Bearer " + token }
    });
    const data = await res.json();
    setMessages(data || []);
  };

  // -----------------------
  // SEND MESSAGE
  // -----------------------
  const sendMessage = async () => {
    if (!text && !videoFile) return;

    const msg = {
      senderId: myId,
      receiverId: userId,
      text,
      video: videoFile ? URL.createObjectURL(videoFile) : "",
      createdAt: new Date()
    };

    socket.emit("sendMessage", msg);

    await fetch(`${API}/api/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({
        receiverId: userId,
        text,
        video: msg.video
      })
    });

    setMessages((prev) => [...prev, msg]);
    setText("");
    setVideoFile(null);
  };

  // -----------------------
  // 🎥 START CAMERA
  // -----------------------
  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });

    localVideo.current.srcObject = stream;
  };

  // -----------------------
  // 🎥 CALL USER
  // -----------------------
  const callUser = async () => {
    await startCamera();

    socket.emit("callUser", {
      to: userId,
      from: myId
    });
  };

  return (
    <div style={{ padding: "15px" }}>
      <h2>Messenger 💬 + 🎥</h2>

      <p>🟢 Online: {onlineUsers.length}</p>

      <input
        placeholder="Enter userId"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />

      <button onClick={loadMessages}>Load Chat</button>

      {/* 🎥 CALL BUTTON */}
      <button onClick={callUser} style={{ marginLeft: "10px" }}>
        📞 Call
      </button>

      {/* 🎥 VIDEO SECTION */}
      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <video ref={localVideo} autoPlay muted width="150" />
        <video ref={remoteVideo} autoPlay width="150" />
      </div>

      {/* CHAT BOX */}
      <div style={{
        border: "1px solid gray",
        height: "250px",
        overflowY: "scroll",
        marginTop: "10px",
        padding: "10px"
      }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            textAlign: m.senderId === myId ? "right" : "left"
          }}>
            <p style={{
              background: "#eee",
              display: "inline-block",
              padding: "5px 10px",
              borderRadius: "10px"
            }}>
              {m.text}
            </p>

            {/* 🎥 VIDEO MESSAGE */}
            {m.video && (
              <video width="150" controls>
                <source src={m.video} />
              </video>
            )}
          </div>
        ))}

        {typingUser && <p>Typing...</p>}
      </div>

      {/* INPUT */}
      <input
        value={text}
        onChange={(e) => {
          setText(e.target.value);

          socket.emit("typing", {
            senderId: myId,
            receiverId: userId
          });
        }}
        placeholder="Type message..."
      />

      {/* 🎥 VIDEO UPLOAD */}
      <input
        type="file"
        accept="video/*"
        onChange={(e) => setVideoFile(e.target.files[0])}
      />

      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Messenger;
