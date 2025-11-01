import { prisma } from '@/lib/prisma'
import { Card } from '@/components/ui'
import { formatPrice } from '@/lib/utils'

async function getDashboardStats() {
  const [
    totalProducts,
    totalOrders,
    totalUsers,
    pendingOrders,
    totalRevenue,
    lowStockProducts,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count({ where: { role: 'USER' } }),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { in: ['DELIVERED', 'SHIPPED'] } },
    }),
    prisma.product.count({ where: { stock: { lte: 10 } } }),
  ])

  return {
    totalProducts,
    totalOrders,
    totalUsers,
    pendingOrders,
    totalRevenue: totalRevenue._sum.total || 0,
    lowStockProducts,
  }
}

async function getRecentOrders() {
  return await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, email: true } },
      items: { include: { product: true } },
    },
  })
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats()
  const recentOrders = await getRecentOrders()

  const statCards = [
    {
      title: 'Toplam Ürün',
      value: stats.totalProducts,
      icon: '📦',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Toplam Sipariş',
      value: stats.totalOrders,
      icon: '🛒',
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Toplam Müşteri',
      value: stats.totalUsers,
      icon: '👥',
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Bekleyen Sipariş',
      value: stats.pendingOrders,
      icon: '⏳',
      color: 'from-orange-500 to-orange-600',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Hoş geldiniz! İşte genel bakış.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title} padding="lg" className="relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 rounded-full -mr-16 -mt-16`} />
            <div className="relative">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Revenue & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Toplam Gelir</h2>
          <div className="text-4xl font-bold text-green-600">
            {formatPrice(stats.totalRevenue)}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Tamamlanan ve kargoda olan siparişler
          </p>
        </Card>

        <Card className="bg-yellow-50 border-yellow-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Düşük Stok Uyarısı
              </h3>
              <p className="text-gray-700">
                <strong>{stats.lowStockProducts}</strong> ürünün stoğu 10&apos;un altında
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Son Siparişler</h2>
          <a href="/admin/siparisler" className="text-sm text-primary hover:underline">
            Tümünü Gör →
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 text-left text-sm text-gray-600">
                <th className="pb-3 font-medium">Sipariş No</th>
                <th className="pb-3 font-medium">Müşteri</th>
                <th className="pb-3 font-medium">Ürün Sayısı</th>
                <th className="pb-3 font-medium">Toplam</th>
                <th className="pb-3 font-medium">Durum</th>
                <th className="pb-3 font-medium">Tarih</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    Henüz sipariş bulunmuyor
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100">
                    <td className="py-4 font-medium">#{order.orderNumber}</td>
                    <td className="py-4">
                      <div>
                        <p className="font-medium text-gray-900">{order.user.name}</p>
                        <p className="text-xs text-gray-500">{order.user.email}</p>
                      </div>
                    </td>
                    <td className="py-4">{order.items.length} ürün</td>
                    <td className="py-4 font-semibold">{formatPrice(order.total)}</td>
                    <td className="py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          order.status === 'DELIVERED'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'SHIPPED'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'CANCELLED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {order.status === 'PENDING' && 'Bekliyor'}
                        {order.status === 'CONFIRMED' && 'Onaylandı'}
                        {order.status === 'PROCESSING' && 'Hazırlanıyor'}
                        {order.status === 'SHIPPED' && 'Kargoda'}
                        {order.status === 'DELIVERED' && 'Teslim Edildi'}
                        {order.status === 'CANCELLED' && 'İptal'}
                      </span>
                    </td>
                    <td className="py-4 text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString('tr-TR')}
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

