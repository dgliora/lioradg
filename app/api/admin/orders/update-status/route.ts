import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdminAuth } from '@/lib/auth-server'

export async function POST(request: Request) {
  try {
    const auth = await checkAdminAuth()
    if (!auth.isAdmin) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 })
    }

    const { orderId, status } = await request.json()

    if (!orderId || !status) {
      return NextResponse.json({ error: 'Geçersiz istek' }, { status: 400 })
    }

    // Siparişi güncelle
    await prisma.order.update({
      where: { id: orderId },
      data: { status },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Sipariş durum güncelleme hatası:', error)
    return NextResponse.json({ error: 'Güncelleme işlemi başarısız' }, { status: 500 })
  }
}

