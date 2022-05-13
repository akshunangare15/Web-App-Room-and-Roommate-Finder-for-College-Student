import React, {useRef, useEffect,useState} from "react";
import "./index.css";
import SignedInNavBar from "../../Nav/SignedInNavbar";
import MobileSignedInNav from "../../Nav/MobileSignedInNav";
import NoImage from "../../../images/defaultProfile.png";
const UserProfile = (props)=>{
    return(
        <div className = "container">
            <h1 style = {
               {
                textAlign: "center",
                position:"relative",
                top: "100px",
               }
           }>SFSU Software Engineering Project CSC 648-848, Fall 2021 Team 2. <br/> For Demonstration Only</h1>

            <div className = "user-profile">
                <div className = "left-col">
                    <div className = "user-profile-image">
                        <img src = {!props.location.info.profile_url?NoImage:props.location.info.profile_url}
                                                                                                        width = "300" height = "250"/>
                    </div>
                    <div className = "additional-images">
                    
                    </div>
                    <div className = "user-attributes">
                        <ul>
                            <li>Gender: {props.location.info.gender}</li>
                            <li>Ethnicity: {props.location.info.ethnicity}</li>
                            <li>Smoking: {props.location.info.smoking=== 1? "Yes": "No"}</li>
                            <li>Pets: {props.location.info.pets === 1? "Yes":"No"}</li>
                        </ul>
                    </div>
                </div>
                <div className = "right-col">
                    <div className = "user-header">
                        <ul>
                            <li>{props.location.info.firstname} {props.location.info.lastname}</li>
                            {props.location.info.age && <li>, {props.location.info.age}</li>}
                        </ul>
                    </div>
                    <div className = "user-description">
                        <p>{props.location.info.biography}</p>
                    </div>
                </div>
            </div>
            <div className = "contact-message">
                    <h3>{`Contact ${props.location.info.firstname} ${props.location.info.lastname}:${props.location.info.email}`} </h3>
            </div>
        </div>
    );
}
export default UserProfile;