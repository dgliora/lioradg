import { auth } from '@/lib/auth-options'

export async function checkAdminAuth() {
  try {
    const session = await auth()

    if (!session?.user) {
      return { isAdmin: false }
    }

    const role = (session.user as any).role
    if (role !== 'ADMIN' && role !== 'STAFF') {
      return { isAdmin: false }
    }

    return { isAdmin: true, role, userId: (session.user as any).id }
  } catch {
    return { isAdmin: false }
  }
}

