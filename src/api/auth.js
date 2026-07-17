import client from './client'
import Cookies from 'js-cookie'

const TOKEN_COOKIE = 'access_token'

// Decode the JWT payload to read its own `exp` claim, so the cookie
// expiry actually matches the token's real lifetime (JWT_EXPIRE_DAYS is a
// server-side setting we don't know client-side).
function jwtExpiryDate(token) {
  try {
    const payload = token.split('.')[1]
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    )
    const { exp } = JSON.parse(json)
    return exp ? new Date(exp * 1000) : null
  } catch {
    return null
  }
}

export async function login(username, password) {
  const params = new URLSearchParams({ username, password })
  const { data } = await client.post('/api/auth/login', params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
  const expires = jwtExpiryDate(data.access_token)
  Cookies.set(TOKEN_COOKIE, data.access_token, expires ? { expires } : { expires: 6 })
  return data
}

export function logout() {
  Cookies.remove(TOKEN_COOKIE)
}

export function isAuthenticated() {
  return !!Cookies.get(TOKEN_COOKIE)
}
