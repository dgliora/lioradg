'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Category } from '@/types'
import { cn } from '@/lib/utils'

interface MobileFilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  categories: Category[]
  currentCategorySlug: string
  currentSort: string
  onSortChange: (value: string) => void
}

export function MobileFilterDrawer({
  isOpen,
  onClose,
  categories,
  currentCategorySlug,
  currentSort,
  onSortChange,
}: MobileFilterDrawerProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'categories' | 'sort'>('categories')

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleCategoryClick = (slug: string) => {
    if (slug === 'all') {
      router.push('/urunler')
    } else {
      router.push(`/urunler/${slug}`)
    }
    onClose()
  }

  const handleSortChange = (value: string) => {
    onSortChange(value)
    onClose()
  }

  const icons: { [key: string]: string } = {
    'bitkisel-yaglar': '🌿',
    'oda-tekstil-kokulari': '🕯️',
  }

  const sortOptions = [
    { label: 'En Yeni', value: 'newest', icon: '🆕' },
    { label: 'En Popüler', value: 'popular', icon: '🔥' },
    { label: 'Fiyat: Düşük → Yüksek', value: 'price-asc', icon: '💰' },
    { label: 'Fiyat: Yüksek → Düşük', value: 'price-desc', icon: '💎' },
  ]

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-2xl transform transition-transform duration-300 ease-out md:hidden max-h-[80vh] overflow-hidden flex flex-col",
          isOpen ? "translate-y-0" : "translate-y-full"
        )}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-warm-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-4 pb-3 border-b border-warm-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-serif font-bold text-neutral">Filtrele & Sırala</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-warm-100 flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => setActiveTab('categories')}
              className={cn(
                "flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all",
                activeTab === 'categories'
                  ? "bg-sage text-white shadow-soft"
                  : "bg-warm-50 text-neutral-medium hover:bg-warm-100"
              )}
            >
              📂 Kategoriler
            </button>
            <button
              onClick={() => setActiveTab('sort')}
              className={cn(
                "flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all",
                activeTab === 'sort'
                  ? "bg-sage text-white shadow-soft"
                  : "bg-warm-50 text-neutral-medium hover:bg-warm-100"
              )}
            >
              🔄 Sıralama
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4">
          {activeTab === 'categories' ? (
            <div className="space-y-2">
              {/* Tüm Ürünler */}
              <button
                onClick={() => handleCategoryClick('all')}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all",
                  currentCategorySlug === 'all'
                    ? "bg-gradient-to-r from-sage/15 to-rose/15 border-2 border-sage shadow-soft"
                    : "bg-warm-50 hover:bg-warm-100 active:scale-[0.98]"
                )}
              >
                <span className="text-2xl">🌟</span>
                <span className={cn(
                  "flex-1 text-left font-medium",
                  currentCategorySlug === 'all' ? "text-sage" : "text-neutral"
                )}>
                  Tüm Ürünler
                </span>
                {currentCategorySlug === 'all' && (
                  <svg className="w-5 h-5 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>

              {/* Kategoriler */}
              {categories.map((category) => {
                const isActive = category.slug === currentCategorySlug
                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.slug)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all",
                      isActive
                        ? "bg-gradient-to-r from-sage/15 to-rose/15 border-2 border-sage shadow-soft"
                        : "bg-warm-50 hover:bg-warm-100 active:scale-[0.98]"
                    )}
                  >
                    <span className="text-2xl">{icons[category.slug] || '📦'}</span>
                    <span className={cn(
                      "flex-1 text-left font-medium",
                      isActive ? "text-sage" : "text-neutral"
                    )}>
                      {category.name}
                    </span>
                    {isActive && (
                      <svg className="w-5 h-5 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="space-y-2">
              {sortOptions.map((option) => {
                const isActive = currentSort === option.value
                return (
                  <button
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all",
                      isActive
                        ? "bg-gradient-to-r from-sage/15 to-rose/15 border-2 border-sage shadow-soft"
                        : "bg-warm-50 hover:bg-warm-100 active:scale-[0.98]"
                    )}
                  >
                    <span className="text-2xl">{option.icon}</span>
                    <span className={cn(
                      "flex-1 text-left font-medium",
                      isActive ? "text-sage" : "text-neutral"
                    )}>
                      {option.label}
                    </span>
                    {isActive && (
                      <svg className="w-5 h-5 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

