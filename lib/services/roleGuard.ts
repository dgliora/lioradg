import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'
import type { Role } from '@prisma/client'

// STAFF kısıtlamaları: bu path'lere erişemez
const STAFF_RESTRICTED_PATHS = [
  '/admin/kampanyalar/yeni',
  '/admin/kampanyalar/sablonlar',
  '/admin/musteriler',
] as const

// STAFF'ın erişemeyeceği API endpointleri
const STAFF_RESTRICTED_API = [
  '/api/admin/campaigns/create',
  '/api/admin/campaign-templates',
  '/api/admin/users/delete',
] as const

// STAFF'ın yapamayacağı işlemler
export type Permission =
  | 'product:edit_price'
  | 'campaign:create'
  | 'campaign:edit'
  | 'user:delete'
  | 'settings:edit'

const STAFF_DENIED_PERMISSIONS: Permission[] = [
  'product:edit_price',
  'campaign:create',
  'campaign:edit',
  'user:delete',
]

export function hasPermission(role: string, permission: Permission): boolean {
  if (role === 'ADMIN') return true
  if (role === 'STAFF') return !STAFF_DENIED_PERMISSIONS.includes(permission)
  return false
}

export function isAdminOrStaff(role: string | undefined | null): boolean {
  return role === 'ADMIN' || role === 'STAFF'
}

export function isAdmin(role: string | undefined | null): boolean {
  return role === 'ADMIN'
}

// Middleware seviyesinde STAFF kısıtlaması
export function isStaffRestricted(pathname: string): boolean {
  return STAFF_RESTRICTED_PATHS.some((p) => pathname.startsWith(p))
}

export function isStaffRestrictedApi(pathname: string): boolean {
  return STAFF_RESTRICTED_API.some((p) => pathname.startsWith(p))
}

// API route'larında kullanılacak guard
export async function requireAdmin(req: NextRequest): Promise<{ authorized: true; userId: string; role: Role } | { authorized: false; response: NextResponse }> {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (!token || !isAdminOrStaff(token.role as string)) {
    return {
      authorized: false,
      response: NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 }),
    }
  }

  return {
    authorized: true,
    userId: token.id as string,
    role: token.role as Role,
  }
}

// Belirli bir izin gerektiren guard
export async function requirePermission(req: NextRequest, permission: Permission): Promise<{ authorized: true; userId: string; role: Role } | { authorized: false; response: NextResponse }> {
  const auth = await requireAdmin(req)
  if (!auth.authorized) return auth

  if (!hasPermission(auth.role, permission)) {
    return {
      authorized: false,
      response: NextResponse.json({ error: 'Bu işlem için yetkiniz yok' }, { status: 403 }),
    }
  }

  return auth
}
