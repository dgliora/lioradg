import { prisma } from '@/lib/prisma'

// iyzico komisyon oranı (%3 varsayılan, env'den değiştirilebilir)
const IYZICO_COMMISSION_RATE = parseFloat(process.env.IYZICO_COMMISSION_RATE || '0.03')

const PAID_STATUSES = ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'] as const

export interface ProfitSummary {
  totalNetProfit: number
  averageProfitMargin: number
  iyzicoTotalCommission: number
}

export interface ProfitableProduct {
  productId: string
  productName: string
  productImage: string
  totalQuantity: number
  totalRevenue: number
  totalCost: number
  iyzicoCommission: number
  netProfit: number
  profitMargin: number
}

export interface ProfitabilityData {
  summary: ProfitSummary
  topProfitable: ProfitableProduct[]
}

const EMPTY_DATA: ProfitabilityData = {
  summary: { totalNetProfit: 0, averageProfitMargin: 0, iyzicoTotalCommission: 0 },
  topProfitable: [],
}

export async function getProfitabilityData(): Promise<ProfitabilityData> {
  try {
    // Paid siparişlerin ID'leri
    const paidOrders = await prisma.order.findMany({
      where: { status: { in: [...PAID_STATUSES] } },
      select: { id: true, total: true },
    })

    const paidOrderIds = paidOrders.map((o) => o.id)

    if (paidOrderIds.length === 0) {
      return EMPTY_DATA
    }

    // Tüm sipariş toplam ciro
    const totalGrossRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0)
    const iyzicoTotalCommission = round(totalGrossRevenue * IYZICO_COMMISSION_RATE)

    // OrderItem'ları ürün bilgileriyle birlikte çek (N+1 yok)
    const orderItems = await prisma.orderItem.findMany({
      where: { orderId: { in: paidOrderIds } },
      select: {
        productId: true,
        quantity: true,
        price: true,
        product: {
          select: { id: true, name: true, images: true, price: true },
        },
      },
    })

    const costPriceMap = new Map<string, number>()
    const productsWithCost = await prisma.product.findMany({
      select: { id: true, costPrice: true },
    })
    for (const p of productsWithCost) {
      costPriceMap.set(p.id, p.costPrice ?? 0)
    }

    // Ürün bazlı aggregation
    const productMap = new Map<string, {
      name: string
      image: string
      totalQty: number
      totalRevenue: number
      totalCost: number
    }>()

    for (const item of orderItems) {
      const existing = productMap.get(item.productId)
      const revenue = item.price * item.quantity
      const costPrice = costPriceMap.get(item.productId) ?? 0
      const cost = costPrice * item.quantity

      if (existing) {
        existing.totalQty += item.quantity
        existing.totalRevenue += revenue
        existing.totalCost += cost
      } else {
        productMap.set(item.productId, {
          name: item.product.name,
          image: item.product.images,
          totalQty: item.quantity,
          totalRevenue: revenue,
          totalCost: cost,
        })
      }
    }

    let totalNetProfit = 0
    let totalRevenueAll = 0
    const allProducts: ProfitableProduct[] = []

    productMap.forEach((data, productId) => {
      const commission = data.totalRevenue * IYZICO_COMMISSION_RATE
      const netProfit = data.totalRevenue - data.totalCost - commission
      const margin = data.totalRevenue > 0 ? (netProfit / data.totalRevenue) * 100 : 0

      totalNetProfit += netProfit
      totalRevenueAll += data.totalRevenue

      allProducts.push({
        productId,
        productName: data.name,
        productImage: data.image,
        totalQuantity: data.totalQty,
        totalRevenue: round(data.totalRevenue),
        totalCost: round(data.totalCost),
        iyzicoCommission: round(commission),
        netProfit: round(netProfit),
        profitMargin: round(margin),
      })
    })

    const topProfitable = allProducts
      .sort((a, b) => b.netProfit - a.netProfit)
      .slice(0, 5)

    const averageProfitMargin = totalRevenueAll > 0
      ? (totalNetProfit / totalRevenueAll) * 100
      : 0

    return {
      summary: {
        totalNetProfit: round(totalNetProfit),
        averageProfitMargin: round(averageProfitMargin),
        iyzicoTotalCommission,
      },
      topProfitable,
    }
  } catch (error) {
    console.warn('[Profitability] Hesaplama hatası (costPrice migration gerekli olabilir):', (error as Error).message)
    return EMPTY_DATA
  }
}

function round(n: number): number {
  return Math.round(n * 100) / 100
}
