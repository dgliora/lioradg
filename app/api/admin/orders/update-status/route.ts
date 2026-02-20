import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdminAuth } from '@/lib/auth-server'
import { sendShippingEmail } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const auth = await checkAdminAuth()
    if (!auth.isAdmin) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 })
    }

    const { orderId, status, trackingNumber } = await request.json()

    if (!orderId) {
      return NextResponse.json({ error: 'Geçersiz istek' }, { status: 400 })
    }

    const prevOrder = await prisma.order.findUnique({
      where: { id: orderId },
      select: { status: true, trackingNumber: true, orderNumber: true, user: { select: { email: true, name: true } } },
    })

    const updateData: Record<string, unknown> = {}
    if (status) updateData.status = status
    if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber || null

    await prisma.order.update({
      where: { id: orderId },
      data: updateData,
    })

    // Durum SHIPPED yapıldıysa kargo e-postası gönder
    if (status === 'SHIPPED' && prevOrder?.status !== 'SHIPPED' && prevOrder?.user) {
      const finalTracking = trackingNumber ?? prevOrder.trackingNumber
      sendShippingEmail(
        prevOrder.user.email,
        prevOrder.user.name,
        prevOrder.orderNumber,
        finalTracking || null
      ).catch((err) => console.error('Kargo e-postası gönderilemedi:', err))
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Sipariş durum güncelleme hatası:', error)
    return NextResponse.json({ error: 'Güncelleme işlemi başarısız' }, { status: 500 })
  }
}
