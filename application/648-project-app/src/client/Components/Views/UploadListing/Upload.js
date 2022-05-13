import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router';
import './index.css';
import ReactGA from 'react-ga';

const Upload = () => {
    const history = useHistory();
    const addressRef = useRef();
    const cityRef = useRef();
    const stateRef = useRef();
    const zipRef = useRef();
    const numOfRoomRef = useRef();
    const maxCapacityRef = useRef();
    const descriptionRef = useRef();
    const rentRef = useRef();
    const typeRef = useRef();
    const imageRef = useRef();

    const cityStateRegex = /^[A-Za-z\s]+$/;
    const zipCodeRegex = /(^\d{5}$)|(^\d{9}$)|(^\d{5}-\d{4}$)/;
    const addressRegex = /^[a-zA-Z0-9_.-\s#]+$/;
    const cityMessage = useRef();
    const stateMessage = useRef();
    const addressMessage = useRef();
    const zipCodeMessage = useRef();
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [allValid, setAllValid] = useState(false);

    const onSubmitHandler = () => {
        ReactGA.event({
            category: 'Button',
            action: 'upload listing sent to backend',
        });

        if (allValid) {
            const formData = new FormData();
            formData.append('address', addressRef.current.value);
            formData.append('city', cityRef.current.value);
            formData.append('state', stateRef.current.value);
            formData.append('zip', zipRef.current.value);
            formData.append('rooms', numOfRoomRef.current.value);
            formData.append('max_capacity', maxCapacityRef.current.value);
            formData.append('description', descriptionRef.current.value);
            formData.append('monthly_rent', rentRef.current.value);
            formData.append('housing_type', typeRef.current.value);

            const { files } = imageRef.current;
            for (let i = 0; i < files.length; ++i) {
                formData.append('images', files[i]);
            }
            const url = '/api/listing/';

            fetch(url, {
                method: 'POST',
                body: formData,
            })
                .then((response) => response.json())
                .then((results) => {
                    if (results.status === 'success') {
                        // Should redirect to user_list dashboard page
                        history.push('/settings');
                    }
                    
                })
                .catch((validationError) => console.log(validationError));
        } else alert('address, city, state, or zipcode does not meet requirement');
    };
    function handleChange(e) {
        e.preventDefault();
        const event = e.target.name;
        switch (event) {
        case 'address':
            setAddress(e.target.value);
            break;
        case 'city':
            setCity(e.target.value);
            break;
        case 'state':
            setState(e.target.value);
            break;
        case 'zip-code':
            setZipCode(e.target.value);
        }
    }
    function validChecker() {
        if (addressRegex.test(address)) {
            addressMessage.current.innerHTML = '';
        } else { addressMessage.current.innerHTML = 'Address format can contain alphanumerical characters & only limited special characters(_ . - #)'; }

        if (cityStateRegex.test(city)) {
            cityMessage.current.innerHTML = '';
        } else { cityMessage.current.innerHTML = 'City should only be alphabetical characters'; }

        if (cityStateRegex.test(state)) {
            stateMessage.current.innerHTML = '';
        } else { stateMessage.current.innerHTML = 'State should only be alphabetical characters'; }

        if (zipCodeRegex.test(zipCode)) {
            zipCodeMessage.current.innerHTML = '';
        } else { zipCodeMessage.current.innerHTML = 'Zip code should only be 5 numerical characters'; }
    }
    function checkAll() {
        const validateAddress = addressRegex.test(address);
        const validateCity = cityStateRegex.test(city);
        const validateState = cityStateRegex.test(state);
        const validateZipCode = zipCodeRegex.test(zipCode);

        if (validateAddress && validateCity && validateState && validateZipCode) {
            setAllValid(true);
        } else setAllValid(false);
    }
    useEffect(() => {
        validChecker();
        checkAll();
    }, [address, city, state, zipCode]);
    return (
        <div>
            <h1 style = {
               {
                textAlign: "center",
                position:"relative",
                top: "120px",
               }
           }>SFSU Software Engineering Project CSC 648-848, Fall 2021 Team 2. <br/> For Demonstration Only</h1>
            <div className="upload">
                <form>
                    <h3>Upload a Listing!</h3>
                    <div className="address">
                        <label>Address:</label>
                        <input
                            name="address"
                            type="text"
                            placeholder="Enter Address"
                            required
                            ref={addressRef}
                            onChange={handleChange}
                      />
                        <p ref={addressMessage} />
                  </div>

                    <div className="city">
                        <label>City:</label>
                        <input
                            name="city"
                            type="text"
                            placeholder="Enter City"
                            required
                            ref={cityRef}
                            onChange={handleChange}
                      />
                        <p ref={cityMessage} />
                  </div>

                    <div className="state">
                        <label>State:</label>
                        <input
                            name="state"
                            type="text"
                            placeholder="Enter State"
                            required
                            ref={stateRef}
                            onChange={handleChange}
                      />
                        <p ref={stateMessage} />
                  </div>

                    <div className="zipcode">
                        <label>Zipcode:</label>
                        <input
                            name="zip-code"
                            type="number"
                            placeholder="Enter Zipcode"
                            required
                            ref={zipRef}
                            onChange={handleChange}
                      />
                        <p ref={zipCodeMessage} />
                  </div>

                    <div className="numberOfRooms">
                        <label>Number of Rooms:</label>
                        <input
                            type="number"
                            placeholder="Enter Room Count"
                            min="0"
                            required
                            ref={numOfRoomRef}
                      />
                  </div>

                    <div className="maxCapacity">
                        <label>Max Capacity:</label>
                        <input
                            type="number"
                            placeholder="Enter Max Capacity"
                            min="0"
                            required
                            ref={maxCapacityRef}
                      />
                  </div>

                    <div className="listingDescription">
                        <label>Description:</label>
                        <textarea
                            placeholder="Enter Description"
                            required
                            ref={descriptionRef}
                      />
                  </div>

                    <div className="monthly-rent">
                        <label>Monthly Rent:</label>
                        <input
                            type="number"
                            placeholder="Enter Monthly Rent"
                            min="0"
                            required
                            ref={rentRef}
                      />
                  </div>

                    <div className="housingType">
                        <label htmlFor="house-type">Housing Type:</label>
                        <select
                            name="house-type"
                            className="housing-type-box"
                            ref={typeRef}
                      >
                            <option value="apartment">Apartment</option>
                            <option value="house">House</option>
                      </select>
                  </div>

                    <div>
                        <label htmlFor="house-img">House Picture:</label>
                        <input
                            type="file"
                            placeholder="Upload Image"
                            required
                            accept="image/*"
                            multiple
                            ref={imageRef}
                      />
                  </div>

                    <div className="upload-submit">
                        <input type="button" value="Upload" onClick={onSubmitHandler} />
                  </div>
              </form>
          </div>
      </div>
    );
};
export default Upload;
