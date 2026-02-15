import { NextRequest, NextResponse } from 'next/server'
import { markAbandonedCarts } from '@/lib/services/abandonedCart'

/**
 * Terk edilen sepetleri işaretleyen cron endpoint'i.
 * Vercel Cron veya harici servis ile tetiklenebilir.
 *
 * Authorization: Bearer <CRON_SECRET> header'ı beklenir.
 */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const count = await markAbandonedCarts()
    return NextResponse.json({
      success: true,
      marked: count,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[Cron] Abandoned cart hatası:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
