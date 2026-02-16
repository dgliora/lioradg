import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// STAFF'ın erişemeyeceği admin sayfaları
const STAFF_RESTRICTED_PAGES = [
  '/admin/kampanyalar/yeni',
  '/admin/kampanyalar/sablonlar',
  '/admin/musteriler',
]

// STAFF'ın erişemeyeceği API endpointleri
const STAFF_RESTRICTED_API = [
  '/api/admin/campaigns/create',
  '/api/admin/campaign-templates',
]

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const isSecure = request.url.startsWith('https')
  const sessionCookieName = isSecure ? '__Secure-authjs.session-token' : 'authjs.session-token'
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
    salt: sessionCookieName,
  })
  const isAdminPath = pathname.startsWith('/admin')
  const isAdminLoginPath = pathname === '/admin/giris'
  const isAdminApi = pathname.startsWith('/api/admin')

  // ─── Admin Panel Sayfaları ───
  if (isAdminPath && !isAdminLoginPath) {
    if (!token) {
      return NextResponse.redirect(new URL('/admin/giris', request.url))
    }

    const role = token.role as string

    // Sadece ADMIN ve STAFF erişebilir
    if (role !== 'ADMIN' && role !== 'STAFF') {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // STAFF kısıtlı sayfalar
    if (role === 'STAFF') {
      const isRestricted = STAFF_RESTRICTED_PAGES.some((p) => pathname.startsWith(p))
      if (isRestricted) {
        return NextResponse.redirect(new URL('/admin?error=unauthorized', request.url))
      }
    }
  }

  // ─── Admin API Endpointleri ───
  if (isAdminApi) {
    if (!token) {
      return NextResponse.json({ error: 'Giriş yapılmamış' }, { status: 401 })
    }

    const role = token.role as string

    if (role !== 'ADMIN' && role !== 'STAFF') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 })
    }

    // STAFF kısıtlı API'ler
    if (role === 'STAFF') {
      const isRestricted = STAFF_RESTRICTED_API.some((p) => pathname.startsWith(p))
      if (isRestricted) {
        return NextResponse.json({ error: 'Bu işlem için yetkiniz yok' }, { status: 403 })
      }
    }
  }

  // Admin login sayfasında zaten giriş yapmış admin/staff varsa panele yönlendir
  if (isAdminLoginPath && token && (token.role === 'ADMIN' || token.role === 'STAFF')) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
