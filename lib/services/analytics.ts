export interface AnalyticsData {
  totalVisitors: number
  last7DaysVisitors: number
  totalSessions: number
}

const FALLBACK: AnalyticsData = {
  totalVisitors: 0,
  last7DaysVisitors: 0,
  totalSessions: 0,
}

/**
 * Google Analytics Data API (GA4) üzerinden ziyaretçi verilerini çeker.
 *
 * Gerekli env değişkenleri:
 * - GA_PROPERTY_ID (ör: "properties/123456789")
 * - GOOGLE_SERVICE_ACCOUNT_EMAIL
 * - GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
 *
 * GA Data API erişimi için Google Cloud Console'da:
 * 1) Analytics Data API'yi aktif et
 * 2) Service Account oluştur ve GA4 property'ye Viewer olarak ekle
 */
export async function getAnalyticsData(): Promise<AnalyticsData> {
  const propertyId = process.env.GA_PROPERTY_ID
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n')

  if (!propertyId || !clientEmail || !privateKey) {
    console.warn('[Analytics] GA env değişkenleri eksik, fallback döndürülüyor')
    return FALLBACK
  }

  try {
    // JWT token oluştur (Google Auth)
    const token = await getGoogleAccessToken(clientEmail, privateKey)
    if (!token) return FALLBACK

    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const formatDate = (d: Date) => d.toISOString().slice(0, 10)

    // GA4 Data API - runReport
    const url = `https://analyticsdata.googleapis.com/v1beta/${propertyId}:runReport`

    // Son 30 gün genel + son 7 gün
    const [report30, report7] = await Promise.all([
      fetchGAReport(url, token, formatDate(thirtyDaysAgo), formatDate(now)),
      fetchGAReport(url, token, formatDate(sevenDaysAgo), formatDate(now)),
    ])

    return {
      totalVisitors: report30.totalUsers,
      last7DaysVisitors: report7.totalUsers,
      totalSessions: report30.sessions,
    }
  } catch (error) {
    console.error('[Analytics] Veri çekilemedi:', error)
    return FALLBACK
  }
}

async function fetchGAReport(url: string, token: string, startDate: string, endDate: string) {
  const body = {
    dateRanges: [{ startDate, endDate }],
    metrics: [
      { name: 'totalUsers' },
      { name: 'sessions' },
    ],
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    next: { revalidate: 300 }, // 5 dk cache
  })

  if (!res.ok) {
    console.error('[Analytics] API hatası:', res.status, await res.text())
    return { totalUsers: 0, sessions: 0 }
  }

  const data = await res.json()
  const row = data.rows?.[0]

  return {
    totalUsers: parseInt(row?.metricValues?.[0]?.value ?? '0', 10),
    sessions: parseInt(row?.metricValues?.[1]?.value ?? '0', 10),
  }
}

// Basit JWT token oluşturma (Google Service Account)
async function getGoogleAccessToken(clientEmail: string, privateKey: string): Promise<string | null> {
  try {
    const now = Math.floor(Date.now() / 1000)
    const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
    const payload = base64url(JSON.stringify({
      iss: clientEmail,
      scope: 'https://www.googleapis.com/auth/analytics.readonly',
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600,
    }))

    const signatureInput = `${header}.${payload}`

    // Node.js crypto ile RS256 imza
    const crypto = await import('crypto')
    const sign = crypto.createSign('RSA-SHA256')
    sign.update(signatureInput)
    const signature = sign.sign(privateKey, 'base64url')

    const jwt = `${signatureInput}.${signature}`

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
    })

    if (!tokenRes.ok) {
      console.error('[Analytics] Token alınamadı:', tokenRes.status)
      return null
    }

    const tokenData = await tokenRes.json()
    return tokenData.access_token
  } catch (e) {
    console.error('[Analytics] Token oluşturma hatası:', e)
    return null
  }
}

function base64url(str: string): string {
  return Buffer.from(str).toString('base64url')
}
