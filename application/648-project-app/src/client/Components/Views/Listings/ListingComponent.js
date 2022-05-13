import React, { useEffect, useState } from "react";
import "./index.css";
import { NavLink } from "react-router-dom";
import NoImage from "../../../images/noImage.png";
// import House1 from "../../../images/house1.png";
import regeneratorRuntime from "regenerator-runtime";
const ListingComponent = (props) => {
  const [images, setImages] = useState([{}]);
  const [profile, setProfile] = useState(NoImage);

  useEffect(() => {
    const fetchImages = async () => {
      let response;
      let jsonObject;
      try {
        const url = `/api/images/images?listing_id=${props.listing.listing_id}`;
        response = await fetch(url);
        if (response.ok) {
          jsonObject = await response.json();
        }

        if (jsonObject) {
          let images = jsonObject.imageURLs;
          setImages(images);
          if (images.length) {
            setProfile(images[0].image_url);
          }
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchImages();
  }, []);
  return (
    <div className="listings-result">
      {/* <img src = {props.Listing_avatar} width = "180" height = "180"/> */}
      {/* <img src = {House1} width = "180" height = "180"/> */}
      <NavLink
        to={{
          pathname: `/listings/${props.listing.listing_id}`,
          info: props.listing,
          images: images,
        }}
      >
        {/* <img src = {props.Listing.profile_url} width = "100" height = "100"/>   */}
        <img src={profile} width="180" height="180" />
      </NavLink>
      <h3>{props.listing.city}, {props.listing.state}</h3>
      <p>{props.listing.zip}</p>
      <h3>${props.listing.monthly_rent}</h3>
    </div>
  );
};
export default ListingComponent;
