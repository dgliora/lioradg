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
}

export function CampaignPopup() {
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
        const dismissKey = `campaign_dismissed_${top.id}`
        const dismissed = sessionStorage.getItem(dismissKey)
        if (dismissed) return

        setCampaign(top)
        // 1 saniye sonra göster
        setTimeout(() => setVisible(true), 1000)
      } catch {}
    }
    fetchCampaign()
  }, [])

  const dismiss = () => {
    if (campaign) sessionStorage.setItem(`campaign_dismissed_${campaign.id}`, '1')
    setVisible(false)
  }

  if (!campaign || !visible) return null

  const discountText =
    campaign.type === 'PERCENTAGE' ? `%${campaign.value} İndirim` :
    campaign.type === 'FIXED' ? `${campaign.value}₺ İndirim` :
    'Ücretsiz Kargo'

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Üst bant */}
        <div className="bg-gradient-to-r from-sage to-sage-dark px-4 py-2 flex items-center justify-between">
          <span className="text-white text-xs font-semibold tracking-wide uppercase">
            ✨ Aktif Kampanya
          </span>
          <button
            onClick={dismiss}
            className="text-white/80 hover:text-white transition-colors"
            aria-label="Kapat"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* İçerik */}
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-sage/10 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">🎁</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 text-base leading-tight">{campaign.title}</h3>
              {campaign.description && (
                <p className="text-gray-500 text-xs mt-0.5 line-clamp-2">{campaign.description}</p>
              )}
              <div className="mt-2 inline-flex items-center gap-1.5 bg-rose/10 text-rose px-3 py-1 rounded-full">
                <span className="text-sm font-bold">{discountText}</span>
              </div>
            </div>
          </div>

          {/* Kupon kodu */}
          {campaign.code && (
            <div className="mt-3 flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
              <span className="text-xs text-gray-500">Kupon:</span>
              <span className="font-mono font-bold text-sage tracking-wider">{campaign.code}</span>
            </div>
          )}

          {/* Sayaç */}
          <div className="mt-3 bg-orange-50 rounded-xl px-3 py-2">
            <p className="text-xs text-gray-500 mb-1 text-center">⏱ Kalan süre</p>
            <div className="flex justify-center">
              <CampaignCountdownSmall endDate={campaign.endDate} />
            </div>
          </div>

          {/* Buton */}
          <Link
            href="/kampanyalar"
            onClick={dismiss}
            className="mt-3 block w-full text-center bg-sage hover:bg-sage-dark text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
          >
            Kampanyayı Kullan →
          </Link>
        </div>
      </div>
    </div>
  )
}
