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
  const [activeTab, setActiveTab] = useState<'description' | 'content' | 'usage' | 'reviews'>('description')
  const [selectedImage, setSelectedImage] = useState(0)
  const addItem = useCartStore((state) => state.addItem)
  const { showToast } = useToast()

  const hasDiscount = product.salePrice && product.salePrice < product.price
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0

  const finalPrice = product.salePrice || product.price
  
  // Çoklu fotoğrafları array'e çevir
  const images = product.images ? product.images.split(',').filter(img => img.trim()) : ['/placeholder.jpg']

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const handleAddToCart = () => {
    addItem(product, quantity)
    showToast(`${product.name} sepete eklendi! (${quantity} adet)`, 'success')
  }

  // Calculate average rating
  const averageRating = product.reviews && product.reviews.length > 0
    ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
    : 0

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-primary">
            Ana Sayfa
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/urunler/${product.category.slug}`} className="hover:text-primary">
            {product.category.name}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Ana Görsel */}
            <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden">
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
                  {discountPercent}% İndirim
                </Badge>
              )}
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Badge variant="danger" size="lg">
                    Stokta Yok
                  </Badge>
                </div>
              )}
              {/* Fotoğraf Sayısı */}
              {images.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black/50 text-white text-sm px-3 py-1 rounded-full">
                  {selectedImage + 1} / {images.length}
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-sage scale-95'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      fill
                      sizes="100px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            {product.reviews && product.reviews.length > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-5 h-5 ${
                        star <= averageRating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  ({product.reviews.length} değerlendirme)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="mb-6">
              {hasDiscount ? (
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-secondary">
                    {formatPrice(product.salePrice)}
                  </span>
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(product.price)}
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* SKU & Stock */}
            <div className="flex items-center gap-4 mb-6 text-sm text-gray-600">
              {product.sku && (
                <>
                  <span>SKU: {product.sku}</span>
                  <span>•</span>
                </>
              )}
              {product.stock > 0 ? (
                <span className="text-green-600 font-medium">
                  Stokta ({product.stock} adet)
                </span>
              ) : (
                <span className="text-red-600 font-medium">Stokta Yok</span>
              )}
            </div>

            {/* Short Description */}
            {product.description && (
              <p className="text-gray-700 mb-6">{product.description}</p>
            )}

            {/* Quantity & Add to Cart */}
            {product.stock > 0 && (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Miktar
                  </label>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={decrementQuantity}
                      disabled={quantity === 1}
                    >
                      -
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={incrementQuantity}
                      disabled={quantity >= product.stock}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <Button
                  size="lg"
                  fullWidth
                  onClick={handleAddToCart}
                  className="text-lg"
                >
                  Sepete Ekle - {formatPrice(finalPrice * quantity)}
                </Button>
              </div>
            )}

            {/* Features */}
            <div className="border-t border-gray-200 pt-6 space-y-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Ücretsiz Kargo (500 TL üzeri)</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>14 Gün İçinde Kolay İade</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>%100 Orijinal Ürün Garantisi</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex gap-6 border-b border-gray-200 mb-8">
            <button
              onClick={() => setActiveTab('description')}
              className={`pb-3 font-medium transition-colors ${
                activeTab === 'description'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Açıklama
            </button>
            {product.content && (
              <button
                onClick={() => setActiveTab('content')}
                className={`pb-3 font-medium transition-colors ${
                  activeTab === 'content'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                İçerik
              </button>
            )}
            {product.usage && (
              <button
                onClick={() => setActiveTab('usage')}
                className={`pb-3 font-medium transition-colors ${
                  activeTab === 'usage'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Kullanım
              </button>
            )}
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 font-medium transition-colors ${
                activeTab === 'reviews'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yorumlar ({product.reviews?.length || 0})
            </button>
          </div>

          <div className="prose max-w-none">
            {activeTab === 'description' && (
              <div className="text-gray-700 whitespace-pre-line">
                {product.description || 'Ürün açıklaması bulunmamaktadır.'}
              </div>
            )}
            {activeTab === 'content' && product.content && (
              <div className="text-gray-700 whitespace-pre-line">{product.content}</div>
            )}
            {activeTab === 'usage' && product.usage && (
              <div className="text-gray-700 whitespace-pre-line">{product.usage}</div>
            )}
            {activeTab === 'reviews' && (
              <div>
                {product.reviews && product.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {product.reviews.map((review: any) => (
                      <div key={review.id} className="border-b border-gray-200 pb-6">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="font-medium text-gray-900">{review.user.name}</span>
                          <span className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString('tr-TR')}
                          </span>
                        </div>
                        {review.comment && (
                          <p className="text-gray-700">{review.comment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">Henüz yorum yapılmamış.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

