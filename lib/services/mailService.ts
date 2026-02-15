import { Resend } from 'resend'
import { prisma } from '@/lib/prisma'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM_EMAIL = process.env.MAIL_FROM || 'Liora DG <noreply@lioradg.com.tr>'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lioradg.com.tr'
const COOLDOWN_HOURS = 24

interface CartReminderPayload {
  cartId: string
  email: string
  userId?: string
  customerName?: string
  items: { name: string; price: number; quantity: number; image: string }[]
  total: number
  discountCode?: string
}

/**
 * 24 saat içinde aynı kullanıcıya tekrar mail atılmamış mı kontrol et.
 */
async function canSendMail(email: string, type: string): Promise<boolean> {
  const cooldownDate = new Date(Date.now() - COOLDOWN_HOURS * 60 * 60 * 1000)

  const recentMail = await prisma.mailLog.findFirst({
    where: {
      email,
      type,
      sentAt: { gte: cooldownDate },
    },
  })

  return !recentMail
}

/**
 * Terk edilen sepet hatırlatma maili gönder.
 */
export async function sendCartReminderEmail(payload: CartReminderPayload): Promise<{ success: boolean; error?: string }> {
  const { cartId, email, userId, customerName, items, total, discountCode } = payload

  // Cooldown kontrolü
  const allowed = await canSendMail(email, 'cart_reminder')
  if (!allowed) {
    return { success: false, error: 'Bu kullanıcıya son 24 saat içinde zaten mail gönderildi' }
  }

  // Mail içeriği
  const itemsHtml = items
    .map(
      (item) => `
        <tr>
          <td style="padding:12px;border-bottom:1px solid #f0f0f0;">
            <strong>${item.name}</strong>
          </td>
          <td style="padding:12px;border-bottom:1px solid #f0f0f0;text-align:center;">${item.quantity}</td>
          <td style="padding:12px;border-bottom:1px solid #f0f0f0;text-align:right;">${formatTRY(item.price * item.quantity)}</td>
        </tr>`
    )
    .join('')

  const discountSection = discountCode
    ? `
      <div style="background:#fef3c7;border-radius:8px;padding:16px;margin:20px 0;text-align:center;">
        <p style="margin:0;color:#92400e;font-size:14px;">Size özel indirim kodunuz:</p>
        <p style="margin:8px 0 0;font-size:24px;font-weight:bold;color:#78350f;letter-spacing:2px;">${discountCode}</p>
      </div>`
    : ''

  const html = `
    <!DOCTYPE html>
    <html>
    <body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;margin:0;padding:0;background:#f5f5f5;">
      <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <div style="background:#1a1a2e;padding:32px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:24px;">Liora DG</h1>
          <p style="color:#a0a0b0;margin:8px 0 0;font-size:14px;">Sepetiniz sizi bekliyor!</p>
        </div>
        <div style="padding:32px;">
          <p style="color:#333;font-size:16px;">Merhaba${customerName ? ` ${customerName}` : ''},</p>
          <p style="color:#666;font-size:14px;line-height:1.6;">
            Sepetinizde ürünler bıraktığınızı fark ettik. Siparişinizi tamamlamak ister misiniz?
          </p>
          <table style="width:100%;border-collapse:collapse;margin:24px 0;">
            <thead>
              <tr style="background:#f8f8f8;">
                <th style="padding:12px;text-align:left;font-size:12px;color:#666;text-transform:uppercase;">Ürün</th>
                <th style="padding:12px;text-align:center;font-size:12px;color:#666;text-transform:uppercase;">Adet</th>
                <th style="padding:12px;text-align:right;font-size:12px;color:#666;text-transform:uppercase;">Tutar</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding:16px 12px;font-weight:bold;font-size:16px;">Toplam</td>
                <td style="padding:16px 12px;font-weight:bold;font-size:16px;text-align:right;color:#059669;">${formatTRY(total)}</td>
              </tr>
            </tfoot>
          </table>
          ${discountSection}
          <div style="text-align:center;margin:32px 0;">
            <a href="${SITE_URL}/sepet" style="display:inline-block;background:#1a1a2e;color:#fff;text-decoration:none;padding:14px 40px;border-radius:8px;font-weight:600;font-size:16px;">
              Siparişi Tamamla
            </a>
          </div>
          <p style="color:#999;font-size:12px;text-align:center;">
            Bu mail Liora DG tarafından gönderilmiştir.
          </p>
        </div>
      </div>
    </body>
    </html>
  `

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Sepetinizde ürünler var! 🛒',
      html,
    })

    if (error) {
      console.error('[Mail] Resend hatası:', error)
      return { success: false, error: error.message }
    }

    // Mail log kaydet
    await prisma.mailLog.create({
      data: {
        email,
        userId: userId ?? null,
        type: 'cart_reminder',
      },
    })

    return { success: true }
  } catch (err: any) {
    console.error('[Mail] Gönderim hatası:', err)
    return { success: false, error: err.message || 'Bilinmeyen hata' }
  }
}

function formatTRY(amount: number): string {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount)
}
