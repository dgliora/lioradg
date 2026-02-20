import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'

interface SyncItem {
  productId: string
  quantity: number
  price: number
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
    }

    const { items }: { items: SyncItem[] } = await request.json()
    const userId = session.user.id

    const total = items.reduce((s, i) => s + i.price * i.quantity, 0)

    // Mevcut cart'ı bul veya oluştur
    const cart = await prisma.cart.upsert({
      where: { userId },
      create: { userId, total, status: 'ACTIVE', email: session.user.email || '' },
      update: { total, status: 'ACTIVE', updatedAt: new Date() },
    })

    // Eski items'ları sil, yenilerini ekle
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } })

    if (items.length > 0) {
      await prisma.cartItem.createMany({
        data: items.map((item) => ({
          cartId: cart.id,
          productId: item.productId,
          quantity: item.quantity,
        })),
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Cart sync error:', error)
    return NextResponse.json({ error: 'Sepet kaydedilemedi' }, { status: 500 })
  }
}
