
import React from "react";
import "./index.css";
import { NavLink } from "react-router-dom";
import logo from "../../images/logo.png";
// import { ReactSession } from "react-client-session";

const LandingNavbar = () => {
  // maybe blocking off non-registered users
  // couldn't test cuz i'm having node module issues
  // isLoggedIn(() => {
  //   // const user = ReactSession.get("username");
  //   let user = localStorage.getItem("username");
  
  //   if(user == null || user.length == 0 || !user) {
  //     alert("Must be logged in to gain access!");
  //   }
  // }, [])

  // add onClick={isLoggedIn} to the home navLink

    return( 
<div className = "Navbar">
            <NavLink id="logo" to="/home" exact>
                <img src = {logo} width = "80" height = "85"/>
            </NavLink>
            <ul className = "desktop-nav">
              <li>
                <NavLink to ="/signin">Sign in</NavLink>
              </li>
              <li>
                <NavLink to="/signup">Sign up</NavLink>
              </li>
            </ul>
     </div>     
    )
 };
 export default LandingNavbar;