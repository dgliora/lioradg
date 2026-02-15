'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { Product } from '@/types'
import { Card, Badge, Button, useToast } from '@/components/ui'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/lib/store/cartStore'
import { useFavoritesStore } from '@/lib/store/favoritesStore'

const Tilt = dynamic(() => import('react-parallax-tilt'), { ssr: false })

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [isMounted, setIsMounted] = useState(false)
  const addItem = useCartStore((state) => state.addItem)
  const { addItem: addFavorite, removeItem: removeFavorite, isFavorite } = useFavoritesStore()
  const { showToast } = useToast()
  
  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  const isFav = isMounted ? isFavorite(product.id) : false
  const hasDiscount = product.salePrice && product.salePrice < product.price
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0

  const mainImage = product.images?.split(',')[0] || '/placeholder.jpg'
  const finalPrice = product.salePrice || product.price

  return (
    <Tilt
      tiltMaxAngleX={10}
      tiltMaxAngleY={10}
      glareEnable={true}
      glareMaxOpacity={0.3}
      scale={1.02}
      transitionSpeed={400}
      className="h-full"
    >
      <Card
        padding="none"
        className="group overflow-hidden h-full flex flex-col"
      >
        <Link href={`/urun/${product.slug}`} className="flex-1 flex flex-col">
          {/* Image - Portrait 3:4 with white background */}
          <div className="relative aspect-[3/4] bg-white overflow-hidden">
            <Image
              src={mainImage}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover p-6 group-hover:scale-105 transition-transform duration-600"
              style={{ filter: 'brightness(1.05) saturate(1.1)' }}
            />
            
            {/* Badges - Responsive padding */}
            {hasDiscount && (
              <div className="absolute top-2 right-2 md:top-3 md:right-3">
                <div className="px-2 py-1 md:px-4 md:py-1.5 gradient-rose text-white text-[10px] md:text-xs font-semibold rounded-full backdrop-blur-sm whitespace-nowrap">
                  %{discountPercent}
                </div>
              </div>
            )}
            {product.featured && !hasDiscount && (
              <div className="absolute top-2 right-2 md:top-3 md:right-3">
                <div className="px-2 py-1 md:px-4 md:py-1.5 bg-gradient-to-r from-yellow-200 to-yellow-300 text-neutral text-[10px] md:text-xs font-semibold rounded-full backdrop-blur-sm whitespace-nowrap">
                  ⭐ Öne Çıkan
                </div>
              </div>
            )}
            
            {/* Quick Actions - Always Visible - Responsive */}
            <div className="absolute top-2 left-2 md:top-3 md:left-3 z-10">
              <button 
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  if (isFav) {
                    removeFavorite(product.id)
                    showToast('Favorilerden çıkarıldı', 'info')
                  } else {
                    addFavorite(product)
                    showToast('Favorilere eklendi!', 'success')
                  }
                }}
                className={`w-8 h-8 md:w-10 md:h-10 rounded-full shadow-soft transition-all flex items-center justify-center ${
                  isFav 
                    ? 'bg-rose text-white hover:bg-rose-dark' 
                    : 'bg-white text-rose hover:bg-rose hover:text-white border-2 border-rose/30'
                }`}
              >
                <svg 
                  className="w-4 h-4 md:w-5 md:h-5" 
                  fill={isFav ? 'currentColor' : 'none'} 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* Add to Cart Button - Mobile: Bottom Right Icon, Desktop: On Hover */}
            {product.stock > 0 && (
              <>
                {/* Mobile: Sepet Icon (Sag Alt) */}
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    addItem(product, 1)
                    showToast('Ürün sepete eklendi!', 'success')
                  }}
                  className="md:hidden absolute bottom-2 right-2 w-10 h-10 bg-sage text-white rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform z-10"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </button>
              </>
            )}

            {product.stock === 0 && (
              <div className="absolute inset-0 bg-neutral/70 flex items-center justify-center backdrop-blur-sm">
                <div className="px-6 py-3 bg-white rounded-full text-neutral font-semibold">
                  Tükendi
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 flex flex-col flex-1">
            {/* Product Name */}
            <h3 className="text-base font-medium text-neutral mb-3 line-clamp-2 min-h-[48px] group-hover:text-sage transition-colors">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className="w-4 h-4 text-warning"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>

            {/* Price */}
            <div className="mt-auto mb-4">
              {hasDiscount ? (
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-danger">
                    {formatPrice(finalPrice)}
                  </span>
                  <span className="text-sm text-neutral-light line-through">
                    {formatPrice(product.price)}
                  </span>
                </div>
              ) : (
                <span className="text-2xl font-bold text-neutral">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* Add to Cart - Desktop: Shows on Hover */}
            {product.stock > 0 && (
              <div className="hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button
                  fullWidth
                  size="md"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    addItem(product, 1)
                    showToast('Ürün sepete eklendi!', 'success')
                  }}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Sepete Ekle
                </Button>
              </div>
            )}
          </div>
        </Link>
      </Card>
    </Tilt>
  )
}
