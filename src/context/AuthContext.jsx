import { useState, useCallback } from 'react'
import * as authService from '../services/authService'
import { AuthContext } from './authContextObject'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getCurrentUser())

  const login = useCallback(async (credentials) => {
    const data = await authService.login(credentials)
    setUser(data)
    return data
  }, [])

  const register = useCallback(async (details) => {
    const data = await authService.register(details)
    setUser(data)
    return data
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
