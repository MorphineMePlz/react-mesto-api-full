import React from "react";

function ImagePopup({ card, isOpen, onClose }) {
  return (
    <div className={`popup ${isOpen ? "popup_active" : ""}`}>
      <div className="popup__image-container">
        <img src={card.link} alt={card.name} className="popup__image-place" />
        <p className="popup__image-title">{card.name}</p>
        <button
          type="button"
          className="popup__close-button"
          onClick={onClose}
        ></button>
      </div>
    </div>
  );
}

export default ImagePopup;
