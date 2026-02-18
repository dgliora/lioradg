import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_INFO    = 'Lioradg <info@lioradg.com.tr>'
const FROM_DESTEK  = 'Lioradg Destek <destek@lioradg.com.tr>'
const FROM_SATIS   = 'Lioradg Satış <satis@lioradg.com.tr>'
const FROM_FATURA  = 'Lioradg Fatura <fatura@lioradg.com.tr>'

const TEST_EMAIL = process.env.TEST_EMAIL || ''

const subjectEmailMap: Record<string, { from: string; to: string; label: string }> = {
  genel:  { from: FROM_INFO,   to: TEST_EMAIL || 'info@lioradg.com.tr',   label: 'Genel' },
  destek: { from: FROM_DESTEK, to: TEST_EMAIL || 'destek@lioradg.com.tr', label: 'Teknik Destek' },
  satis:  { from: FROM_SATIS,  to: TEST_EMAIL || 'satis@lioradg.com.tr',  label: 'Satış' },
  fatura: { from: FROM_FATURA, to: TEST_EMAIL || 'fatura@lioradg.com.tr', label: 'Fatura' },
  iade:   { from: FROM_DESTEK, to: TEST_EMAIL || 'destek@lioradg.com.tr', label: 'İptal & İade' },
}

export async function sendWelcomeEmail(to: string, name: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lioradg.com.tr'

  try {
    await resend.emails.send({
      from: FROM_INFO,
      to,
      subject: "Lioradg'e Hoş Geldiniz!",
      html: `
        <!DOCTYPE html>
        <html>
          <head><meta charset="utf-8"></head>
          <body style="font-family:Arial,sans-serif;line-height:1.6;color:#2C2C2C;margin:0;padding:0;">
            <div style="max-width:600px;margin:0 auto;padding:20px;">
              <div style="background:linear-gradient(135deg,#8B9D83 0%,#A8B99C 100%);color:white;padding:40px 20px;text-align:center;border-radius:16px 16px 0 0;">
                <h1 style="margin:0;font-size:32px;font-family:Georgia,serif;">LIORADG</h1>
                <p style="margin:10px 0 0 0;opacity:0.9;">Premium Bitkisel Kozmetik</p>
              </div>
              <div style="background:white;padding:40px 20px;border:1px solid #E8E1D9;border-top:none;border-radius:0 0 16px 16px;">
                <h2 style="color:#8B9D83;font-family:Georgia,serif;">Hoş Geldiniz, ${name}!</h2>
                <p>Lioradg ailesine katıldığınız için teşekkür ederiz. 🌿</p>
                <p>Hesabınız başarıyla oluşturuldu. Artık %100 doğal ve organik ürünlerimizi keşfedebilir, özel kampanyalardan yararlanabilirsiniz.</p>
                <a href="${siteUrl}/urunler" style="display:inline-block;background:#8B9D83;color:white;padding:14px 32px;text-decoration:none;border-radius:12px;font-weight:600;margin:20px 0;">Ürünleri Keşfet</a>
                <div style="background:#F5F1ED;padding:20px;border-radius:12px;margin:20px 0;">
                  <h3 style="margin-top:0;color:#2C2C2C;">İlk Siparişinize Özel</h3>
                  <p style="margin-bottom:0;">Tüm ürünlerde <strong>ücretsiz kargo</strong> fırsatını kaçırmayın!</p>
                </div>
                <p>Sorularınız için:</p>
                <p>
                  📞 <a href="tel:+905302084747" style="color:#8B9D83;">+90 530 208 47 47</a><br>
                  📧 <a href="mailto:info@lioradg.com.tr" style="color:#8B9D83;">info@lioradg.com.tr</a>
                </p>
              </div>
              <div style="text-align:center;padding:20px;color:#5A5A5A;font-size:12px;">
                <p>© 2025 LIORADG. Tüm hakları saklıdır.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    })
    return { success: true }
  } catch (error) {
    console.error('Welcome email error:', error)
    return { success: false, error }
  }
}

export async function sendOrderConfirmationEmail(to: string, orderNumber: string, total: number) {
  try {
    await resend.emails.send({
      from: FROM_SATIS,
      to,
      subject: `Siparişiniz Alındı - #${orderNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head><meta charset="utf-8"></head>
          <body style="font-family:Arial,sans-serif;line-height:1.6;color:#2C2C2C;margin:0;padding:0;">
            <div style="max-width:600px;margin:0 auto;padding:20px;">
              <div style="background:linear-gradient(135deg,#8B9D83 0%,#A8B99C 100%);color:white;padding:40px 20px;text-align:center;border-radius:16px 16px 0 0;">
                <h1 style="margin:0;font-size:28px;font-family:Georgia,serif;">Siparişiniz Alındı!</h1>
              </div>
              <div style="background:white;padding:40px 20px;border:1px solid #E8E1D9;border-top:none;border-radius:0 0 16px 16px;">
                <p>Merhaba,</p>
                <p>Siparişiniz başarıyla alındı. Ürünleriniz en kısa sürede kargoya teslim edilecektir.</p>
                <div style="background:#F5F1ED;padding:20px;border-radius:12px;margin:20px 0;">
                  <h3 style="margin-top:0;">Sipariş Detayları</h3>
                  <p><strong>Sipariş No:</strong> #${orderNumber}</p>
                  <p><strong>Toplam Tutar:</strong> ${total.toFixed(2)} TL</p>
                  <p><strong>Tahmini Teslimat:</strong> 2-5 iş günü</p>
                </div>
                <p>Sipariş durumunuzu <a href="https://lioradg.com.tr/siparis-takip" style="color:#8B9D83;">sipariş takip</a> sayfasından takip edebilirsiniz.</p>
                <p><strong>Lioradg Ekibi</strong></p>
              </div>
            </div>
          </body>
        </html>
      `,
    })
    return { success: true }
  } catch (error) {
    console.error('Order confirmation email error:', error)
    return { success: false, error }
  }
}

export async function sendResetEmail(to: string, token: string, name?: string) {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://lioradg.com.tr'
  const resetUrl = `${baseUrl}/sifre-sifirla?token=${token}`

  try {
    await resend.emails.send({
      from: FROM_INFO,
      to,
      subject: 'Şifre Sıfırlama Talebiniz',
      html: `
        <!DOCTYPE html>
        <html>
          <head><meta charset="utf-8"></head>
          <body style="font-family:Arial,sans-serif;line-height:1.6;color:#2C2C2C;margin:0;padding:0;">
            <div style="max-width:600px;margin:0 auto;padding:20px;">
              <div style="background:linear-gradient(135deg,#D4A5A5 0%,#C89F9C 100%);color:white;padding:40px 20px;text-align:center;border-radius:16px 16px 0 0;">
                <h1 style="margin:0;font-size:28px;font-family:Georgia,serif;">Şifre Sıfırlama</h1>
              </div>
              <div style="background:white;padding:40px 20px;border:1px solid #E8E1D9;border-top:none;border-radius:0 0 16px 16px;">
                <h2 style="color:#D4A5A5;">Merhaba${name ? `, ${name}` : ''},</h2>
                <p>Şifre sıfırlama talebinizi aldık. Aşağıdaki link ile yeni şifrenizi belirleyebilirsiniz.</p>
                <a href="${resetUrl}" style="display:inline-block;background:#D4A5A5;color:white;padding:14px 32px;text-decoration:none;border-radius:12px;font-weight:600;margin:20px 0;">Şifremi Sıfırla</a>
                <div style="background:#F5F1ED;padding:20px;border-radius:12px;margin:20px 0;">
                  <p><strong>Not:</strong> Bu link 1 saat içinde geçerlidir. Eğer bu talebi siz yapmadıysanız dikkate almayabilirsiniz.</p>
                </div>
                <p><strong>Lioradg Ekibi</strong></p>
              </div>
            </div>
          </body>
        </html>
      `,
    })
    return { success: true }
  } catch (error) {
    console.error('Reset email error:', error)
    return { success: false, error }
  }
}

export async function sendVerificationEmail(to: string, name: string, token: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lioradg.com.tr'
  const verifyUrl = `${siteUrl}/email-dogrula?token=${token}`

  try {
    await resend.emails.send({
      from: FROM_INFO,
      to,
      subject: 'Lioradg - E-posta Adresinizi Doğrulayın',
      html: `
        <!DOCTYPE html>
        <html>
          <head><meta charset="utf-8"></head>
          <body style="font-family:Arial,sans-serif;line-height:1.6;color:#2C2C2C;margin:0;padding:0;">
            <div style="max-width:600px;margin:0 auto;padding:20px;">
              <div style="background:linear-gradient(135deg,#8B9D83 0%,#A8B99C 100%);color:white;padding:40px 20px;text-align:center;border-radius:16px 16px 0 0;">
                <h1 style="margin:0;font-size:32px;font-family:Georgia,serif;">LIORADG</h1>
                <p style="margin:10px 0 0 0;opacity:0.9;">E-posta Doğrulama</p>
              </div>
              <div style="background:white;padding:40px 20px;border:1px solid #E8E1D9;border-top:none;border-radius:0 0 16px 16px;">
                <h2 style="color:#8B9D83;font-family:Georgia,serif;">Merhaba, ${name}!</h2>
                <p>Hesabınızı aktifleştirmek için aşağıdaki butona tıklayarak e-posta adresinizi doğrulayın.</p>
                <div style="text-align:center;margin:30px 0;">
                  <a href="${verifyUrl}" style="display:inline-block;background:#8B9D83;color:white;padding:14px 32px;text-decoration:none;border-radius:12px;font-weight:600;">E-postamı Doğrula</a>
                </div>
                <div style="background:#F5F1ED;padding:20px;border-radius:12px;margin:20px 0;">
                  <p style="margin:0;font-size:13px;color:#5A5A5A;">Bu link 24 saat içinde geçerlidir. Eğer bu talebi siz yapmadıysanız dikkate almayabilirsiniz.</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
    })
    return { success: true }
  } catch (error) {
    console.error('Verification email error:', error)
    return { success: false, error }
  }
}

export async function sendContactEmail(data: {
  name: string
  email: string
  subject: string
  message: string
}) {
  const account = subjectEmailMap[data.subject] || subjectEmailMap.genel

  try {
    await resend.emails.send({
      from: account.from,
      to: account.to,
      replyTo: data.email,
      subject: `[İletişim - ${account.label}] ${data.name}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <div style="background:linear-gradient(135deg,#8B9D83,#A8B99C);color:white;padding:30px;border-radius:12px 12px 0 0;">
            <h2 style="margin:0;">Yeni İletişim Mesajı</h2>
          </div>
          <div style="background:white;padding:30px;border:1px solid #E8E1D9;border-top:none;border-radius:0 0 12px 12px;">
            <p><strong>Gönderen:</strong> ${data.name}</p>
            <p><strong>E-posta:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
            <p><strong>Konu:</strong> ${account.label}</p>
            <hr style="border:none;border-top:1px solid #E8E1D9;margin:20px 0;" />
            <p><strong>Mesaj:</strong></p>
            <p style="background:#F5F1ED;padding:16px;border-radius:8px;white-space:pre-wrap;">${data.message}</p>
          </div>
        </div>
      `,
    })
    return { success: true }
  } catch (error) {
    console.error('Contact email error:', error)
    return { success: false, error }
  }
}
