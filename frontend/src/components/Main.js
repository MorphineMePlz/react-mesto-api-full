import { useContext } from "react";
import Card from "./Card";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Main({
  onEditAvatar,
  onEditProfile,
  onAddPlace,
  onHandleCardClick,
  cards,
  onCardLike,
  onCardDelete,
}) {
  const currentUser = useContext(CurrentUserContext);
  return (
    currentUser && (
      <main className="main">
        <section className="profile">
          <div className="profile__container">
            <div className="profile__image-container">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="profile__image"
              />
              <button
                type="button"
                className="profile__edit-button-avatar"
                onClick={onEditAvatar}
              ></button>
            </div>
            <div className="profile__info-container">
              <div className="profile__box">
                <h1 className="profile__title">{currentUser.name}</h1>
                <button
                  type="button"
                  className="profile__edit-button"
                  onClick={onEditProfile}
                ></button>
              </div>
              <p className="profile__profession">{currentUser.about}</p>
            </div>
          </div>
          <button
            type="button"
            className="profile__plus-button"
            onClick={onAddPlace}
          ></button>
        </section>
        <section className="gallery">
          <ul className="gallery__list">
            {cards.length > 0 &&
              cards.map((card) => (
                <Card
                  card={card}
                  key={card._id}
                  onCardClick={onHandleCardClick}
                  onCardLike={onCardLike}
                  onCardDelete={onCardDelete}
                />
              ))}
          </ul>
        </section>
      </main>
    )
  );
}

export default Main;
