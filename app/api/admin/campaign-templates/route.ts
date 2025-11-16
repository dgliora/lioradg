import { NextResponse } from 'next/server'
import campaignData from '@/data/turkey-campaign-calendar.json'

export async function GET() {
  try {
    return NextResponse.json(campaignData.campaigns)
  } catch (error) {
    console.error('Kampanya şablonları yüklenirken hata:', error)
    return NextResponse.json(
      { error: 'Kampanya şablonları yüklenirken hata oluştu' },
      { status: 500 }
    )
  }
}

