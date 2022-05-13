import React,{useRef, useEffect,useState} from "react";
import SignedInNavbar from "../Nav/SignedInNavbar";
import MobileSignedInNav from "../Nav/MobileSignedInNav";
import Tabs from "../Tabs/Tabs";
import "./index.css";

import Decider from "../ContentDisplayDecider/Decider"

const Home = ()=>{
    let [displayUsers, setDisplayUsers] = useState(true);
     return(
         
         <div className = "home">
            <h1 style = {
               {
                textAlign: "center",
                position:"relative",
                top: "120px",
               }
           }>SFSU Software Engineering Project CSC 648-848, Fall 2021 Team 2. <br/> For Demonstration Only</h1>
            <Tabs handleClick = {(show) =>setDisplayUsers(show)}/>
            <Decider displayUsers = {displayUsers} />
         </div>
     )
};
export default Home;