import React, { useRef, useEffect, useState } from "react";
import "./index.css";
import ImageModal from "../../Modal/ImageModal";
import NoImage from "../../../images/noImage.png";
const ListingProfile = (props) => {
  const [profile, setProfile] = useState(NoImage);
  const [clickedImg, setClickedImg] = useState(null);
  const [display, setDisplay] = useState(false);
  const [email, setEmail] = useState("");
  function handleImgClick(e) {
    e.preventDefault();
    setClickedImg(e.target.src);
    setDisplay(true);
  }
  useEffect(() => {
    const fetchUserInfo = () => {
      const url = `/api/user/?user_id=${props.location.info.user_id}`;
      fetch(url)
        .then((response) => response.json())
        .then((results) => {
          setEmail(results.results.email);
        })
        .catch((err) => console.log(err));
    };
    fetchUserInfo();
  }, []);
  return (
    <div className="container">
      <h1 style = {
          {
          textAlign: "center",
          position:"relative",
          top: "100px",
          }
      }>SFSU Software Engineering Project CSC 648-848, Fall 2021 Team 2. <br/> For Demonstration Only</h1>
      <ImageModal
        handleClose={(close) => setDisplay(close)}
        img={clickedImg}
        display={display}
      />
      <div className="listing-profile">
        <div className="left-col">
          <div className="listing-profile-image">
            <img
              className="listing-image"
              onClick={handleImgClick}
              src={
                props.location.images.length === 0
                  ? profile
                  : props.location.images[0].image_url
              }
              width="300"
              height="250"
            />
          </div>
          <div className="additional-images">
            {props.location.images.slice(1).map((imgObj) => {
              return (
                <img
                  className="listing-image"
                  onClick={handleImgClick}
                  src={imgObj.image_url}
                  width="100"
                  height="100"
                />
              );
            })}
          </div>
          <div className="listing-attributes">
            <ul>
              <li>Housing Type: {props.location.info.housing_type}</li>
              <li>Beds: {props.location.info.rooms}</li>
              <li>Max Capacity: {props.location.info.max_capacity?props.location.info.max_capacity:props.location.info.rooms * 2}</li>
            </ul>
          </div>
        </div>
        <div className="right-col">
          <div className="listing-header">
            <ul>
              <li>{props.location.info.address}</li>
              <li>, ${props.location.info.monthly_rent}/mo</li>
            </ul>
          </div>
          <div className="listing-description">
            <p>{props.location.info.description}</p>
          </div>
        </div>
      </div>
      <div className="contact-message">
        <h3>{`Contact Owner: ${email}`}</h3>
      </div>
    </div>
  );
};
export default ListingProfile;
