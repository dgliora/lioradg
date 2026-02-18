import { NextRequest, NextResponse } from 'next/server'
import { createUser, getUserByEmail } from '@/lib/auth'
import { sendVerificationEmail } from '@/lib/email'
import { randomBytes } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, emailConsent, smsConsent } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Tüm alanları doldurun' }, { status: 400 })
    }

    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ error: 'Bu e-posta adresi zaten kayıtlı' }, { status: 400 })
    }

    const verificationToken = randomBytes(32).toString('hex')
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000)

    const user = await createUser({ name, email, password, verificationToken, verificationExpiry })

    try {
      await sendVerificationEmail(email, name, verificationToken)
    } catch (emailError) {
      console.error('Verification email error:', emailError)
    }

    return NextResponse.json({
      message: 'Kayıt başarılı. Lütfen e-postanızı kontrol edin ve hesabınızı doğrulayın.',
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({ error: 'Kayıt sırasında bir hata oluştu' }, { status: 500 })
  }
}
