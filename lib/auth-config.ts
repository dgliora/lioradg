import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import { verifyPassword } from './auth'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          console.log('Authorize - Credentials received:', { email: credentials?.email })
          
          if (!credentials?.email || !credentials?.password) {
            console.log('Authorize - Missing credentials')
            return null
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          })

          if (!user) {
            console.log('Authorize - User not found')
            return null
          }

          console.log('Authorize - User found:', { id: user.id, email: user.email, role: user.role })

          const isValid = await verifyPassword(credentials.password, user.password)
          if (!isValid) {
            console.log('Authorize - Invalid password')
            return null
          }

          console.log('Authorize - Password valid, returning user')
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch (error) {
          console.error('Authorize error:', error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        // Google ile giriş yapıldığında user'ı DB'ye ekle veya güncelle
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        })

        if (!existingUser) {
          // Yeni kullanıcı oluştur (Google ile)
          await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name || '',
              password: '', // Google OAuth kullanıyorsa password yok
              role: 'USER',
              emailVerified: new Date(),
            },
          })
        }
      }
      return true
    },
    async jwt({ token, user }) {
      try {
        // İlk giriş sırasında user objesi gelir
        if (user) {
          console.log('JWT callback - User login:', { id: user.id, email: user.email, role: user.role })
          token.id = user.id
          token.role = user.role
          token.email = user.email
          token.name = user.name
          return token
        }
        
        // Token'da role yoksa DB'den çek (refresh durumu)
        if (!token.role && token.email) {
          console.log('JWT callback - Fetching role from DB for:', token.email)
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email as string },
            select: { id: true, role: true, name: true, email: true },
          })
          if (dbUser) {
            console.log('JWT callback - DB User found:', { id: dbUser.id, role: dbUser.role })
            token.id = dbUser.id
            token.role = dbUser.role
            token.name = dbUser.name
            token.email = dbUser.email
          } else {
            console.log('JWT callback - User not found in DB')
          }
        }
        
        return token
      } catch (error) {
        console.error('JWT callback error:', error)
        return token
      }
    },
    async session({ session, token }) {
      try {
        console.log('Session callback - Token:', { id: token.id, role: token.role, email: token.email })
        if (session.user) {
          session.user.id = token.id as string
          session.user.role = token.role as string
          session.user.name = token.name as string
          session.user.email = token.email as string
        }
        console.log('Session callback - Final session:', session.user)
        return session
      } catch (error) {
        console.error('Session callback error:', error)
        return session
      }
    },
  },
  pages: {
    signIn: '/giris',
    signOut: '/',
    error: '/giris',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

