import React from "react";
import PopupWithForm from "./PopupWithForm";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function ProfilePopup({ onClose, isOpen, onUpdateUser }) {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");

  const currentUser = React.useContext(CurrentUserContext);

  React.useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser]);

  function handleNameChange(evt) {
    setName(evt.target.value);
  }

  function handleDescriptionChange(evt) {
    setDescription(evt.target.value);
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    onUpdateUser({
      name,
      about: description,
    });
  }

  return (
    <PopupWithForm
      name="popup_profile"
      title="Редактировать профиль"
      textButton="Сохранить"
      onSubmit={handleSubmit}
      isOpen={isOpen}
      onClose={onClose}
      children={
        <>
          <label className="popup__field">
            <input
              type="text"
              className="popup__input popup__input_type_name"
              placeholder="Имя"
              minLength="2"
              maxLength="40"
              required
              name="name"
              value={name || ""}
              onChange={handleNameChange}
            />

            <span className="popup__error" id="name-error"></span>
          </label>
          <label className="popup__field">
            <input
              type="text"
              className="popup__input popup__input_type_prof"
              placeholder="Профессия"
              minLength="2"
              maxLength="200"
              required
              name="job"
              value={description || ""}
              onChange={handleDescriptionChange}
            />
            <span className="popup__error" id="job-error"></span>
          </label>
        </>
      }
    />
  );
}

export default ProfilePopup;
