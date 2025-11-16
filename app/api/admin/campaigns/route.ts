import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdminAuth } from '@/lib/auth-server'

export async function GET(request: NextRequest) {
  try {
    const auth = await checkAdminAuth()
    if (!auth.isAdmin) {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 401 }
      )
    }

    const campaigns = await prisma.campaign.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(campaigns)
  } catch (error) {
    console.error('Kampanyalar yüklenirken hata:', error)
    return NextResponse.json(
      { error: 'Kampanyalar yüklenirken hata oluştu' },
      { status: 500 }
    )
  }
}

