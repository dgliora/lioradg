'use client'

import { ParallaxProvider } from 'react-scroll-parallax'
import { AuthProvider } from '@/lib/contexts/AuthContext'
import { Header } from '@/components/shop/Header'
import { Footer } from '@/components/shop/Footer'
import { TrustBadges } from '@/components/shop/TrustBadges'
import { ToastProvider } from '@/components/ui'

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <ToastProvider>
        <ParallaxProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">{children}</main>
            <TrustBadges />
            <Footer />
          </div>
        </ParallaxProvider>
      </ToastProvider>
    </AuthProvider>
  )
}

