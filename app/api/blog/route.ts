import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, title: true, slug: true, excerpt: true,
        coverImage: true, tags: true, author: true,
        readingTime: true, createdAt: true,
      },
    })
    return NextResponse.json(posts)
  } catch (error) {
    return NextResponse.json({ error: 'Blog yazıları alınamadı' }, { status: 500 })
  }
}
