'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui'
import { useCartStore } from '@/lib/store/cartStore'
import { useFavoritesStore } from '@/lib/store/favoritesStore'
import { useAuth } from '@/lib/contexts/AuthContext'
import { MiniCart } from './MiniCart'
import { LogoLioraDG } from '@/components/LogoLioraDG'
import { ActiveCampaignsBanner } from './ActiveCampaignsBanner'

type Category = {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  order: number
}

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [contactInfo, setContactInfo] = useState({
    phone: '+90 530 208 47 47',
    email: 'info@lioradg.com.tr',
    instagram: 'https://instagram.com/lioradg',
  })
  const cartItems = useCartStore((state) => state.items)
  const favoriteItems = useFavoritesStore((state) => state.items)
  const { user } = useAuth()

  useEffect(() => {
    setMounted(true)
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Kategorileri API'den çek
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        if (response.ok) {
          const data = await response.json()
          setCategories(data)
        }
      } catch (error) {
        console.error('Kategoriler yüklenirken hata:', error)
      }
    }
    
    // İletişim bilgilerini API'den çek
    const fetchContactInfo = async () => {
      try {
        const response = await fetch('/api/settings/contact', { cache: 'no-store' })
        if (response.ok) {
          const data = await response.json()
          setContactInfo(data)
        }
      } catch (error) {
        console.error('İletişim bilgileri yüklenirken hata:', error)
      }
    }
    
    fetchCategories()
    fetchContactInfo()
  }, [])

  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalFavorites = favoriteItems.length

  return (
    <header className="sticky top-0 z-40 bg-white">
      {/* Kampanyalar Banner */}
      <ActiveCampaignsBanner />

      {/* Top Bar */}
      <div className="bg-sage text-white border-b border-sage-dark/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-9 text-xs">
            {/* Left: Contact Info */}
            <div className="flex items-center gap-4">
              <a href={`tel:${contactInfo.phone.replace(/\s/g, '')}`} className="flex items-center gap-1.5 hover:text-warm-100 transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {contactInfo.phone}
              </a>
              <span className="hidden sm:inline text-white/40">|</span>
              <a href={`mailto:${contactInfo.email}`} className="hidden sm:flex items-center gap-1.5 hover:text-warm-100 transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {contactInfo.email}
              </a>
            </div>
            
            {/* Right: Links & Social */}
            <div className="flex items-center gap-4">
              <Link href="/siparis-takip" className="hover:text-warm-100 transition-colors">
                Sipariş Takip
              </Link>
              <Link href="/iletisim" className="hover:text-warm-100 transition-colors">
                İletişim
              </Link>
              <a href={contactInfo.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-warm-100 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a 
                href="https://wa.me/905302084747" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-full transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className={`container mx-auto px-4 transition-all duration-300 border-b border-warm-100 ${
        isScrolled ? 'h-16' : 'h-20'
      }`}>
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link href="/" className="flex items-center transition-all duration-300">
            <LogoLioraDG 
              variant="full"
              width={isScrolled ? 140 : 180}
              height={isScrolled ? 35 : 45}
              className="text-sage transition-all duration-300"
              showImage={true}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/" className="text-[15px] font-medium text-neutral-medium hover:text-sage transition-colors relative group">
              Ana Sayfa
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-sage group-hover:w-full transition-all duration-300" />
            </Link>
            
            <div className="relative group">
              <Link href="/urunler" className="text-[15px] font-medium text-neutral-medium hover:text-sage transition-colors flex items-center gap-1 relative">
                Ürünler
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                </svg>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-sage group-hover:w-full transition-all duration-300" />
              </Link>
              
              {/* Mega Menu - Full Width */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[800px] bg-white rounded-card shadow-hover border border-warm-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 p-12">
                <div className="grid grid-cols-3 gap-8">
                  {categories.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/urunler/${category.slug}`}
                      className="flex flex-col gap-3 p-5 rounded-lg hover:bg-warm-50 transition-all group/item hover:shadow-soft"
                    >
                      <div className="w-14 h-14 bg-warm-50 rounded-lg flex items-center justify-center text-3xl group-hover/item:bg-sage group-hover/item:scale-110 transition-all duration-300">
                        {category.icon || '🏷️'}
                      </div>
                      <div>
                        <h4 className="font-serif font-semibold text-neutral mb-1 group-hover/item:text-sage transition-colors">
                          {category.name}
                        </h4>
                        <p className="text-xs text-neutral-light line-clamp-2">
                          {category.description}
                        </p>
                      </div>
                      <span className="text-xs text-sage font-medium flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                        Keşfet
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </Link>
                  ))}
                </div>
                
                {/* Mega Menu Bottom CTA */}
                <div className="mt-8 pt-8 border-t border-warm-100">
                  <Link href="/kampanyalar" className="flex items-center justify-between p-5 bg-sage rounded-lg group/cta hover:shadow-button transition-all hover:bg-sage-dark">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/90 rounded-lg flex items-center justify-center text-2xl shadow-soft">
                        🎁
                      </div>
                      <div>
                        <p className="font-serif font-semibold text-white text-lg">Kampanyalar</p>
                        <p className="text-sm text-white/90">Özel fırsatları kaçırmayın</p>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-white group-hover/cta:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            <Link href="/kampanyalar" className="text-[15px] font-medium text-neutral-medium hover:text-sage transition-colors relative group">
              Kampanyalar
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-sage group-hover:w-full transition-all duration-300" />
            </Link>

            <div className="relative group">
              <button className="text-[15px] font-medium text-neutral-medium hover:text-sage transition-colors flex items-center gap-1">
                Müşteri Hizmetleri
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full right-0 mt-4 w-64 bg-white rounded-card shadow-hover border border-warm-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 p-3">
                {[
                  { label: 'Müşteri Hizmetleri', href: '/musteri-hizmetleri' },
                  { label: 'Hesabım', href: '/account' },
                  { label: 'Sipariş Takip', href: '/siparis-takip' },
                  { label: 'İade ve Değişim', href: '/iade-degisim' },
                  { label: 'SSS', href: '/sss' },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-4 py-2.5 text-sm text-neutral-medium hover:text-sage hover:bg-warm-50 rounded-lg transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form 
              onSubmit={(e) => {
                e.preventDefault()
                const searchInput = e.currentTarget.elements.namedItem('search') as HTMLInputElement
                if (searchInput.value.trim()) {
                  window.location.href = `/urunler?arama=${encodeURIComponent(searchInput.value)}`
                }
              }}
              className="relative w-full"
            >
              <input
                type="search"
                name="search"
                placeholder="Ürün ara..."
                className="w-full h-11 px-5 pl-11 rounded-button border border-warm-100 focus:outline-none focus:border-sage focus:ring-4 focus:ring-sage/10 transition-all text-sm bg-warm-50"
              />
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-light pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </form>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-5">
            {/* Favorites */}
            <Link href="/account/favorilerim" className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-warm-100 transition-colors">
              <svg className="w-[22px] h-[22px] text-neutral-medium hover:text-sage transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {mounted && totalFavorites > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose text-white text-xs font-semibold rounded-full flex items-center justify-center">
                  {totalFavorites}
                </span>
              )}
            </Link>

            {/* User */}
            {mounted && user ? (
              <Link href="/account" className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full hover:bg-warm-100 transition-colors group">
                <div className="w-8 h-8 gradient-sage rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-neutral group-hover:text-sage transition-colors">
                  {user.name.split(' ')[0]}
                </span>
              </Link>
            ) : (
              <Link href="/giris" className="hidden md:flex items-center justify-center w-10 h-10 rounded-full hover:bg-warm-100 transition-colors">
                <svg className="w-[22px] h-[22px] text-neutral-medium hover:text-sage transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            )}
            
            {/* Cart */}
            <div className="relative group">
              <Link href="/sepet" className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-warm-100 transition-colors">
                <svg className="w-[22px] h-[22px] text-neutral-medium hover:text-sage transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {mounted && totalCartItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose text-white text-xs font-semibold rounded-full flex items-center justify-center">
                    {totalCartItems}
                  </span>
                )}
              </Link>
              <MiniCart />
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden flex items-center justify-center w-10 h-10"
            >
              <svg className="w-6 h-6 text-neutral" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-white">
          <div className="p-4">
            <div className="flex items-center justify-between mb-8">
              <LogoLioraDG 
                variant="full"
                width={140}
                height={35}
                className="text-sage"
                showImage={true}
              />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-10 h-10 flex items-center justify-center hover:bg-warm-50 rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col gap-1">
              <Link href="/" className="px-4 py-4 text-base font-medium text-neutral hover:bg-warm-50 rounded-lg">
                Ana Sayfa
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/urunler/${category.slug}`}
                  className="flex items-center gap-3 px-4 py-4 hover:bg-warm-50 rounded-lg"
                >
                  <span className="text-xl">{category.icon || '🏷️'}</span>
                  <span className="text-base text-neutral-medium">{category.name}</span>
                </Link>
              ))}
              <Link href="/kampanyalar" className="px-4 py-4 text-base font-medium text-neutral hover:bg-warm-50 rounded-lg">
                Kampanyalar
              </Link>
              <Link href="/musteri-hizmetleri" className="px-4 py-4 text-base font-medium text-neutral hover:bg-warm-50 rounded-lg">
                Müşteri Hizmetleri
              </Link>
              <Link href="/giris" className="px-4 py-4 text-base font-medium text-neutral hover:bg-warm-50 rounded-lg">
                Giriş Yap
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
