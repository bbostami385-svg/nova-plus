import React, { useState } from "react";

function Signup(){

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  return(
    <div style={{textAlign:"center"}}>

      <h2>Create Account</h2>

      <input placeholder="Name" onChange={(e)=>setName(e.target.value)}/>
      <br/><br/>

      <input placeholder="Email" onChange={(e)=>setEmail(e.target.value)}/>
      <br/><br/>

      <input type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)}/>
      <br/><br/>

      <button>Signup</button>

    </div>
  );
}

export default Signup;
