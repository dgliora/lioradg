import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: 'desc' },
    })

    const total = subscribers.length
    const active = subscribers.filter((s) => s.active).length
    const thisMonth = subscribers.filter((s) => {
      const d = new Date(s.createdAt)
      const now = new Date()
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    }).length

    return NextResponse.json({ subscribers, stats: { total, active, thisMonth } })
  } catch (error) {
    return NextResponse.json({ error: 'Hata oluştu' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, active } = await req.json()
    await prisma.newsletterSubscriber.update({ where: { id }, data: { active } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Hata oluştu' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()
    await prisma.newsletterSubscriber.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Hata oluştu' }, { status: 500 })
  }
}
