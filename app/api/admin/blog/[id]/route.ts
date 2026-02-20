import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdminAuth } from '@/lib/auth-server'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await checkAdminAuth()
    if (!auth.isAdmin) return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })

    const post = await prisma.blogPost.findUnique({ where: { id: params.id } })
    if (!post) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })
    return NextResponse.json(post)
  } catch {
    return NextResponse.json({ error: 'Hata' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await checkAdminAuth()
    if (!auth.isAdmin) return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })

    const body = await req.json()
    const post = await prisma.blogPost.update({
      where: { id: params.id },
      data: {
        ...body,
        updatedAt: new Date(),
      },
    })
    return NextResponse.json(post)
  } catch {
    return NextResponse.json({ error: 'Güncellenemedi' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await checkAdminAuth()
    if (!auth.isAdmin) return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })

    await prisma.blogPost.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Silinemedi' }, { status: 500 })
  }
}
