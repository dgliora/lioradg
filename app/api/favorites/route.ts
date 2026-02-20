import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'

// Kullanıcının favorilerini getir
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json([], { status: 200 })
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    select: { productId: true },
  })

  return NextResponse.json(favorites.map((f) => f.productId))
}

// Toggle: favoriye ekle / kaldır
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })
  }

  const { productId } = await req.json()
  if (!productId) {
    return NextResponse.json({ error: 'productId gerekli' }, { status: 400 })
  }

  const existing = await prisma.favorite.findUnique({
    where: { userId_productId: { userId: session.user.id, productId } },
  })

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } })
    return NextResponse.json({ favorited: false })
  } else {
    await prisma.favorite.create({
      data: { userId: session.user.id, productId },
    })
    return NextResponse.json({ favorited: true })
  }
}
