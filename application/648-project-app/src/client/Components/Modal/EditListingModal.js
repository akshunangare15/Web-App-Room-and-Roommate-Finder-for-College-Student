import React, {useRef, useEffect,useState, useContext} from "react";
// import "../Views/UploadListing/index.css";
import { useHistory } from 'react-router';
import "./Modal.css";


const EditListingModal = ({display, handleClose,listingId, listingContent})=>{
    const history = useHistory();
    const displayStyle = display? "block": "none";
    const modalRef = useRef();
    const style = {
        display: `${displayStyle}`
    }
    const addressRef = useRef();
    const cityRef = useRef();
    const stateRef = useRef();
    const zipRef = useRef();
    const numOfRoomRef = useRef();
    const maxCapacityRef = useRef();
    const descriptionRef = useRef();
    const rentRef = useRef();
    const typeRef = useRef();


    const cityStateRegex = /^[A-Za-z\s]+$/;
    const zipCodeRegex = /(^\d{5}$)|(^\d{9}$)|(^\d{5}-\d{4}$)/;
    const addressRegex = /^[a-zA-Z0-9_.-\s#]+$/;
    const cityMessage = useRef();
    const stateMessage = useRef();
    const addressMessage = useRef();
    const zipCodeMessage = useRef();
    let [address, setAddress] = useState("");
    let [city, setCity] = useState("");
    let [state, setState] = useState("");
    let [zipCode, setZipCode] = useState("");
    let [rooms, setRooms] = useState(null);
    let [maxCap, setMaxCap] = useState(null);
    let [description, setDescript] = useState(null);
    let [allValid, setAllValid] = useState(false);
    let [rent, setRent] = useState(null);
    let [houseType, setHouseType] = useState(null);

    const onSubmitHandler = () =>{
      if(allValid){
        const formData = new FormData();
        formData.append("listing_id", listingId);
        formData.append("address", addressRef.current.value);
        formData.append("city", cityRef.current.value);
        formData.append("state", stateRef.current.value);
        formData.append("zip", zipRef.current.value);
        formData.append("rooms", numOfRoomRef.current.value);
        formData.append("max_capacity", maxCapacityRef.current.value);
        formData.append("description", descriptionRef.current.value);
        formData.append("housing_type", typeRef.current.value);
        formData.append("monthly_rent", rentRef.current.value);

        fetch(`/api/listing`,{
          method:"PUT",
          body:formData
        })
        .then(response => response.json())
        .then(results => {
          if(results.status === "success"){
           history.push("/home");
            
          }
        }).catch(err => console.log(err))
      }
      else alert("validation requirements must be met");
    }
    function handleChange(e){
      e.preventDefault();
      const event = e.target.name;
      switch(event){
        case "address":
          setAddress(e.target.value);
          break;
        case "city":
          setCity(e.target.value);
          break;
        case "state":
          setState(e.target.value);
          break;
        case "zip-code":
          setZipCode(e.target.value);
          break;
        case "rooms":
          setRooms(e.target.value);
          break;
        case "maxCap":
          setMaxCap(e.target.value);
          break;
        case "description":
          setDescript(e.target.value);
          break;
        case "rent":
          setRent(e.target.value)
          break;
        case "house-type":
          setHouseType(e.target.value);
      }
    }
    function validChecker(){
      if(addressRegex.test(address)){
        addressMessage.current.innerHTML = "";
      }else addressMessage.current.innerHTML = "Address format can contain alphanumerical characters & only limited special characters(_ . - #)";

      if(cityStateRegex.test(city)){
        cityMessage.current.innerHTML = "";
      }else cityMessage.current.innerHTML = "City should only be alphabetical characters";

      if(cityStateRegex.test(state)){
        stateMessage.current.innerHTML = "";
      }else stateMessage.current.innerHTML = "State should only be alphabetical characters";

      if(zipCodeRegex.test(zipCode)){
        zipCodeMessage.current.innerHTML = "";
      }else zipCodeMessage.current.innerHTML = "Zip code should only be 5 numerical characters";
    }
    function checkAll(){
      let validateAddress = addressRegex.test(address);
      let validateCity = cityStateRegex.test(city);
      let validateState = cityStateRegex.test(state);
      let validateZipCode = zipCodeRegex.test(zipCode);

      if(validateAddress && validateCity && validateState && validateZipCode){
        setAllValid(true);
      }else setAllValid(false);
    }
    useEffect(()=>{
      validChecker();
      checkAll();

    }, [address, city, state, zipCode])
    useEffect(()=>{
      setAddress(listingContent.address);
      setCity(listingContent.city);
      setState(listingContent.state);
      setZipCode(listingContent.zip);
      setRooms(listingContent.rooms);
      setMaxCap(listingContent.max_capacity);
      setDescript(listingContent.description);
      setRent(listingContent.monthly_rent);
      setHouseType(listingContent.housing_type);
    },[listingContent])
    return(
        <div className = "edit-listing-modal" style = {style} ref = {modalRef}>
            <div className = "modal-container">
                <h3 id = "edit-listing-closer" onClick = {()=> handleClose(false)}>Close</h3>
                <div className = "edit-listing">
            <div className="upload">
                <form>
                    <h3>Edit Listing</h3>
                    <div className="address">
                    <label>Address:</label>
                    <input
                        name = "address"
                        type="text"
                        value = {address}
                        placeholder="Enter Address"
                        required
                        ref={addressRef}
                        onChange = {handleChange}
                    />
                    <p ref = {addressMessage}></p>
                    </div>

                    <div className="city">
                    <label>City:</label>
                    <input
                        name = "city"
                        type="text"
                        placeholder="Enter City"
                        required
                        ref={cityRef}
                        onChange = {handleChange}
                        value = {city}
                    />
                    <p ref = {cityMessage}></p>
                    </div>

                    <div className="state">
                    <label>State:</label>
                    <input
                        name = "state"
                        type="text"
                        placeholder="Enter State"
                        required
                        ref={stateRef}
                        onChange = {handleChange}
                        value = {state}
                    />
                    <p ref = {stateMessage}></p>
                    </div>

                    <div className="zipcode">
                    <label>Zipcode:</label>
                    <input
                        name = "zip-code"
                        type="number"
                        placeholder="Enter Zipcode"
                        required
                        ref={zipRef}
                        onChange = {handleChange}
                        value = {zipCode}
                    />
                    <p ref = {zipCodeMessage}></p>
                    </div>

                    <div className="numberOfRooms">
                    <label>Number of Rooms:</label>
                    <input
                        name = "rooms"
                        type="number"
                        placeholder="Enter Room Count"
                        min="0"
                        required
                        ref={numOfRoomRef}
                        onChange = {handleChange}
                        value = {rooms}
                    />
                    </div>

                    <div className="maxCapacity">
                    <label>Max Capacity:</label>
                    <input
                        name = "maxCap"
                        type="number"
                        placeholder="Enter Max Capacity"
                        min="0"
                        required
                        ref={maxCapacityRef}
                        onChange = {handleChange}
                        value = {maxCap}
                    />
                    </div>

                    <div className="listingDescription">
                    <label>Description:</label>
                    <textarea
                        name = "description"
                        placeholder="Enter Description"
                        required
                        ref={descriptionRef}
                        onChange = {handleChange}
                        value = {description}
                    />
                    </div>

                    <div className="monthly-rent">
                    <label>Monthly Rent:</label>
                    <input
                        name = "rent"
                        type="number"
                        placeholder="Enter Monthly Rent"
                        min="0"
                        required
                        ref={rentRef}
                        onChange = {handleChange}
                        value = {rent}
                    />
                    </div>

                    <div className="housingType">
                    <label for="house-type">Housing Type:</label>
                    <select
                        name="house-type"
                        className="housing-type-box"
                        ref={typeRef}
                        onChange = {handleChange}
                        value = {houseType}
                    >
                        <option value="apartment">Apartment</option>
                        <option value="house">House</option>
                    </select>
                    </div>

                    {/* <div>
                    <label for="house-img">House Picture:</label>
                    <input
                        type="file"
                        placeholder="Upload Image"
                        required
                        accept="image/*"
                        multiple
                        ref={imageRef}
                    />
                    </div> */}

                    <div className="upload-submit">
                    <input type="button" value="Save" onClick={onSubmitHandler} />
                    </div>
                </form>
            </div>
                </div>
            </div>
        </div>
    )
}
export default EditListingModal;