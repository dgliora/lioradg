'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types'
import { Button, Badge, useToast } from '@/components/ui'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/lib/store/cartStore'

interface ProductDetailProps {
  product: Product & {
    category: { name: string; slug: string }
    reviews?: any[]
  }
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<'description' | 'content' | 'usage'>('description')
  const [selectedImage, setSelectedImage] = useState(0)
  const addItem = useCartStore((state) => state.addItem)
  const { showToast } = useToast()

  const hasDiscount = product.salePrice && product.salePrice < product.price
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0

  const finalPrice = product.salePrice || product.price
  const images = product.images ? product.images.split(',').filter(img => img.trim()) : ['/placeholder.jpg']

  const incrementQuantity = () => {
    if (quantity < product.stock) setQuantity(quantity + 1)
  }
  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1)
  }

  const handleAddToCart = () => {
    addItem(product, quantity)
    showToast(`${product.name} sepete eklendi! (${quantity} adet)`, 'success')
  }

  const averageRating = product.reviews && product.reviews.length > 0
    ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
    : 0

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-6 md:py-10">
        {/* Breadcrumb */}
        <nav className="text-sm text-neutral-light mb-6 flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-sage transition-colors">Ana Sayfa</Link>
          <span>/</span>
          <Link href={`/urunler/${product.category.slug}`} className="hover:text-sage transition-colors">
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-neutral line-clamp-1">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-12">
          {/* Image Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-square bg-warm-50 rounded-2xl overflow-hidden">
              <Image
                src={images[selectedImage]}
                alt={`${product.name} - ${selectedImage + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                className="object-cover"
                priority
              />
              {hasDiscount && (
                <Badge variant="danger" size="lg" className="absolute top-4 left-4">
                  %{discountPercent} İndirim
                </Badge>
              )}
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-neutral/60 flex items-center justify-center backdrop-blur-sm">
                  <Badge variant="danger" size="lg">Stokta Yok</Badge>
                </div>
              )}
              {images.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black/40 text-white text-xs px-3 py-1 rounded-full">
                  {selectedImage + 1} / {images.length}
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square bg-warm-50 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === index ? 'border-sage scale-95' : 'border-transparent hover:border-warm-200'
                    }`}
                  >
                    <Image src={img} alt={`${product.name} ${index + 1}`} fill sizes="100px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-neutral mb-4 leading-tight">
              {product.name}
            </h1>

            {product.reviews && product.reviews.length > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className={`w-5 h-5 ${star <= averageRating ? 'text-warning' : 'text-warm-200'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-neutral-light">({product.reviews.length} değerlendirme)</span>
              </div>
            )}

            {/* Price */}
            <div className="mb-6">
              {hasDiscount ? (
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-danger">{formatPrice(product.salePrice!)}</span>
                  <span className="text-lg text-neutral-light line-through">{formatPrice(product.price)}</span>
                </div>
              ) : (
                <span className="text-3xl font-bold text-neutral">{formatPrice(product.price)}</span>
              )}
            </div>

            {/* SKU & Stock */}
            <div className="flex items-center gap-3 mb-5 text-sm text-neutral-light flex-wrap">
              {product.sku && <><span>SKU: {product.sku}</span><span>•</span></>}
              {product.stock > 0 ? (
                <span className="text-success font-medium">Stokta ({product.stock} adet)</span>
              ) : (
                <span className="text-danger font-medium">Stokta Yok</span>
              )}
            </div>

            {(product.benefits || product.description) && (
              <p className="text-neutral-medium mb-6 leading-relaxed">
                {(product.benefits || product.description || '').slice(0, 200)}
                {(product.benefits || product.description || '').length > 200 ? '...' : ''}
              </p>
            )}

            {/* Quantity & Add to Cart */}
            {product.stock > 0 && (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-neutral mb-2">Miktar</label>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" onClick={decrementQuantity} disabled={quantity === 1}>-</Button>
                    <span className="w-12 text-center font-medium text-neutral">{quantity}</span>
                    <Button variant="outline" size="sm" onClick={incrementQuantity} disabled={quantity >= product.stock}>+</Button>
                  </div>
                </div>
                <Button size="lg" fullWidth onClick={handleAddToCart} className="text-base">
                  Sepete Ekle — {formatPrice(finalPrice * quantity)}
                </Button>
              </div>
            )}

            {/* Features */}
            <div className="border-t border-warm-100 pt-5 space-y-3 text-sm">
              {[
                { icon: 'M5 13l4 4L19 7', text: 'Ücretsiz Kargo (500 TL üzeri)' },
                { icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15', text: '14 Gün İçinde Kolay İade' },
                { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', text: '%100 Orijinal Ürün Garantisi' },
              ].map((f) => (
                <div key={f.text} className="flex items-center gap-2 text-neutral-medium">
                  <svg className="w-5 h-5 text-sage shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={f.icon} />
                  </svg>
                  <span>{f.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-warm-100 pt-8">
          <div className="flex gap-1 sm:gap-4 border-b border-warm-100 mb-8 overflow-x-auto">
            {([
              { key: 'description', label: 'Özellikleri' },
              { key: 'content', label: 'Bilinen Faydaları' },
              { key: 'usage', label: 'Kullanım Alanı' },
            ] as const).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`pb-3 px-2 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'text-sage border-b-2 border-sage'
                    : 'text-neutral-light hover:text-neutral'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="text-neutral-medium leading-relaxed whitespace-pre-line text-sm md:text-base">
            {activeTab === 'description' && (product.features || product.content || 'Bilgi bulunmamaktadır.')}
            {activeTab === 'content' && (product.benefits || product.description || 'Bilgi bulunmamaktadır.')}
            {activeTab === 'usage' && (product.usage || 'Bilgi bulunmamaktadır.')}
          </div>
        </div>
      </div>
    </div>
  )
}
