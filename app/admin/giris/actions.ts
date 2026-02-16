'use server'

import { signIn } from '@/lib/auth-options'
import { AuthError } from 'next-auth'

export async function adminLogin(email: string, password: string) {
  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: '/admin',
    })
  } catch (error: any) {
    if (error?.digest?.startsWith('NEXT_REDIRECT')) {
      throw error
    }
    if (error instanceof AuthError) {
      return { error: 'E-posta veya şifre hatalı' }
    }
    return { error: 'E-posta veya şifre hatalı' }
  }
  return null
}
