import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Splash from "./pages/Splash";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Feed from "./pages/index"; // index.js ভিতরে Feed component
import Chat from "./pages/chat";   // chat.js ভিতরে Chat component
import AppIcon from "./assets/app_icon.png"; // App icon import

function App() {
  return (
    <Router>
      <div>
        {/* Optional Navbar / App icon */}
        <header style={{ padding: "10px", textAlign: "center", background: "#222" }}>
          <img src={AppIcon} alt="App Icon" style={{ width: "50px" }} />
        </header>

        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
