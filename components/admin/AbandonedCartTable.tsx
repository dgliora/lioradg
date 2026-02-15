'use client'

import { useState } from 'react'
import { formatPrice } from '@/lib/utils'

interface AbandonedCart {
  id: string
  userId: string | null
  email: string | null
  userName: string | null
  total: number
  itemCount: number
  updatedAt: string
}

export function AbandonedCartTable({ carts }: { carts: AbandonedCart[] }) {
  const [sendingId, setSendingId] = useState<string | null>(null)
  const [results, setResults] = useState<Record<string, { ok: boolean; msg: string }>>({})

  const handleRemind = async (cart: AbandonedCart) => {
    if (!cart.email) return
    setSendingId(cart.id)

    try {
      const res = await fetch('/api/admin/abandoned-carts/remind', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartId: cart.id }),
      })

      const data = await res.json()

      if (res.ok) {
        setResults((prev) => ({ ...prev, [cart.id]: { ok: true, msg: 'Gönderildi!' } }))
      } else {
        setResults((prev) => ({ ...prev, [cart.id]: { ok: false, msg: data.error || 'Hata' } }))
      }
    } catch {
      setResults((prev) => ({ ...prev, [cart.id]: { ok: false, msg: 'Bağlantı hatası' } }))
    } finally {
      setSendingId(null)
    }
  }

  if (carts.length === 0) {
    return <p className="text-sm text-gray-400 text-center py-6">Terk edilen sepet yok</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 text-left text-xs text-gray-500 uppercase tracking-wider">
            <th className="pb-3 font-medium">Müşteri</th>
            <th className="pb-3 font-medium">Ürün</th>
            <th className="pb-3 font-medium">Tutar</th>
            <th className="pb-3 font-medium">Tarih</th>
            <th className="pb-3 font-medium">İşlem</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {carts.map((cart) => {
            const result = results[cart.id]
            return (
              <tr key={cart.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                <td className="py-3">
                  <p className="font-medium text-gray-800">{cart.userName || 'Misafir'}</p>
                  <p className="text-xs text-gray-400">{cart.email || '-'}</p>
                </td>
                <td className="py-3 text-gray-600">{cart.itemCount} ürün</td>
                <td className="py-3 font-semibold">{formatPrice(cart.total)}</td>
                <td className="py-3 text-gray-500 text-xs">
                  {new Date(cart.updatedAt).toLocaleString('tr-TR')}
                </td>
                <td className="py-3">
                  {result ? (
                    <span className={`text-xs font-medium ${result.ok ? 'text-green-600' : 'text-red-500'}`}>
                      {result.msg}
                    </span>
                  ) : (
                    <button
                      onClick={() => handleRemind(cart)}
                      disabled={!cart.email || sendingId === cart.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      {sendingId === cart.id ? (
                        <>
                          <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Gönderiliyor...
                        </>
                      ) : (
                        <>📧 Hatırlat</>
                      )}
                    </button>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
