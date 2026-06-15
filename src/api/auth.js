import client from './client'
import Cookies from 'js-cookie'

export const login = async ({ username, password }) => {
  const params = new URLSearchParams({ username, password })
  const { data } = await client.post('/auth/login', params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
  Cookies.set('access_token', data.access_token, { expires: 7 })
  return data
}

export const logout = () => Cookies.remove('access_token')
