'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/lib/store/cartStore'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui'
import { calculateShippingFee } from '@/lib/utils/shipping'

export function MiniCart() {
  const [mounted, setMounted] = useState(false)
  const [shippingCost, setShippingCost] = useState(89.90)
  const { items, removeItem, getTotalPrice } = useCartStore()

  useEffect(() => {
    setMounted(true)
    // Kargo ücreti ayarını yükle
    fetch('/api/settings/shipping-fee')
      .then(res => res.json())
      .then(data => {
        if (data.shippingFee) {
          setShippingCost(data.shippingFee)
        }
      })
      .catch(() => {}) // Hata durumunda default değer kalır
  }, [])

  useEffect(() => {
    if (mounted && items.length > 0) {
      const total = getTotalPrice()
      calculateShippingFee(total).then(fee => {
        setShippingCost(fee)
      })
    } else if (mounted && items.length === 0) {
      // Sepet boş olduğunda da ayardan kargo ücretini al
      fetch('/api/settings/shipping-fee')
        .then(res => res.json())
        .then(data => {
          if (data.shippingFee) {
            setShippingCost(data.shippingFee)
          }
        })
        .catch(() => {})
    }
    // items array'inin içeriğini serialize ederek dependency olarak kullan
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(items.map(item => ({ id: item.product.id, quantity: item.quantity }))), mounted])

  if (!mounted) return null

  const total = getTotalPrice() + shippingCost

  return (
    <div className="absolute top-full right-0 mt-3 w-96 bg-white rounded-card shadow-hover border border-warm-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 p-6 max-h-[600px] flex flex-col">
      {items.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto text-neutral-light mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <p className="text-sm text-neutral-medium mb-4">Sepetiniz boş</p>
          <Link href="/urunler">
            <Button size="sm" variant="outline">
              Alışverişe Başla
            </Button>
          </Link>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-warm-100">
            <h3 className="font-serif font-semibold text-neutral">
              Sepetim ({items.length})
            </h3>
          </div>

          {/* Cart Items - Scrollable */}
          <div className="flex-1 overflow-y-auto mb-4 -mx-2 px-2 space-y-3">
            {items.map((item) => {
              const finalPrice = item.product.salePrice || item.product.price
              return (
                <div key={item.product.id} className="flex gap-3 p-3 rounded-lg hover:bg-warm-50 transition-colors">
                  <div className="relative w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-warm-100">
                    <Image
                      src={item.product.images || '/placeholder.jpg'}
                      alt={item.product.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-medium text-neutral truncate mb-1">
                      {item.product.name}
                    </h4>
                    <p className="text-xs text-neutral-medium mb-2">
                      {item.quantity} x {formatPrice(finalPrice)}
                    </p>
                    <p className="text-sm font-semibold text-sage">
                      {formatPrice(finalPrice * item.quantity)}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeItem(item.product.id)
                    }}
                    className="flex-shrink-0 text-neutral-light hover:text-danger transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )
            })}
          </div>

          {/* Summary */}
          <div className="pt-4 border-t border-warm-100 space-y-2 mb-4">
            <div className="flex justify-between text-sm text-neutral-medium">
              <span>Ara Toplam</span>
              <span>{formatPrice(getTotalPrice())}</span>
            </div>
            <div className="flex justify-between text-sm text-neutral-medium">
              <span>Kargo</span>
              <span className={shippingCost === 0 ? 'text-success font-medium' : ''}>
                {shippingCost === 0 ? 'Ücretsiz' : formatPrice(shippingCost)}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold text-neutral pt-2 border-t border-warm-100">
              <span>Toplam</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <Link href="/sepet" className="block">
              <Button fullWidth size="md" variant="outline">
                Sepeti Görüntüle
              </Button>
            </Link>
            <Link href="/odeme" className="block">
              <Button fullWidth size="md">
                Ödemeye Geç
              </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  )
}

