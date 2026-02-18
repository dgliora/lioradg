import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendWelcomeEmail } from '@/lib/email'

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')

  if (!token) {
    return NextResponse.json({ error: 'Geçersiz token' }, { status: 400 })
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
        verificationExpiry: { gt: new Date() },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'Token geçersiz veya süresi dolmuş' }, { status: 400 })
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationToken: null,
        verificationExpiry: null,
      },
    })

    try {
      await sendWelcomeEmail(user.email, user.name)
    } catch (e) {
      console.error('Welcome email error:', e)
    }

    return NextResponse.json({ message: 'E-posta başarıyla doğrulandı', name: user.name })
  } catch (error) {
    console.error('Verify email error:', error)
    return NextResponse.json({ error: 'Doğrulama sırasında bir hata oluştu' }, { status: 500 })
  }
}
