import React, {forwardRef} from "react";
import "./index.css";

const Search = ({onClick, placeholder}, ref) => {
    return (
        <div className = "search">
                <input name = "search" id = "search-text" type = "text" ref = {ref} placeholder = {placeholder}/>
                {/* <button id = "search-button" onClick= {onClick}>Search</button> */}
                <input type = "button" id = "search-button" onClick = {onClick} value = "Search" />
        </div>
    )
};  
const forwardSearch = React.forwardRef(Search);
export default forwardSearch;
