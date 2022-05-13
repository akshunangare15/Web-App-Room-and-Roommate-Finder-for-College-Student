import React,{useRef, useEffect,useState} from "react";
import "./index.css";
const Tabs = (props)=>{
    return(
        <div className = "tabs">
            <button onClick = {()=>props.handleClick(true)} value = "roommate">Find Roommates</button>
            <button onClick = {()=>props.handleClick(false)} value = "listing">Find Listings</button>
        </div>
    )
}
export default Tabs;