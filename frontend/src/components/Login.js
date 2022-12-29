import { useState } from "react";

function Login({ onSubmit }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (evt) => {
    onSubmit(evt, { email, password });
  };

  return (
    <div className="authorization">
      <h2 className="authorization__heading">Вход</h2>
      <form className="authorization__form" onSubmit={handleSubmit}>
        <input
          type="email"
          className="authorization__input"
          placeholder="Email"
          onChange={(evt) => setEmail(evt.target.value)}
          value={email}
          required
        />
        <input
          type="password"
          className="authorization__input"
          placeholder="Пароль"
          onChange={(evt) => setPassword(evt.target.value)}
          value={password}
          required
        />
        <button
          type="submit"
          className="authorization__submit authorization__submit-button"
        >
          Войти
        </button>
      </form>
    </div>
  );
}

export default Login;
