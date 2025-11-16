import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdminAuth } from '@/lib/auth-server'
import { removeCampaignDiscount } from '@/lib/campaign-service'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await checkAdminAuth()
    if (!auth.isAdmin) {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 401 }
      )
    }

    const campaign = await prisma.campaign.findUnique({
      where: { id: params.id }
    })

    if (!campaign) {
      return NextResponse.json(
        { error: 'Kampanya bulunamadı' },
        { status: 404 }
      )
    }

    // Kampanyayı pasif et
    const updatedCampaign = await prisma.campaign.update({
      where: { id: params.id },
      data: {
        active: false
      }
    })

    // İndirimi ürünlerden kaldır
    try {
      await removeCampaignDiscount(params.id)
    } catch (error) {
      console.error('İndirim kaldırılırken hata:', error)
      // Hata olsa bile kampanya pasif olsun, sadece log tutsun
    }

    return NextResponse.json({
      success: true,
      campaign: updatedCampaign,
      message: 'Kampanya deaktive edildi ve ürünlerden indirim kaldırıldı'
    })
  } catch (error) {
    console.error('Kampanya deaktive edilirken hata:', error)
    return NextResponse.json(
      { error: 'Kampanya deaktive edilirken hata oluştu' },
      { status: 500 }
    )
  }
}

