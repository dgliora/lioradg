'use client'

import Link from 'next/link'
import { Button } from '@/components/ui'
import { ProductCard } from '@/components/shop'
import { useFavoritesStore } from '@/lib/store/favoritesStore'

export default function FavoritesPage() {
  const { items: favoritesProducts } = useFavoritesStore()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-h2 font-serif font-bold text-neutral mb-1">
          Favorilerim
        </h2>
        <p className="text-sm text-neutral-medium">
          Beğendiğiniz {favoritesProducts.length} ürün
        </p>
      </div>

      {favoritesProducts.length === 0 ? (
        <div className="text-center py-16 bg-warm-50 rounded-lg border-2 border-dashed border-warm-200">
          <div className="w-16 h-16 bg-warm-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-neutral-medium" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="text-h3 font-serif text-neutral mb-2">Favori Ürün Yok</h3>
          <p className="text-neutral-medium mb-6">Beğendiğiniz ürünleri favorilere ekleyin</p>
          <Link href="/urunler">
            <Button>Ürünleri İncele</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {favoritesProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
