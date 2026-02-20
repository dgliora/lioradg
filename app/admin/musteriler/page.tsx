import { prisma } from '@/lib/prisma'
import { CustomersTable } from '@/components/admin/CustomersTable'

export const dynamic = 'force-dynamic'

async function getCustomers() {
  return await prisma.user.findMany({
    where: { role: { in: ['USER', 'ADMIN'] } },
    include: {
      orders: {
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: { product: { select: { name: true, categoryId: true } } },
          },
        },
      },
      _count: { select: { orders: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export default async function AdminCustomersPage() {
  const customers = await getCustomers()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Müşteri Yönetimi</h1>
        <p className="text-gray-600">{customers.length} müşteri listeleniyor</p>
      </div>

      <CustomersTable customers={customers} />
    </div>
  )
}

