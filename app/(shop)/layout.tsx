'use client'

import { SessionProvider } from 'next-auth/react'
import { ParallaxProvider } from 'react-scroll-parallax'
import { AuthProvider } from '@/lib/contexts/AuthContext'
import { Header } from '@/components/shop/Header'
import { Footer } from '@/components/shop/Footer'
import { TrustBadges } from '@/components/shop/TrustBadges'
import { MobileBottomNav } from '@/components/shop/MobileBottomNav'
import { ToastProvider } from '@/components/ui'

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <AuthProvider>
        <ToastProvider>
          <ParallaxProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1 pb-24 md:pb-0">{children}</main>
              <TrustBadges />
              <Footer />
              <MobileBottomNav />
            </div>
          </ParallaxProvider>
        </ToastProvider>
      </AuthProvider>
    </SessionProvider>
  )
}

