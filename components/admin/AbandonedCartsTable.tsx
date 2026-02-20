'use client'

import { useState } from 'react'
import { formatPrice } from '@/lib/utils'
import type { Cart, CartItem, Product, User } from '@prisma/client'

type CartWithDetails = Cart & {
  user: Pick<User, 'id' | 'name' | 'email'>
  items: (CartItem & {
    product: Pick<Product, 'name' | 'images' | 'price' | 'salePrice'>
  })[]
}

interface AbandonedCartsTableProps {
  carts: CartWithDetails[]
}

function exportCSV(carts: CartWithDetails[]) {
  const rows = [['Müşteri', 'E-posta', 'Ürün Sayısı', 'Sepet Tutarı (TL)', 'Son Güncelleme']]
  carts.forEach((c) => {
    const itemCount = c.items.reduce((s, i) => s + i.quantity, 0)
    rows.push([
      c.user.name,
      c.user.email,
      String(itemCount),
      c.total.toFixed(2),
      new Date(c.updatedAt).toLocaleDateString('tr-TR'),
    ])
  })
  const csv = '\uFEFF' + rows.map((r) => r.map((v) => `"${v}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `sepette_bekleyenler_${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export function AbandonedCartsTable({ carts }: AbandonedCartsTableProps) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const totalValue = carts.reduce((s, c) => s + c.total, 0)

  const filtered = carts.filter(
    (c) =>
      c.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-4">
      {/* İstatistik */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-500">Bekleyen Sepet</p>
          <p className="text-2xl font-bold text-orange-500 mt-1">{carts.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-500">Toplam Potansiyel Gelir</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{formatPrice(totalValue)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-500">Ort. Sepet Değeri</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {formatPrice(carts.length > 0 ? totalValue / carts.length : 0)}
          </p>
        </div>
      </div>

      {/* Filtre + Export */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
        <input
          type="text"
          placeholder="Müşteri adı veya e-posta ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sage focus:border-transparent"
        />
        <button
          onClick={() => exportCSV(filtered)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium whitespace-nowrap"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Excel İndir
        </button>
      </div>

      {/* Liste */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center text-gray-400">
          Bekleyen sepet bulunamadı
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((cart) => {
            const itemCount = cart.items.reduce((s, i) => s + i.quantity, 0)
            const daysSince = Math.floor((Date.now() - new Date(cart.updatedAt).getTime()) / 86400000)
            const isOpen = expanded === cart.id

            return (
              <div key={cart.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                {/* Satır */}
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpanded(isOpen ? null : cart.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-sm">
                      {cart.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{cart.user.name}</p>
                      <p className="text-xs text-gray-400">{cart.user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs text-gray-400">{itemCount} ürün</p>
                      <p className="text-xs text-gray-400">
                        {daysSince === 0 ? 'Bugün' : `${daysSince} gün önce`}
                      </p>
                    </div>
                    <p className="font-bold text-green-600">{formatPrice(cart.total)}</p>
                    <svg
                      className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Ürünler */}
                {isOpen && (
                  <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
                    <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Sepetteki Ürünler</p>
                    <div className="space-y-2">
                      {cart.items.map((item) => {
                        const imgs = JSON.parse(item.product.images || '[]')
                        const price = item.product.salePrice || item.product.price
                        return (
                          <div key={item.id} className="flex items-center gap-3">
                            {imgs[0] && (
                              <img src={imgs[0]} alt={item.product.name} className="w-10 h-10 rounded-lg object-cover border border-gray-200" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-800 truncate">{item.product.name}</p>
                              <p className="text-xs text-gray-400">{item.quantity} adet × {formatPrice(price)}</p>
                            </div>
                            <p className="text-sm font-semibold text-gray-700">{formatPrice(price * item.quantity)}</p>
                          </div>
                        )
                      })}
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
