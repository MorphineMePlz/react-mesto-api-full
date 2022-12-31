export const BASE_URL = "http://localhost:3000";

class AuthApi {
  constructor(setting) {
    this._address = setting.baseUrl;
    this._headers = setting.headers;
  }

  handleResponse(res) {
    if (!res.ok) {
      return Promise.reject(`Ошибка: ${res.status} - ${res.statusText}`);
    }
    return res.json();
  }

  signUp({ email, password }) {
    return fetch(`${this._address}/signup`, {
      method: "POST",
      credentials: 'include',
      mode: "cors",
      headers: this._headers,
      body: JSON.stringify({
        email,
        password,
      }),
    }).then((res) => this.handleResponse(res));
  }

  signIn({ email, password }) {
    return fetch(`${this._address}/signin`, {
      method: "POST",
      credentials: 'include',
      mode: "cors",
      headers: this._headers,
      body: JSON.stringify({
        email,
        password,
      }),
    }).then((res) => this.handleResponse(res));
  }

  logout = () => {
    return fetch(`${BASE_URL}/logout`, {
      method: "POST",
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => this.handleResponse(res));
  }
  
  checkTokenValidity = () => {
    return fetch(`${BASE_URL}/users/me`, {
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => this.handleResponse(res));
  }
}

export const authApi = new AuthApi({
  baseUrl: BASE_URL,
  credentials: 'include',
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});



