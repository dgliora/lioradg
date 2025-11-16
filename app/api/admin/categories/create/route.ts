import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdminAuth } from '@/lib/auth-server'

function generateSlug(text: string): string {
  const trMap: { [key: string]: string } = {
    'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
    'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u'
  }
  
  return text
    .split('')
    .map(char => trMap[char] || char)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function POST(request: NextRequest) {
  try {
    const auth = await checkAdminAuth()
    if (!auth.isAdmin) {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 401 }
      )
    }

    const data = await request.json()

    if (!data.name) {
      return NextResponse.json(
        { error: 'Kategori adı zorunludur' },
        { status: 400 }
      )
    }

    const slug = data.slug || generateSlug(data.name)

    const existingCategory = await prisma.category.findUnique({
      where: { slug }
    })

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Bu slug ile bir kategori zaten mevcut' },
        { status: 400 }
      )
    }

    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug,
        description: data.description || null,
        icon: data.icon || null,
        image: data.image || null,
        order: data.order || 0,
      }
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Kategori oluşturulurken hata:', error)
    return NextResponse.json(
      { error: 'Kategori oluşturulurken hata oluştu' },
      { status: 500 }
    )
  }
}

