import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Geçerli bir e-posta adresi girin.' }, { status: 400 })
    }

    const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } })

    if (existing) {
      if (existing.active) {
        return NextResponse.json({ message: 'Bu e-posta zaten abone.' }, { status: 200 })
      }
      // Tekrar aktif et
      await prisma.newsletterSubscriber.update({ where: { email }, data: { active: true } })
      return NextResponse.json({ message: 'Aboneliğiniz yenilendi!' })
    }

    await prisma.newsletterSubscriber.create({
      data: { email, name: name || null, source: 'website' },
    })

    return NextResponse.json({ message: 'E-bültene başarıyla abone oldunuz!' })
  } catch (error) {
    console.error('Newsletter subscribe error:', error)
    return NextResponse.json({ error: 'Bir hata oluştu.' }, { status: 500 })
  }
}
