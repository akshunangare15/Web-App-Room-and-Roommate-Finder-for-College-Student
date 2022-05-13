import React,{useRef, useEffect,useState} from "react";
import { NavLink } from "react-router-dom";
import "./index.css";
import logo from "../../images/logo.png";
// import { ReactSession } from "react-client-session";



const MobileSignedInNav = ()=>{
    function handleLogOff(){
        const uri = "http://" + window.location.host + "/logout";
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
        <div className = "mobile-nav">
            <NavLink id="logo" to="/home" exact>
                <img src = {logo} width = "80" height = "85"/>
            </NavLink>
            <div className = "dropdown" >
                <button className = "dropbtn">Menu</button>
                <div className="dropdown-content" >
                    <NavLink className="dropdown-item" to = "/settings">Username</NavLink>
                    <NavLink to = "uploadlisting">Upload</NavLink>
                    <NavLink className="dropdown-item" to = "/" onClick = {handleLogOff}>Log Off</NavLink>
                </div>
            </div>
        </div>

    )
}
export default MobileSignedInNav;
