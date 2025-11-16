import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdminAuth } from '@/lib/auth-server'

export async function POST(request: NextRequest) {
  try {
    const auth = await checkAdminAuth()
    if (!auth.isAdmin) {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 401 }
      )
    }

    const data = await request.json()

    if (!data.title || !data.type || !data.scope || !data.value) {
      return NextResponse.json(
        { error: 'Gerekli alanlar eksik' },
        { status: 400 }
      )
    }

    if (!data.startDate || !data.endDate) {
      return NextResponse.json(
        { error: 'Başlangıç ve bitiş tarihleri gerekli' },
        { status: 400 }
      )
    }

    // Kupon kodu kontrolü
    if (data.code) {
      const existingCampaign = await prisma.campaign.findUnique({
        where: { code: data.code }
      })

      if (existingCampaign) {
        return NextResponse.json(
          { error: 'Bu kupon kodu zaten kullanılıyor' },
          { status: 400 }
        )
      }
    }

    const campaign = await prisma.campaign.create({
      data: {
        title: data.title,
        description: data.description || null,
        type: data.type,
        scope: data.scope,
        value: parseFloat(data.value),
        code: data.code || null,
        minAmount: data.minAmount ? parseFloat(data.minAmount) : null,
        maxDiscount: data.maxDiscount ? parseFloat(data.maxDiscount) : null,
        targetCategories: data.targetCategories || null,
        targetProducts: data.targetProducts || null,
        usageLimit: data.usageLimit ? parseInt(data.usageLimit) : null,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        active: data.active !== undefined ? data.active : true,
      }
    })

    return NextResponse.json(campaign, { status: 201 })
  } catch (error) {
    console.error('Kampanya oluşturulurken hata:', error)
    return NextResponse.json(
      { error: 'Kampanya oluşturulurken hata oluştu' },
      { status: 500 }
    )
  }
}

