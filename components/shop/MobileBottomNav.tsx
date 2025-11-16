'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useCartStore } from '@/lib/store/cartStore'
import { useFavoritesStore } from '@/lib/store/favoritesStore'
import { useAuth } from '@/lib/contexts/AuthContext'
import { cn } from '@/lib/utils'

export function MobileBottomNav() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const cartItems = useCartStore((state) => state.items)
  const favoriteItems = useFavoritesStore((state) => state.items)
  const { user } = useAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  const totalCartItems = mounted ? cartItems.reduce((sum, item) => sum + item.quantity, 0) : 0
  const totalFavorites = mounted ? favoriteItems.length : 0

  // Hide on auth pages and admin pages
  if (pathname.startsWith('/giris') || pathname.startsWith('/kayit') || pathname.startsWith('/sifremi-unuttum') || pathname.startsWith('/sifre-sifirla') || pathname.startsWith('/admin')) {
    return null
  }

  const navItems = [
    {
      name: 'Ana Sayfa',
      href: '/',
      icon: (active: boolean) => (
        <svg className={cn("w-6 h-6", active ? "fill-current" : "fill-none")} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      name: 'Ürünler',
      href: '/urunler',
      icon: (active: boolean) => (
        <svg className={cn("w-6 h-6", active ? "fill-current" : "fill-none")} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      name: 'Sepet',
      href: '/sepet',
      icon: (active: boolean) => (
        <svg className={cn("w-6 h-6", active ? "fill-current" : "fill-none")} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      badge: totalCartItems,
    },
    {
      name: 'Favoriler',
      href: '/account/favorilerim',
      icon: (active: boolean) => (
        <svg className={cn("w-6 h-6", active ? "fill-current" : "fill-none")} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      badge: totalFavorites,
    },
    {
      name: user ? 'Hesabım' : 'Giriş',
      href: user ? '/account' : '/giris',
      icon: (active: boolean) => (
        <svg className={cn("w-6 h-6", active ? "fill-current" : "fill-none")} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-warm-100 shadow-lg safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all relative min-w-[60px]",
                isActive 
                  ? "text-sage" 
                  : "text-neutral-medium active:scale-95"
              )}
            >
              <div className="relative">
                {item.icon(isActive)}
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              <span className={cn(
                "text-[10px] font-medium transition-all",
                isActive ? "text-sage scale-105" : "text-neutral-medium"
              )}>
                {item.name}
              </span>
              {isActive && (
                <div className="absolute -top-[2px] left-1/2 -translate-x-1/2 w-12 h-1 bg-sage rounded-b-full" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

