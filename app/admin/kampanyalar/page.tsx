import { prisma } from '@/lib/prisma'
import { Card, Badge, Button } from '@/components/ui'
import Link from 'next/link'

async function getCampaigns() {
  return await prisma.campaign.findMany({
    orderBy: {
      createdAt: 'desc',
    },
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
        <Button size="lg">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Yeni Kampanya Ekle
        </Button>
      </div>

      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-left text-sm text-gray-600">
                <th className="px-6 py-4 font-medium">Kampanya Adı</th>
                <th className="px-6 py-4 font-medium">Tip</th>
                <th className="px-6 py-4 font-medium">İndirim</th>
                <th className="px-6 py-4 font-medium">Başlangıç</th>
                <th className="px-6 py-4 font-medium">Bitiş</th>
                <th className="px-6 py-4 font-medium">Durum</th>
                <th className="px-6 py-4 font-medium">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {campaigns.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    Henüz kampanya oluşturulmamış
                  </td>
                </tr>
              ) : (
                campaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{campaign.title}</p>
                        {campaign.description && (
                          <p className="text-sm text-gray-500">{campaign.description}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge>
                        {campaign.type === 'PERCENTAGE' && 'Yüzde'}
                        {campaign.type === 'FIXED' && 'Sabit'}
                        {campaign.type === 'FREE_SHIPPING' && 'Ücretsiz Kargo'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      {campaign.type === 'PERCENTAGE' && `%${campaign.value}`}
                      {campaign.type === 'FIXED' && `${campaign.value} TL`}
                      {campaign.type === 'FREE_SHIPPING' && '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(campaign.startDate).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(campaign.endDate).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={campaign.active ? 'success' : 'default'}>
                        {campaign.active ? 'Aktif' : 'Pasif'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Button size="sm" variant="ghost">
                        Düzenle
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-gray-700">
            <p className="font-semibold mb-1">Kampanya Yönetimi</p>
            <p>
              Kampanya oluşturma, düzenleme ve silme özellikleri yakında eklenecektir.
              Şimdilik kampanyalar görüntülenebilmektedir.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

