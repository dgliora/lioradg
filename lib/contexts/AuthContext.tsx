'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useSession, signOut } from 'next-auth/react'

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
  login: (user: User) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const isLoading = status === 'loading'
  const user: User | null = session?.user
    ? {
        id: (session.user as any).id ?? '',
        name: session.user.name ?? '',
        email: session.user.email ?? '',
        role: (session.user as any).role ?? 'USER',
      }
    : null

  const login = () => {}
  const logout = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

