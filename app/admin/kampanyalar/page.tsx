import { prisma } from '@/lib/prisma'
import { Card, Button } from '@/components/ui'
import Link from 'next/link'
import { CampaignsTable } from '@/components/admin/CampaignsTable'

export const dynamic = 'force-dynamic'

async function getCampaigns() {
  // Süresi dolmuş aktif kampanyaları otomatik pasif yap
  await prisma.campaign.updateMany({
    where: {
      active: true,
      endDate: { lt: new Date() },
    },
    data: { active: false },
  })

  return await prisma.campaign.findMany({
    orderBy: [
      { active: 'desc' },
      { createdAt: 'desc' },
    ],
  })
}

export default async function AdminCampaignsPage() {
  const campaigns = await getCampaigns()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Kampanya Yönetimi</h1>
          <p className="text-gray-600">{campaigns.length} kampanya listeleniyor</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/kampanyalar/raporlar">
            <Button size="lg" variant="ghost">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Raporlar
            </Button>
          </Link>
          <Link href="/admin/kampanyalar/sablonlar">
            <Button size="lg" variant="ghost">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Şablonları Gör
            </Button>
          </Link>
          <Link href="/admin/kampanyalar/yeni">
            <Button size="lg">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Yeni Kampanya Ekle
            </Button>
          </Link>
        </div>
      </div>

      <Card padding="none">
        <CampaignsTable campaigns={campaigns} />
      </Card>
    </div>
  )
}

