import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const now = new Date()
    const campaigns = await prisma.campaign.findMany({
      where: {
        active: true,
        endDate: {
          gte: now,
        }
      },
      select: {
        id: true,
        title: true,
        description: true,
        value: true,
        type: true,
        endDate: true,
        code: true,
        bannerImage: true,
      },
      orderBy: {
        startDate: 'desc',
      },
    })

    return NextResponse.json(campaigns)
  } catch (error) {
    console.error('Aktif kampanyalar getirilirken hata:', error)
    return NextResponse.json(
      { error: 'Kampanyalar getirilemedi' },
      { status: 500 }
    )
  }
}

