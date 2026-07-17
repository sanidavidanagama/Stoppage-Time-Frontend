import axios from 'axios'
import Cookies from 'js-cookie'

const API_URL =
  window.__APP_CONFIG__?.API_URL ||
  import.meta.env.VITE_API_URL ||
  'http://localhost:8000'

const client = axios.create({
  baseURL: API_URL,
})

client.interceptors.request.use((config) => {
  const token = Cookies.get('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default client
