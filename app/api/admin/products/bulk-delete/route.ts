import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { productIds } = await request.json()

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json({ error: 'Geçersiz ürün listesi' }, { status: 400 })
    }

    // Ürünleri sil
    await prisma.product.deleteMany({
      where: {
        id: { in: productIds },
      },
    })

    return NextResponse.json({ success: true, deleted: productIds.length })
  } catch (error) {
    console.error('Toplu silme hatası:', error)
    return NextResponse.json({ error: 'Silme işlemi başarısız' }, { status: 500 })
  }
}

