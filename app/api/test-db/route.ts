import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Veritabanı bağlantısını test et
    const userCount = await prisma.user.count()
    
    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      userCount,
      hasDbUrl: !!process.env.DATABASE_URL,
      hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
      hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
      nextAuthUrl: process.env.NEXTAUTH_URL?.substring(0, 30),
    })
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      database: 'disconnected',
      error: error.message,
      hasDbUrl: !!process.env.DATABASE_URL,
    })
  }
}
