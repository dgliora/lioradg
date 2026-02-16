import type { NextAuthConfig } from 'next-auth'

/**
 * Edge-safe auth config: Prisma/DB yok, sadece JWT decode için.
 * Middleware'de kullanılır; tam config lib/auth-options.ts'de.
 */
export const authConfig: NextAuthConfig = {
  trustHost: true,
  providers: [], // Edge'de sadece session okunur, giris yapilmaz
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  pages: { signIn: '/giris' },
  callbacks: {
    session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.sub
        ;(session.user as { role?: string }).role = token.role as string
        ;(session.user as { email?: string }).email = token.email as string
        ;(session.user as { name?: string }).name = token.name as string
      }
      return session
    },
  },
}
