'use client'

import { AuthProvider } from '@/lib/contexts/AuthContext'
import { ToastProvider } from '@/components/ui'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <ToastProvider>{children}</ToastProvider>
    </AuthProvider>
  )
}

