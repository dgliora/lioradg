import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function GET(req: NextRequest) {
  const isSecure = req.url.startsWith('https')
  const cookieName = isSecure ? '__Secure-authjs.session-token' : 'authjs.session-token'
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, salt: cookieName })
  
  return NextResponse.json({
    hasToken: !!token,
    hasSecret: !!process.env.NEXTAUTH_SECRET,
    secretLength: process.env.NEXTAUTH_SECRET?.length || 0,
    tokenRole: token?.role || null,
    tokenEmail: token?.email || null,
    cookies: req.cookies.getAll().map(c => c.name),
  })
}
