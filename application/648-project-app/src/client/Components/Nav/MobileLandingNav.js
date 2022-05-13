import React from "react";
import { NavLink } from "react-router-dom";
import "./index.css";
import logo from "../../images/logo.png";

const MobileLandingNav = ()=>{
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
    return (
        <div className = "mobile-nav">
            <NavLink id="logo" to="/home" exact>
                <img src = {logo} width = "80" height = "85"/>
            </NavLink>
            <div className = "dropdown" >
            <button className = "dropbtn">Menu</button>
                <div className="dropdown-content">
                    <NavLink className="dropdown-item" to = "/signin">Sign in</NavLink>
                    <NavLink className="dropdown-item" to = "/signup">Sign up</NavLink>
                </div>
            </div>
        </div>
    )
}
export default MobileLandingNav;