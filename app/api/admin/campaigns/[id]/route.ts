import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdminAuth } from '@/lib/auth-server'

export async function GET(
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

    return NextResponse.json(campaign)
  } catch (error) {
    console.error('Kampanya yüklenirken hata:', error)
    return NextResponse.json(
      { error: 'Kampanya yüklenirken hata oluştu' },
      { status: 500 }
    )
  }
}

export async function PUT(
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

    const data = await request.json()

    // Partial update için: eğer sadece active field'ı güncelliyorsa
    if (Object.keys(data).length === 1 && data.active !== undefined) {
      const campaign = await prisma.campaign.update({
        where: { id: params.id },
        data: {
          active: data.active
        }
      })
      return NextResponse.json(campaign)
    }

    // Full update için
    if (!data.title || !data.type || !data.scope) {
      return NextResponse.json(
        { error: 'Kampanya adı, tipi ve kapsamı gereklidir' },
        { status: 400 }
      )
    }

    // Ücretsiz kargo değilse değer zorunlu
    if (data.type !== 'FREE_SHIPPING' && !data.value) {
      return NextResponse.json(
        { error: 'İndirim değeri gereklidir' },
        { status: 400 }
      )
    }

    // Sepet tutarına göre ise minimum tutar zorunlu
    if (data.scope === 'CART' && !data.minAmount) {
      return NextResponse.json(
        { error: 'Sepet tutarı kampanyası için minimum tutar gereklidir' },
        { status: 400 }
      )
    }

    // Kupon kodu kontrolü (farklı kampanya için kullanılmış mı?)
    if (data.code) {
      const existingCampaign = await prisma.campaign.findFirst({
        where: {
          code: data.code,
          NOT: { id: params.id }
        }
      })

      if (existingCampaign) {
        return NextResponse.json(
          { error: 'Bu kupon kodu başka bir kampanya tarafından kullanılıyor' },
          { status: 400 }
        )
      }
    }

    const campaign = await prisma.campaign.update({
      where: { id: params.id },
      data: {
        title: data.title,
        description: data.description || null,
        type: data.type,
        scope: data.scope,
        value: data.type === 'FREE_SHIPPING' ? 0 : (data.value ? parseFloat(data.value) : 0),
        code: data.code || null,
        minAmount: data.minAmount ? parseFloat(data.minAmount) : null,
        maxDiscount: data.maxDiscount ? parseFloat(data.maxDiscount) : null,
        targetCategories: data.targetCategories || null,
        targetProducts: data.targetProducts || null,
        usageLimit: data.usageLimit ? parseInt(data.usageLimit) : null,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        active: data.active !== undefined ? data.active : undefined,
        bannerImage: data.bannerImage !== undefined ? (data.bannerImage || null) : undefined,
      }
    })

    return NextResponse.json(campaign)
  } catch (error) {
    console.error('Kampanya güncellenirken hata:', error)
    return NextResponse.json(
      { error: 'Kampanya güncellenirken hata oluştu' },
      { status: 500 }
    )
  }
}

export async function DELETE(
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

    // Önce bu kampanyaya bağlı ürünlerin referansını temizle
    await prisma.product.updateMany({
      where: { activeCampaignId: params.id },
      data: { activeCampaignId: null, salePrice: null },
    })

    await prisma.campaign.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Kampanya silinirken hata:', error)
    return NextResponse.json(
      { error: 'Kampanya silinirken hata oluştu' },
      { status: 500 }
    )
  }
}

