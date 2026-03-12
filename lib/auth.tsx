"use client"

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { authAPI } from './api'

interface User {
  id: number
  username: string
  email?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  register: (username: string, password: string, email: string, otp: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    try {
      if (authAPI.isAuthenticated()) {
        const data = await authAPI.getMe()
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    }
  }, [])

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true)
      const storedUser = authAPI.getUser()
      if (storedUser) {
        setUser(storedUser)
      }
      if (authAPI.isAuthenticated()) {
        try {
          await refreshUser()
        } catch {
          // Token might be invalid
        }
      }
      setIsLoading(false)
    }

    initAuth()
  }, [refreshUser])

  const login = async (username: string, password: string) => {
    const data = await authAPI.login(username, password)
    setUser(data.user)
  }

  const register = async (username: string, password: string, email: string, otp: string) => {
    const data = await authAPI.register(username, password, email, otp)
    setUser(data.user)
  }

  const logout = () => {
    // Clear user state and redirect immediately (instant)
    setUser(null)
    authAPI.clearUser()
    router.push('/login')
    // Fire backend logout in background (non-blocking)
    authAPI.logout().catch((err) =>
      console.error('Background logout failed:', err)
    )
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuth()

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        window.location.href = '/login'
      }
    }, [isAuthenticated, isLoading])

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )
    }

    if (!isAuthenticated) {
      return null
    }

    return <Component {...props} />
  }
}
