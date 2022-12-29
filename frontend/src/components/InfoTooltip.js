import { useMemo } from "react";
import error from "../images/icons/error.svg";
import success from "../images/icons/success.svg";

function InfoTooltip({ isOpen, onClose, isRequestFailed }) {
  const modalContentData = useMemo(() => {
    if (!isRequestFailed) {
      return {
        image: success,
        text: "Вы успешно зарегистрировались!",
      };
    } else {
      return {
        image: error,
        text: "Что-то пошло не так! Попробуйте ещё раз.",
      };
    }
  }, [isRequestFailed]);

  return (
    <div className={`popup ${isOpen ? " popup_active " : " "}`}>
      <div className="popup__tooltip">
        <img
          src={modalContentData.image}
          alt="name"
          className="popup__tooltip-image"
        />
        <button
          type="button"
          className="popup__close-button"
          onClick={onClose}
        />
        <h3 className="popup__tooltip-heading">{modalContentData.text}</h3>
      </div>
    </div>
  );
}

export default InfoTooltip;
