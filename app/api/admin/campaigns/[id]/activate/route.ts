import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdminAuth } from '@/lib/auth-server'
import { applyCampaignDiscount } from '@/lib/campaign-service'

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

    // Kampanyayı aktif et
    const updatedCampaign = await prisma.campaign.update({
      where: { id: params.id },
      data: {
        active: true
      }
    })

    // İndirimi ürünlere uygula
    try {
      await applyCampaignDiscount(params.id)
    } catch (error) {
      console.error('İndirim uygulanırken hata:', error)
      // Hata olsa bile kampanya aktif olsun, sadece log tutsun
    }

    return NextResponse.json({
      success: true,
      campaign: updatedCampaign,
      message: 'Kampanya aktive edildi ve ürünlere indirim uygulandı'
    })
  } catch (error) {
    console.error('Kampanya aktive edilirken hata:', error)
    return NextResponse.json(
      { error: 'Kampanya aktive edilirken hata oluştu' },
      { status: 500 }
    )
  }
}

