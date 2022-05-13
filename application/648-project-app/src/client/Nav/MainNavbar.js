import React, { useContext } from "react";
import { useHistory } from "react-router";
import "./index.css";
import { NavLink } from "react-router-dom";
import logo from "../../images/logo.png";
import { AuthContext } from "../../context/auth-context";
const MainNavBar = (props) => {
  const auth = useContext(AuthContext);
  const history = useHistory();
  const handleLogoff = () => {
    const uri = "http://" + window.location.host + "/api/user/logout";
    fetch(uri, {
      method: "POST",
      credentials: "include"
    })
    .then(response => response.json())
    .then(results => {
      if (results.status === "success") {
        auth.logout();
        history.push("/");
      } else {
        setResult(results);
      }
    })
    .catch(error=>{
        console.error("error:", error)
    })
  }
  return (
    <div className = "nav-container">
      <div className = "Navbar">
              <NavLink id="logo" to="/home" exact>
                  <img src = {logo} width = "80" height = "85"/>
              </NavLink>
              <ul className = "desktop-nav">
              {!auth.isLoggedIn && (
                  <li>
                      <NavLink to ="/signin">Sign in</NavLink>
                  </li>)
              }
              {!auth.isLoggedIn && (
                  <li>
                      <NavLink to="/signup">Sign up</NavLink>
                  </li>)
              }
              {auth.isLoggedIn && (
                  <li>
                      <NavLink to="/settings">{auth.userName}</NavLink>
                  </li>)
              }
              {auth.isLoggedIn && (
                  <li>
                      <NavLink to = "/uploadlisting">Upload</NavLink>
                  </li>)
              }
              {auth.isLoggedIn && (
                  <li>
                      <NavLink to="/" onClick = {handleLogoff}>Log off</NavLink>
                  </li>)
              }
              </ul>
      </div>
      
        <div className = "mobile-nav">
            <NavLink id="logo" to="/home" exact>
                <img src = {logo} width = "80" height = "85"/>
            </NavLink>
            <div className = "dropdown" >
            <button className = "dropbtn">Menu</button>
                <div className="dropdown-content">
                    {!auth.isLoggedIn && (<NavLink className="dropdown-item" to = "/signin">Sign in</NavLink>)}
                    {!auth.isLoggedIn &&(<NavLink className="dropdown-item" to = "/signup">Sign up</NavLink>)}
                    {auth.isLoggedIn &&(<NavLink to="/settings">{auth.userName}</NavLink>)}
                    {auth.isLoggedIn &&(<NavLink to = "/uploadlisting">Upload</NavLink>)}
                    {auth.isLoggedIn &&(<NavLink to="/" onClick = {handleLogoff}>Log off</NavLink>)}
                </div>
            </div>
        </div>
    </div>
  )
}

export default MainNavBar;