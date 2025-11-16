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
    ordersByStatus,
    topProducts,
    revenueByDay,
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
    // Sipariş durumlarına göre istatistik
    prisma.order.groupBy({
      by: ['status'],
      _count: { id: true },
    }),
    // En çok satan ürünler
    prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    }),
    // Son 7 günlük gelir (basit)
    prisma.order.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
        status: { in: ['DELIVERED', 'SHIPPED'] },
      },
      select: {
        createdAt: true,
        total: true,
      },
    }),
  ])

  // Top products'ı detaylı bilgiyle birleştir
  const topProductsWithDetails = await Promise.all(
    topProducts.map(async (item) => {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { name: true, image: true },
      })
      return {
        ...item,
        product,
      }
    })
  )

  // Geliri günlere göre grupla
  const revenueByDayMap = new Map<string, number>()
  revenueByDay.forEach((order) => {
    const day = new Date(order.createdAt).toLocaleDateString('tr-TR', { 
      day: '2-digit', 
      month: '2-digit' 
    })
    revenueByDayMap.set(day, (revenueByDayMap.get(day) || 0) + order.total)
  })

  return {
    totalProducts,
    totalOrders,
    totalUsers,
    pendingOrders,
    totalRevenue: totalRevenue._sum.total || 0,
    lowStockProducts,
    ordersByStatus,
    topProducts: topProductsWithDetails,
    revenueByDay: Array.from(revenueByDayMap.entries()).map(([day, total]) => ({
      day,
      total,
    })),
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

async function getActiveCampaigns() {
  return await prisma.campaign.findMany({
    where: {
      active: true,
      startDate: {
        lte: new Date()
      },
      endDate: {
        gte: new Date()
      }
    },
    take: 5,
    orderBy: {
      createdAt: 'desc'
    }
  })
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats()
  const recentOrders = await getRecentOrders()
  const activeCampaigns = await getActiveCampaigns()

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

      {/* Sipariş Durumları & En Çok Satanlar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sipariş Durumları */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Sipariş Durumları</h2>
          <div className="space-y-4">
            {stats.ordersByStatus.map((item) => {
              const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
                PENDING: { label: 'Bekleyen', color: 'text-yellow-700', bgColor: 'bg-yellow-500' },
                CONFIRMED: { label: 'Onaylanan', color: 'text-blue-700', bgColor: 'bg-blue-500' },
                PROCESSING: { label: 'Hazırlanan', color: 'text-purple-700', bgColor: 'bg-purple-500' },
                SHIPPED: { label: 'Kargoda', color: 'text-indigo-700', bgColor: 'bg-indigo-500' },
                DELIVERED: { label: 'Teslim Edilen', color: 'text-green-700', bgColor: 'bg-green-500' },
                CANCELLED: { label: 'İptal Edilen', color: 'text-red-700', bgColor: 'bg-red-500' },
              }
              
              const config = statusConfig[item.status] || { label: item.status, color: 'text-gray-700', bgColor: 'bg-gray-500' }
              const percentage = stats.totalOrders > 0 ? (item._count.id / stats.totalOrders) * 100 : 0

              return (
                <div key={item.status}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-medium ${config.color}`}>
                      {config.label}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {item._count.id} ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`${config.bgColor} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
            {stats.ordersByStatus.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">Henüz sipariş yok</p>
            )}
          </div>
        </Card>

        {/* En Çok Satanlar */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">En Çok Satanlar</h2>
          <div className="space-y-4">
            {stats.topProducts.map((item, index) => (
              <div key={item.productId} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sage to-sage-dark flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {item.product?.name || 'Bilinmeyen Ürün'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item._sum.quantity} adet satıldı
                  </p>
                </div>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-sage to-sage-dark h-2 rounded-full"
                    style={{ 
                      width: `${((item._sum.quantity || 0) / (stats.topProducts[0]._sum.quantity || 1)) * 100}%` 
                    }}
                  />
                </div>
              </div>
            ))}
            {stats.topProducts.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">Henüz satış yok</p>
            )}
          </div>
        </Card>
      </div>

      {/* Gelir Grafiği (Son 7 Gün) */}
      {stats.revenueByDay.length > 0 && (
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Son 7 Günlük Gelir</h2>
          <div className="flex items-end justify-between gap-2 h-64">
            {stats.revenueByDay.map((item) => {
              const maxRevenue = Math.max(...stats.revenueByDay.map(d => d.total))
              const heightPercentage = maxRevenue > 0 ? (item.total / maxRevenue) * 100 : 0

              return (
                <div key={item.day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="relative w-full group">
                    <div 
                      className="bg-gradient-to-t from-sage to-sage-light rounded-t-lg transition-all duration-300 hover:from-sage-dark hover:to-sage"
                      style={{ height: `${Math.max(heightPercentage, 5)}%` }}
                    />
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      {formatPrice(item.total)}
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 font-medium">{item.day}</span>
                </div>
              )
            })}
          </div>
        </Card>
      )}

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

      {/* Aktif Kampanyalar */}
      <Card>
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">🎁 Aktif Kampanyalar</h2>
        </div>
        {activeCampaigns.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            Şu an aktif kampanya bulunmuyor
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {activeCampaigns.map((campaign) => (
              <div key={campaign.id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{campaign.title}</h3>
                    {campaign.description && (
                      <p className="text-sm text-gray-600 mt-1">{campaign.description}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">
                      {campaign.type === 'PERCENTAGE' && `%${campaign.value}`}
                      {campaign.type === 'FIXED' && `${campaign.value} TL`}
                      {campaign.type === 'FREE_SHIPPING' && 'Ücretsiz Kargo'}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(campaign.startDate).toLocaleDateString('tr-TR')} - {new Date(campaign.endDate).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

