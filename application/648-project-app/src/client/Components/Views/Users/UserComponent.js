import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import NoImage from "../../../images/defaultProfile.png";
import "./index.css";

const UserComponent = (props) => {
    useEffect(()=>{
        console.log(props.user.profile_url);
    },[props.user.profile_url])
    return (
            <div className = "users-result">
                <NavLink to = {{
                    pathname:`/users/${props.user.user_id}`,
                    info:props.user
                    }}>
                    <img src = {props.user.profile_url === ""?NoImage:props.user.profile_url } width = "100" height = "100"/>
                    <h3>{props.user.firstname + " "+ props.user.lastname}</h3>
                </NavLink>
            </div>
    )
};  

export default UserComponent;