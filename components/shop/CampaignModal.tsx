'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CampaignCountdownSmall } from '@/components/shop/CampaignCountdown'

type Campaign = {
  id: string
  title: string
  description: string | null
  value: number
  type: 'PERCENTAGE' | 'FIXED' | 'FREE_SHIPPING'
  endDate: string
  code: string | null
  bannerImage: string | null
}

export function CampaignModal() {
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await fetch('/api/campaigns/active')
        if (!res.ok) return
        const data: Campaign[] = await res.json()
        if (data.length === 0) return

        const top = data[0]
        const dismissKey = `campaign_modal_dismissed_${top.id}`
        if (sessionStorage.getItem(dismissKey)) return

        setCampaign(top)
        setTimeout(() => setVisible(true), 800)
      } catch {}
    }
    fetchCampaign()
  }, [])

  const dismiss = () => {
    if (campaign) sessionStorage.setItem(`campaign_modal_dismissed_${campaign.id}`, '1')
    setVisible(false)
  }

  if (!campaign || !visible) return null

  const discountText =
    campaign.type === 'PERCENTAGE' ? `%${campaign.value} İndirim` :
    campaign.type === 'FIXED' ? `${campaign.value}₺ İndirim` :
    'Ücretsiz Kargo'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={dismiss}
      />

      {/* Modal */}
      <div className="relative z-10 bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-scale">
        {/* Kapat butonu */}
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 z-20 w-9 h-9 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center transition-colors"
          aria-label="Kapat"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Fotoğraf */}
        {campaign.bannerImage ? (
          <div className="relative w-full h-52">
            <Image
              src={campaign.bannerImage}
              alt={campaign.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            {/* İndirim rozeti */}
            <div className="absolute bottom-4 left-4 bg-rose text-white px-4 py-1.5 rounded-full font-bold text-lg shadow-lg">
              {discountText}
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-sage to-sage-dark h-32 flex items-center justify-center">
            <span className="text-5xl">🎁</span>
            <div className="absolute bottom-4 left-4 bg-white/20 text-white px-4 py-1.5 rounded-full font-bold text-lg">
              {discountText}
            </div>
          </div>
        )}

        {/* İçerik */}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{campaign.title}</h2>
          {campaign.description && (
            <p className="text-gray-600 text-sm mb-4">{campaign.description}</p>
          )}

          {/* Sayaç */}
          <div className="bg-orange-50 rounded-2xl px-4 py-3 mb-4">
            <p className="text-xs text-gray-500 text-center mb-2 font-medium">⏱ Kampanya Bitimine Kalan Süre</p>
            <div className="flex justify-center">
              <CampaignCountdownSmall endDate={campaign.endDate} />
            </div>
          </div>

          {/* Kupon kodu */}
          {campaign.code && (
            <div className="flex items-center justify-between bg-gray-50 border-2 border-dashed border-sage/40 rounded-xl px-4 py-3 mb-4">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Kupon Kodun</p>
                <span className="font-mono font-black text-sage tracking-[0.2em] text-lg">{campaign.code}</span>
              </div>
              <button
                onClick={() => { navigator.clipboard.writeText(campaign.code!); alert('Kopyalandı!') }}
                className="text-xs bg-sage text-white px-3 py-1.5 rounded-lg hover:bg-sage-dark transition-colors"
              >
                Kopyala
              </button>
            </div>
          )}

          {/* Butonlar */}
          <div className="flex gap-3">
            <Link
              href="/urunler"
              onClick={dismiss}
              className="flex-1 text-center bg-sage hover:bg-sage-dark text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Alışverişe Başla
            </Link>
            <button
              onClick={dismiss}
              className="px-5 py-3 border-2 border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors text-sm"
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
