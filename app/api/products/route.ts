import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        salePrice: true,
        slug: true,
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json({ 
      products: products.map(p => ({
        ...p,
        // Satış fiyatı varsa onu göster, yoksa normal fiyatı göster
        displayPrice: p.salePrice || p.price
      }))
    })
  } catch (error) {
    console.error('Ürünler yüklenirken hata:', error)
    return NextResponse.json(
      { error: 'Ürünler yüklenirken hata oluştu' },
      { status: 500 }
    )
  }
}

