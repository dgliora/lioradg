import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/services/roleGuard'

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin(_request)
  if (!auth.authorized) return auth.response

  if (auth.role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'Sadece admin müşteri silebilir' },
      { status: 403 }
    )
  }

  const id = params.id
  if (!id) {
    return NextResponse.json({ error: 'Kullanıcı id gerekli' }, { status: 400 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        _count: { select: { orders: true } },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'Müşteri bulunamadı' }, { status: 404 })
    }

    if (user.role === 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin hesaplar buradan silinemez' },
        { status: 400 }
      )
    }

    if (user._count.orders > 0) {
      return NextResponse.json(
        { error: 'Siparişi olan müşteri silinemez. Sipariş yoksa tekrar deneyin.' },
        { status: 400 }
      )
    }

    await prisma.cart.deleteMany({ where: { userId: id } })
    await prisma.address.deleteMany({ where: { userId: id } })
    await prisma.review.deleteMany({ where: { userId: id } })
    await prisma.user.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Müşteri silinirken hata:', error)
    return NextResponse.json(
      { error: 'Müşteri silinirken hata oluştu' },
      { status: 500 }
    )
  }
}
