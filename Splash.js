import React from "react";
import SplashLogo from "../assets/splash_logo.png";

function Splash() {
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <img src={SplashLogo} alt="Splash Logo" width={200} />
      <h1>Welcome to NovaPlus Social</h1>
    </div>
  );
}

export default Splash;
