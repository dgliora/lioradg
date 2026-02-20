import { prisma } from '@/lib/prisma'
import { Card } from '@/components/ui'
import { OrdersTable } from '@/components/admin/OrdersTable'

export const dynamic = 'force-dynamic'

async function getOrders() {
  return await prisma.order.findMany({
    include: {
      user: {
        select: { name: true, email: true },
      },
      items: {
        include: {
          product: {
            select: { name: true, images: true },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export default async function AdminOrdersPage() {
  const orders = await getOrders()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sipariş Yönetimi</h1>
        <p className="text-gray-600">{orders.length} sipariş listeleniyor</p>
      </div>

      {/* İstatistik Kartları */}
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

      <OrdersTable orders={orders} />
    </div>
  )
}

