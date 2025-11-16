import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { productIds, active } = await request.json()

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json({ error: 'Geçersiz ürün listesi' }, { status: 400 })
    }

    if (typeof active !== 'boolean') {
      return NextResponse.json({ error: 'Geçersiz durum değeri' }, { status: 400 })
    }

    // Ürünleri güncelle
    await prisma.product.updateMany({
      where: {
        id: { in: productIds },
      },
      data: {
        active,
      },
    })

    return NextResponse.json({ success: true, updated: productIds.length })
  } catch (error) {
    console.error('Toplu güncelleme hatası:', error)
    return NextResponse.json({ error: 'Güncelleme işlemi başarısız' }, { status: 500 })
  }
}

