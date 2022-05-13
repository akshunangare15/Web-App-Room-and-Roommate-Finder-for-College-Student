import React from "react";
import LandingNavbar from "../Nav/LandingNavbar";
import MobileLandingNav from "../Nav/MobileLandingNav";
import landingImage from "../../images/landingimage.png";

const LandingPage = ()=>{
    return(
        <div className = "landingpage">
            <div className = "main-contents" style = {{
                backgroundImage: `url(${landingImage})`
            }}>
            <h1 style = {
               {
                textAlign: "center",
                position:"relative",
                top: "120px",
               }
           }>SFSU Software Engineering Project CSC 648-848, Fall 2021 Team 2. <br/> For Demonstration Only</h1>
                <h1>Rent with like minded individuals</h1>
                <h4>Sign up for more features</h4>
            </div>
            <footer>Since 2021</footer>
        </div>
    )
}
export default LandingPage;
