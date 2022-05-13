import React, {useRef, useEffect,useState} from "react";

import "./Modal.css";

const ImageModal = ({img, display, handleClose})=>{
    const displayStyle = display? "block": "none";
    const modalRef = useRef();
    const style = {
        display: `${displayStyle}`
    }
    return(
        <div className = "image-modal" style = {style} ref = {modalRef}>
            <div className = "modal-container">
                <h3 onClick = {()=> handleClose(false)}>Close</h3>
                <img src = {img} className = "modal-content" width = "1000" height = "600"/>
            </div>
        </div>
    )
}
export default ImageModal;