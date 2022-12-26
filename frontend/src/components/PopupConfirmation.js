import React from "react";
import PopupWithForm from "./PopupWithForm";

function PopupConfirmation({ onClose }) {
  return (
    <PopupWithForm
      onClose={onClose}
      name="popup_confirmation "
      title="Вы уверены?"
      textButton="Да"
    />
  );
}

export default PopupConfirmation;
