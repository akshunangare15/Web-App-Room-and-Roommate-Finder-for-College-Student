import React,{useRef, useEffect,useState} from "react";
import "./index.css";

const UserFilter = (props)=> {
    let[ethnicity, setEthnicity] = useState("");
    let[gender, setGender] = useState("all-gender");
    let[smoking, setSmoking] = useState(null);
    let[pet, setPet] = useState(null);
    let [contents, setContents] = useState([]);

    useEffect(()=>{
        fetch(`/api/user/advancedSearch?ethnicity=${ethnicity}&gender=${gender}&smoking=${smoking}&pets=${pet}`)
        .then(data => data.json())
        .then(data=>data.results)
        .then(data=>setContents(data)) 
    },[ethnicity, gender, smoking, pet])

    return(
            <div className = "filter">
                <form className = "filter-form" /*action = "/user/advancedSearch" method = "GET"*/>
                    <div id = "ethnic-filter">
                        <select name = "ethnicity" onChange = {(event)=>setEthnicity(event.target.value)}>
                            <option value = "">Filter Ethnicity...</option>
                            <option value = "American Indian">American Indian</option>
                            <option value = "East Asian">East Asian</option>
                            <option value = "Middle Eastern">Middle Eastern</option>
                            <option value = "South Asian">South Asian</option>
                            <option value = "Black/African Descent">Black/African Descent</option>
                            <option value = "Hispanic/Latino">Hispanic/Latino</option>
                            <option value = "Pacific Islander">Pacific Islander</option>
                            <option value = "White/Caucasian">White/Caucasian</option>
                            <option value = "Other">Other</option>
                        </select>
                    </div>
                    <div id = "gender-filter">
                        <label htmlFor = "male">Male</label>
                        <input id = "male-radio" value = "male" type = "radio" name = "gender" onChange = {(event)=>setGender(event.target.value)}/>

                        <label htmlFor = "female">Female</label>
                        <input id = "female-radio" value = "female" type = "radio" name = "gender" onChange = {(event)=>setGender(event.target.value)}/>

                        <label htmlFor = "all-gender">All</label>
                        <input id = "all-gender" value = "all-gender" type = "radio" name = "gender" defaultChecked onChange = {(event)=>setGender(event.target.value)}/>
                    </div>
                    <div id = "pet-filter">
                        <select name = "pets" onChange = {(event)=>setPet(event.target.value)}>
                            <option value = "">Pets?</option>
                            <option value = "1">Has Pet(s)</option>
                            <option value = "0">No Pet</option>
                        </select>
                    </div>
                    <div id = "smoking-filter">
                        <select name = "smoking" onChange = {(event)=>setSmoking(event.target.value)}>
                            <option value = "">Smoke?</option>
                            <option value = "1">Smoking</option>
                            <option value = "0">No Smoking</option>
                        </select>
                    </div>
                    
                </form>
                <div className = "filter-btn">
                        <button htmlFor = "filter-form" onClick = {()=>props.handleFilter(contents)}type = "submit">Filter</button>
                </div>
            </div>
    )
}
export default UserFilter;