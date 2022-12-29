export const BASE_URL = "https://auth.nomoreparties.co";

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
    console.log(this._address);
    return fetch(`${this._address}/signup`, {
      method: "POST",
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
      mode: "cors",
      headers: this._headers,
      body: JSON.stringify({
        email,
        password,
      }),
    }).then((res) => this.handleResponse(res));
  }

  checkTokenValidity(userToken) {
    return fetch(`${BASE_URL}/users/me`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    }).then((res) => this.handleResponse(res));
  }
}

export const authApi = new AuthApi({
  baseUrl: BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});
