import axios from 'axios'
import Cookies from 'js-cookie'

const API_URL = 'https://17eeed1a-8826-4d97-86c4-ec780162a899-dev.e1-us-east-azure.choreoapis.dev/stoppage-time/backend/v1.0'

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