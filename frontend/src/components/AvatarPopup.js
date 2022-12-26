import React from "react";
import PopupWithForm from "./PopupWithForm";

function AvatarPopup({ onClose, isOpen, onUpdateAvatar }) {
  const avatarRef = React.useRef("");

  function handleSubmit(evt) {
    evt.preventDefault();
    onUpdateAvatar({
      avatar: avatarRef.current.value,
    });
  }

  React.useEffect(() => {
    avatarRef.current.value = "";
  }, [isOpen]);

  return (
    <PopupWithForm
      isOpen={isOpen}
      onClose={onClose}
      name="change-avatar"
      title="Обновить аватар"
      textButton="Сохранить"
      onSubmit={handleSubmit}
      children={
        <label className="popup__field">
          <input
            className="popup__input popup__input_type_link"
            placeholder="Ссылка на картинку"
            required
            type="url"
            name="avatar"
            ref={avatarRef}
          />
          <span className="popup__error" id="avatar-error"></span>
        </label>
      }
    />
  );
}

export default AvatarPopup;
