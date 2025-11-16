import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdminAuth } from '@/lib/auth-server'

export async function GET(request: NextRequest) {
  try {
    // Admin kontrolü (geliştirme aşamasında basitleştirilmiş)
    const auth = await checkAdminAuth()
    if (!auth.isAdmin) {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 401 }
      )
    }

    const categories = await prisma.category.findMany({
      orderBy: [
        { order: 'asc' },
        { name: 'asc' }
      ],
      include: {
        _count: {
          select: { products: true }
        }
      }
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Kategoriler yüklenirken hata:', error)
    return NextResponse.json(
      { error: 'Kategoriler yüklenirken hata oluştu' },
      { status: 500 }
    )
  }
}

