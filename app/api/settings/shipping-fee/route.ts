import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: 'shipping_fee' },
    })

    const shippingFee = setting ? parseFloat(setting.value) : 89.90

    return NextResponse.json({ shippingFee })
  } catch (error) {
    console.error('Kargo ücreti getirilirken hata:', error)
    return NextResponse.json(
      { shippingFee: 89.90 },
      { status: 200 }
    )
  }
}

