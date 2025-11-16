import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        order: 'asc',
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        icon: true,
        image: true,
        order: true,
      },
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Categories fetch error:', error)
    return NextResponse.json(
      { error: 'Kategoriler yüklenirken hata oluştu' },
      { status: 500 }
    )
  }
}

