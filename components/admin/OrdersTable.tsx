'use client'

import { useState } from 'react'
import { Card, Badge, Button } from '@/components/ui'
import { formatPrice } from '@/lib/utils'
import type { Order, User, OrderItem, Product } from '@prisma/client'

type OrderWithRelations = Order & {
  user: Pick<User, 'name' | 'email'>
  items: (OrderItem & {
    product: Pick<Product, 'name'>
  })[]
}

interface OrdersTableProps {
  orders: OrderWithRelations[]
}

const statusMap: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'danger' | 'info' }> = {
  PENDING: { label: 'Bekliyor', variant: 'warning' },
  CONFIRMED: { label: 'Onaylandı', variant: 'info' },
  PROCESSING: { label: 'Hazırlanıyor', variant: 'info' },
  SHIPPED: { label: 'Kargoda', variant: 'info' },
  DELIVERED: { label: 'Teslim Edildi', variant: 'success' },
  CANCELLED: { label: 'İptal Edildi', variant: 'danger' },
  REFUNDED: { label: 'İade Edildi', variant: 'default' },
}

export function OrdersTable({ orders }: OrdersTableProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [dateRange, setDateRange] = useState<string>('all')

  // Filtrelenmiş siparişler
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.user.email.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus
    
    let matchesDate = true
    if (dateRange !== 'all') {
      const orderDate = new Date(order.createdAt)
      const now = new Date()
      const daysDiff = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24))
      
      switch (dateRange) {
        case 'today':
          matchesDate = daysDiff === 0
          break
        case 'week':
          matchesDate = daysDiff <= 7
          break
        case 'month':
          matchesDate = daysDiff <= 30
          break
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate
  })

  // Excel export
  const handleExport = () => {
    const toCell = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`
    const csvHeader = ['Sipariş No', 'Müşteri', 'Email', 'Ürün Sayısı', 'Toplam', 'Durum', 'Tarih'].map(toCell).join(';') + '\n'
    const csvData = filteredOrders.map(order =>
      [
        order.orderNumber,
        order.user.name,
        order.user.email,
        order.items.length,
        order.total,
        statusMap[order.status]?.label || order.status,
        new Date(order.createdAt).toLocaleDateString('tr-TR'),
      ].map(toCell).join(';')
    ).join('\n')

    const blob = new Blob(['sep=;\n\uFEFF' + csvHeader + csvData], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `siparisler_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  // Durum değiştirme
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/admin/orders/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      })

      if (response.ok) {
        window.location.reload()
      } else {
        alert('Durum güncellenirken hata oluştu')
      }
    } catch (error) {
      alert('Durum güncellenirken hata oluştu')
    }
  }

  return (
    <div className="space-y-4">
      {/* Filtreler */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Arama */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ara
            </label>
            <input
              type="text"
              placeholder="Sipariş no, müşteri adı veya email ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent"
            />
          </div>

          {/* Durum Filtresi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Durum
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent"
            >
              <option value="all">Tümü</option>
              <option value="PENDING">Bekliyor</option>
              <option value="CONFIRMED">Onaylandı</option>
              <option value="PROCESSING">Hazırlanıyor</option>
              <option value="SHIPPED">Kargoda</option>
              <option value="DELIVERED">Teslim Edildi</option>
              <option value="CANCELLED">İptal Edildi</option>
            </select>
          </div>

          {/* Tarih Filtresi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tarih
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent"
            >
              <option value="all">Tümü</option>
              <option value="today">Bugün</option>
              <option value="week">Son 7 Gün</option>
              <option value="month">Son 30 Gün</option>
            </select>
          </div>
        </div>

        {/* Export Butonu */}
        <div className="mt-4 flex justify-end">
          <Button onClick={handleExport} size="sm" variant="ghost">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Excel İndir ({filteredOrders.length} sipariş)
          </Button>
        </div>
      </Card>

      {/* Sipariş Tablosu */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-left text-sm text-gray-600">
                <th className="px-6 py-4 font-medium">Sipariş No</th>
                <th className="px-6 py-4 font-medium">Müşteri</th>
                <th className="px-6 py-4 font-medium">Ürünler</th>
                <th className="px-6 py-4 font-medium">Toplam</th>
                <th className="px-6 py-4 font-medium">Durum</th>
                <th className="px-6 py-4 font-medium">Tarih</th>
                <th className="px-6 py-4 font-medium">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    {searchQuery || selectedStatus !== 'all' || dateRange !== 'all'
                      ? 'Filtrelere uygun sipariş bulunamadı'
                      : 'Henüz sipariş bulunmuyor'}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-mono text-sm font-medium text-gray-900">
                        #{order.orderNumber}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{order.user.name}</p>
                        <p className="text-sm text-gray-500">{order.user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">{order.items.length} ürün</p>
                        <p className="text-gray-500">
                          {order.items[0]?.product.name}
                          {order.items.length > 1 && ` +${order.items.length - 1}`}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">
                        {formatPrice(order.total)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="text-sm border-0 bg-transparent font-medium focus:ring-2 focus:ring-sage rounded px-2 py-1"
                      >
                        <option value="PENDING">Bekliyor</option>
                        <option value="CONFIRMED">Onaylandı</option>
                        <option value="PROCESSING">Hazırlanıyor</option>
                        <option value="SHIPPED">Kargoda</option>
                        <option value="DELIVERED">Teslim Edildi</option>
                        <option value="CANCELLED">İptal Edildi</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-sm text-primary hover:underline">
                        Detay
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Sonuç Sayısı */}
      <div className="text-sm text-gray-600 text-center">
        {filteredOrders.length} sipariş gösteriliyor (Toplam: {orders.length})
      </div>
    </div>
  )
}

