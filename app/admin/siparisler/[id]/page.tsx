'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  PENDING:    { label: 'Bekliyor',      color: 'bg-yellow-100 text-yellow-800' },
  CONFIRMED:  { label: 'Onaylandı',     color: 'bg-blue-100 text-blue-800' },
  PROCESSING: { label: 'Hazırlanıyor',  color: 'bg-purple-100 text-purple-800' },
  SHIPPED:    { label: 'Kargoda',       color: 'bg-orange-100 text-orange-800' },
  DELIVERED:  { label: 'Teslim Edildi', color: 'bg-green-100 text-green-800' },
  CANCELLED:  { label: 'İptal',         color: 'bg-red-100 text-red-800' },
  REFUNDED:   { label: 'İade',          color: 'bg-gray-100 text-gray-800' },
}

const ALL_STATUSES = Object.entries(STATUS_MAP)

interface OrderItem {
  id: string
  quantity: number
  price: number
  product: { id: string; name: string; images: string | null; slug: string }
}

interface Address {
  fullName: string
  phone: string
  address: string
  city: string
  district: string
  postalCode?: string | null
}

interface Order {
  id: string
  orderNumber: string
  status: string
  total: number
  subtotal: number
  shippingCost: number
  discount: number
  couponCode: string | null
  notes: string | null
  trackingNumber: string | null
  createdAt: string
  updatedAt: string
  user: { id: string; name: string; email: string }
  items: OrderItem[]
  shippingAddress: Address
  billingAddress: Address
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [status, setStatus] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [notes, setNotes] = useState('')
  const [saveMsg, setSaveMsg] = useState('')

  useEffect(() => {
    fetch(`/api/admin/orders/${orderId}`)
      .then((r) => r.json())
      .then((data) => {
        setOrder(data)
        setStatus(data.status)
        setTrackingNumber(data.trackingNumber || '')
        setNotes(data.notes || '')
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [orderId])

  const handleSave = async () => {
    setSaving(true)
    setSaveMsg('')
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, trackingNumber, notes }),
    })
    setSaving(false)
    if (res.ok) {
      setSaveMsg('Kaydedildi ✓')
      setTimeout(() => setSaveMsg(''), 3000)
    } else {
      setSaveMsg('Hata oluştu!')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 mb-4">Sipariş bulunamadı.</p>
        <Link href="/admin/siparisler" className="text-blue-600 hover:underline">← Siparişlere Dön</Link>
      </div>
    )
  }

  const firstImage = (img: string | null) => img?.split(',')[0]?.trim() || '/images/placeholder.jpg'

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Başlık */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => router.push('/admin/siparisler')}
            className="text-sm text-gray-500 hover:text-gray-700 mb-2 flex items-center gap-1"
          >
            ← Siparişlere Dön
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Sipariş #{order.orderNumber}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {new Date(order.createdAt).toLocaleDateString('tr-TR', {
              day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
            })}
          </p>
        </div>
        <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${STATUS_MAP[order.status]?.color || 'bg-gray-100 text-gray-800'}`}>
          {STATUS_MAP[order.status]?.label || order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sol: Ürünler + Özet */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ürünler */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Ürünler ({order.items.length})</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 px-5 py-4">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                    <Image
                      src={firstImage(item.product.images)}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{item.product.name}</p>
                    <p className="text-sm text-gray-500">{formatPrice(item.price)} × {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-900 flex-shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
            {/* Özet */}
            <div className="px-5 py-4 bg-gray-50 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Ara Toplam</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>İndirim {order.couponCode && `(${order.couponCode})`}</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Kargo</span>
                <span>{order.shippingCost === 0 ? 'Ücretsiz' : formatPrice(order.shippingCost)}</span>
              </div>
              <div className="flex justify-between font-semibold text-gray-900 pt-2 border-t border-gray-200 text-base">
                <span>Toplam</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Teslimat Adresi */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Teslimat Adresi</h2>
            </div>
            <div className="px-5 py-4 text-sm text-gray-700 space-y-1">
              <p className="font-medium">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.phone}</p>
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.district} / {order.shippingAddress.city}</p>
              {order.shippingAddress.postalCode && <p>{order.shippingAddress.postalCode}</p>}
            </div>
          </div>
        </div>

        {/* Sağ: İşlemler + Müşteri */}
        <div className="space-y-6">
          {/* Durum & Kargo Güncelle */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Sipariş Güncelle</h2>
            </div>
            <div className="px-5 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Durum</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  {ALL_STATUSES.map(([val, { label }]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Kargo Takip No</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Takip numarası..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Not</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Sipariş notu..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none"
                />
              </div>

              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-gray-900 hover:bg-gray-700 disabled:opacity-50 text-white font-medium py-2 rounded-lg text-sm transition-colors"
              >
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
              {saveMsg && (
                <p className={`text-sm text-center font-medium ${saveMsg.includes('Hata') ? 'text-red-600' : 'text-green-600'}`}>
                  {saveMsg}
                </p>
              )}
            </div>
          </div>

          {/* Müşteri Bilgisi */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Müşteri</h2>
            </div>
            <div className="px-5 py-4 space-y-2 text-sm">
              <p className="font-medium text-gray-900">{order.user.name}</p>
              <p className="text-gray-500">{order.user.email}</p>
              <Link
                href={`/admin/musteriler/${order.user.id}`}
                className="inline-block mt-2 text-blue-600 hover:underline text-xs"
              >
                Müşteri profilini gör →
              </Link>
            </div>
          </div>

          {/* Yazdır */}
          <button
            onClick={() => window.print()}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 rounded-lg text-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Yazdır / PDF
          </button>
        </div>
      </div>
    </div>
  )
}
