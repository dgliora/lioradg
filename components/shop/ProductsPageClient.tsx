'use client'

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Category, Product } from '@/types'
import { ProductGrid } from './ProductGrid'
import { ProductFilters } from './ProductFilters'
import { MobileFilterDrawer } from './MobileFilterDrawer'
import { MobileFilterButton } from './MobileFilterButton'

interface ProductsPageClientProps {
  categories: Category[]
  currentCategorySlug: string
  products: Product[]
  currentPage: number
  totalPages: number
}

export function ProductsPageClient({
  categories,
  currentCategorySlug,
  products,
  currentPage,
  totalPages,
}: ProductsPageClientProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  const currentSort = searchParams.get('siralama') || 'newest'

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('siralama', value)
    params.delete('sayfa')
    
    const targetUrl = currentCategorySlug === 'all' 
      ? `/urunler?${params.toString()}`
      : `/urunler/${currentCategorySlug}?${params.toString()}`
    
    router.push(targetUrl)
  }

  // Count active filters (kategori seçiliyse 1)
  const activeFiltersCount = currentCategorySlug !== 'all' ? 1 : 0

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-8">
        <ProductFilters 
          categories={categories} 
          currentCategorySlug={currentCategorySlug} 
        />
        <ProductGrid
          products={products}
          currentPage={currentPage}
          totalPages={totalPages}
          categorySlug={currentCategorySlug}
        />
      </div>

      {/* Mobile Filter Button */}
      <MobileFilterButton 
        onClick={() => setIsFilterOpen(true)}
        activeFiltersCount={activeFiltersCount}
      />

      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        categories={categories}
        currentCategorySlug={currentCategorySlug}
        currentSort={currentSort}
        onSortChange={handleSortChange}
      />
    </>
  )
}

