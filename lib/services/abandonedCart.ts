import { prisma } from '@/lib/prisma'

const ABANDON_THRESHOLD_MINUTES = 30

export interface AbandonedCartStats {
  abandonedLast24h: number
  abandonedPotentialRevenue: number
  abandonedCarts: {
    id: string
    userId: string | null
    email: string | null
    userName: string | null
    total: number
    itemCount: number
    updatedAt: string
  }[]
}

const EMPTY_STATS: AbandonedCartStats = {
  abandonedLast24h: 0,
  abandonedPotentialRevenue: 0,
  abandonedCarts: [],
}

/**
 * 30 dk boyunca ORDERED olmamış ACTIVE sepetleri ABANDONED olarak işaretle.
 */
export async function markAbandonedCarts(): Promise<number> {
  try {
    const threshold = new Date(Date.now() - ABANDON_THRESHOLD_MINUTES * 60 * 1000)

    const result = await prisma.cart.updateMany({
      where: {
        status: 'ACTIVE',
        updatedAt: { lt: threshold },
      },
      data: {
        status: 'ABANDONED',
      },
    })

    return result.count
  } catch (error) {
    console.warn('[AbandonedCart] markAbandonedCarts hatası (migration gerekli olabilir):', (error as Error).message)
    return 0
  }
}

/**
 * Dashboard için terk edilen sepet istatistikleri.
 * Migration yapılmamışsa fallback döndürür.
 */
export async function getAbandonedCartStats(): Promise<AbandonedCartStats> {
  try {
    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000)

    const [countLast24h, revenueLast24h, recentAbandoned] = await Promise.all([
      prisma.cart.count({
        where: {
          status: 'ABANDONED',
          updatedAt: { gte: last24h },
        },
      }),
      prisma.cart.aggregate({
        _sum: { total: true },
        where: {
          status: 'ABANDONED',
          updatedAt: { gte: last24h },
        },
      }),
      prisma.cart.findMany({
        where: { status: 'ABANDONED' },
        orderBy: { updatedAt: 'desc' },
        take: 10,
        include: {
          user: { select: { name: true, email: true } },
          items: {
            include: { product: { select: { name: true, price: true, images: true } } },
          },
        },
      }),
    ])

    return {
      abandonedLast24h: countLast24h,
      abandonedPotentialRevenue: Math.round((revenueLast24h._sum.total ?? 0) * 100) / 100,
      abandonedCarts: recentAbandoned.map((cart) => ({
        id: cart.id,
        userId: cart.userId,
        email: (cart as any).email ?? cart.user?.email ?? null,
        userName: cart.user?.name ?? null,
        total: (cart as any).total ?? 0,
        itemCount: cart.items.length,
        updatedAt: cart.updatedAt.toISOString(),
      })),
    }
  } catch (error) {
    console.warn('[AbandonedCart] getAbandonedCartStats hatası (migration gerekli olabilir):', (error as Error).message)
    return EMPTY_STATS
  }
}
