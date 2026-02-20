import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const TEMPLATES = {
  reminder: {
    subject: 'Sepetinizde ürünler bekliyor! 🛒',
    html: (name: string, cartUrl: string) => `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
        <div style="background:linear-gradient(135deg,#8B9D83,#A8B99C);color:white;padding:30px;text-align:center;border-radius:12px 12px 0 0;">
          <h1 style="margin:0;font-family:Georgia,serif;">LIORADG</h1>
        </div>
        <div style="background:white;padding:30px;border:1px solid #E8E1D9;border-top:none;border-radius:0 0 12px 12px;">
          <h2 style="color:#8B9D83;">Merhaba ${name}!</h2>
          <p>Sepetinizde ürünler sizi bekliyor. Alışverişinizi tamamlamak için hâlâ vakit var!</p>
          <div style="text-align:center;margin:24px 0;">
            <a href="${cartUrl}" style="background:#8B9D83;color:white;padding:14px 32px;text-decoration:none;border-radius:10px;font-weight:600;">Sepete Dön</a>
          </div>
          <p style="color:#999;font-size:12px;">Lioradg ekibi olarak her zaman yanınızdayız.</p>
        </div>
      </div>`,
  },
  discount: {
    subject: 'Sepetiniz için özel %10 indirim! 🎁',
    html: (name: string, cartUrl: string) => `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
        <div style="background:linear-gradient(135deg,#8B9D83,#A8B99C);color:white;padding:30px;text-align:center;border-radius:12px 12px 0 0;">
          <h1 style="margin:0;font-family:Georgia,serif;">LIORADG</h1>
        </div>
        <div style="background:white;padding:30px;border:1px solid #E8E1D9;border-top:none;border-radius:0 0 12px 12px;">
          <h2 style="color:#8B9D83;">Merhaba ${name}!</h2>
          <p>Sepetinizdeki ürünler hâlâ sizin için bekliyor. Size özel <strong>%10 indirim</strong> kazandınız!</p>
          <div style="background:#F5F1ED;padding:16px;border-radius:10px;text-align:center;margin:16px 0;">
            <p style="margin:0;font-size:13px;color:#555;">İndirim otomatik uygulanacaktır.</p>
          </div>
          <div style="text-align:center;margin:24px 0;">
            <a href="${cartUrl}" style="background:#8B9D83;color:white;padding:14px 32px;text-decoration:none;border-radius:10px;font-weight:600;">Alışverişi Tamamla</a>
          </div>
        </div>
      </div>`,
  },
  lastchance: {
    subject: 'Son şans! Sepetinizdeki ürünler tükeniyor ⏰',
    html: (name: string, cartUrl: string) => `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
        <div style="background:linear-gradient(135deg,#D4A5A5,#C89F9C);color:white;padding:30px;text-align:center;border-radius:12px 12px 0 0;">
          <h1 style="margin:0;font-family:Georgia,serif;">LIORADG</h1>
          <p style="margin:8px 0 0;opacity:0.9;">Son Şans!</p>
        </div>
        <div style="background:white;padding:30px;border:1px solid #E8E1D9;border-top:none;border-radius:0 0 12px 12px;">
          <h2 style="color:#D4A5A5;">Merhaba ${name}!</h2>
          <p>Sepetinizdeki ürünler stokta sınırlı sayıda bulunuyor. Kaçırmadan tamamlayın!</p>
          <div style="text-align:center;margin:24px 0;">
            <a href="${cartUrl}" style="background:#D4A5A5;color:white;padding:14px 32px;text-decoration:none;border-radius:10px;font-weight:600;">Hemen Al</a>
          </div>
        </div>
      </div>`,
  },
}

export async function POST(request: NextRequest) {
  try {
    const { userIds, template, customSubject, customMessage } = await request.json()

    if (!userIds?.length) {
      return NextResponse.json({ error: 'Müşteri seçilmedi' }, { status: 400 })
    }

    const { prisma } = await import('@/lib/prisma')
    const carts = await prisma.cart.findMany({
      where: { userId: { in: userIds }, status: 'ACTIVE' },
      include: { user: { select: { name: true, email: true } } },
    })

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lioradg.com.tr'
    const cartUrl = `${siteUrl}/sepet`

    const tpl = TEMPLATES[template as keyof typeof TEMPLATES]
    let sent = 0
    let failed = 0

    for (const cart of carts) {
      try {
        const subject = customSubject || tpl?.subject || 'Sepetinizde ürünler bekliyor!'
        const html = customMessage
          ? `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
              <div style="background:linear-gradient(135deg,#8B9D83,#A8B99C);color:white;padding:30px;text-align:center;border-radius:12px 12px 0 0;">
                <h1 style="margin:0;font-family:Georgia,serif;">LIORADG</h1>
              </div>
              <div style="background:white;padding:30px;border:1px solid #E8E1D9;border-top:none;border-radius:0 0 12px 12px;">
                <h2 style="color:#8B9D83;">Merhaba ${cart.user.name}!</h2>
                <p>${customMessage}</p>
                <div style="text-align:center;margin:24px 0;">
                  <a href="${cartUrl}" style="background:#8B9D83;color:white;padding:14px 32px;text-decoration:none;border-radius:10px;font-weight:600;">Sepete Dön</a>
                </div>
              </div>
            </div>`
          : tpl?.html(cart.user.name, cartUrl) || ''

        await resend.emails.send({
          from: 'Lioradg <info@lioradg.com.tr>',
          to: cart.user.email,
          subject,
          html,
        })
        sent++
      } catch {
        failed++
      }
    }

    return NextResponse.json({ success: true, sent, failed })
  } catch (error) {
    console.error('Cart reminder error:', error)
    return NextResponse.json({ error: 'Mail gönderilemedi' }, { status: 500 })
  }
}
