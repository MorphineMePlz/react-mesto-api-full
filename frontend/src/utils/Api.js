import { BASE_URL } from "./constants";

class Api {
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

  getUserInformation() {
    return fetch(`${this._address}/users/me`, {
      // method: "GET",
      credentials: 'include',
      headers: this._headers,
    }).then((res) => this.handleResponse(res));
  }

  getInitialCards() {
    return fetch(`${this._address}/cards`, {
      // method: "GET",
      credentials: 'include',
      headers: this._headers,
    }).then((res) => this.handleResponse(res));
  }

  editUserInformation({ about, name }) {
    return fetch(`${this._address}/users/me`, {
      method: "PATCH",
      credentials: 'include',
      headers: this._headers,
      body: JSON.stringify({
        name,
        about: about,
      }),
    }).then((res) => this.handleResponse(res));
  }

  addNewCard({ name, link }) {
    return fetch(`${this._address}/cards`, {
      method: "POST",
      credentials: 'include',
      headers: this._headers,
      body: JSON.stringify({
        name,
        link,
      }),
    }).then((res) => this.handleResponse(res));
  }

  deleteOwnCard(id) {
    return fetch(`${this._address}/cards/${id}`, {
      method: "DELETE",
      credentials: 'include',
      headers: this._headers,
    }).then((res) => this.handleResponse(res));
  }

  likeCard(id) {
    return fetch(`${this._address}/cards/${id}/likes`, {
      method: "PUT",
      credentials: 'include',
      headers: this._headers,
    }).then((res) => this.handleResponse(res));
  }

  removeCardLike(id) {
    return fetch(`${this._address}/cards/${id}/likes`, {
      method: "DELETE",
      credentials: 'include',
      headers: this._headers,
    }).then((res) => this.handleResponse(res));
  }

  changeLikeCardStatus(cardId, isNotLiked) {
    return fetch(`${this._address}/cards/${cardId}/likes`, {
      method: isNotLiked ? "PUT" : "DELETE",
      credentials: 'include',
      headers: this._headers,
    }).then((res) => this.handleResponse(res));
  }

  changeAvatar(data) {
    return fetch(`${this._address}/users/me/avatar`, {
      method: "PATCH",
      credentials: 'include',
      headers: this._headers,
      body: JSON.stringify({
        avatar: data.avatar,
      }),
    }).then((res) => this.handleResponse(res));
  }
}

export const api = new Api({
  baseUrl: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  },
});
