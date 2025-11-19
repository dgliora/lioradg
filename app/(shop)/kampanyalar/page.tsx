import Link from 'next/link'
import Image from 'next/image'
import { Card, Badge, Button } from '@/components/ui'
import { getAllProducts } from '@/lib/api/products'
import { formatPrice } from '@/lib/utils'
import { prisma } from '@/lib/prisma'

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeCampaigns.map((campaign) => (
                <Card key={campaign.id} className="bg-gradient-to-br from-sage/5 to-sage/10 border-2 border-sage/30 hover:border-sage transition-all">
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-neutral-900">{campaign.title}</h3>
                        {campaign.description && (
                          <p className="text-sm text-neutral-600 mt-1">{campaign.description}</p>
                        )}
                      </div>
                      <Badge variant="success" className="whitespace-nowrap ml-2">
                        {campaign.type === 'PERCENTAGE' ? `%${campaign.value}` : 
                         campaign.type === 'FIXED' ? `₺${campaign.value}` :
                         'Ücretsiz Kargo'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-neutral-600 mt-4 pt-4 border-t border-sage/20">
                      <span>
                        {new Date(campaign.startDate).toLocaleDateString('tr-TR')} - {new Date(campaign.endDate).toLocaleDateString('tr-TR')}
                      </span>
                      <span className="text-sage font-semibold">Devam Ediyor</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Campaign Banners */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Link href="/urunler/krem-bakim">
            <Card hover padding="none" className="overflow-hidden group cursor-pointer">
              <div className="relative h-64 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                <div className="text-center p-8">
                  <Badge variant="success" size="lg" className="mb-4">
                    Ücretsiz Kargo
                  </Badge>
                  <h2 className="text-h2 font-bold text-neutral-900 mb-2">
                    500 TL Üzeri Alışverişlerde
                  </h2>
                  <p className="text-neutral-600 mb-4">
                    Kargo bedava!
                  </p>
                  <span className="text-primary font-semibold group-hover:underline">
                    Hemen Alışverişe Başla →
                  </span>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/urunler/bitkisel-yaglar">
            <Card hover padding="none" className="overflow-hidden group cursor-pointer">
              <div className="relative h-64 bg-gradient-to-br from-accent/10 to-primary/10 flex items-center justify-center">
                <div className="text-center p-8">
                  <Badge variant="warning" size="lg" className="mb-4">
                    Yeni Koleksiyon
                  </Badge>
                  <h2 className="text-h2 font-bold text-neutral-900 mb-2">
                    Bitkisel Yağlar Serisi
                  </h2>
                  <p className="text-neutral-600 mb-4">
                    Difüzör için özel yağlar
                  </p>
                  <span className="text-primary font-semibold group-hover:underline">
                    Keşfet →
                  </span>
                </div>
              </div>
            </Card>
          </Link>
        </div>

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

