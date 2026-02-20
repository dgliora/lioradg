import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth-options'
import { hashPassword } from '@/lib/auth'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== 'ADMIN') return null
  return session
}

// PATCH: kullanıcı güncelle (isim, şifre, izinler)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })

  const { name, email, password, permissions } = await req.json()

  const data: any = {}
  if (name) data.name = name
  if (email) data.email = email
  if (password) data.password = await hashPassword(password)
  if (permissions !== undefined) data.permissions = JSON.stringify(permissions)

  const user = await prisma.user.update({
    where: { id: params.id },
    data,
    select: { id: true, name: true, email: true, role: true, permissions: true },
  })

  return NextResponse.json(user)
}

// DELETE: kullanıcı sil (kendi kendini silemesin)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })

  if (params.id === (session.user as any).id) {
    return NextResponse.json({ error: 'Kendi hesabınızı silemezsiniz.' }, { status: 400 })
  }

  await prisma.user.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
