import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdminAuth } from '@/lib/auth-server'

export async function GET() {
  try {
    const auth = await checkAdminAuth()
    if (!auth.isAdmin) return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })

    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(posts)
  } catch {
    return NextResponse.json({ error: 'Hata' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await checkAdminAuth()
    if (!auth.isAdmin) return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })

    const body = await req.json()
    const { title, slug, excerpt, content, coverImage, published, metaTitle, metaDescription, tags, author, readingTime } = body

    if (!title || !slug || !excerpt || !content) {
      return NextResponse.json({ error: 'Zorunlu alanlar eksik' }, { status: 400 })
    }

    const existing = await prisma.blogPost.findUnique({ where: { slug } })
    if (existing) return NextResponse.json({ error: 'Bu slug kullanılıyor' }, { status: 400 })

    const post = await prisma.blogPost.create({
      data: {
        title, slug, excerpt, content,
        coverImage: coverImage || null,
        published: published || false,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        tags: tags || null,
        author: author || 'Lioradg Ekibi',
        readingTime: readingTime || 5,
      },
    })
    return NextResponse.json(post, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Oluşturulamadı' }, { status: 500 })
  }
}
