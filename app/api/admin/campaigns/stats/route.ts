import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdminAuth } from '@/lib/auth-server'

export async function GET(request: NextRequest) {
  try {
    const auth = await checkAdminAuth()
    if (!auth.isAdmin) {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 401 }
      )
    }

    const campaigns = await prisma.campaign.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      }
    })

    const stats = campaigns.map(campaign => ({
      campaignId: campaign.id,
      title: campaign.title,
      productsCount: campaign._count.products,
      usageCount: campaign.usageCount,
      usageLimit: campaign.usageLimit,
      active: campaign.active,
      type: campaign.type,
      value: campaign.value
    }))

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Kampanya raporları yüklenirken hata:', error)
    return NextResponse.json(
      { error: 'Raporlar yüklenirken hata oluştu' },
      { status: 500 }
    )
  }
}

