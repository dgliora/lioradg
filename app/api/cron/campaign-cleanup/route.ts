import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Süresi dolmuş ama hâlâ aktif olan kampanyaları bul
    const expiredCampaigns = await prisma.campaign.findMany({
      where: {
        active: true,
        endDate: { lt: new Date() },
      },
      select: { id: true, title: true },
    })

    let cleaned = 0

    for (const campaign of expiredCampaigns) {
      // Ürünlerin salePrice ve activeCampaignId alanlarını temizle
      await prisma.product.updateMany({
        where: { activeCampaignId: campaign.id },
        data: { salePrice: null, activeCampaignId: null },
      })

      // Kampanyayı pasif yap
      await prisma.campaign.update({
        where: { id: campaign.id },
        data: { active: false },
      })

      cleaned++
    }

    return NextResponse.json({
      success: true,
      cleaned,
      campaigns: expiredCampaigns.map((c) => c.title),
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[Cron] Campaign cleanup hatası:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
