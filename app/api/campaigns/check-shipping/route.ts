import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { cartTotal } = await request.json()

    if (typeof cartTotal !== 'number') {
      return NextResponse.json(
        { error: 'Geçersiz sepet tutarı' },
        { status: 400 }
      )
    }

    // Aktif ücretsiz kargo kampanyalarını getir
    const campaigns = await prisma.campaign.findMany({
      where: {
        active: true,
        type: 'FREE_SHIPPING',
        startDate: {
          lte: new Date(),
        },
        endDate: {
          gte: new Date(),
        }
      },
      select: {
        id: true,
        scope: true,
        minAmount: true,
      },
    })

    // Kampanyaları kontrol et
    for (const campaign of campaigns) {
      // Eğer kampanya "Sepet Tutarına Göre" ise
      if (campaign.scope === 'CART') {
        const minAmount = campaign.minAmount ? parseFloat(campaign.minAmount.toString()) : null
        if (minAmount !== null && cartTotal >= minAmount) {
          console.log(`✅ Ücretsiz kargo: Sepet ${cartTotal} >= Minimum ${minAmount}`)
          return NextResponse.json({ freeShipping: true })
        } else {
          console.log(`❌ Ücretsiz kargo yok: Sepet ${cartTotal} < Minimum ${minAmount}`)
        }
      }
      // Eğer kampanya "Tüm Ürünler" ise
      else if (campaign.scope === 'ALL') {
        console.log(`✅ Ücretsiz kargo: Tüm ürünler kampanyası aktif`)
        return NextResponse.json({ freeShipping: true })
      }
    }

    return NextResponse.json({ freeShipping: false })
  } catch (error) {
    console.error('Kargo kontrolü yapılırken hata:', error)
    return NextResponse.json(
      { error: 'Kargo kontrolü yapılamadı', freeShipping: false },
      { status: 500 }
    )
  }
}

