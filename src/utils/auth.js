import Cookies from 'js-cookie'
// import storage from './storage'
const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
  // return storage.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
  // return storage.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
  // return storage.remove(TokenKey)
}
