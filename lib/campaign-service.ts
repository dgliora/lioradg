import { prisma } from '@/lib/prisma'

/**
 * Kampanya aktive edildiğinde ürünlere indirim uygula
 */
export async function applyCampaignDiscount(campaignId: string) {
  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId }
    })

    if (!campaign) {
      throw new Error('Kampanya bulunamadı')
    }

    let productsToUpdate: string[] = []

    // Kampanya scope'una göre ürünleri belirle
    if (campaign.scope === 'ALL') {
      // Tüm ürünleri al
      const allProducts = await prisma.product.findMany({
        select: { id: true }
      })
      productsToUpdate = allProducts.map(p => p.id)
    } else if (campaign.scope === 'CATEGORY' && campaign.targetCategories) {
      // Kategori bazlı ürünleri al
      const categoryIds = campaign.targetCategories.split(',').filter(Boolean)
      const categoryProducts = await prisma.product.findMany({
        where: {
          categoryId: { in: categoryIds }
        },
        select: { id: true }
      })
      productsToUpdate = categoryProducts.map(p => p.id)
    } else if (campaign.scope === 'PRODUCT' && campaign.targetProducts) {
      // Spesifik ürünleri al
      productsToUpdate = campaign.targetProducts.split(',').filter(Boolean)
    } else if (campaign.scope === 'CART') {
      // Sepet bazlı kampanyalar ürünleri değiştirmez
      return
    }

    // Ürünlerin sale price'ını güncelle
    for (const productId of productsToUpdate) {
      const product = await prisma.product.findUnique({
        where: { id: productId }
      })

      if (!product) continue

      let salePrice = product.price

      // İndirim hesapla
      if (campaign.type === 'PERCENTAGE') {
        salePrice = product.price * (1 - campaign.value / 100)
      } else if (campaign.type === 'FIXED') {
        salePrice = Math.max(0, product.price - campaign.value)
      }

      // Max indirim sınırı varsa kontrol et
      if (campaign.maxDiscount) {
        const discount = product.price - salePrice
        if (discount > campaign.maxDiscount) {
          salePrice = product.price - campaign.maxDiscount
        }
      }

      await prisma.product.update({
        where: { id: productId },
        data: {
          salePrice: Math.round(salePrice * 100) / 100,
          activeCampaignId: campaignId // Hangi kampanya uygulandığını izle
        }
      })
    }

    console.log(`✓ ${productsToUpdate.length} ürüne indirim uygulandı`)
  } catch (error) {
    console.error('Kampanya indirim uygularken hata:', error)
    throw error
  }
}

/**
 * Kampanya deaktive edildiğinde ürünlerdeki indirim kaldır
 */
export async function removeCampaignDiscount(campaignId: string) {
  try {
    const productsWithCampaign = await prisma.product.findMany({
      where: {
        activeCampaignId: campaignId
      },
      select: { id: true }
    })

    // Sale price'ı sıfırla
    for (const product of productsWithCampaign) {
      await prisma.product.update({
        where: { id: product.id },
        data: {
          salePrice: null,
          activeCampaignId: null
        }
      })
    }

    console.log(`✓ ${productsWithCampaign.length} ürünün indirim kaldırıldı`)
  } catch (error) {
    console.error('Kampanya indirim kaldırırken hata:', error)
    throw error
  }
}

/**
 * Aktif kampanyaları getir
 */
export async function getActiveCampaigns() {
  return await prisma.campaign.findMany({
    where: {
      active: true,
      startDate: {
        lte: new Date()
      },
      endDate: {
        gte: new Date()
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}

/**
 * Kampanya istatistikleri
 */
export async function getCampaignStats(campaignId: string) {
  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId }
  })

  if (!campaign) {
    throw new Error('Kampanya bulunamadı')
  }

  // Kampanyaya bağlı ürünleri bul
  const productsCount = await prisma.product.count({
    where: {
      activeCampaignId: campaignId
    }
  })

  return {
    campaignId,
    title: campaign.title,
    productsCount,
    usageCount: campaign.usageCount,
    usageLimit: campaign.usageLimit,
    active: campaign.active,
    type: campaign.type,
    value: campaign.value
  }
}

