'use client'

import { SessionProvider } from 'next-auth/react'
import { AuthProvider } from '@/lib/contexts/AuthContext'
import { ToastProvider } from '@/components/ui'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <AuthProvider>
        <ToastProvider>{children}</ToastProvider>
      </AuthProvider>
    </SessionProvider>
  )
}
