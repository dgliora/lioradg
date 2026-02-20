'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Card, Badge } from '@/components/ui'
import { formatPrice } from '@/lib/utils'
import type { User, Order, OrderItem, Product } from '@prisma/client'

type OrderWithItems = Order & {
  items: (OrderItem & { product: { name: string; categoryId: string } })[]
}

type CustomerWithOrders = User & {
  orders: OrderWithItems[]
  _count: { orders: number }
}

interface CustomersTableProps {
  customers: CustomerWithOrders[]
}

function getCustomerStats(customer: CustomerWithOrders) {
  const totalSpent = customer.orders.reduce((s, o) => s + o.total, 0)
  const orderCount = customer.orders.length
  const avgBasket = orderCount > 0 ? totalSpent / orderCount : 0
  const lastOrder = customer.orders[0]?.createdAt ?? null
  const firstOrder = customer.orders[orderCount - 1]?.createdAt ?? null
  const daysSinceLastOrder = lastOrder
    ? Math.floor((Date.now() - new Date(lastOrder).getTime()) / 86400000)
    : null
  const isActive = daysSinceLastOrder !== null && daysSinceLastOrder <= 90
  return { totalSpent, orderCount, avgBasket, lastOrder, firstOrder, daysSinceLastOrder, isActive }
}

function exportCSV(customers: CustomerWithOrders[]) {
  const rows = [
    ['Ad Soyad', 'E-posta', 'Sipariş Sayısı', 'Toplam Harcama (TL)', 'Ort. Sepet (TL)', 'İlk Sipariş', 'Son Sipariş', 'E-posta Onayı', 'Kayıt Tarihi'],
  ]
  customers.forEach((c) => {
    const s = getCustomerStats(c)
    rows.push([
      c.name,
      c.email,
      String(s.orderCount),
      s.totalSpent.toFixed(2),
      s.avgBasket.toFixed(2),
      s.firstOrder ? new Date(s.firstOrder).toLocaleDateString('tr-TR') : '-',
      s.lastOrder ? new Date(s.lastOrder).toLocaleDateString('tr-TR') : '-',
      c.emailVerified ? 'Onaylı' : 'Bekliyor',
      new Date(c.createdAt).toLocaleDateString('tr-TR'),
    ])
  })
  const csv = '\uFEFF' + rows.map((r) => r.map((v) => `"${v}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `musteriler_${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export function CustomersTable({ customers: initialCustomers }: CustomersTableProps) {
  const router = useRouter()
  const [customers, setCustomers] = useState(initialCustomers)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'orders' | 'spent' | 'avg'>('date')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'passive' | 'unverified'>('all')
  const [filterSpent, setFilterSpent] = useState<'all' | '0' | '500' | '1000' | '5000'>('all')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState('')

  const handleDelete = async (customer: CustomerWithOrders) => {
    if (customer.role === 'ADMIN') return
    if (customer._count.orders > 0) { setError('Siparişi olan müşteri silinemez.'); return }
    if (!confirm(`${customer.name} silinsin mi?`)) return
    setDeletingId(customer.id)
    setError('')
    try {
      const res = await fetch(`/api/admin/users/${customer.id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Silinemedi'); return }
      setCustomers((prev) => prev.filter((c) => c.id !== customer.id))
      router.refresh()
    } catch { setError('Bağlantı hatası') }
    finally { setDeletingId(null) }
  }

  const filtered = useMemo(() => {
    return customers
      .filter((c) => {
        const s = getCustomerStats(c)
        const matchesSearch =
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.email.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus =
          filterStatus === 'all' ? true :
          filterStatus === 'active' ? s.isActive :
          filterStatus === 'passive' ? !s.isActive && s.orderCount > 0 :
          filterStatus === 'unverified' ? !c.emailVerified : true
        const minSpent = filterSpent === 'all' ? 0 : Number(filterSpent)
        const matchesSpent = s.totalSpent >= minSpent
        return matchesSearch && matchesStatus && matchesSpent
      })
      .sort((a, b) => {
        const sa = getCustomerStats(a)
        const sb = getCustomerStats(b)
        switch (sortBy) {
          case 'name': return a.name.localeCompare(b.name, 'tr')
          case 'orders': return sb.orderCount - sa.orderCount
          case 'spent': return sb.totalSpent - sa.totalSpent
          case 'avg': return sb.avgBasket - sa.avgBasket
          default: return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        }
      })
  }, [customers, searchQuery, sortBy, filterStatus, filterSpent])

  const totalRevenue = customers.reduce((s, c) => s + getCustomerStats(c).totalSpent, 0)
  const totalOrders = customers.reduce((s, c) => s + c._count.orders, 0)
  const activeCount = customers.filter((c) => getCustomerStats(c).isActive).length
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  return (
    <div className="space-y-4">
      {/* İstatistik Kartları */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Toplam Müşteri', value: customers.length, color: 'text-gray-900' },
          { label: 'Aktif Müşteri (90 gün)', value: activeCount, color: 'text-blue-600' },
          { label: 'Toplam Gelir', value: formatPrice(totalRevenue), color: 'text-green-600' },
          { label: 'Ort. Sepet Değeri', value: formatPrice(avgOrderValue), color: 'text-gray-900' },
        ].map((stat) => (
          <Card key={stat.label} padding="lg">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Filtreler + Export */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <input
            type="text"
            placeholder="İsim veya e-posta ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent text-sm"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage text-sm"
          >
            <option value="all">Tüm Müşteriler</option>
            <option value="active">Aktif (son 90 gün)</option>
            <option value="passive">Pasif</option>
            <option value="unverified">E-posta Onayı Bekleyen</option>
          </select>
          <select
            value={filterSpent}
            onChange={(e) => setFilterSpent(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage text-sm"
          >
            <option value="all">Tüm Harcamalar</option>
            <option value="500">500 TL+</option>
            <option value="1000">1.000 TL+</option>
            <option value="5000">5.000 TL+</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage text-sm"
          >
            <option value="date">Kayıt Tarihine Göre</option>
            <option value="spent">En Çok Harcayan</option>
            <option value="orders">En Çok Sipariş</option>
            <option value="avg">En Yüksek Ort. Sepet</option>
            <option value="name">İsme Göre (A-Z)</option>
          </select>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">{filtered.length} müşteri gösteriliyor</span>
          <button
            onClick={() => exportCSV(filtered)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Excel İndir ({filtered.length})
          </button>
        </div>
      </Card>

      {/* Tablo */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-left text-xs text-gray-500 uppercase tracking-wide">
                <th className="px-6 py-3 font-medium">Müşteri</th>
                <th className="px-6 py-3 font-medium">Sipariş</th>
                <th className="px-6 py-3 font-medium">Toplam Harcama</th>
                <th className="px-6 py-3 font-medium">Ort. Sepet</th>
                <th className="px-6 py-3 font-medium">Son Sipariş</th>
                <th className="px-6 py-3 font-medium">Durum</th>
                <th className="px-6 py-3 font-medium">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {error && (
                <tr><td colSpan={7} className="px-6 py-2 bg-red-50 text-red-600 text-sm">{error}</td></tr>
              )}
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400">Müşteri bulunamadı</td></tr>
              ) : (
                filtered.map((customer) => {
                  const s = getCustomerStats(customer)
                  return (
                    <tr
                      key={customer.id}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => router.push(`/admin/musteriler/${customer.id}`)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-gradient-to-br from-sage to-sage-dark rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {customer.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{customer.name}</p>
                            <p className="text-xs text-gray-400">{customer.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-sm text-gray-900">{s.orderCount}</p>
                        {s.firstOrder && (
                          <p className="text-xs text-gray-400">
                            İlk: {new Date(s.firstOrder).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-green-600 text-sm">{formatPrice(s.totalSpent)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-700">{formatPrice(s.avgBasket)}</p>
                      </td>
                      <td className="px-6 py-4">
                        {s.lastOrder ? (
                          <div>
                            <p className="text-sm text-gray-700">{new Date(s.lastOrder).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                            <p className={`text-xs ${s.daysSinceLastOrder! <= 30 ? 'text-green-500' : s.daysSinceLastOrder! <= 90 ? 'text-yellow-500' : 'text-red-400'}`}>
                              {s.daysSinceLastOrder} gün önce
                            </p>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">Sipariş yok</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <Badge variant={customer.emailVerified ? 'success' : 'warning'} className="text-xs w-fit">
                            {customer.emailVerified ? 'Onaylı' : 'Onay Bekliyor'}
                          </Badge>
                          {s.orderCount > 0 && (
                            <Badge variant={s.isActive ? 'success' : 'default'} className="text-xs w-fit">
                              {s.isActive ? 'Aktif' : 'Pasif'}
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => router.push(`/admin/musteriler/${customer.id}`)}
                            className="text-sage hover:text-sage-dark text-sm font-medium"
                          >
                            Detay
                          </button>
                          {customer.role !== 'ADMIN' && (
                            <button
                              onClick={() => handleDelete(customer)}
                              disabled={deletingId === customer.id || customer._count.orders > 0}
                              className="text-red-500 hover:text-red-700 text-sm disabled:opacity-30 disabled:cursor-not-allowed"
                              title={customer._count.orders > 0 ? 'Siparişi olan silinemez' : 'Sil'}
                            >
                              {deletingId === customer.id ? '...' : 'Sil'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
