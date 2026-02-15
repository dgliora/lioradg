import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    
    const correctPassword = process.env.SITE_PASSWORD || 'lioradg2025'
    
    if (password === correctPassword) {
      const response = NextResponse.json({ success: true })
      
      // 30 gün geçerli cookie
      response.cookies.set('site_access', correctPassword, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30 // 30 gün
      })
      
      return response
    }
    
    return NextResponse.json(
      { error: 'Hatalı şifre' },
      { status: 401 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Bir hata oluştu' },
      { status: 500 }
    )
  }
}

