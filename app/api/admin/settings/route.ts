import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdminAuth } from '@/lib/auth-server'

export async function GET() {
  try {
    const auth = await checkAdminAuth()
    if (!auth.isAdmin) {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 401 }
      )
    }

    const settings = await prisma.setting.findMany({
      orderBy: {
        key: 'asc',
      },
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Ayarlar getirilirken hata:', error)
    return NextResponse.json(
      { error: 'Ayarlar getirilemedi' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await checkAdminAuth()
    if (!auth.isAdmin) {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 401 }
      )
    }

    const data = await request.json()
    const { key, value } = data

    if (!key || value === undefined) {
      return NextResponse.json(
        { error: 'Key ve value gereklidir' },
        { status: 400 }
      )
    }

    const setting = await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: {
        key,
        value: value.toString(),
        label: data.label || key,
        type: data.type || 'text',
      },
    })

    return NextResponse.json(setting)
  } catch (error) {
    console.error('Ayar güncellenirken hata:', error)
    return NextResponse.json(
      { error: 'Ayar güncellenemedi' },
      { status: 500 }
    )
  }
}

