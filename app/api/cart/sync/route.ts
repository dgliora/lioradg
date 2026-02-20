import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'

interface SyncItem {
  productId: string
  quantity: number
  price: number
}

// DB'deki sepeti çek (yeni sekme / gizli sekme için)
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ items: [] })
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                salePrice: true,
                images: true,
                stock: true,
                categoryId: true,
              },
            },
          },
        },
      },
    })

    if (!cart) return NextResponse.json({ items: [] })

    const items = cart.items.map((i) => ({
      product: i.product,
      quantity: i.quantity,
    }))

    return NextResponse.json({ items })
  } catch (error) {
    console.error('Cart load error:', error)
    return NextResponse.json({ items: [] })
  }
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
