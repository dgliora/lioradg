import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import NextAuth from 'next-auth'
import { authConfig } from '@/lib/auth.config'

const STAFF_RESTRICTED_PAGES = [
  '/admin/kampanyalar/yeni',
  '/admin/kampanyalar/sablonlar',
  '/admin/musteriler',
]
const STAFF_RESTRICTED_API = ['/api/admin/campaigns/create', '/api/admin/campaign-templates', '/api/admin/users/']

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const pathname = req.nextUrl.pathname
  const authUser = req.auth
  const token = authUser?.user
  const role = (token as { role?: string } | undefined)?.role
  const isAdminPath = pathname.startsWith('/admin')
  const isAdminLoginPath = pathname === '/admin/giris'
  const isAdminApi = pathname.startsWith('/api/admin')

  if (isAdminPath && !isAdminLoginPath) {
    if (!token) {
      return NextResponse.redirect(new URL('/admin/giris', req.nextUrl))
    }
    if (role !== 'ADMIN' && role !== 'STAFF') {
      return NextResponse.redirect(new URL('/', req.nextUrl))
    }
    if (role === 'STAFF') {
      const restricted = STAFF_RESTRICTED_PAGES.some((p) => pathname.startsWith(p))
      if (restricted) {
        return NextResponse.redirect(new URL('/admin?error=unauthorized', req.nextUrl))
      }
    }
  }

  if (isAdminApi) {
    if (!token) {
      return NextResponse.json({ error: 'Giriş yapılmamış' }, { status: 401 })
    }
    if (role !== 'ADMIN' && role !== 'STAFF') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 })
    }
    if (role === 'STAFF') {
      const restricted = STAFF_RESTRICTED_API.some((p) => pathname.startsWith(p))
      if (restricted) {
        return NextResponse.json({ error: 'Bu işlem için yetkiniz yok' }, { status: 403 })
      }
    }
  }

  if (isAdminLoginPath && token && (role === 'ADMIN' || role === 'STAFF')) {
    return NextResponse.redirect(new URL('/admin', req.nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
