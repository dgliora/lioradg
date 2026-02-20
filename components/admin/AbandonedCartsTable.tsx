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

function getFirstImage(images: string): string {
  try {
    const parsed = JSON.parse(images)
    return Array.isArray(parsed) ? parsed[0] || '' : images
  } catch {
    return images || ''
  }
}

interface AbandonedCartsTableProps {
  carts: CartWithDetails[]
}

const TEMPLATES = [
  {
    key: 'reminder',
    label: '🛒 Sepet Hatırlatma',
    defaultSubject: 'Sepetinizde ürünler bekliyor! 🛒',
    defaultMessage: 'Sepetinizdeki ürünler sizi bekliyor. Alışverişinizi tamamlamak için hâlâ vakit var!',
  },
  {
    key: 'discount',
    label: '🎁 İndirim Teklifi',
    defaultSubject: 'Sepetiniz için özel indirim! 🎁',
    defaultMessage: 'Sepetinizdeki ürünler hâlâ sizin için bekliyor. Özel indirim fırsatını kaçırmayın! İndirim kodunuz: SEPET10',
  },
  {
    key: 'lastchance',
    label: '⏰ Son Şans',
    defaultSubject: 'Son şans! Sepetinizdeki ürünler tükeniyor ⏰',
    defaultMessage: 'Sepetinizdeki ürünler stokta sınırlı sayıda bulunuyor. Kaçırmadan tamamlayın!',
  },
  {
    key: 'custom',
    label: '✏️ Özel Mesaj',
    defaultSubject: '',
    defaultMessage: '',
  },
]

function exportCSV(carts: CartWithDetails[]) {
  const rows = [['Müşteri', 'E-posta', 'Ürün Sayısı', 'Sepet Tutarı (TL)', 'Son Güncelleme']]
  carts.forEach((c) => {
    rows.push([
      c.user.name,
      c.user.email,
      String(c.items.reduce((s, i) => s + i.quantity, 0)),
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
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [showMailPanel, setShowMailPanel] = useState(false)
  const [template, setTemplate] = useState(TEMPLATES[0].key)
  const [editSubject, setEditSubject] = useState(TEMPLATES[0].defaultSubject)
  const [editMessage, setEditMessage] = useState(TEMPLATES[0].defaultMessage)
  const [sending, setSending] = useState(false)
  const [sendResult, setSendResult] = useState<{ sent: number; failed: number } | null>(null)

  const totalValue = carts.reduce((s, c) => s + c.total, 0)
  const filtered = carts.filter(
    (c) =>
      c.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(filtered.map((c) => c.user.id)))
    }
  }

  const handleSendMail = async () => {
    if (selected.size === 0) return
    setSending(true)
    setSendResult(null)
    try {
      const res = await fetch('/api/admin/cart-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userIds: Array.from(selected),
          template,
          customSubject: editSubject,
          customMessage: editMessage,
        }),
      })
      const data = await res.json()
      setSendResult({ sent: data.sent, failed: data.failed })
    } catch {
      setSendResult({ sent: 0, failed: selected.size })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* İstatistik */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-500">Bekleyen Sepet</p>
          <p className="text-2xl font-bold text-orange-500 mt-1">{carts.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-500">Potansiyel Gelir</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{formatPrice(totalValue)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-500">Ort. Sepet</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {formatPrice(carts.length > 0 ? totalValue / carts.length : 0)}
          </p>
        </div>
      </div>

      {/* Araç Çubuğu */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Müşteri ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sage focus:border-transparent"
          />
          <button
            onClick={() => exportCSV(filtered)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium whitespace-nowrap"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Excel
          </button>
          <button
            onClick={() => setShowMailPanel(!showMailPanel)}
            disabled={selected.size === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              selected.size > 0
                ? 'bg-sage text-white hover:bg-sage/90'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Mail Gönder {selected.size > 0 && `(${selected.size})`}
          </button>
        </div>

        {/* Mail Panel */}
        {showMailPanel && selected.size > 0 && (
          <div className="border border-sage/30 bg-sage/5 rounded-xl p-4 space-y-4">
            <h3 className="font-semibold text-gray-800 text-sm">Mail Şablonu Seç</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {TEMPLATES.map((t) => (
                <button
                  key={t.key}
                  onClick={() => {
                    setTemplate(t.key)
                    setEditSubject(t.defaultSubject)
                    setEditMessage(t.defaultMessage)
                  }}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    template === t.key
                      ? 'border-sage bg-white shadow-sm'
                      : 'border-gray-200 bg-white hover:border-sage/50'
                  }`}
                >
                  <p className="text-sm font-medium text-gray-800">{t.label}</p>
                </button>
              ))}
            </div>

            {/* Düzenlenebilir konu ve mesaj */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Konu</label>
                <input
                  type="text"
                  placeholder="E-posta konusu..."
                  value={editSubject}
                  onChange={(e) => setEditSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sage"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">
                  Mesaj <span className="text-gray-400 font-normal">(kupon kodu varsa buraya ekle)</span>
                </label>
                <textarea
                  placeholder="Mesaj içeriği..."
                  value={editMessage}
                  onChange={(e) => setEditMessage(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sage resize-none"
                />
              </div>
            </div>

            {sendResult && (
              <div className={`p-3 rounded-lg text-sm ${sendResult.failed === 0 ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                ✓ {sendResult.sent} mail gönderildi{sendResult.failed > 0 && `, ${sendResult.failed} başarısız`}
              </div>
            )}

            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">{selected.size} müşteriye gönderilecek</p>
              <button
                onClick={handleSendMail}
                disabled={sending || !editSubject || !editMessage}
                className="px-5 py-2 bg-sage text-white rounded-lg text-sm font-medium hover:bg-sage/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? 'Gönderiliyor...' : 'Gönder'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Liste */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center text-gray-400">
          Bekleyen sepet bulunamadı
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {/* Tümünü seç */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-gray-50">
            <input
              type="checkbox"
              checked={selected.size === filtered.length && filtered.length > 0}
              onChange={toggleAll}
              className="rounded text-sage focus:ring-sage"
            />
            <span className="text-xs text-gray-500">Tümünü Seç</span>
          </div>

          <div className="divide-y divide-gray-100">
            {filtered.map((cart) => {
              const itemCount = cart.items.reduce((s, i) => s + i.quantity, 0)
              const daysSince = Math.floor((Date.now() - new Date(cart.updatedAt).getTime()) / 86400000)
              const isOpen = expanded === cart.id
              const isSelected = selected.has(cart.user.id)

              return (
                <div key={cart.id} className={`${isSelected ? 'bg-sage/5' : ''}`}>
                  <div className="flex items-center gap-3 p-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(cart.user.id)}
                      className="rounded text-sage focus:ring-sage flex-shrink-0"
                    />
                    <div
                      className="flex items-center justify-between flex-1 cursor-pointer"
                      onClick={() => setExpanded(isOpen ? null : cart.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-sm flex-shrink-0">
                          {cart.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{cart.user.name}</p>
                          <p className="text-xs text-gray-400">{cart.user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                          <p className="text-xs text-gray-400">{itemCount} ürün</p>
                          <p className={`text-xs ${daysSince <= 3 ? 'text-green-500' : daysSince <= 7 ? 'text-yellow-500' : 'text-red-400'}`}>
                            {daysSince === 0 ? 'Bugün' : `${daysSince} gün önce`}
                          </p>
                        </div>
                        <p className="font-bold text-green-600">{formatPrice(cart.total)}</p>
                        <svg className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="border-t border-gray-100 px-4 py-3 bg-gray-50 ml-10">
                      <div className="space-y-2">
                        {cart.items.map((item) => {
                          const img = getFirstImage(item.product.images)
                          const price = item.product.salePrice || item.product.price
                          return (
                            <div key={item.id} className="flex items-center gap-3">
                              {img && <img src={img} alt={item.product.name} className="w-10 h-10 rounded-lg object-cover border border-gray-200" />}
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
        </div>
      )}
    </div>
  )
}
