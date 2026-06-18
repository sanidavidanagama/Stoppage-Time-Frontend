import axios from 'axios'
import Cookies from 'js-cookie'

const API_URL = window.configs?.apiUrl || import.meta.env.VITE_API_URL

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