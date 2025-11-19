'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Card, Button, useToast } from '@/components/ui'
import { useCartStore } from '@/lib/store/cartStore'
import { useAuth } from '@/lib/contexts/AuthContext'
import { calculateShippingFee } from '@/lib/utils/shipping'

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
  const [cartItems, setCartItems] = useState([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [shippingFee, setShippingFee] = useState(89.90)

  useEffect(() => {
    if (mounted) {
      setCartItems(cartStore.items)
      const total = cartStore.items.reduce((sum, item) => {
        return sum + (item.product.price * item.quantity)
      }, 0)
      setTotalPrice(total)
      
      // Kargo ücretini hesapla
      calculateShippingFee(total).then(fee => {
        setShippingFee(fee)
      })
    }
  }, [cartStore.items, mounted])

  if (!mounted || authLoading) {
    return null
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

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      showToast('Sepetiniz boş', 'warning')
      return
    }

    if (!user) {
      showToast('Ödeme için giriş yapmanız gerekiyor', 'info')
      router.push('/giris')
      return
    }

    setIsSubmitting(true)
    showToast('Ödeme sayfasına yönlendiriliyor...', 'info')
    setTimeout(() => {
      setIsSubmitting(false)
      router.push('/odeme')
    }, 1000)
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
    <div className="min-h-screen bg-warm-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Sayfa Başlığı */}
          <div className="mb-8">
            <h1 className="text-h1 font-serif font-bold text-neutral mb-2">
              Sepetim ({cartItems.length} ürün)
            </h1>
            <p className="text-neutral-medium">
              Sepetinizdeki ürünleri gözden geçirin ve ödemeye geçin
            </p>
          </div>

          {/* Sepet İçeriği */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sol: Ürün Listesi */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => {
                const itemTotal = item.product.price * item.quantity
                return (
                  <Card key={item.id} className="p-6">
                    <div className="flex items-center gap-4">
                      {/* Ürün Resmi */}
                      <div className="w-20 h-20 bg-warm-50 rounded-lg flex-shrink-0 overflow-hidden relative">
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
                          {item.product.originalPrice && item.product.originalPrice > item.product.price && (
                            <span className="text-sm text-neutral-medium line-through">
                              {item.product.originalPrice.toLocaleString('tr-TR', {
                                style: 'currency',
                                currency: 'TRY',
                              })}
                            </span>
                          )}
                        </div>

                        {/* Miktar Seçici */}
                        <div className="flex items-center gap-4">
                          <label className="text-xs text-neutral-medium whitespace-nowrap">Miktar:</label>
                          <div className="flex items-center gap-2 bg-warm-50 rounded-lg p-1">
                            <button
                              onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                              className="w-8 h-8 rounded-md bg-white flex items-center justify-center text-neutral hover:bg-neutral hover:text-neutral-dark transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              <span className="text-lg font-medium">-</span>
                            </button>
                            <span className="w-8 text-center text-sm font-semibold text-neutral">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-md bg-white flex items-center justify-center text-neutral hover:bg-neutral hover:text-neutral-dark transition-colors"
                            >
                              <span className="text-lg font-medium">+</span>
                            </button>
                          </div>
                          
                          <div className="ml-auto">
                            <button
                              onClick={() => handleRemoveItem(item.product.id)}
                              className="text-danger hover:text-danger-dark transition-colors text-sm font-medium"
                            >
                              Sepetten Kaldır
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>

            {/* Sağ: Sepet Özeti */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="p-6 sticky top-24">
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

                <Button
                  fullWidth
                  size="lg"
                  onClick={handleCheckout}
                  loading={isSubmitting}
                  disabled={cartItems.length === 0}
                  className="bg-gradient-to-r from-sage to-sage-dark hover:from-sage-dark hover:to-sage text-white font-semibold py-3 mb-4"
                >
                  {isSubmitting ? 'Yönlendiriliyor...' : `Ödemeye Geç - ${(totalPrice + shippingFee).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}`}
                </Button>

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

