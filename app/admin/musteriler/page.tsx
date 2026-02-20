import { prisma } from '@/lib/prisma'
import { CustomersTable } from '@/components/admin/CustomersTable'
import { AbandonedCartsTable } from '@/components/admin/AbandonedCartsTable'

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

async function getAbandonedCarts() {
  return await prisma.cart.findMany({
    where: {
      status: 'ACTIVE',
      total: { gt: 0 },
      items: { some: {} },
    },
    include: {
      user: { select: { id: true, name: true, email: true } },
      items: {
        include: {
          product: { select: { name: true, images: true, price: true, salePrice: true } },
        },
      },
    },
    orderBy: { updatedAt: 'desc' },
  })
}

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: { tab?: string }
}) {
  const activeTab = searchParams.tab || 'musteriler'
  const [customers, abandonedCarts] = await Promise.all([getCustomers(), getAbandonedCarts()])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Müşteri Yönetimi</h1>
      </div>

      {/* Sekmeler */}
      <div className="flex gap-1 border-b border-gray-200">
        {[
          { key: 'musteriler', label: `Müşteriler (${customers.length})` },
          { key: 'sepet', label: `Sepette Bekleyenler (${abandonedCarts.length})` },
        ].map((tab) => (
          <a
            key={tab.key}
            href={`?tab=${tab.key}`}
            className={`px-5 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === tab.key
                ? 'border-sage text-sage'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </a>
        ))}
      </div>

      {activeTab === 'musteriler' && <CustomersTable customers={customers} />}
      {activeTab === 'sepet' && <AbandonedCartsTable carts={abandonedCarts} />}
    </div>
  )
}
