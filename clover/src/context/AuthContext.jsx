import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import * as authApi from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadUser = useCallback(async () => {
    if (!authApi.isLoggedIn()) {
      setUser(null)
      setLoading(false)
      return
    }
    try {
      const me = await authApi.fetchMe()
      setUser(me)
    } catch {
      authApi.logout()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  const login = useCallback(async (credentials) => {
    await authApi.login(credentials)
    await loadUser()
  }, [loadUser])

  const register = useCallback(async (payload) => {
    await authApi.register(payload)
    await authApi.login({ username: payload.username, password: payload.password })
    await loadUser()
  }, [loadUser])

  const logout = useCallback(() => {
    authApi.logout()
    setUser(null)
  }, [])

  const value = { user, loading, isAuthenticated: Boolean(user), login, register, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
