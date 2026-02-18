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

  useEffect(() => {
    fetch('/api/campaigns/active', { cache: 'no-store' })
      .then(r => r.json())
      .then((data: Campaign[]) => {
        if (!data || data.length === 0) return
        const top = data[0]
        const key = `modal_seen_${top.id}`
        if (sessionStorage.getItem(key)) return
        setCampaign(top)
      })
      .catch(() => {})
  }, [])

  if (!campaign) return null

  const discountText =
    campaign.type === 'PERCENTAGE' ? `%${campaign.value} İndirim` :
    campaign.type === 'FIXED' ? `${campaign.value}₺ İndirim` :
    'Ücretsiz Kargo'

  const dismiss = () => {
    sessionStorage.setItem(`modal_seen_${campaign.id}`, '1')
    setCampaign(null)
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={dismiss} />
      <div className="relative z-10 bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Kapat */}
        <button
          onClick={dismiss}
          className="absolute top-3 right-3 z-20 w-9 h-9 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Fotoğraf veya gradient */}
        {campaign.bannerImage ? (
          <div className="relative w-full h-52">
            <Image src={campaign.bannerImage} alt={campaign.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-4 left-4 bg-rose text-white px-4 py-1.5 rounded-full font-bold text-lg shadow-lg">
              {discountText}
            </div>
          </div>
        ) : (
          <div className="relative bg-gradient-to-br from-sage to-sage-dark h-36 flex items-center justify-center">
            <span className="text-6xl">🎁</span>
            <div className="absolute bottom-4 right-4 bg-white/25 text-white px-4 py-1.5 rounded-full font-bold text-lg">
              {discountText}
            </div>
          </div>
        )}

        {/* İçerik */}
        <div className="p-6 space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{campaign.title}</h2>
            {campaign.description && <p className="text-gray-500 text-sm mt-1">{campaign.description}</p>}
          </div>

          {/* Sayaç */}
          <div className="bg-orange-50 rounded-2xl px-4 py-3 text-center">
            <p className="text-xs text-gray-400 mb-1.5 font-medium uppercase tracking-wide">⏱ Kalan Süre</p>
            <CampaignCountdownSmall endDate={campaign.endDate} />
          </div>

          {/* Kupon */}
          {campaign.code && (
            <div className="flex items-center justify-between bg-sage/5 border-2 border-dashed border-sage/30 rounded-xl px-4 py-3">
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Kupon Kodu</p>
                <span className="font-mono font-black text-sage tracking-[0.2em] text-xl">{campaign.code}</span>
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(campaign.code!).then(() => alert('Kopyalandı!'))}
                className="text-xs bg-sage text-white px-3 py-2 rounded-lg hover:bg-sage-dark transition-colors"
              >
                Kopyala
              </button>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <Link href="/urunler" onClick={dismiss} className="flex-1 text-center bg-sage hover:bg-sage-dark text-white font-semibold py-3 rounded-xl transition-colors">
              Alışverişe Başla
            </Link>
            <button onClick={dismiss} className="px-5 py-3 border-2 border-gray-200 text-gray-500 font-medium rounded-xl hover:bg-gray-50 transition-colors text-sm">
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
