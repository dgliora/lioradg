import { prisma } from '@/lib/prisma'
import { Card, Badge } from '@/components/ui'
import { formatPrice } from '@/lib/utils'

async function getOrders() {
  return await prisma.order.findMany({
    include: {
      user: {
        select: { name: true, email: true },
      },
      items: {
        include: {
          product: {
            select: { name: true },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
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

export default async function AdminOrdersPage() {
  const orders = await getOrders()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sipariş Yönetimi</h1>
        <p className="text-gray-600">{orders.length} sipariş listeleniyor</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Bekleyen', count: orders.filter(o => o.status === 'PENDING').length, color: 'bg-yellow-500' },
          { label: 'Hazırlanan', count: orders.filter(o => ['CONFIRMED', 'PROCESSING'].includes(o.status)).length, color: 'bg-blue-500' },
          { label: 'Kargoda', count: orders.filter(o => o.status === 'SHIPPED').length, color: 'bg-purple-500' },
          { label: 'Tamamlanan', count: orders.filter(o => o.status === 'DELIVERED').length, color: 'bg-green-500' },
        ].map((stat) => (
          <Card key={stat.label} padding="lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.count}</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg opacity-10`} />
            </div>
          </Card>
        ))}
      </div>

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
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    Henüz sipariş bulunmuyor
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
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
                      <Badge variant={statusMap[order.status]?.variant || 'default'}>
                        {statusMap[order.status]?.label || order.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
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
    </div>
  )
}

