import { useContext } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Card({ card, onCardClick, onCardLike, onCardDelete }) {
  const currentUser = useContext(CurrentUserContext);
  const isOwn = card.owner === currentUser._id;
  const cardDeleteButtonClassName = `gallery__delete-button ${
    isOwn ? "gallery__delete-button_visible" : "gallery__delete-button_hidden"
  }`;
  const isLiked = card.likes.some((i) => i === currentUser._id);
  const cardLikeButtonClassName = `gallery__like-button ${
    isLiked ? "gallery__like-button_active" : " "
  }`;

  return (
    <li className="gallery__list-item">
      <button
        className={cardDeleteButtonClassName}
        onClick={() => onCardDelete(card)}
      ></button>
      <div className="gallery__image-container">
        <img
          src={card.link}
          alt={card.name}
          className="gallery__image"
          onClick={() => onCardClick(card)}
        />
      </div>
      <div className="gallery__content">
        <h2 className="gallery__title">{card.name || "Загрузка..."}</h2>
        <div className="gallery__like-container">
          <button
            type="button"
            className={cardLikeButtonClassName}
            onClick={() => onCardLike(card)}
          ></button>
          <span className="gallery__like-count">{card.likes.length}</span>
        </div>
      </div>
    </li>
  );
}

export default Card;
