import { useState, useEffect } from "react";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import AvatarPopup from "./AvatarPopup";
import ProfilePopup from "./ProfilePopup";
import AddPlacePopup from "./AddPlacePopup";
import PopupConfirmation from "./PopupConfirmation";
import ImagePopup from "./ImagePopup";
import Login from "./Login";
import Register from "./Register";
import InfoTooltip from "./InfoTooltip";
import ProtectedRoute from "../hoc/ProtectedRoute";
import { DEFAULT_CARD } from "../utils/constants";
import { api } from "../utils/Api";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { authApi } from "../utils/AuthApi";

const NAVIGATION_DELAY = 2000;

function App() {
  // modals
  const [isTooltipOpen, setTooltipOpen] = useState(false);
  const [isImagePopupOpen, setImagePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const [isConfirmationPopupOpen, setConfirmationPopupOpen] = useState(false);

  const [cards, setCards] = useState([]);
  const [isUserAuth, setUserAuth] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [isRequestFailed, setRequestFailed] = useState(false);
  const [selectedCard, setSelectedCard] = useState(DEFAULT_CARD);
  const [currentUser, setCurrentUser] = useState(null);

  const history = useNavigate()

  useEffect(() => {
    authApi
      .checkTokenValidity()
      .then((data) => {
        if(data) {
        setUserAuth(true)
        setCurrentUser(data)
        history('/')
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }, [history, isUserAuth])


  useEffect(() => {
    if (isUserAuth) {
      Promise.all([api.getUserInformation(), api.getInitialCards()])
      .then(([userData, initialCards]) => {
        setUserAuth(true)
        setCurrentUserEmail(userData.email)
        setCurrentUser(userData);
        setCards(initialCards);
        history('/')
      })
      .catch(() => {
        setCurrentUser(null);
        setUserAuth(false);
      });
    }
  }, [history, isUserAuth]);







  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i === currentUser._id);
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleCardDelete(card) {
    api
      .deleteOwnCard(card._id)
      .then(() => {
        setCards((state) =>
        state.filter((c) => (c._id !== card._id))
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleUpdateUser(newData) {
    api
      .editUserInformation(newData)
      .then((userData) => {
        setCurrentUser(userData);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleUpdateAvatar(newData) {
    api
      .changeAvatar(newData)
      .then((userData) => {
        setCurrentUser(userData);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleAddPlaceSubmit(newData) {
    api
      .addNewCard(newData)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleCardClick(card) {
    setSelectedCard(card);
    setImagePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setEditAvatarPopupOpen(true);
  }

  function closeAllPopups() {
    setEditAvatarPopupOpen(false);
    setEditProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    setConfirmationPopupOpen(false);
    setImagePopupOpen(false);
    setTooltipOpen(false);
    setSelectedCard(DEFAULT_CARD);
  }

  function handleEditProfileClick() {
    setEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setAddPlacePopupOpen(true);
  }

  const handleRegestration = (evt, { email, password }) => {
    evt.preventDefault();
    authApi
      .signUp({ email, password })
      .then((res) => {
        if (res.statusCode !== 400) {
          setRequestFailed(false);
          setTooltipOpen(true);
          setTimeout(() => {
            history("/login");
            setTooltipOpen(false);
          }, NAVIGATION_DELAY);
        }
      })
      .catch(() => {
        setRequestFailed(true);
        setTooltipOpen(true);
      });
  };

  const handleLogin = (evt, { email, password }) => {
    evt.preventDefault();
    authApi
      .signIn({ email, password })
      .then(() => {
        setCurrentUserEmail(email)
        setUserAuth(true);
        history('/')
      })
      .catch((err) => {
        setRequestFailed(true);
        setTooltipOpen(true);
        console.log(err)
      });
  };

  const handleLogout = () => {
    authApi
    .logOut()
    .then((res) => {
      setCurrentUserEmail(null);
      setUserAuth(false);
      history("/login");
    })
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header
          handleLogout={handleLogout}
          currentUserEmail={currentUserEmail}
          isUserAuth={isUserAuth}
        />
        <Routes>
          <Route
            path="/"
            exact
            element={
              <ProtectedRoute isUserAuth={isUserAuth}>
                <Main
                  onEditAvatar={handleEditAvatarClick}
                  onEditProfile={handleEditProfileClick}
                  onAddPlace={handleAddPlaceClick}
                  onHandleCardClick={handleCardClick}
                  cards={cards}
                  onCardLike={handleCardLike}
                  onCardDelete={handleCardDelete}
                />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path="/sign-up"
            element={<Register onSubmit={handleRegestration} />}
          />
          <Route
            path="*"
            element={
              isUserAuth ? <Navigate to="/" /> : <Navigate to="/login" />
            }
          />
          <Route
            exact
            path="/login"
            element={<Login onSubmit={handleLogin} />}
          />
        </Routes>

        <Footer />
        <ImagePopup
          onClose={closeAllPopups}
          card={selectedCard}
          isOpen={isImagePopupOpen}
        />
        <PopupConfirmation
          isOpen={isConfirmationPopupOpen}
          onClose={closeAllPopups}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
        />
        <ProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />
        <AvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />

        <InfoTooltip
          isOpen={isTooltipOpen}
          onClose={closeAllPopups}
          isRequestFailed={isRequestFailed}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
