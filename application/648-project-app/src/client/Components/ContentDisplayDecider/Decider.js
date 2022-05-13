import React from "react";
import DisplayUsers from "../Views/Users/DisplayUsers";
import DisplayListings from "../Views/Listings/DisplayListings";

const Decider = (props)=>{
    if(props.displayUsers){
        return <DisplayUsers />;
    }
    else return <DisplayListings />;
    
 
}
export default Decider;