import nodemailer from 'nodemailer'

function createTransporter(user: string, pass: string) {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'mail.lioradg.com.tr',
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true,
    auth: { user, pass },
  })
}

const transporter = createTransporter(
  process.env.SMTP_USER || 'info@lioradg.com.tr',
  process.env.SMTP_PASSWORD || ''
)

const isDevelopment = false

export async function sendWelcomeEmail(to: string, name: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000'
  const mailOptions = {
    from: '"Lioradg" <info@lioradg.com.tr>',
    to,
    subject: 'Lioradg\'e Hoş Geldiniz! 🌿',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #2C2C2C; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #8B9D83 0%, #A8B99C 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 16px 16px 0 0; }
            .content { background: white; padding: 40px 20px; border: 1px solid #E8E1D9; border-top: none; border-radius: 0 0 16px 16px; }
            .button { display: inline-block; background: #8B9D83; color: white; padding: 14px 32px; text-decoration: none; border-radius: 12px; font-weight: 600; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #5A5A5A; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 32px; font-family: Georgia, serif;">LIORADG</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Premium Bitkisel Kozmetik</p>
            </div>
            <div class="content">
              <h2 style="color: #8B9D83; font-family: Georgia, serif;">Hoş Geldiniz, ${name}!</h2>
              <p>Lioradg ailesine katıldığınız için teşekkür ederiz. 🌿</p>
              <p>Hesabınız başarıyla oluşturuldu. Artık %100 doğal ve organik ürünlerimizi keşfedebilir, özel kampanyalardan yararlanabilirsiniz.</p>
              
              <a href="${siteUrl}/urunler" class="button">Ürünleri Keşfet</a>
              
              <div style="background: #F5F1ED; padding: 20px; border-radius: 12px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #2C2C2C;">İlk Siparişinize Özel</h3>
                <p style="margin-bottom: 0;">Tüm ürünlerde <strong>ücretsiz kargo</strong> fırsatını kaçırmayın!</p>
              </div>
              
              <p style="margin-top: 30px;">Sorularınız için bizimle iletişime geçebilirsiniz:</p>
              <p>
                📞 <a href="tel:+905302084747" style="color: #8B9D83;">+90 530 208 47 47</a><br>
                📧 <a href="mailto:info@lioradg.com.tr" style="color: #8B9D83;">info@lioradg.com.tr</a>
              </p>
            </div>
            <div class="footer">
              <p>© 2025 LIORADG. Tüm hakları saklıdır.</p>
              <p>
                <a href="https://lioradg.com.tr/gizlilik-politikasi" style="color: #8B9D83; text-decoration: none;">Gizlilik Politikası</a> |
                <a href="https://lioradg.com.tr/kvkk" style="color: #8B9D83; text-decoration: none;">KVKK</a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
  }

  if (isDevelopment) {
    console.log('📧 [DEV MODE] Hoş geldiniz e-postası gönderildi:', { to, name, subject: mailOptions.subject })
    return { success: true, dev: true }
  }

  try {
    await transporter.sendMail(mailOptions)
    return { success: true }
  } catch (error) {
    console.error('Email send error:', error)
    return { success: false, error }
  }
}

export async function sendOrderConfirmationEmail(
  to: string,
  orderNumber: string,
  total: number
) {
  const mailOptions = {
    from: '"Lioradg" <info@lioradg.com.tr>',
    to,
    subject: `Siparişiniz Alındı - #${orderNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #2C2C2C; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #8B9D83 0%, #A8B99C 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 16px 16px 0 0; }
            .content { background: white; padding: 40px 20px; border: 1px solid #E8E1D9; border-top: none; border-radius: 0 0 16px 16px; }
            .order-box { background: #F5F1ED; padding: 20px; border-radius: 12px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #5A5A5A; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 32px; font-family: Georgia, serif;">Siparişiniz Alındı!</h1>
            </div>
            <div class="content">
              <p>Merhaba,</p>
              <p>Siparişiniz başarıyla alındı. Ürünleriniz en kısa sürede kargoya teslim edilecektir.</p>
              
              <div class="order-box">
                <h3 style="margin-top: 0;">Sipariş Detayları</h3>
                <p><strong>Sipariş No:</strong> #${orderNumber}</p>
                <p><strong>Toplam Tutar:</strong> ${total.toFixed(2)} TL</p>
                <p><strong>Tahmini Teslimat:</strong> 2-5 iş günü</p>
              </div>
              
              <p>Sipariş durumunuzu <a href="https://lioradg.com.tr/siparis-takip" style="color: #8B9D83;">sipariş takip</a> sayfasından takip edebilirsiniz.</p>
              
              <p style="margin-top: 30px;">Teşekkür ederiz!</p>
              <p><strong>Lioradg Ekibi</strong></p>
            </div>
            <div class="footer">
              <p>© 2025 LIORADG.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }

  if (isDevelopment) {
    console.log('📧 [DEV MODE] Sipariş onay e-postası gönderildi:', { to, orderNumber, total })
    return { success: true, dev: true }
  }

  try {
    await transporter.sendMail(mailOptions)
    return { success: true }
  } catch (error) {
    console.error('Email send error:', error)
    return { success: false, error }
  }
}

export async function sendResetEmail(to: string, token: string, name?: string) {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  const resetUrl = `${baseUrl}/sifre-sifirla?token=${token}`
  const mailOptions = {
    from: '"Lioradg" <info@lioradg.com.tr>',
    to,
    subject: 'Şifre Sıfırlama Talebiniz',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #2C2C2C; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #D4A5A5 0%, #C89F9C 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 16px 16px 0 0; }
            .content { background: white; padding: 40px 20px; border: 1px solid #E8E1D9; border-top: none; border-radius: 0 0 16px 16px; }
            .button { display: inline-block; background: #D4A5A5; color: white; padding: 14px 32px; text-decoration: none; border-radius: 12px; font-weight: 600; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #5A5A5A; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 32px; font-family: Georgia, serif;">Şifre Sıfırlama</h1>
            </div>
            <div class="content">
              <h2 style="color: #D4A5A5; font-family: Georgia, serif;">Merhaba${name ? `, ${name}` : ''},</h2>
              <p>Şifre sıfırlama talebinizi aldık. Aşağıdaki link ile yeni şifrenizi belirleyebilirsiniz.</p>
              
              <a href="${resetUrl}" class="button">Şifremi Sıfırla</a>
              
              <div style="background: #F5F1ED; padding: 20px; border-radius: 12px; margin: 20px 0;">
                <p><strong>Not:</strong> Bu link 1 saat içinde geçerlidir. Eğer bu talebi siz yapmadıysanız, dikkate almayabilirsiniz.</p>
              </div>
              
              <p style="margin-top: 30px;">Sorularınız için bizimle iletişime geçebilirsiniz.</p>
              <p><strong>Lioradg Ekibi</strong></p>
            </div>
            <div class="footer">
              <p>© 2025 LIORADG. Tüm hakları saklıdır.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }

  if (isDevelopment) {
    console.log('📧 [DEV MODE] Şifre sıfırlama e-postası gönderildi:', { to, token, resetUrl, subject: mailOptions.subject })
    return { success: true, dev: true }
  }

  try {
    await transporter.sendMail(mailOptions)
    return { success: true }
  } catch (error) {
    console.error('Reset email send error:', error)
    return { success: false, error }
  }
}

const subjectEmailMap: Record<string, { user: string; pass: string; label: string }> = {
  genel:   { user: process.env.SMTP_USER         || 'info@lioradg.com.tr',    pass: process.env.SMTP_PASSWORD         || '', label: 'Genel' },
  destek:  { user: process.env.SMTP_USER_DESTEK  || 'destek@lioradg.com.tr',  pass: process.env.SMTP_PASSWORD_DESTEK  || '', label: 'Teknik Destek' },
  satis:   { user: process.env.SMTP_USER_SATIS   || 'satis@lioradg.com.tr',   pass: process.env.SMTP_PASSWORD_SATIS   || '', label: 'Satış' },
  fatura:  { user: process.env.SMTP_USER_FATURA  || 'fatura@lioradg.com.tr',  pass: process.env.SMTP_PASSWORD_FATURA  || '', label: 'Fatura' },
  iade:    { user: process.env.SMTP_USER_DESTEK  || 'destek@lioradg.com.tr',  pass: process.env.SMTP_PASSWORD_DESTEK  || '', label: 'İptal & İade' },
}

export async function sendContactEmail(data: {
  name: string
  email: string
  subject: string
  message: string
}) {
  const account = subjectEmailMap[data.subject] || subjectEmailMap.genel
  const tr = createTransporter(account.user, account.pass)

  try {
    await tr.sendMail({
      from: `"${data.name}" <${account.user}>`,
      to: account.user,
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
