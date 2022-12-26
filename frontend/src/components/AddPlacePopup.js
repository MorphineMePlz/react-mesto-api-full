import React from "react";
import PopupWithForm from "./PopupWithForm";

function AddPlacePopup({ onClose, isOpen, onAddPlace }) {
  const [name, setName] = React.useState("");
  const [link, setLink] = React.useState("");

  React.useEffect(() => {
    setName("");
    setLink("");
  }, [isOpen]);

  function handleNameChange(evt) {
    setName(evt.target.value);
  }

  function handleLinkChange(evt) {
    setLink(evt.target.value);
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    onAddPlace({
      name,
      link,
    });
  }

  return (
    <PopupWithForm
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      name="popup_new-place"
      title="Новое место"
      textButton="Создать"
      children={
        <>
          <label className="popup__field">
            <input
              type="text"
              className="popup__input popup__input_type_place"
              placeholder="Название"
              required
              minLength="2"
              maxLength="30"
              name="place"
              onChange={handleNameChange}
              value={name || ""}
            />
            <span className="popup__error" id="place-error"></span>
          </label>
          <label className="popup__field">
            <input
              className="popup__input popup__input_type_link"
              placeholder="Ссылка на картинку"
              required
              type="url"
              name="link"
              onChange={handleLinkChange}
              value={link || ""}
            />
            <span className="popup__error" id="link-error"></span>
          </label>
        </>
      }
    />
  );
}

export default AddPlacePopup;
