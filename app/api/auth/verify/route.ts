import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ valid: false })
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { password: true, role: true },
    })

    if (!user) {
      return NextResponse.json({ valid: false })
    }

    const isValid = await verifyPassword(password, user.password)
    if (!isValid) {
      return NextResponse.json({ valid: false })
    }

    return NextResponse.json({ valid: true, role: user.role })
  } catch {
    return NextResponse.json({ valid: false })
  }
}
