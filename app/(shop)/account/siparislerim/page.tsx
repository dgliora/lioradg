'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui'
import { formatPrice } from '@/lib/utils'

interface OrderProduct {
  id: string
  name: string
  images: string
  slug: string
}

interface OrderItem {
  id: string
  quantity: number
  price: number
  product: OrderProduct
}

interface Order {
  id: string
  orderNumber: string
  status: string
  total: number
  subtotal: number
  shippingCost: number
  discount: number
  trackingNumber: string | null
  createdAt: string
  items: OrderItem[]
}

const statusMap: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'danger' | 'info'; icon: string }> = {
  PENDING:    { label: 'Bekliyor',        variant: 'warning', icon: '⏳' },
  CONFIRMED:  { label: 'Onaylandı',       variant: 'info',    icon: '✅' },
  PROCESSING: { label: 'Hazırlanıyor',    variant: 'info',    icon: '📦' },
  SHIPPED:    { label: 'Kargoya Verildi', variant: 'info',    icon: '🚚' },
  DELIVERED:  { label: 'Teslim Edildi',   variant: 'success', icon: '🎉' },
  CANCELLED:  { label: 'İptal Edildi',    variant: 'danger',  icon: '❌' },
  REFUNDED:   { label: 'İade Edildi',     variant: 'default', icon: '↩️' },
}

function getFirstImage(images: string): string {
  try {
    const parsed = JSON.parse(images)
    return Array.isArray(parsed) ? parsed[0] || '' : images
  } catch {
    return images || ''
  }
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetch('/api/orders')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setOrders(data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-sage border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-h2 font-serif font-bold text-neutral mb-1">Siparişlerim</h2>
          <p className="text-sm text-neutral-medium">{orders.length} sipariş</p>
        </div>

        {orders.length > 0 && (
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-warm-100 rounded-lg text-sm focus:outline-none focus:border-sage"
          >
            <option value="all">Tüm Siparişler</option>
            {Object.entries(statusMap).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-warm-50 rounded-lg border-2 border-dashed border-warm-200">
          <div className="w-16 h-16 bg-warm-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-neutral-medium" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h3 className="text-h3 font-serif text-neutral mb-2">Henüz Sipariş Yok</h3>
          <p className="text-neutral-medium mb-6">İlk siparişinizi verin ve burada takip edin</p>
          <Link href="/urunler" className="inline-flex items-center gap-2 px-6 py-3 bg-sage text-white rounded-full text-sm font-medium hover:bg-sage-dark transition-colors">
            Alışverişe Başla
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center py-10 text-neutral-medium">Bu filtreye uygun sipariş bulunamadı.</p>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => {
            const status = statusMap[order.status] ?? { label: order.status, variant: 'default' as const, icon: '📋' }
            const isExpanded = expandedId === order.id
            const previewImages = order.items.slice(0, 4)

            return (
              <div key={order.id} className="bg-white border border-warm-100 rounded-2xl overflow-hidden hover:border-sage/30 transition-colors">
                {/* Header */}
                <button
                  className="w-full text-left p-5 flex items-center justify-between gap-4"
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {/* Ürün görselleri önizleme */}
                    <div className="flex -space-x-2 flex-shrink-0">
                      {previewImages.map((item, i) => {
                        const img = getFirstImage(item.product.images)
                        return (
                          <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-warm-50 overflow-hidden flex-shrink-0">
                            {img ? (
                              <Image src={img} alt={item.product.name} width={40} height={40} className="object-cover w-full h-full" />
                            ) : (
                              <div className="w-full h-full bg-warm-100" />
                            )}
                          </div>
                        )
                      })}
                      {order.items.length > 4 && (
                        <div className="w-10 h-10 rounded-full border-2 border-white bg-sage/10 flex items-center justify-center text-xs font-medium text-sage flex-shrink-0">
                          +{order.items.length - 4}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="font-semibold text-neutral text-sm">#{order.orderNumber}</p>
                      <p className="text-xs text-neutral-medium">
                        {new Date(order.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        {' · '}{order.items.length} ürün
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <Badge variant={status.variant}>{status.icon} {status.label}</Badge>
                    <span className="font-bold text-neutral">{formatPrice(order.total)}</span>
                    <svg
                      className={`w-4 h-4 text-neutral-medium transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Detay */}
                {isExpanded && (
                  <div className="border-t border-warm-100 p-5 space-y-4 bg-warm-50/30">
                    {/* Kargo takip */}
                    {order.trackingNumber && (
                      <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm">
                        <span className="text-xl">🚚</span>
                        <div>
                          <p className="font-medium text-blue-800">Kargo Takip Numarası</p>
                          <p className="font-mono font-bold text-blue-700">{order.trackingNumber}</p>
                        </div>
                      </div>
                    )}

                    {/* Ürünler */}
                    <div className="space-y-3">
                      {order.items.map((item) => {
                        const img = getFirstImage(item.product.images)
                        return (
                          <Link
                            key={item.id}
                            href={`/urun/${item.product.slug}`}
                            className="flex items-center gap-3 hover:bg-warm-50 rounded-xl p-2 -mx-2 transition-colors"
                          >
                            <div className="relative w-14 h-14 bg-white rounded-lg border border-warm-100 overflow-hidden flex-shrink-0">
                              {img ? (
                                <Image src={img} alt={item.product.name} fill sizes="56px" className="object-cover" />
                              ) : (
                                <div className="w-full h-full bg-warm-100" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-neutral truncate">{item.product.name}</p>
                              <p className="text-xs text-neutral-medium">{item.quantity} adet × {formatPrice(item.price)}</p>
                            </div>
                            <p className="text-sm font-semibold text-neutral flex-shrink-0">{formatPrice(item.price * item.quantity)}</p>
                          </Link>
                        )
                      })}
                    </div>

                    {/* Fiyat özeti */}
                    <div className="border-t border-warm-100 pt-3 space-y-1.5 text-sm">
                      <div className="flex justify-between text-neutral-medium">
                        <span>Ara Toplam</span>
                        <span>{formatPrice(order.subtotal)}</span>
                      </div>
                      {order.shippingCost > 0 && (
                        <div className="flex justify-between text-neutral-medium">
                          <span>Kargo</span>
                          <span>{formatPrice(order.shippingCost)}</span>
                        </div>
                      )}
                      {order.discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>İndirim</span>
                          <span>-{formatPrice(order.discount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold text-neutral pt-1 border-t border-warm-100">
                        <span>Toplam</span>
                        <span>{formatPrice(order.total)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
