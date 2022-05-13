import React, { useEffect, useState } from "react";
import "./index.css";
import { NavLink } from "react-router-dom";
import NoImage from "../../../images/noImage.png";

const OwnerlistingComponent = ({listing, handleRemove, showListingEdit}) => {
    let [contents, setContents] = useState({});
    useEffect(()=>{
        fetch(`/api/listing/${listing.listing_id}`)
        .then(data => data.json())
        .then(data => data.listing)
        .then(data => setContents(data))
        .catch(err => console.log(err))
    }, [])
    const Decider = ()=>{
        if(listing.listing_id !== null){
            return(
                <div className = "inventory">
                    <NavLink to = {{
                    pathname:`/listings/${listing.listing_id}`,
                    info:contents,
                    images:contents.images
                }}>
                <img name = {listing.listing_id} 
                    src = {listing.images.length > 0? listing.images[0].image_url:NoImage} 
                    width = "300" 
                    height = "300"/>
                </NavLink>
                <p>{listing.address}</p>
                <div className = "inventory-btn">
                    <input name = {listing.listing_id} type = "button" value = "Remove" onClick = {handleRemove}/>
                    <input name = {listing.listing_id} type = "button" value = "Edit" onClick = {showListingEdit}/>
                </div>
                </div>
            )
        }
        else{
            return (<div></div>)
        }
    }
    return(
        <Decider/>
    )
}

export default OwnerlistingComponent;