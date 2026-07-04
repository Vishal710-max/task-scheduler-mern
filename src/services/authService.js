import api from './api'

const USER_KEY = 'user'

export const register = async ({ name, email, password }) => {
  const { data } = await api.post('/auth/register', { name, email, password })
  localStorage.setItem(USER_KEY, JSON.stringify(data))
  return data
}

export const login = async ({ email, password }) => {
  const { data } = await api.post('/auth/login', { email, password })
  localStorage.setItem(USER_KEY, JSON.stringify(data))
  return data
}

export const logout = () => {
  localStorage.removeItem(USER_KEY)
}

export const getCurrentUser = () => {
  const stored = localStorage.getItem(USER_KEY)
  return stored ? JSON.parse(stored) : null
}
