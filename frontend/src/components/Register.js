import { useState } from "react";
import { Link } from "react-router-dom";

function Register({ onSubmit }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (evt) => {
    onSubmit(evt, {
      email,
      password,
    });
  };
  return (
    <div className="authorization">
      <h2 className="authorization__heading">Регистрация</h2>
      <form className="authorization__form" onSubmit={handleSubmit}>
        <input
          type="email"
          className="authorization__input"
          placeholder="Email"
          required
          onChange={(evt) => setEmail(evt.target.value)}
          value={email}
        />
        <input
          type="password"
          className="authorization__input"
          placeholder="Пароль"
          required
          onChange={(evt) => setPassword(evt.target.value)}
          value={password}
        />
        <button type="submit" className="authorization__submit">
          Зарегистрироваться
        </button>
        <Link to="/login" className="authorization__link">
          Уже зарегистрированы? Войти
        </Link>
      </form>
    </div>
  );
}

export default Register;
