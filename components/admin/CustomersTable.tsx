'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, Badge } from '@/components/ui'
import { formatPrice } from '@/lib/utils'
import type { User, Order } from '@prisma/client'

type CustomerWithOrders = User & {
  orders: Order[]
  _count: {
    orders: number
  }
}

interface CustomersTableProps {
  customers: CustomerWithOrders[]
}

export function CustomersTable({ customers: initialCustomers }: CustomersTableProps) {
  const router = useRouter()
  const [customers, setCustomers] = useState(initialCustomers)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'orders' | 'date'>('date')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState('')

  const handleDelete = async (customer: CustomerWithOrders) => {
    if (customer.role === 'ADMIN') return
    if (customer._count.orders > 0) {
      setError('Siparişi olan müşteri silinemez.')
      return
    }
    if (!confirm(`${customer.name} (${customer.email}) müşterisini silmek istediğinize emin misiniz?`)) return
    setDeletingId(customer.id)
    setError('')
    try {
      const res = await fetch(`/api/admin/users/${customer.id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Silinemedi')
        return
      }
      setCustomers((prev) => prev.filter((c) => c.id !== customer.id))
      router.refresh()
    } catch {
      setError('Bağlantı hatası')
    } finally {
      setDeletingId(null)
    }
  }

  // Filtrelenmiş ve sıralanmış müşteriler
  const filteredCustomers = customers
    .filter(customer => {
      const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           customer.email.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesSearch
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name, 'tr')
        case 'orders':
          return b._count.orders - a._count.orders
        case 'date':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

  // Müşteri istatistikleri
  const totalRevenue = customers.reduce((sum, customer) => {
    return sum + customer.orders.reduce((orderSum, order) => orderSum + order.total, 0)
  }, 0)

  const avgOrderValue = customers.length > 0
    ? totalRevenue / customers.reduce((sum, c) => sum + c._count.orders, 0)
    : 0

  return (
    <div className="space-y-4">
      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card padding="lg">
          <div>
            <p className="text-sm text-gray-600">Toplam Müşteri</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{customers.length}</p>
          </div>
        </Card>
        <Card padding="lg">
          <div>
            <p className="text-sm text-gray-600">Aktif Müşteri</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {customers.filter(c => c._count.orders > 0).length}
            </p>
          </div>
        </Card>
        <Card padding="lg">
          <div>
            <p className="text-sm text-gray-600">Toplam Gelir</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {formatPrice(totalRevenue)}
            </p>
          </div>
        </Card>
        <Card padding="lg">
          <div>
            <p className="text-sm text-gray-600">Ort. Sipariş Değeri</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {formatPrice(avgOrderValue)}
            </p>
          </div>
        </Card>
      </div>

      {/* Filtreler */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Arama */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ara
            </label>
            <input
              type="text"
              placeholder="Müşteri adı veya email ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent"
            />
          </div>

          {/* Sıralama */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sırala
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent"
            >
              <option value="date">Kayıt Tarihine Göre</option>
              <option value="name">İsme Göre (A-Z)</option>
              <option value="orders">Sipariş Sayısına Göre</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Müşteri Tablosu */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-left text-sm text-gray-600">
                <th className="px-6 py-4 font-medium">Müşteri</th>
                <th className="px-6 py-4 font-medium">E-posta</th>
                <th className="px-6 py-4 font-medium">Sipariş Sayısı</th>
                <th className="px-6 py-4 font-medium">Toplam Harcama</th>
                <th className="px-6 py-4 font-medium">Kayıt Tarihi</th>
                <th className="px-6 py-4 font-medium">E-posta Onayı</th>
                <th className="px-6 py-4 font-medium w-24">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {error && (
                <tr>
                  <td colSpan={7} className="px-6 py-2 bg-red-50 text-red-600 text-sm">
                    {error}
                  </td>
                </tr>
              )}
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    {searchQuery
                      ? 'Filtrelere uygun müşteri bulunamadı'
                      : 'Henüz müşteri kaydı bulunmuyor'}
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => {
                  const totalSpent = customer.orders.reduce((sum, order) => sum + order.total, 0)

                  return (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-sage to-sage-dark rounded-full flex items-center justify-center text-white font-semibold">
                            {customer.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{customer.name}</p>
                            {customer.role === 'ADMIN' && (
                              <Badge variant="info" className="text-xs">Admin</Badge>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {customer.email}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="font-semibold text-gray-900">
                            {customer._count.orders} sipariş
                          </p>
                          {customer._count.orders > 0 && (
                            <p className="text-xs text-gray-500">
                              Son: {new Date(customer.orders[customer.orders.length - 1]?.createdAt).toLocaleDateString('tr-TR')}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-green-600">
                          {formatPrice(totalSpent)}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(customer.createdAt).toLocaleDateString('tr-TR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={customer.emailVerified ? 'success' : 'warning'}>
                          {customer.emailVerified ? 'Onaylı' : 'Bekliyor'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        {customer.role === 'ADMIN' ? (
                          <span className="text-xs text-gray-400">—</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleDelete(customer)}
                            disabled={deletingId === customer.id || customer._count.orders > 0}
                            className="text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            title={customer._count.orders > 0 ? 'Siparişi olan müşteri silinemez' : 'Müşteriyi sil'}
                          >
                            {deletingId === customer.id ? '...' : 'Sil'}
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Sonuç Sayısı */}
      <div className="text-sm text-gray-600 text-center">
        {filteredCustomers.length} müşteri gösteriliyor (Toplam: {customers.length})
      </div>
    </div>
  )
}

