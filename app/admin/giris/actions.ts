'use server'

import { signIn } from '@/lib/auth-options'
import { redirect } from 'next/navigation'

export async function adminLogin(email: string, password: string) {
  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
  } catch (error: any) {
    // NEXT_REDIRECT hatasini tekrar firlat (Next.js yonlendirmesi)
    if (error?.digest?.startsWith('NEXT_REDIRECT')) {
      throw error
    }
    return { error: 'E-posta veya şifre hatalı' }
  }

  redirect('/admin')
}
