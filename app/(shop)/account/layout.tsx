'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/contexts/AuthContext'

const menuItems = [
  { icon: '🏠', label: 'Hesap Özeti', href: '/account' },
  { icon: '📦', label: 'Siparişlerim', href: '/account/siparislerim' },
  { icon: '📍', label: 'Adreslerim', href: '/account/adreslerim' },
  { icon: '❤️', label: 'Favorilerim', href: '/account/favorilerim' },
  { icon: '👤', label: 'Profil', href: '/account/profil' },
]

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isLoading, logout } = useAuth()

  useEffect(() => {
    if (!isLoading && !user) router.push('/giris')
  }, [user, isLoading, router])

  if (isLoading || !user) return null

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-warm-50">
      <div className="container mx-auto px-4 py-6 md:py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-h1 font-serif font-bold text-neutral mb-1">
              Hesabım
            </h1>
            <p className="text-sm text-neutral-medium">
              Hoş geldiniz, <span className="font-medium text-sage">{user.name}</span>
            </p>
          </div>

          {/* Mobil: Yatay kaydırmalı menü */}
          <div className="lg:hidden mb-4 -mx-4 px-4">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {menuItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap text-sm font-medium transition-all shrink-0 ${
                      isActive
                        ? 'bg-sage text-white shadow-button'
                        : 'bg-white text-neutral-medium hover:text-sage border border-warm-100'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                )
              })}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap text-sm font-medium bg-white text-danger border border-warm-100 shrink-0"
              >
                <span>🚪</span>
                <span>Çıkış</span>
              </button>
            </div>
          </div>

          {/* Desktop: Sol sidebar + sağ içerik */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Sol Sidebar — sadece desktop */}
            <aside className="hidden lg:block lg:col-span-3">
              <div className="bg-white rounded-card shadow-soft p-6 sticky top-24">
                <nav className="space-y-1">
                  {menuItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-sage/10 to-rose/5 text-sage font-semibold border-l-4 border-sage pl-3.5'
                            : 'text-neutral-medium hover:bg-warm-50 hover:text-sage border-l-4 border-transparent hover:border-warm-200'
                        }`}
                      >
                        <span className="text-xl">{item.icon}</span>
                        <span className="text-sm">{item.label}</span>
                      </Link>
                    )
                  })}

                  <div className="pt-4 mt-4 border-t border-warm-100">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-danger hover:bg-danger/5 transition-all w-full text-left text-sm"
                    >
                      <span className="text-xl">🚪</span>
                      <span>Çıkış Yap</span>
                    </button>
                  </div>
                </nav>
              </div>
            </aside>

            {/* İçerik Alanı */}
            <main className="lg:col-span-9">
              <div className="bg-white rounded-card shadow-soft p-4 md:p-8">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}
