'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Card, Button, useToast, Skeleton } from '@/components/ui'
import { useCartStore } from '@/lib/store/cartStore'
import { useAuth } from '@/lib/contexts/AuthContext'
import { calculateShippingFee } from '@/lib/utils/shipping'
import type { CartItem } from '@/lib/store/cartStore'

export default function CartPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const cartStore = useCartStore()
  const { showToast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Hydration için mounted state
  useEffect(() => {
    setMounted(true)
  }, [])

  // Store'dan verileri al (mounted olduktan sonra)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [shippingFee, setShippingFee] = useState(89.90)

  // Kargo ücreti ayarını yükle
  useEffect(() => {
    if (mounted) {
      fetch('/api/settings/shipping-fee')
        .then(res => res.json())
        .then(data => {
          if (data.shippingFee) {
            setShippingFee(data.shippingFee)
          }
        })
        .catch(() => {}) // Hata durumunda default değer kalır
    }
  }, [mounted])

  useEffect(() => {
    if (mounted) {
      setCartItems(cartStore.items)
      const total = cartStore.items.reduce((sum, item) => {
        const itemPrice = item.product.salePrice || item.product.price
        return sum + (itemPrice * item.quantity)
      }, 0)
      setTotalPrice(total)
    }
  }, [cartStore.items, mounted])

  // Sepet tutarı değiştiğinde kargo ücretini yeniden hesapla
  useEffect(() => {
    if (mounted && totalPrice >= 0) {
      calculateShippingFee(totalPrice).then(fee => {
        setShippingFee(fee)
      })
    }
  }, [totalPrice, mounted])

  if (!mounted || authLoading) {
    return (
      <div className="min-h-screen bg-warm-50 py-6 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6 sm:mb-8">
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              <div className="lg:col-span-2 space-y-4">
                {[1, 2].map((i) => (
                  <Card key={i} className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <Skeleton className="w-full sm:w-20 h-32 sm:h-20 rounded-lg shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-9 w-32" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              <div className="lg:col-span-1">
                <Card className="p-4 sm:p-6">
                  <Skeleton className="h-6 w-28 mb-6" />
                  <div className="space-y-4 mb-6">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-10 w-full mt-4" />
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const handleRemoveItem = (productId: string) => {
    if (confirm('Bu ürünü sepetten kaldırmak istediğinizden emin misiniz?')) {
      cartStore.removeItem(productId)
      showToast('Ürün sepetten kaldırıldı', 'info')
    }
  }

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveItem(productId)
      return
    }
    cartStore.updateQuantity(productId, newQuantity)
  }

  const handleCheckout = async (asGuest = false) => {
    if (cartItems.length === 0) {
      showToast('Sepetiniz boş', 'warning')
      return
    }

    setIsSubmitting(true)
    showToast('Ödeme sayfasına yönlendiriliyor...', 'info')
    setTimeout(() => {
      setIsSubmitting(false)
      router.push(asGuest ? '/odeme?misafir=1' : '/odeme')
    }, 500)
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-warm-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-warm-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-neutral-medium" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 3.5a3 3 0 002.5 2.5H17a3 3 0 002.5-2.5l-1.5-3.5M6 21h12a2 2 0 002-2v-1a2 2 0 00-2-2H6a2 2 0 00-2 2v1a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-h1 font-serif font-bold text-neutral mb-4">
              Sepetiniz Boş
            </h1>
            <p className="text-neutral-medium mb-8">
              Henüz sepetinize ürün eklemediniz. Hemen alışverişe başlayın!
            </p>
            <div className="space-x-4">
              <Button onClick={() => router.push('/urunler')} size="lg">
                Alışverişe Başla
              </Button>
              <Button variant="outline" onClick={() => router.push('/')} size="lg">
                Ana Sayfa
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-warm-50 py-6 sm:py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-h1 font-serif font-bold text-neutral mb-2">
              Sepetim ({cartItems.length} ürün)
            </h1>
            <p className="text-neutral-medium">
              Sepetinizdeki ürünleri gözden geçirin ve ödemeye geçin
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => {
                const itemTotal = (item.product.salePrice || item.product.price) * item.quantity
                return (
                  <Card key={item.product.id} className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                      <div className="w-full sm:w-20 h-32 sm:h-20 bg-warm-50 rounded-lg flex-shrink-0 overflow-hidden relative">
                        {mounted && item.product.images && (
                          <Image
                            src={item.product.images}
                            alt={item.product.name}
                            width={80}
                            height={80}
                            className="object-cover"
                            sizes="80px"
                          />
                        )}
                      </div>

                      {/* Ürün Bilgileri */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-neutral text-sm mb-1 line-clamp-2">
                          {item.product.name}
                        </h3>
                        <p className="text-xs text-neutral-medium mb-2">
                          {typeof item.product.category === 'string' 
                            ? item.product.category 
                            : item.product.category?.name || 'Ürün'}
                        </p>
                        
                        {/* Fiyat */}
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-lg font-serif font-bold text-sage">
                            {itemTotal.toLocaleString('tr-TR', {
                              style: 'currency',
                              currency: 'TRY',
                            })}
                          </span>
                          {item.product.salePrice && item.product.salePrice < item.product.price && (
                            <span className="text-sm text-neutral-medium line-through">
                              {item.product.price.toLocaleString('tr-TR', {
                                style: 'currency',
                                currency: 'TRY',
                              })}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <div className="flex items-center gap-2">
                            <label className="text-xs text-neutral-medium whitespace-nowrap">Miktar:</label>
                            <div className="flex items-center gap-1 bg-warm-50 rounded-lg p-1">
                              <button
                                onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                                className="w-8 h-8 rounded-md bg-white flex items-center justify-center text-neutral hover:bg-neutral hover:text-white transition-colors disabled:opacity-50"
                                disabled={item.quantity <= 1}
                              >
                                <span className="text-lg font-medium">-</span>
                              </button>
                              <span className="w-8 text-center text-sm font-semibold text-neutral">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                                className="w-8 h-8 rounded-md bg-white flex items-center justify-center text-neutral hover:bg-neutral hover:text-white transition-colors"
                              >
                                <span className="text-lg font-medium">+</span>
                              </button>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.product.id)}
                            className="text-danger hover:underline text-sm font-medium py-2 px-3 -mx-3 rounded-lg active:bg-warm-100 min-h-[44px] flex items-center"
                          >
                            Sepetten Kaldır
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>

            <div className="lg:col-span-1 space-y-6">
              <Card className="p-4 sm:p-6 lg:sticky lg:top-24">
                <h3 className="font-serif font-semibold text-neutral mb-6 text-lg">
                  Sepet Özeti
                </h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-medium">Ara Toplam ({cartItems.length} ürün)</span>
                    <span className="font-medium text-neutral">
                      {totalPrice.toLocaleString('tr-TR', {
                        style: 'currency',
                        currency: 'TRY',
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-medium">Kargo Bedeli</span>
                    <span className={shippingFee === 0 ? 'text-success font-medium' : 'font-medium text-neutral'}>
                      {shippingFee === 0 ? 'Ücretsiz' : shippingFee.toLocaleString('tr-TR', {
                        style: 'currency',
                        currency: 'TRY',
                      })}
                    </span>
                  </div>
                  <div className="h-px bg-warm-200" />
                  <div className="flex justify-between text-xl font-serif font-bold">
                    <span className="text-neutral">Toplam Tutar</span>
                    <span className="text-sage">
                      {(totalPrice + shippingFee).toLocaleString('tr-TR', {
                        style: 'currency',
                        currency: 'TRY',
                      })}
                    </span>
                  </div>
                </div>

                {user ? (
                  <Button
                    fullWidth
                    size="lg"
                    onClick={() => handleCheckout(false)}
                    loading={isSubmitting}
                    disabled={cartItems.length === 0}
                    className="bg-gradient-to-r from-sage to-sage-dark hover:from-sage-dark hover:to-sage text-white font-semibold py-3 mb-3"
                  >
                    {isSubmitting ? 'Yönlendiriliyor...' : `Ödemeye Geç - ${(totalPrice + shippingFee).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}`}
                  </Button>
                ) : (
                  <div className="space-y-3 mb-3">
                    <Button
                      fullWidth
                      size="lg"
                      onClick={() => router.push('/giris?callbackUrl=/odeme')}
                      disabled={cartItems.length === 0}
                      className="bg-gradient-to-r from-sage to-sage-dark hover:from-sage-dark hover:to-sage text-white font-semibold py-3"
                    >
                      Giriş Yap ve Öde
                    </Button>
                    <button
                      onClick={() => handleCheckout(true)}
                      disabled={cartItems.length === 0 || isSubmitting}
                      className="w-full border-2 border-sage text-sage py-3 rounded-xl font-semibold hover:bg-sage/5 transition-colors disabled:opacity-50"
                    >
                      Misafir Olarak Devam Et
                    </button>
                    <p className="text-xs text-center text-neutral-500">
                      Üye olarak daha hızlı takip edebilirsiniz
                    </p>
                  </div>
                )}

                <div className="text-center text-xs text-neutral-medium space-y-1">
                  <p className="font-medium">Güvenli Alışveriş</p>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                    <span>SSL Sertifikalı</span>
                  </div>
                </div>
              </Card>

              {/* Ödeme Yöntemleri */}
              <Card className="p-4">
                <h4 className="font-medium text-neutral mb-3 text-sm">Güvenli Ödeme Seçenekleri</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-medium">Kredi Kartı</span>
                    <span className="text-success">✓</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-medium">Havale / EFT</span>
                    <span className="text-success">✓</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-medium">Kapıda Ödeme</span>
                    <span className="text-success">✓</span>
                  </div>
                </div>
              </Card>

              {/* Devam Et Butonu */}
              <div>
                <Button
                  fullWidth
                  variant="outline"
                  onClick={() => router.push('/urunler')}
                  size="lg"
                  className="py-3"
                >
                  Alışverişe Devam Et
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

