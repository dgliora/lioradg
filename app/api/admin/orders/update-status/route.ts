import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdminAuth } from '@/lib/auth-server'

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

    const updateData: Record<string, unknown> = {}
    if (status) updateData.status = status
    if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber || null

    await prisma.order.update({
      where: { id: orderId },
      data: updateData,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Sipariş durum güncelleme hatası:', error)
    return NextResponse.json({ error: 'Güncelleme işlemi başarısız' }, { status: 500 })
  }
}

