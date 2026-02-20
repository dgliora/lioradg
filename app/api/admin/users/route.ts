import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth-options'
import { hashPassword } from '@/lib/auth'

export const dynamic = 'force-dynamic'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    return null
  }
  return session
}

// GET: tüm admin/staff kullanıcıları listele
export async function GET() {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })

  const users = await prisma.user.findMany({
    where: { role: { in: ['ADMIN', 'STAFF'] } },
    select: {
      id: true, name: true, email: true, role: true,
      permissions: true, createdAt: true, emailVerified: true,
    },
    orderBy: { createdAt: 'asc' },
  })

  return NextResponse.json(users)
}

// POST: yeni staff kullanıcı oluştur
export async function POST(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })

  const { name, email, password, permissions } = await req.json()

  if (!name || !email || !password) {
    return NextResponse.json({ error: 'Ad, e-posta ve şifre zorunludur.' }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: 'Bu e-posta zaten kayıtlı.' }, { status: 400 })
  }

  const hashed = await hashPassword(password)

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      role: 'STAFF',
      emailVerified: new Date(), // admin oluşturduğu için doğrulama gerekmez
      permissions: JSON.stringify(permissions || []),
    },
    select: { id: true, name: true, email: true, role: true, permissions: true, createdAt: true },
  })

  return NextResponse.json(user, { status: 201 })
}
