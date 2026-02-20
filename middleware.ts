import { NextResponse } from 'next/server'
import NextAuth from 'next-auth'
import { authConfig } from '@/lib/auth.config'

// Her izin anahtarı → hangi URL prefix'ini kapsar
const PERMISSION_PATHS: Record<string, string> = {
  analytics: '/admin/analitik',
  products:  '/admin/urunler',
  categories:'/admin/kategoriler',
  orders:    '/admin/siparisler',
  campaigns: '/admin/kampanyalar',
  customers: '/admin/musteriler',
  newsletter:'/admin/newsletter',
  settings:  '/admin/ayarlar',
  users:     '/admin/kullanicilar',
}

// Bu path için gereken izin anahtarını döndür (yoksa null → herkese açık admin sayfası)
function requiredPermission(pathname: string): string | null {
  for (const [key, prefix] of Object.entries(PERMISSION_PATHS)) {
    if (pathname.startsWith(prefix)) return key
  }
  return null // dashboard vb. herkese açık
}

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const pathname = req.nextUrl.pathname
  const authUser = req.auth
  const token = authUser?.user
  const role = (token as any)?.role as string | undefined
  const permissionsRaw: string = (token as any)?.permissions || '[]'

  const isAdminPath = pathname.startsWith('/admin')
  const isAdminLoginPath = pathname === '/admin/giris'
  const isAdminApi = pathname.startsWith('/api/admin')

  // --- Admin sayfaları ---
  if (isAdminPath && !isAdminLoginPath) {
    if (!token) {
      return NextResponse.redirect(new URL('/admin/giris', req.nextUrl))
    }
    if (role !== 'ADMIN' && role !== 'STAFF') {
      return NextResponse.redirect(new URL('/', req.nextUrl))
    }

    // STAFF → izin kontrolü
    if (role === 'STAFF') {
      const requiredKey = requiredPermission(pathname)
      if (requiredKey) {
        let permissions: string[] = []
        try { permissions = JSON.parse(permissionsRaw) } catch {}
        if (!permissions.includes(requiredKey)) {
          return NextResponse.redirect(new URL('/admin?error=unauthorized', req.nextUrl))
        }
      }
    }
  }

  // --- Admin API ---
  if (isAdminApi) {
    if (!token) {
      return NextResponse.json({ error: 'Giriş yapılmamış' }, { status: 401 })
    }
    if (role !== 'ADMIN' && role !== 'STAFF') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 })
    }
    if (role === 'STAFF') {
      // Kullanıcı yönetimi API'si sadece ADMIN
      if (pathname.startsWith('/api/admin/users')) {
        return NextResponse.json({ error: 'Bu işlem için yetkiniz yok' }, { status: 403 })
      }
      // Diğer API'ler için izin kontrolü (path → permission eşlemesi)
      const apiToPermission: Record<string, string> = {
        '/api/admin/products':   'products',
        '/api/admin/categories': 'categories',
        '/api/admin/orders':     'orders',
        '/api/admin/campaigns':  'campaigns',
        '/api/admin/customers':  'customers',
        '/api/admin/newsletter': 'newsletter',
        '/api/admin/settings':   'settings',
      }
      for (const [apiPrefix, permKey] of Object.entries(apiToPermission)) {
        if (pathname.startsWith(apiPrefix)) {
          let permissions: string[] = []
          try { permissions = JSON.parse(permissionsRaw) } catch {}
          if (!permissions.includes(permKey)) {
            return NextResponse.json({ error: 'Bu işlem için yetkiniz yok' }, { status: 403 })
          }
        }
      }
    }
  }

  // Giriş yapmış admin → login sayfasına girmesin
  if (isAdminLoginPath && token && (role === 'ADMIN' || role === 'STAFF')) {
    return NextResponse.redirect(new URL('/admin', req.nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
