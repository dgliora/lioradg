'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, Badge, Button } from '@/components/ui'
import { formatPrice } from '@/lib/utils'
import type { Order, User, OrderItem, Product } from '@prisma/client'

type OrderWithRelations = Order & {
  user: Pick<User, 'name' | 'email'>
  items: (OrderItem & {
    product: Pick<Product, 'name' | 'images'>
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

export function OrdersTable({ orders: initialOrders }: OrdersTableProps) {
  const [orders, setOrders] = useState(initialOrders)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [dateRange, setDateRange] = useState<string>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({})
  const [savingTracking, setSavingTracking] = useState<string | null>(null)
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [bulkStatus, setBulkStatus] = useState('')
  const [bulkSaving, setBulkSaving] = useState(false)

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

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/orders/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      })
      if (res.ok) {
        setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: newStatus as Order['status'] } : o))
      } else {
        alert('Durum güncellenirken hata oluştu')
      }
    } catch {
      alert('Durum güncellenirken hata oluştu')
    }
  }

  const handleSaveTracking = async (orderId: string) => {
    const trackingNumber = trackingInputs[orderId] ?? ''
    setSavingTracking(orderId)
    try {
      const res = await fetch('/api/admin/orders/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, trackingNumber }),
      })
      if (res.ok) {
        setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, trackingNumber: trackingNumber || null } : o))
      } else {
        alert('Kargo numarası kaydedilemedi')
      }
    } catch {
      alert('Kargo numarası kaydedilemedi')
    } finally {
      setSavingTracking(null)
    }
  }

  const handleBulkStatusUpdate = async () => {
    if (!bulkStatus || selectedOrders.length === 0) return
    setBulkSaving(true)
    try {
      await Promise.all(
        selectedOrders.map((id) =>
          fetch('/api/admin/orders/update-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: id, status: bulkStatus }),
          })
        )
      )
      setOrders((prev) =>
        prev.map((o) => selectedOrders.includes(o.id) ? { ...o, status: bulkStatus as Order['status'] } : o)
      )
      setSelectedOrders([])
      setBulkStatus('')
    } catch {
      alert('Toplu güncelleme başarısız')
    } finally {
      setBulkSaving(false)
    }
  }

  const stats = [
    { label: 'Bekleyen',   count: orders.filter(o => o.status === 'PENDING').length,                              color: 'bg-yellow-500', text: 'text-yellow-700' },
    { label: 'Hazırlanan', count: orders.filter(o => ['CONFIRMED','PROCESSING'].includes(o.status)).length,       color: 'bg-blue-500',   text: 'text-blue-700' },
    { label: 'Kargoda',    count: orders.filter(o => o.status === 'SHIPPED').length,                              color: 'bg-purple-500', text: 'text-purple-700' },
    { label: 'Tamamlanan', count: orders.filter(o => o.status === 'DELIVERED').length,                            color: 'bg-green-500',  text: 'text-green-700' },
  ]

  return (
    <div className="space-y-4">
      {/* İstatistik Kartları */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} padding="lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{s.label}</p>
                <p className={`text-2xl font-bold mt-1 ${s.text}`}>{s.count}</p>
              </div>
              <div className={`w-10 h-10 ${s.color} rounded-lg opacity-15`} />
            </div>
          </Card>
        ))}
      </div>

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

      {/* Toplu İşlem Barı */}
      {selectedOrders.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl text-sm">
          <span className="font-medium text-blue-900">{selectedOrders.length} sipariş seçildi</span>
          <select
            value={bulkStatus}
            onChange={(e) => setBulkStatus(e.target.value)}
            className="border border-blue-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          >
            <option value="">Durum Seç</option>
            <option value="PENDING">⏳ Bekliyor</option>
            <option value="CONFIRMED">✅ Onaylandı</option>
            <option value="PROCESSING">📦 Hazırlanıyor</option>
            <option value="SHIPPED">🚚 Kargoda</option>
            <option value="DELIVERED">🎉 Teslim Edildi</option>
            <option value="CANCELLED">❌ İptal</option>
          </select>
          <button
            onClick={handleBulkStatusUpdate}
            disabled={!bulkStatus || bulkSaving}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
          >
            {bulkSaving ? 'Güncelleniyor...' : 'Uygula'}
          </button>
          <button
            onClick={() => setSelectedOrders([])}
            className="ml-auto text-blue-600 hover:text-blue-800 underline"
          >
            Seçimi Temizle
          </button>
        </div>
      )}

      {/* Sipariş Tablosu */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-left text-sm text-gray-600">
                <th className="px-4 py-4 font-medium w-10">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                    onChange={() =>
                      setSelectedOrders(
                        selectedOrders.length === filteredOrders.length
                          ? []
                          : filteredOrders.map((o) => o.id)
                      )
                    }
                    className="rounded border-gray-300"
                  />
                </th>
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
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    {searchQuery || selectedStatus !== 'all' || dateRange !== 'all'
                      ? 'Filtrelere uygun sipariş bulunamadı'
                      : 'Henüz sipariş bulunmuyor'}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isExpanded = expandedId === order.id
                  const trackingVal = trackingInputs[order.id] ?? (order.trackingNumber || '')
                  return (
                    <>
                      <tr key={order.id} className={`hover:bg-gray-50 cursor-pointer ${isExpanded ? 'bg-gray-50' : ''}`}
                        onClick={() => setExpandedId(isExpanded ? null : order.id)}>
                        <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={selectedOrders.includes(order.id)}
                            onChange={() =>
                              setSelectedOrders((prev) =>
                                prev.includes(order.id) ? prev.filter((id) => id !== order.id) : [...prev, order.id]
                              )
                            }
                            className="rounded border-gray-300"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-mono text-sm font-medium text-gray-900">#{order.orderNumber}</p>
                          {order.trackingNumber && (
                            <p className="text-xs text-blue-600 font-mono mt-0.5">🚚 {order.trackingNumber}</p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900">{order.user.name}</p>
                          <p className="text-sm text-gray-500">{order.user.email}</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <p className="font-medium text-gray-900">{order.items.length} ürün</p>
                          <p className="text-gray-500 truncate max-w-[160px]">
                            {order.items[0]?.product.name}{order.items.length > 1 && ` +${order.items.length - 1}`}
                          </p>
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-900">{formatPrice(order.total)}</td>
                        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className={`text-xs border rounded-full px-3 py-1 font-medium focus:ring-2 focus:ring-sage cursor-pointer ${
                              order.status === 'DELIVERED' ? 'bg-green-50 border-green-200 text-green-700' :
                              order.status === 'CANCELLED' ? 'bg-red-50 border-red-200 text-red-700' :
                              order.status === 'SHIPPED' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                              'bg-yellow-50 border-yellow-200 text-yellow-700'
                            }`}
                          >
                            <option value="PENDING">⏳ Bekliyor</option>
                            <option value="CONFIRMED">✅ Onaylandı</option>
                            <option value="PROCESSING">📦 Hazırlanıyor</option>
                            <option value="SHIPPED">🚚 Kargoda</option>
                            <option value="DELIVERED">🎉 Teslim Edildi</option>
                            <option value="CANCELLED">❌ İptal</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/admin/siparisler/${order.id}`}
                              className="text-xs px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                            >
                              Detay
                            </Link>
                            <svg className={`w-4 h-4 text-gray-400 transition-transform cursor-pointer ${isExpanded ? 'rotate-180' : ''}`}
                              onClick={(e) => { e.stopPropagation(); setExpandedId(isExpanded ? null : order.id) }}
                              fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr key={`${order.id}-detail`} className="bg-blue-50/30">
                          <td colSpan={8} className="px-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Ürünler */}
                              <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Ürünler</p>
                                <div className="space-y-1.5">
                                  {order.items.map((item) => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                      <span className="text-gray-700">{item.product.name} <span className="text-gray-400">×{item.quantity}</span></span>
                                      <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              {/* Kargo Takip No */}
                              <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Kargo Takip Numarası</p>
                                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                                  <input
                                    type="text"
                                    value={trackingVal}
                                    onChange={(e) => setTrackingInputs((prev) => ({ ...prev, [order.id]: e.target.value }))}
                                    placeholder="Takip numarası girin..."
                                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent"
                                  />
                                  <Button
                                    size="sm"
                                    onClick={() => handleSaveTracking(order.id)}
                                    loading={savingTracking === order.id}
                                  >
                                    Kaydet
                                  </Button>
                                </div>
                                {order.trackingNumber && (
                                  <p className="text-xs text-blue-600 mt-1">Mevcut: <span className="font-mono">{order.trackingNumber}</span></p>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  )
                })
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

