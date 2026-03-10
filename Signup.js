import React, { useState } from "react";

function Signup() {

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const handleSignup = async () => {

    const res = await fetch("/api/auth/signup",{

      method:"POST",

      headers:{
        "Content-Type":"application/json"
      },

      body:JSON.stringify({
        name,
        email,
        password
      })

    });

    const data = await res.json();

    alert(data.msg);

  };

  return(

    <div style={{textAlign:"center"}}>

      <h2>Signup</h2>

      <input
      placeholder="Name"
      onChange={(e)=>setName(e.target.value)}
      />

      <br/><br/>

      <input
      placeholder="Email"
      onChange={(e)=>setEmail(e.target.value)}
      />

      <br/><br/>

      <input
      type="password"
      placeholder="Password"
      onChange={(e)=>setPassword(e.target.value)}
      />

      <br/><br/>

      <button onClick={handleSignup}>Create Account</button>

    </div>

  );

}

export default Signup;
