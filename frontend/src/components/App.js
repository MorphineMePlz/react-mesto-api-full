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
import { useCallback } from "react";

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

  const navigate = useNavigate();

  const checkToken = useCallback(() => {
    const token = localStorage.getItem("jwt");

    if (token) {
      authApi
        .checkTokenValidity(token)
        .then((res) => {
          setUserAuth(true);
          setCurrentUserEmail(res.data.email);
        })
        .catch(() => {
          setUserAuth(false);
        });
    }
  }, []);

  useEffect(() => {
    Promise.all([api.getUserInformation(), api.getInitialCards()])
      .then(([userData, initialCards]) => {
        localStorage.setItem("userId", userData._id);
        setCurrentUser(userData);
        setCards(initialCards);
        checkToken();
      })
      .catch(() => {
        setCurrentUser(null);
        setUserAuth(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isUserAuth) {
      checkToken();
      navigate("/");
    }
  }, [checkToken, isUserAuth, navigate]);

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
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
          state.filter((c) => (c._id === card._id ? false : true))
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
      .then(() => {
        setRequestFailed(false);
        setTooltipOpen(true);
        setTimeout(() => {
          navigate("/login");
          setTooltipOpen(false);
        }, NAVIGATION_DELAY);
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
      .then((res) => {
        localStorage.setItem("jwt", res.token);
        setUserAuth(true);
      })
      .catch(() => {
        setRequestFailed(true);
        setTooltipOpen(true);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("jwt");
    setCurrentUserEmail(null);
    setUserAuth(false);
    navigate("/login");
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
