import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { cartTotal } = await request.json()

    if (typeof cartTotal !== 'number') {
      return NextResponse.json(
        { error: 'Geçersiz sepet tutarı' },
        { status: 400 }
      )
    }

    // Admin ayarlarından ücretsiz kargo limitini kontrol et
    const freeShippingMinSetting = await prisma.setting.findUnique({
      where: { key: 'free_shipping_min_amount' },
    })
    if (freeShippingMinSetting) {
      const minAmount = parseFloat(freeShippingMinSetting.value)
      if (!isNaN(minAmount) && minAmount > 0 && cartTotal >= minAmount) {
        return NextResponse.json({ freeShipping: true, debug: { cartTotal, minAmount, scope: 'SETTINGS' } })
      }
    }

    // Aktif ücretsiz kargo kampanyalarını getir
    const campaigns = await prisma.campaign.findMany({
      where: {
        active: true,
        type: 'FREE_SHIPPING',
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

    console.log(`🔍 Kargo kontrolü: Sepet tutarı = ${cartTotal} TL, Aktif kampanya sayısı = ${campaigns.length}`)

    // Kampanyaları kontrol et
    for (const campaign of campaigns) {
      console.log(`📋 Kampanya: scope=${campaign.scope}, minAmount=${campaign.minAmount}`)
      
      // Eğer kampanya "Sepet Tutarına Göre" ise
      if (campaign.scope === 'CART') {
        // minAmount MUTLAKA olmalı
        if (!campaign.minAmount) {
          console.log(`⚠️ CART kampanyası ama minAmount yok, atlanıyor`)
          continue
        }
        
        const minAmount = parseFloat(campaign.minAmount.toString())
        if (cartTotal >= minAmount) {
          console.log(`✅ Ücretsiz kargo: Sepet ${cartTotal} >= Minimum ${minAmount}`)
          return NextResponse.json({ 
            freeShipping: true,
            debug: { cartTotal, minAmount, scope: campaign.scope }
          })
        } else {
          console.log(`❌ Ücretsiz kargo yok: Sepet ${cartTotal} < Minimum ${minAmount}`)
        }
      }
      // Eğer kampanya "Tüm Ürünler" ise - SADECE minAmount yoksa veya 0 ise
      else if (campaign.scope === 'ALL') {
        // ALL scope'unda da minAmount kontrolü yapalım (eğer varsa)
        if (campaign.minAmount) {
          const minAmount = parseFloat(campaign.minAmount.toString())
          if (cartTotal >= minAmount) {
            console.log(`✅ Ücretsiz kargo (ALL): Sepet ${cartTotal} >= Minimum ${minAmount}`)
            return NextResponse.json({ freeShipping: true })
          } else {
            console.log(`❌ Ücretsiz kargo yok (ALL): Sepet ${cartTotal} < Minimum ${minAmount}`)
            continue
          }
        } else {
          console.log(`✅ Ücretsiz kargo: Tüm ürünler kampanyası aktif (minAmount yok)`)
          return NextResponse.json({ freeShipping: true })
        }
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

