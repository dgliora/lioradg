import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'
import { sendOrderConfirmationEmail } from '@/lib/email'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: {
          product: {
            select: { id: true, name: true, images: true, slug: true },
          },
        },
      },
    },
  })

  return NextResponse.json(orders)
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    const body = await req.json()

    const {
      // Adres bilgileri
      fullName, phone, city, district, neighborhood, address, postalCode,
      // Misafir
      guestEmail,
      // Sepet
      items,
      subtotal,
      shippingCost,
      discount,
      total,
      couponCode,
    } = body

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Sepet boş' }, { status: 400 })
    }

    // Sipariş numarası oluştur
    const orderNumber = 'ORD-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase()

    let userId = session?.user?.id || null

    // Misafir kullanıcı için geçici kayıt oluştur
    if (!userId && guestEmail) {
      const guestUser = await prisma.user.upsert({
        where: { email: guestEmail },
        update: {},
        create: {
          email: guestEmail,
          name: fullName,
          password: '',
          role: 'USER',
        },
      })
      userId = guestUser.id
    }

    if (!userId) {
      return NextResponse.json({ error: 'Kullanıcı kimliği gerekli' }, { status: 400 })
    }

    // Adres kaydı oluştur (hem shipping hem billing için aynı)
    const savedAddress = await prisma.address.create({
      data: {
        title: 'Sipariş Adresi',
        fullName,
        phone,
        address: `${neighborhood ? neighborhood + ', ' : ''}${address}`,
        city,
        district,
        postalCode: postalCode || '',
        userId,
      },
    })

    // Ürün fiyatlarını DB'den doğrula
    const productIds = items.map((i: { productId: string }) => i.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, price: true, salePrice: true, stock: true },
    })

    const productMap = Object.fromEntries(products.map((p) => [p.id, p]))

    // Sipariş oluştur
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId,
        status: 'PENDING',
        subtotal,
        shippingCost,
        discount: discount || 0,
        total,
        couponCode: couponCode || null,
        shippingAddressId: savedAddress.id,
        billingAddressId: savedAddress.id,
        items: {
          create: items.map((item: { productId: string; quantity: number }) => {
            const p = productMap[item.productId]
            const price = p?.salePrice ?? p?.price ?? 0
            return {
              productId: item.productId,
              quantity: item.quantity,
              price,
            }
          }),
        },
      },
    })

    // Sepeti temizle (giriş yapmış kullanıcılar için)
    if (session?.user?.id) {
      await prisma.cart.updateMany({
        where: { userId: session.user.id },
        data: { status: 'ORDERED' },
      })
      await prisma.cartItem.deleteMany({
        where: { cart: { userId: session.user.id } },
      })
    }

    // Sipariş onay e-postası gönder
    const emailTo = guestEmail || session?.user?.email
    if (emailTo) {
      sendOrderConfirmationEmail(emailTo, order.orderNumber, total).catch((err) =>
        console.error('Sipariş e-postası gönderilemedi:', err)
      )
    }

    return NextResponse.json({ success: true, orderNumber: order.orderNumber })
  } catch (error) {
    console.error('Sipariş oluşturma hatası:', error)
    return NextResponse.json({ error: 'Sipariş oluşturulamadı' }, { status: 500 })
  }
}
