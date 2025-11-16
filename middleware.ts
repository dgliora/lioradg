import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  const isAdminPath = request.nextUrl.pathname.startsWith('/admin')
  const isAdminLoginPath = request.nextUrl.pathname === '/admin/giris'

  // Admin sayfalarına erişim kontrolü
  if (isAdminPath && !isAdminLoginPath) {
    // Giriş yapmamış kullanıcıyı admin login'e yönlendir
    if (!token) {
      return NextResponse.redirect(new URL('/admin/giris', request.url))
    }

    // ADMIN rolü olmayan kullanıcıyı anasayfaya yönlendir
    if (token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Admin login sayfasında zaten giriş yapmış admin varsa panele yönlendir
  if (isAdminLoginPath && token?.role === 'ADMIN') {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}

