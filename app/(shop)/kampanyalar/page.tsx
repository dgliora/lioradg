import Link from 'next/link'
import { Card, Badge, Button } from '@/components/ui'
import { getAllProducts } from '@/lib/api/products'
import { prisma } from '@/lib/prisma'
import { CampaignCountdown } from '@/components/shop/CampaignCountdown'

export default async function CampaignsPage() {
  // Aktif kampanyaları getir
  const activeCampaigns = await prisma.campaign.findMany({
    where: {
      active: true,
      endDate: {
        gte: new Date(),
      }
    },
    orderBy: {
      startDate: 'desc',
    },
  })

  // İndirimli ürünleri getir
  const { products: saleProducts } = await getAllProducts({
    limit: 12,
    orderBy: 'newest',
  })

  const discountedProducts = saleProducts.filter(p => p.salePrice && p.salePrice < p.price)

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-h1 font-bold text-neutral-900 mb-4">
            Kampanyalar ve Fırsatlar
          </h1>
          <p className="text-base text-neutral-600">
            Özel indirimler ve kampanyalarımızdan yararlanın
          </p>
        </div>

        {/* Aktif Kampanyalar */}
        {activeCampaigns.length > 0 && (
          <div className="mb-12">
            <h2 className="text-h2 font-serif font-bold text-neutral mb-6">
              ✨ Şu Anda Aktif Kampanyalar
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeCampaigns.map((campaign) => (
                <div key={campaign.id} className="rounded-2xl overflow-hidden shadow-lg">
                  {/* Üst gradient başlık */}
                  <div className="bg-gradient-to-r from-sage to-sage-dark text-white px-6 py-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white/70 text-xs font-semibold uppercase tracking-wider">✨ Aktif Kampanya</span>
                        </div>
                        <h3 className="text-xl font-bold">{campaign.title}</h3>
                        {campaign.description && (
                          <p className="text-white/80 text-sm mt-1">{campaign.description}</p>
                        )}
                      </div>
                      <div className="bg-white/20 rounded-xl px-4 py-2 text-center flex-shrink-0">
                        <div className="text-2xl font-black">
                          {campaign.type === 'PERCENTAGE' ? `%${campaign.value}` :
                           campaign.type === 'FIXED' ? `₺${campaign.value}` : '🚚'}
                        </div>
                        <div className="text-xs text-white/80 mt-0.5">
                          {campaign.type === 'PERCENTAGE' ? 'İndirim' :
                           campaign.type === 'FIXED' ? 'İndirim' : 'Ücretsiz Kargo'}
                        </div>
                      </div>
                    </div>

                    {/* Geri sayım */}
                    <div className="mt-5">
                      <p className="text-white/70 text-xs text-center mb-3 uppercase tracking-wider font-medium">⏱ Kampanya Bitimine Kalan Süre</p>
                      <CampaignCountdown endDate={campaign.endDate.toISOString()} />
                    </div>
                  </div>

                  {/* Alt bilgi */}
                  <div className="bg-white px-6 py-4 flex items-center justify-between">
                    {campaign.code ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Kupon:</span>
                        <span className="font-mono font-bold text-sage tracking-widest bg-sage/10 px-3 py-1 rounded-lg">
                          {campaign.code}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500">
                        Otomatik uygulanır
                      </span>
                    )}
                    <Link
                      href="/urunler"
                      className="bg-sage hover:bg-sage-dark text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
                    >
                      Alışverişe Başla →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Discounted Products */}
        {discountedProducts.length > 0 && (
          <div>
            <h2 className="text-h2 font-serif font-bold text-neutral mb-12">
              İndirimli Ürünler
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {discountedProducts.map((product) => {
                const { ProductCard } = require('@/components/shop/ProductCard')
                return <ProductCard key={product.id} product={product} />
              })}
            </div>
          </div>
        )}

        {discountedProducts.length === 0 && (
          <Card className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-h3 font-semibold text-neutral-900 mb-2">
                Yakında Yeni Kampanyalar
              </h3>
              <p className="text-neutral-600 mb-6">
                Özel fırsatlar için bizi takipte kalın
              </p>
              <Link href="/">
                <Button>Ana Sayfaya Dön</Button>
              </Link>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

