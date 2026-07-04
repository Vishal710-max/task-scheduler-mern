import axios from 'axios'

// Set VITE_API_URL in a .env file at the project root, e.g.
// VITE_API_URL=http://localhost:5000/api        (development)
// VITE_API_URL=https://your-backend.onrender.com/api   (production)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Attach the JWT token (if present) to every outgoing request
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'))
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
})

// If the token is invalid/expired, log the user out automatically
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user')
    }
    return Promise.reject(error)
  }
)

export default api
