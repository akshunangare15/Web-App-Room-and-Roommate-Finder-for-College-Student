import React from "react";
import "./index.css";
import { NavLink } from "react-router-dom";
import logo from "../../images/logo.png";
// import { ReactSession } from "react-client-session";
const SignedInNavbar = ()=>{
  function handleLogOff(){
    const uri = "http://" + window.location.host + "/api/user/logout";
    fetch(uri, {
        method:"POST",
        credentials:"include",
        headers:new Headers({
            "content-type":"application/json"    
        })
    })
    .then(response =>{
        ReactSession.setStoreType("localStorage");
        ReactSession.set("message", response.message)
        alert(ReactSession.get("message"));
    })
    .catch(error=>console.error("error", error))

    localStorage.clear();
  }
    return(
        <div className = "Navbar">
            <NavLink id="logo" to="/home" exact>
              <img src = {logo} width = "80" height = "85"/>
            </NavLink>
            <ul className="desktop-nav">
              <li>
                <NavLink to="/settings">Username</NavLink>
              </li>
              <li>
                <NavLink to = "/uploadlisting">Upload</NavLink>
              </li>
              <li>
                <NavLink to="/" onClick = {handleLogOff}>Log off</NavLink>
              </li>
            </ul>
     </div>
    )
}
export default SignedInNavbar;