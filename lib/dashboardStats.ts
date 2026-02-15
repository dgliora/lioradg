import { prisma } from '@/lib/prisma'
import type {
  DailySummary,
  RevenueChartItem,
  TopProductItem,
  StockAlert,
  RecentOrder,
  DashboardData,
} from '@/types/dashboard'
import { getProfitabilityData } from '@/lib/services/profitability'
import { getAnalyticsData } from '@/lib/services/analytics'
import { getAbandonedCartStats } from '@/lib/services/abandonedCart'

// "Ödeme başarılı" kabul edilen status'lar
const PAID_STATUSES = ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'] as const
const FAILED_STATUSES = ['CANCELLED', 'REFUNDED'] as const

function startOfDay(date: Date): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

// 1) Günlük Özet
async function getDailySummary(): Promise<DailySummary> {
  const todayStart = startOfDay(new Date())

  const [paidToday, failedToday, allToday] = await Promise.all([
    prisma.order.aggregate({
      _sum: { total: true },
      _count: { id: true },
      where: {
        createdAt: { gte: todayStart },
        status: { in: [...PAID_STATUSES] },
      },
    }),
    prisma.order.count({
      where: {
        createdAt: { gte: todayStart },
        status: { in: [...FAILED_STATUSES] },
      },
    }),
    prisma.order.count({
      where: { createdAt: { gte: todayStart } },
    }),
  ])

  return {
    todayRevenue: paidToday._sum.total ?? 0,
    todayOrderCount: allToday,
    paidOrderCount: paidToday._count.id,
    failedOrderCount: failedToday,
  }
}

// 2) Son 7 Gün Satış Grafiği
async function getRevenueChart(): Promise<RevenueChartItem[]> {
  const now = new Date()
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  sevenDaysAgo.setHours(0, 0, 0, 0)

  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: sevenDaysAgo },
      status: { in: [...PAID_STATUSES] },
    },
    select: {
      createdAt: true,
      total: true,
    },
  })

  // 7 günü hazırla (bugün dahil)
  const dayMap = new Map<string, { revenue: number; orderCount: number }>()
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    const key = d.toISOString().slice(0, 10) // YYYY-MM-DD
    dayMap.set(key, { revenue: 0, orderCount: 0 })
  }

  // Siparişleri günlere dağıt
  for (const order of orders) {
    const key = order.createdAt.toISOString().slice(0, 10)
    const existing = dayMap.get(key)
    if (existing) {
      existing.revenue += order.total
      existing.orderCount += 1
    }
  }

  const result: RevenueChartItem[] = []
  dayMap.forEach((val, dateStr) => {
    const d = new Date(dateStr + 'T00:00:00')
    result.push({
      date: dateStr,
      label: d.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' }),
      revenue: Math.round(val.revenue * 100) / 100,
      orderCount: val.orderCount,
    })
  })

  return result
}

// 3) En Çok Satan 5 Ürün (sadece paid siparişler)
async function getTopProducts(): Promise<TopProductItem[]> {
  // Paid siparişlerin ID'lerini al
  const paidOrderIds = await prisma.order.findMany({
    where: { status: { in: [...PAID_STATUSES] } },
    select: { id: true },
  })
  const ids = paidOrderIds.map((o) => o.id)

  if (ids.length === 0) {
    return []
  }

  // OrderItem'ları groupBy ile topla
  const grouped = await prisma.orderItem.groupBy({
    by: ['productId'],
    where: { orderId: { in: ids } },
    _sum: { quantity: true, price: true },
    orderBy: { _sum: { quantity: 'desc' } },
    take: 5,
  })

  if (grouped.length === 0) {
    return []
  }

  // Ürün detaylarını tek seferde çek (N+1 yok)
  const productIds = grouped.map((g) => g.productId)
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, name: true, images: true },
  })
  const productMap = new Map(products.map((p) => [p.id, p]))

  // Gelir hesabı için orderItem'ları çek
  const orderItems = await prisma.orderItem.findMany({
    where: { orderId: { in: ids }, productId: { in: productIds } },
    select: { productId: true, quantity: true, price: true },
  })

  const revenueMap = new Map<string, number>()
  for (const item of orderItems) {
    const current = revenueMap.get(item.productId) ?? 0
    revenueMap.set(item.productId, current + item.price * item.quantity)
  }

  return grouped.map((g) => {
    const product = productMap.get(g.productId)
    return {
      productId: g.productId,
      productName: product?.name ?? 'Bilinmeyen Ürün',
      productImage: product?.images ?? '',
      totalQuantity: g._sum.quantity ?? 0,
      totalRevenue: Math.round((revenueMap.get(g.productId) ?? 0) * 100) / 100,
    }
  })
}

// 4) Kritik Stok Uyarıları
async function getStockAlerts(): Promise<StockAlert> {
  const [outOfStock, lowStockCount, lowStockProducts] = await Promise.all([
    prisma.product.count({ where: { stock: 0, active: true } }),
    prisma.product.count({ where: { stock: { gt: 0, lt: 5 }, active: true } }),
    prisma.product.findMany({
      where: { stock: { lt: 5 }, active: true },
      select: { id: true, name: true, stock: true, images: true },
      orderBy: { stock: 'asc' },
      take: 10,
    }),
  ])

  return {
    outOfStock,
    lowStock: lowStockCount,
    lowStockProducts: lowStockProducts.map((p) => ({
      id: p.id,
      name: p.name,
      stock: p.stock,
      image: p.images,
    })),
  }
}

// 5) Ortalama Sepet Tutarı
async function getAverageCartValue(): Promise<number> {
  const result = await prisma.order.aggregate({
    _avg: { total: true },
    _count: { id: true },
    where: { status: { in: [...PAID_STATUSES] } },
  })

  return Math.round((result._avg.total ?? 0) * 100) / 100
}

// 6) Son 5 Sipariş
async function getRecentOrders(): Promise<RecentOrder[]> {
  const orders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, email: true } },
    },
  })

  return orders.map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    customerName: o.user.name,
    customerEmail: o.user.email,
    total: o.total,
    status: o.status,
    createdAt: o.createdAt.toISOString(),
  }))
}

// Genel istatistikler (mevcut kartlar için)
async function getGeneralStats() {
  const [totalProducts, totalOrders, totalUsers, pendingOrders, totalRevenue, ordersByStatus] =
    await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count({ where: { role: 'USER' } }),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { in: [...PAID_STATUSES] } },
      }),
      prisma.order.groupBy({
        by: ['status'],
        _count: { id: true },
      }),
    ])

  return {
    totalProducts,
    totalOrders,
    totalUsers,
    pendingOrders,
    totalRevenue: totalRevenue._sum.total ?? 0,
    ordersByStatus: ordersByStatus.map((s) => ({
      status: s.status,
      count: s._count.id,
    })),
  }
}

// Aktif kampanyalar
async function getActiveCampaigns() {
  const campaigns = await prisma.campaign.findMany({
    where: {
      active: true,
      startDate: { lte: new Date() },
      endDate: { gte: new Date() },
    },
    take: 5,
    orderBy: { createdAt: 'desc' },
  })

  return campaigns.map((c) => ({
    id: c.id,
    title: c.title,
    description: c.description,
    type: c.type,
    value: c.value,
    startDate: c.startDate.toISOString(),
    endDate: c.endDate.toISOString(),
  }))
}

// Ana fonksiyon - tüm dashboard verisini toplar
export async function getDashboardData(): Promise<DashboardData> {
  const [
    daily,
    revenueChart,
    topProducts,
    stockAlert,
    averageCartValue,
    recentOrders,
    general,
    activeCampaigns,
    profitability,
    analytics,
    abandonedCarts,
  ] = await Promise.all([
    getDailySummary(),
    getRevenueChart(),
    getTopProducts(),
    getStockAlerts(),
    getAverageCartValue(),
    getRecentOrders(),
    getGeneralStats(),
    getActiveCampaigns(),
    getProfitabilityData(),
    getAnalyticsData(),
    getAbandonedCartStats(),
  ])

  return {
    daily,
    revenueChart,
    topProducts,
    stockAlert,
    averageCartValue,
    recentOrders,
    ...general,
    activeCampaigns,
    profitability,
    analytics,
    abandonedCarts,
  }
}
