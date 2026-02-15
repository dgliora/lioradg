import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/services/roleGuard'
import { sendCartReminderEmail } from '@/lib/services/mailService'

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (!auth.authorized) return auth.response

  try {
    const body = await req.json()
    const { cartId, discountCode } = body as { cartId: string; discountCode?: string }

    if (!cartId) {
      return NextResponse.json({ error: 'cartId gerekli' }, { status: 400 })
    }

    // Sepeti ve ürünleri çek
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        user: { select: { name: true, email: true } },
        items: {
          include: {
            product: { select: { name: true, price: true, salePrice: true, images: true } },
          },
        },
      },
    })

    if (!cart) {
      return NextResponse.json({ error: 'Sepet bulunamadı' }, { status: 404 })
    }

    const email = cart.email ?? cart.user?.email
    if (!email) {
      return NextResponse.json({ error: 'Bu sepet için email adresi bulunamadı' }, { status: 400 })
    }

    const items = cart.items.map((item) => ({
      name: item.product.name,
      price: item.product.salePrice ?? item.product.price,
      quantity: item.quantity,
      image: item.product.images,
    }))

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    const result = await sendCartReminderEmail({
      cartId: cart.id,
      email,
      userId: cart.userId ?? undefined,
      customerName: cart.user?.name ?? undefined,
      items,
      total,
      discountCode,
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 429 })
    }

    return NextResponse.json({ success: true, message: 'Hatırlatma maili gönderildi' })
  } catch (error: any) {
    console.error('[RemindAPI] Hata:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
