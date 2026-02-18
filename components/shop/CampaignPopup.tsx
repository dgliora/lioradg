'use client'

import { useState, useEffect } from 'react'
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

export function CampaignPopup() {
  const [campaign, setCampaign] = useState<Campaign | null>(null)

  useEffect(() => {
    fetch('/api/campaigns/active', { cache: 'no-store' })
      .then(r => r.json())
      .then((data: Campaign[]) => {
        if (!data || data.length === 0) return
        const top = data[0]
        const key = `popup_seen_${top.id}`
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
    sessionStorage.setItem(`popup_seen_${campaign.id}`, '1')
    setCampaign(null)
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9998] max-w-sm w-full">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-sage to-sage-dark px-4 py-2.5 flex items-center justify-between">
          <span className="text-white text-xs font-semibold tracking-wide">✨ Aktif Kampanya</span>
          <button onClick={dismiss} className="text-white/80 hover:text-white">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-sage/10 flex items-center justify-center flex-shrink-0 text-xl">🎁</div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 text-sm leading-tight">{campaign.title}</h3>
              <div className="mt-1 inline-flex items-center bg-rose/10 text-rose px-2 py-0.5 rounded-full text-xs font-bold">
                {discountText}
              </div>
            </div>
          </div>

          {campaign.code && (
            <div className="bg-gray-50 rounded-lg px-3 py-2 flex items-center gap-2">
              <span className="text-xs text-gray-400">Kupon:</span>
              <span className="font-mono font-bold text-sage tracking-wider text-sm">{campaign.code}</span>
            </div>
          )}

          <div className="bg-orange-50 rounded-xl px-3 py-2 text-center">
            <p className="text-xs text-gray-400 mb-1">⏱ Kalan süre</p>
            <CampaignCountdownSmall endDate={campaign.endDate} />
          </div>

          <Link href="/kampanyalar" onClick={dismiss} className="block w-full text-center bg-sage hover:bg-sage-dark text-white text-sm font-semibold py-2.5 rounded-xl transition-colors">
            Kampanyayı Kullan →
          </Link>
        </div>
      </div>
    </div>
  )
}
