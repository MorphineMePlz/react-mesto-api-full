import { useEffect, useState } from "react";
import mestoLogo from "../images/icons/logo.svg";
import { Link, useLocation } from "react-router-dom";

function Header({ handleLogout, currentUserEmail, isUserAuth }) {
  const [isLink, setLink] = useState("");
  const [isLinkText, setLinkText] = useState("");
  const [isDefaultRoute, setDefaultRoute] = useState(false);


  const location = useLocation();
  const currentLocation = location.pathname;

  useEffect(() => {
    switch (currentLocation) {
      case "/sign-up":
        setLink("/login");
        setLinkText("Войти");
        setDefaultRoute(false);
        break;
      case "/login":
        setLink("/sign-up");
        setLinkText("Регистрация");
        setDefaultRoute(false);
        break; 
      default:
        setLink("/");
        setLinkText("На главную");
        isUserAuth && setDefaultRoute(true);

    }
  }, [currentLocation, isUserAuth]);
  

  return (
    <header className="header">
      <a
        href="https://ya.ru"
        target="_blank"
        className="header__link"
        rel="noreferrer"
      >
        <img
          src={mestoLogo}
          className="header__logo"
          alt="Логотип проекта Mesto"
        />
      </a>
      <div className="header__container">
        {currentUserEmail && (
          <span className="header__email-container">{currentUserEmail}</span>
        )}
        {isDefaultRoute ? (
          <button className="header__button" onClick={handleLogout}>
            Выйти
          </button>
        ) : (
          <Link
            to={isLink}
            className="header__link-item"
          >
            {isLinkText}
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;
