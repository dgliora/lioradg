'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Category } from '@/types'
import { Card } from '@/components/ui'

interface ProductFiltersProps {
  categories: Category[]
  currentCategorySlug: string
}

export function ProductFilters({ categories, currentCategorySlug }: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [sortBy, setSortBy] = useState(searchParams.get('siralama') || 'newest')
  const [searchQuery, setSearchQuery] = useState('')

  const handleSortChange = (value: string) => {
    setSortBy(value)
    const params = new URLSearchParams(searchParams.toString())
    params.set('siralama', value)
    params.delete('sayfa')
    
    const targetUrl = currentCategorySlug === 'all' 
      ? `/urunler?${params.toString()}`
      : `/urunler/${currentCategorySlug}?${params.toString()}`
    
    router.push(targetUrl)
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set('arama', value)
    } else {
      params.delete('arama')
    }
    params.delete('sayfa')
    
    const targetUrl = currentCategorySlug === 'all' 
      ? `/urunler?${params.toString()}`
      : `/urunler/${currentCategorySlug}?${params.toString()}`
    
    router.push(targetUrl)
  }

  return (
    <aside className="lg:w-64 flex-shrink-0 space-y-4">
      {/* Search */}
      <Card>
        <h3 className="text-base font-semibold text-neutral-900 mb-4">Ürün Ara</h3>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Ürün adı..."
            className="w-full px-4 py-2 pl-10 rounded-input border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-focus focus:border-transparent text-small"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </Card>

      {/* Categories Filter */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-sage/5 to-rose/5 px-4 py-3 -mx-8 -mt-8 mb-4">
          <h3 className="text-base font-serif font-semibold text-neutral flex items-center gap-2">
            <svg className="w-5 h-5 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Kategoriler
          </h3>
        </div>
        <div className="space-y-1">
          {/* Tüm Ürünler */}
          <button
            onClick={() => router.push('/urunler')}
            className={`w-full text-left px-3 py-3 rounded-lg text-sm transition-all relative flex items-center gap-3 group ${
              currentCategorySlug === 'all'
                ? 'bg-gradient-to-r from-sage/10 to-rose/10 text-sage font-semibold border-l-4 border-sage pl-2.5 shadow-soft'
                : 'text-neutral-medium hover:bg-warm-50 hover:text-sage border-l-4 border-transparent hover:border-warm-200'
            }`}
          >
            <span className="text-lg">🌟</span>
            <span className="flex-1">Tüm Ürünler</span>
            {currentCategorySlug === 'all' && (
              <svg className="w-4 h-4 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>

          <div className="h-px bg-gradient-to-r from-transparent via-warm-200 to-transparent my-2" />

          {categories.map((category) => {
            const isActive = category.slug === currentCategorySlug
            const icons: { [key: string]: string } = {
              'parfumler': '🌸',
              'tonikler': '💧',
              'sampuan-sac-bakim': '🧴',
              'krem-bakim': '✨',
              'bitkisel-yaglar': '🌿',
              'oda-tekstil-kokulari': '🏠',
            }
            return (
              <button
                key={category.id}
                onClick={() => router.push(`/urunler/${category.slug}`)}
                className={`w-full text-left px-3 py-3 rounded-lg text-sm transition-all relative flex items-center gap-3 group ${
                  isActive
                    ? 'bg-gradient-to-r from-sage/10 to-rose/10 text-sage font-semibold border-l-4 border-sage pl-2.5 shadow-soft'
                    : 'text-neutral-medium hover:bg-warm-50 hover:text-sage border-l-4 border-transparent hover:border-warm-200'
                }`}
              >
                <span className={`text-lg transition-transform group-hover:scale-110 ${isActive ? 'scale-110' : ''}`}>
                  {icons[category.slug] || '📦'}
                </span>
                <span className="flex-1">{category.name}</span>
                {isActive && (
                  <svg className="w-4 h-4 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            )
          })}
        </div>
      </Card>

      {/* Sort */}
      <Card>
        <h3 className="text-base font-semibold text-neutral-900 mb-4">Sıralama</h3>
        <div className="space-y-2">
          {[
            { label: 'En Yeni', value: 'newest' },
            { label: 'En Popüler', value: 'popular' },
            { label: 'Fiyat: Düşükten Yükseğe', value: 'price-asc' },
            { label: 'Fiyat: Yüksekten Düşüğe', value: 'price-desc' },
          ].map((option) => (
            <label key={option.value} className="flex items-center cursor-pointer hover:bg-neutral-50 p-2 rounded-lg transition-colors">
              <input
                type="radio"
                name="sort"
                value={option.value}
                checked={sortBy === option.value}
                onChange={(e) => handleSortChange(e.target.value)}
                className="mr-3 text-primary focus:ring-focus"
              />
              <span className="text-small text-neutral-700">{option.label}</span>
            </label>
          ))}
        </div>
      </Card>
    </aside>
  )
}

