import type { ProfitabilityData } from '@/lib/services/profitability'
import type { AnalyticsData } from '@/lib/services/analytics'
import type { AbandonedCartStats } from '@/lib/services/abandonedCart'

export type { ProfitabilityData, AnalyticsData, AbandonedCartStats }

export interface DailySummary {
  todayRevenue: number
  todayOrderCount: number
  paidOrderCount: number
  failedOrderCount: number
}

export interface RevenueChartItem {
  date: string
  label: string
  revenue: number
  orderCount: number
}

export interface TopProductItem {
  productId: string
  productName: string
  productImage: string
  totalQuantity: number
  totalRevenue: number
}

export interface StockAlert {
  outOfStock: number
  lowStock: number
  lowStockProducts: {
    id: string
    name: string
    stock: number
    image: string
  }[]
}

export interface RecentOrder {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  total: number
  status: string
  createdAt: string
}

export interface DashboardData {
  daily: DailySummary
  revenueChart: RevenueChartItem[]
  topProducts: TopProductItem[]
  stockAlert: StockAlert
  averageCartValue: number
  recentOrders: RecentOrder[]
  totalProducts: number
  totalOrders: number
  totalUsers: number
  pendingOrders: number
  totalRevenue: number
  ordersByStatus: { status: string; count: number }[]
  activeCampaigns: {
    id: string
    title: string
    description: string | null
    type: string
    value: number
    startDate: string
    endDate: string
  }[]
  profitability: ProfitabilityData
  analytics: AnalyticsData
  abandonedCarts: AbandonedCartStats
}
