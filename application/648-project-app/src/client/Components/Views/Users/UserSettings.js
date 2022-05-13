import React,{useRef, useEffect,useState, useContext} from "react";
import SignedInNavBar from "../../Nav/SignedInNavbar";
import MobileSignedInNavBar from "../../Nav/MobileSignedInNav";
import { useHistory } from 'react-router';
// import { ReactSession } from "react-client-session";
import house from "../../../images/house1.png";
import {NavLink} from "react-router-dom";
import EditListingModal from "../../Modal/EditListingModal";
import { AuthContext } from "../../../context/auth-context";
import OwnerlistingComponent from "../Listings/OwnerListingComponent";

const UserSettings = ()=>{
    const history = useHistory();
    const auth = useContext(AuthContext);
    const nameRegex = /^[A-Za-z]+$/;
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const firstNameMessage = useRef();
    const lastNameMessage = useRef();
    const emailMessage = useRef();
    const ListingsRef = useRef();

    const profileRef = useRef();
    const firstNameRef = useRef();
    const lastNameRef = useRef();
    const emailRef = useRef();
    const ethnicRef = useRef();
    const petRef = useRef();
    const smokeRef = useRef();
    const ageRef = useRef();
    const bioRef = useRef();

    
    let [gender, setGender] = useState(null);
    let [pets, setPets] = useState(null);
    let [smoke, setSmoke] = useState(null);
    let [ethnicity, setEthnicity] = useState(null);
    let [age, setAge] = useState(null);
    let [bio, setBio] = useState(null);

    let [firstname, setFirstname] = useState("");
    let [lastname, setLastname] = useState("");
    let [email, setEmail] = useState("");
    let [allValid, setAllValid] = useState(false);
    let [displayEdit, setDisplayEdit] = useState(null);
    
    let [ownerListings, setOwnerListings] = useState([]);
    let [targetListingId, setTargetListingId] = useState(null);
    let [listingContent, setListingContent] = useState({});
    function handleUpdate(){
        // TODO: handle user info update
        if(allValid){
            const formData = new FormData();
            formData.append("image", profileRef.current.files[0]);
            formData.append("firstname",firstNameRef.current.value);
            formData.append("lastname",lastNameRef.current.value);
            formData.append("email",emailRef.current.value);
            formData.append("ethnicity",ethnicRef.current.value);
            formData.append("age",ageRef.current.value);
            formData.append("gender",gender);
            formData.append("pets",petRef.current.value === "yes"? 1 : 0);
            formData.append("smoking",smokeRef.current.value === "yes"? 1 : 0);
            formData.append("biography", bioRef.current.value);
            
            fetch("/api/user",{
                method: "PUT",
                body: formData,
            })
            .then(response =>response.json())
            .then(results =>{
             history.push("/home");
            
            }).catch(err => console.log(err))
        }
        else{
            alert("validation requirements are not met");
        }
    }
    function showListingEdit(e){
        //TODO: show edit listing modal
        e.preventDefault(e);
        setDisplayEdit(true);
        setTargetListingId(e.target.name);
        fetch(`/api/listing/${e.target.name}`)
        .then(data => data.json())
        .then(data => data.listing)
        .then(data => setListingContent(data))
        .catch(err => console.log(err))
    }
    function handleRemove(e){
       // TODO: Remove listing
        const listingId = e.target.name;
        fetch(`/api/listing/${listingId}`,{
            method:"DELETE"
        })
        .then(response => response.json())
        .then(results =>{
            if(results.status === "success"){
                // alert("Listing Deleted Successfully");
                // location.replace("/#/settings");
                history.push("/home");
            }
        }).catch(err => console.log(err))

    }
    function getOwnerListings(){
        fetch(`/api/listings/${auth.userId}`)
        .then(data => data.json())
        .then(data => data.listings)
        .then(data =>{setOwnerListings(data)})
        .catch(err =>console.log(err))
    }
    function handleChange(e){
        e.preventDefault();
        const event = e.target.name;
        switch(event){
            case "firstname":
                setFirstname(e.target.value);
                break;
            case "lastname":
                setLastname(e.target.value);
                break;
            case "email":
                setEmail(e.target.value);
                break;
            case "bio":
                setBio(e.target.value);
                break;
            case "age":
                setAge(e.target.value);
        }
    }
    function validChecker(){
        if(nameRegex.test(firstname)){
            firstNameMessage.current.innerHTML = "";
        }else firstNameMessage.current.innerHTML = "First name should only have alphabetical characters";

        if(nameRegex.test(lastname)){
            lastNameMessage.current.innerHTML = "";
        }else lastNameMessage.current.innerHTML = "Last name should only have alphabetical characters";

        if(emailRegex.test(email)){
            emailMessage.current.innerHTML = "";
        }else emailMessage.current.innerHTML = "Email format should be standard";
    }
    function checkAll(){
        let validateFirstname = nameRegex.test(firstname);
        let validateLastname = nameRegex.test(lastname);
        let validateEmail = emailRegex.test(email);
        if(validateFirstname && validateLastname && validateEmail){
            setAllValid(true);
        }else setAllValid(false);
    }
    function handleGender(e){
        let event = e.target.value;
        switch(event){
            case "male":
                setGender("male");
                break;
            case "female":
                setGender("female");
                break;
            case "other":
                setGender("other");
        }
    }
    function getOwnerInfo(){
        fetch(`/api/user/?user_id=${auth.userId}`)
        .then(data => data.json())
        .then(data => data.results)
        .then(data => {
            setFirstname(data.firstname);
            setLastname(data.lastname);
            setEmail(data.email);
            setGender(data.gender);
            setPets(data.pets);
            setSmoke(data.smoking);
            setEthnicity(data.ethnicity);
            setAge(data.age);
            setBio(data.biography);

        })
        .catch(err => console.log(err))
    }
    useEffect(()=>{
        validChecker();
        checkAll();
    }, [firstname, lastname, email]);

    useEffect(()=>{
        getOwnerListings();
        getOwnerInfo();
    },[]);
    // function renderOwnerListing(){
    //     if(ownerListings.length > 0){
    //         ownerListings.map((listing)=>{
    //             return<OwnerlistingComponent
    //                 listing = {listing}
    //                 handleRemove = {handleRemove}
    //                 showListingEdit = {showListingEdit}
    //             />
    //         })
    //     }
    // }
   

    return(
        <div className = "user-settings">
            <h1 style = {
               {
                textAlign: "center",
                position:"relative",
                top: "120px",
               }
           }>SFSU Software Engineering Project CSC 648-848, Fall 2021 Team 2. <br/> For Demonstration Only</h1>
            <div className = "update-form">
                <form enctype="multipart/form-data">
                    <label>Upload Profile</label>
                    <input ref = {profileRef} type = "file" name = "file" accept="image/*"></input>

                    <label>Change First Name:</label>
                    <input ref = {firstNameRef} type = "text" name = "firstname" placeholder = "Update First Name..." 
                        onChange = {handleChange} value = {firstname}></input>
                    <p ref = {firstNameMessage}></p>

                    <label>Change Last Name:</label>
                    <input ref = {lastNameRef} type = "text" name = "lastname" placeholder = "Update Last Name..." 
                        onChange = {handleChange} value = {lastname}></input>
                    <p ref = {lastNameMessage}></p>

                    <label>Change Email:</label>
                    <input ref = {emailRef}type = "text" name = "email" placeholder = "Update Email..." 
                        onChange = {handleChange} value = {email}></input>
                    <p ref = {emailMessage}></p>
                    <label>Age:</label>
                    <input ref = {ageRef} 
                        type = "number" 
                        name = "age" 
                        placeholder = "enter age..." 
                        value = {age}
                        onChange = {handleChange}
                        />
                    <label>Update Your Bio:</label>
                    <textarea
                        placeholder = "Add a bio..."
                        ref = {bioRef}
                        value = {bio}
                        name = "bio"
                        onChange = {handleChange}
                    />

                    <select ref = {ethnicRef} name = "update-ethnicity">
                    <option value = "">Update Ethnicity</option>
                        <option value = "American Indian" selected = {ethnicity === "American Indian"}>American Indian</option>
                        <option value = "East Asian" selected = {ethnicity === "East Asian"}>East Asian</option>
                        <option value = "Middle Eastern" selected = {ethnicity === "Middle Eastern"}>Middle Eastern</option>
                        <option value = "South Asian" selected = {ethnicity === "South Asian"}>South Asian</option>
                        <option value = "Black/African Descent" selected = {ethnicity === "Black/African Descent"}>Black/African Descent</option>
                        <option value = "Hispanic/Latino" selected = {ethnicity === "Hispanic/Latino"}>Hispanic/Latino</option>
                        <option value = "Pacific Islander" selected = {ethnicity === "Pacific Islander"}>Pacific Islander</option>
                        <option value = "White/Caucasian" selected = {ethnicity === "White/Caucasian"}>White/Caucasian</option>
                        <option value = "Other" selected = {ethnicity === "Other"}>Other</option>
                    </select><br/><br/>
                    <div className = "update-gender">
                        <label htmlFor = "male">Male</label>
                        <input id = "male-radio" value = "male" type = "radio" name = "update-gender" 
                            onClick = {handleGender} checked = {gender === "male"}/>

                        <label htmlFor = "female">Female</label>
                        <input id = "female-radio" value = "female" type = "radio" name = "update-gender"
                            onClick = {handleGender} checked = {gender === "female"}/>

                        <label htmlFor = "other">Other</label>
                        <input value = "other" type = "radio" name = "update-gender"
                            onClick = {handleGender} checked = {gender === "other"}/>
                    </div><br/>
                    <select ref = {petRef} name = "pets-update">
                        <option value = "">Update Pet Status</option>
                        <option value = "yes" selected = {pets === 1}>Has Pet(s)</option>
                        <option value = "no" selected = {pets === 0}>No Pet</option>
                    </select>
                    <select ref = {smokeRef} name = "smoking-update">
                        <option value = "">Update Smoking Habits</option>
                        <option value = "yes" selected = {smoke === 1}>Smoking</option>
                        <option value = "no" selected = {smoke === 0}>No Smoking</option>
                    </select><br/><br/>
                    <input type = "button" value = "Save Changes" onClick = {handleUpdate}/>
                </form>
            </div>
            <div className = "listings-uploaded" ref = {ListingsRef}>
                <EditListingModal 
                handleClose = {(close) =>setDisplayEdit(close)}
                display = {displayEdit}
                listingId = {targetListingId}
                listingContent = {listingContent}
                />
                {ownerListings.map(listing=>{
                    return <OwnerlistingComponent 
                    listing={listing}
                    handleRemove = {handleRemove}
                    showListingEdit = {showListingEdit}
                    />
                })}
                {/* {ownerListings.length && ownerListings.map(listing =>{
                    return <OwnerlistingComponent 
                    listing={listing}
                    handleRemove = {handleRemove}
                    showListingEdit = {showListingEdit}
                    />
                })} */}
                
            </div>
        </div>
    )
}

export default UserSettings;