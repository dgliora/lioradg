'use client'

import { useState, useEffect } from 'react'
import { Badge, Button } from '@/components/ui'
import Link from 'next/link'

function Countdown({ endDate }: { endDate: Date }) {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    const calc = () => {
      const diff = new Date(endDate).getTime() - Date.now()
      if (diff <= 0) { setTimeLeft('Süresi doldu'); return }
      const d = Math.floor(diff / 86400000)
      const h = Math.floor((diff % 86400000) / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      if (d > 0) setTimeLeft(`${d}g ${h}s ${m}d`)
      else setTimeLeft(`${h}s ${m}d ${s}sn`)
    }
    calc()
    const t = setInterval(calc, 1000)
    return () => clearInterval(t)
  }, [endDate])

  const diff = new Date(endDate).getTime() - Date.now()
  const isUrgent = diff < 86400000 // 1 günden az

  return (
    <span className={`text-xs font-mono font-semibold ${isUrgent ? 'text-red-600' : 'text-orange-600'}`}>
      ⏱ {timeLeft}
    </span>
  )
}

interface Campaign {
  id: string
  title: string
  description: string | null
  type: string
  value: number
  startDate: Date
  endDate: Date
  active: boolean
}

interface CampaignsTableProps {
  campaigns: Campaign[]
}

export function CampaignsTable({ campaigns }: CampaignsTableProps) {
  const [campaignsList, setCampaignsList] = useState(campaigns)
  const [loading, setLoading] = useState<string | null>(null)

  const toggleCampaignStatus = async (id: string, currentStatus: boolean) => {
    setLoading(id)
    try {
      const newStatus = !currentStatus
      
      // Aktivasyon kısmı
      if (newStatus) {
        const activateResponse = await fetch(`/api/admin/campaigns/${id}/activate`, {
          method: 'POST',
        })
        
        if (!activateResponse.ok) {
          const error = await activateResponse.json()
          alert(error.error || 'Kampanya aktive edilirken hata oluştu')
          setLoading(null)
          return
        }
      } else {
        // Deaktivasyonkısmı
        const deactivateResponse = await fetch(`/api/admin/campaigns/${id}/deactivate`, {
          method: 'POST',
        })
        
        if (!deactivateResponse.ok) {
          const error = await deactivateResponse.json()
          alert(error.error || 'Kampanya deaktive edilirken hata oluştu')
          setLoading(null)
          return
        }
      }

      setCampaignsList(
        campaignsList.map((campaign) =>
          campaign.id === id ? { ...campaign, active: newStatus } : campaign
        )
      )
    } catch (error) {
      console.error('Hata:', error)
      alert('Kampanya durumu güncellenirken hata oluştu')
    } finally {
      setLoading(null)
    }
  }

  const deleteCampaign = async (id: string) => {
    if (!confirm('Bu kampanyayı silmek istediğinizden emin misiniz?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/campaigns/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setCampaignsList(campaignsList.filter((campaign) => campaign.id !== id))
      } else {
        alert('Kampanya silinirken hata oluştu')
      }
    } catch (error) {
      console.error('Hata:', error)
      alert('Kampanya silinirken hata oluştu')
    }
  }

  return (
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
          {campaignsList.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                Henüz kampanya oluşturulmamış
              </td>
            </tr>
          ) : (
              campaignsList.map((campaign) => (
                  <tr 
                    key={campaign.id} 
                    className={`hover:bg-gray-50 ${campaign.active ? 'bg-green-50 border-l-4 border-l-green-500' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className={`font-medium ${campaign.active ? 'text-green-900' : 'text-gray-900'}`}>
                          {campaign.active && '✨ '}{campaign.title}
                        </p>
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
                  <div>{new Date(campaign.endDate).toLocaleDateString('tr-TR')}</div>
                  {campaign.active && <Countdown endDate={campaign.endDate} />}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleCampaignStatus(campaign.id, campaign.active)}
                    disabled={loading === campaign.id}
                    className={`${
                      campaign.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    } px-3 py-1 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {loading === campaign.id
                      ? 'Güncelleniyor...'
                      : campaign.active
                        ? '✓ Aktif'
                        : '✗ Pasif'}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Link href={`/admin/kampanyalar/${campaign.id}`}>
                      <Button size="sm" variant="ghost">
                        Düzenle
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => deleteCampaign(campaign.id)}
                    >
                      Sil
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

