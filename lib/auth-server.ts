import { getToken } from 'next-auth/jwt'
import { cookies, headers } from 'next/headers'

export async function checkAdminAuth() {
  try {
    const cookieStore = cookies()
    const headersList = headers()
    
    // NextAuth JWT token'ını cookie'den oku
    const token = cookieStore.get('next-auth.session-token')?.value 
      || cookieStore.get('__Secure-next-auth.session-token')?.value

    if (!token) {
      return { isAdmin: false }
    }

    // JWT'yi decode et
    const jwt = await import('next-auth/jwt')
    const decoded = await jwt.decode({ 
      token, 
      secret: process.env.NEXTAUTH_SECRET || '' 
    })

    if (!decoded || (decoded.role !== 'ADMIN' && decoded.role !== 'STAFF')) {
      return { isAdmin: false }
    }

    return { isAdmin: true, role: decoded.role, userId: decoded.id }
  } catch {
    return { isAdmin: false }
  }
}

