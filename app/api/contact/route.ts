import { NextRequest, NextResponse } from 'next/server'
import { sendContactEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Tüm alanları doldurun' }, { status: 400 })
    }

    const result = await sendContactEmail({ name, email, subject: subject || 'genel', message })

    if (!result.success) {
      console.error('SMTP Error detail:', JSON.stringify(result.error, Object.getOwnPropertyNames(result.error as object)))
      return NextResponse.json({ error: 'Mesaj gönderilemedi, lütfen tekrar deneyin' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Mesajınız başarıyla gönderildi' })
  } catch (error) {
    console.error('Contact route error:', error)
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 })
  }
}
