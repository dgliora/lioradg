import { prisma } from '@/lib/prisma'
import { OrdersTable } from '@/components/admin/OrdersTable'

export const dynamic = 'force-dynamic'

async function getOrders() {
  return await prisma.order.findMany({
    include: {
      user: { select: { name: true, email: true } },
      items: {
        include: {
          product: { select: { name: true, images: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export default async function AdminOrdersPage() {
  const orders = await getOrders()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sipariş Yönetimi</h1>
        <p className="text-gray-600">{orders.length} sipariş</p>
      </div>
      <OrdersTable orders={orders} />
    </div>
  )
}

