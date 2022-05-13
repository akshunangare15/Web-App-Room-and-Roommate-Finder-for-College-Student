import React from 'react';

import './Modal.css';

const Modal = React.memo(props => {
  return (
    <React.Fragment>
      <div className="backdrop" onClick={props.onClose} />
      <div className="modal">
        <h2>{props.title}</h2>
        <p>{props.message}</p>
        <div className="modal__actions">
          <button type="button" onClick={props.onClose}>
            Okay
          </button>
        </div>
      </div>
    </React.Fragment>
  );
});

export default Modal;
