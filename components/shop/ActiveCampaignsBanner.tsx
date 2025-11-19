'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type Campaign = {
  id: string
  title: string
  value: number
  type: 'PERCENTAGE' | 'FIXED' | 'FREE_SHIPPING'
}

export function ActiveCampaignsBanner() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetchActiveCampaigns()
  }, [])

  const fetchActiveCampaigns = async () => {
    try {
      const response = await fetch('/api/campaigns/active')
      if (response.ok) {
        const data = await response.json()
        setCampaigns(data.slice(0, 3))
      }
    } catch (error) {
      console.error('Kampanyalar yüklenirken hata:', error)
    } finally {
      setLoaded(true)
    }
  }

  if (!loaded || campaigns.length === 0) {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-sage to-sage-dark text-white py-3">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-4 overflow-x-auto">
          <div className="flex items-center gap-3 min-w-max">
            <span className="text-lg">✨ Aktif Kampanyalar:</span>
          </div>
          
          <div className="flex items-center gap-4 overflow-x-auto pb-1">
            {campaigns.map((campaign) => (
              <Link
                key={campaign.id}
                href="/kampanyalar"
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full whitespace-nowrap transition-all"
              >
                <span className="font-semibold">
                  {campaign.title}
                </span>
                <span className="bg-white/30 px-2 py-0.5 rounded-full text-sm font-bold">
                  {campaign.type === 'PERCENTAGE' ? `%${campaign.value}` : 
                   campaign.type === 'FIXED' ? `₺${campaign.value}` :
                   'Ücretsiz Kargo'}
                </span>
              </Link>
            ))}
          </div>

          <Link
            href="/kampanyalar"
            className="ml-auto flex items-center gap-1 hover:bg-white/10 px-3 py-2 rounded-lg transition-all whitespace-nowrap"
          >
            <span className="text-sm font-semibold">Tümünü Gör</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}

