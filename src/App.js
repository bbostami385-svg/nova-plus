import React, { useState } from "react";
import Splash from "./Splash";
import Login from "./Login";
import Signup from "./Signup";
import Feed from "./Feed";
import Chat from "./Chat";

function App() {
  const [page, setPage] = useState("splash");

  const renderPage = () => {
    switch (page) {
      case "login":
        return <Login goToSignup={() => setPage("signup")} goToFeed={() => setPage("feed")} />;
      case "signup":
        return <Signup goToLogin={() => setPage("login")} />;
      case "feed":
        return (
          <>
            <Feed />
            <Chat />
          </>
        );
      default:
        return <Splash goToLogin={() => setPage("login")} />;
    }
  };

  return <div>{renderPage()}</div>;
}

export default App;
