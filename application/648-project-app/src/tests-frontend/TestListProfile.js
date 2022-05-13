import React, {useRef, useEffect,useState} from "react";
import "../app/Components/Views/Listings/index.css";
import House1 from "../app/images/house1.png";
import SignedInNavBar from "../app/Components/Nav/SignedInNavbar";
import MobileSignedInNav from "../app/Components/Nav/MobileSignedInNav";
import ImageModal from "../app/Components/Modal/ImageModal";


const TestListProfile = (props)=>{
//    const [profile, setProfile] = useState(NoImage);
    const [clickedImg, setClickedImg] = useState(null);
    const [display, setDisplay] = useState(false);


    function handleImgClick(e){
        e.preventDefault();
        setClickedImg(e.target.src);
        setDisplay(true);
      
    }
    return(
        <div className = "container">
            <MobileSignedInNav/>
            <SignedInNavBar/>
            <ImageModal handleClose = {(close)=>setDisplay(close)}img = {clickedImg} display = {display}/>
            <div className = "listing-profile">
                <div className = "left-col">
                    <div className = "listing-profile-image">
                        <img className = "listing-image" onClick = {handleImgClick} src = {House1} width = "300" height = "250"/>
                    </div>
                    <div className = "additional-images">
                    <img className = "listing-image" onClick = {handleImgClick} src = {House1} width = "100" height = "100"/>
                    <img className = "listing-image" onClick = {handleImgClick} src = {House1} width = "100" height = "100"/>
                    <img className = "listing-image" onClick = {handleImgClick} src = {House1} width = "100" height = "100"/>
                    </div>
                    <div className = "listing-attributes">
                        <ul>
                          
                        </ul>
                    </div>
                </div>
                <div className = "right-col">
                    <div className = "listing-header">
                        <ul>
                            
                            
                        </ul>
                    </div>
                    <div className = "listing-description">
                        
                    </div>
                </div>
            </div>
            <div className = "contact-message">
                <h3>{`Contact Owner: Ownersemail@gmail.com`}</h3>
            </div>
          
        </div>
    );
}
export default TestListProfile;