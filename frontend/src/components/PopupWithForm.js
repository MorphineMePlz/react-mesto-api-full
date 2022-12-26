import React from "react";
function PopupWithForm({
  name,
  title,
  onClose,
  isOpen,
  children,
  textButton,
  onSubmit,
}) {
  return (
    <div className={`popup popup_${name} ${isOpen && "popup_active"}`}>
      <div className="popup__container">
        <h2 className="popup__title">{title}</h2>
        <form
          className={`popup__form popup__form_${name}`}
          noValidate
          onSubmit={onSubmit}
        >
          {children}
          <button type="submit" className="popup__submit-button">
            {textButton}
          </button>
        </form>
        <button
          type="button"
          className="popup__close-button"
          onClick={onClose}
        ></button>
      </div>
    </div>
  );
}

export default PopupWithForm;
