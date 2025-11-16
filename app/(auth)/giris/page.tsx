'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Card, Input, Button, useToast } from '@/components/ui'
import { LogoLioraDG } from '@/components/LogoLioraDG'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  const { showToast } = useToast()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        showToast('E-posta veya şifre hatalı', 'error')
        setIsSubmitting(false)
        return
      }

      if (result?.ok) {
        showToast('Giriş başarılı! Yönlendiriliyorsunuz...', 'success')
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (error: any) {
      showToast('Giriş sırasında bir hata oluştu', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await signIn('google', { callbackUrl })
    } catch (error) {
      showToast('Google ile giriş başarısız', 'error')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F4F0] via-white to-[#F5EDE8] flex items-center justify-center p-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-32">
          <Link href="/" className="inline-block">
            <LogoLioraDG 
              variant="full"
              width={180}
              height={45}
              className="text-sage mx-auto"
              showImage={true}
            />
          </Link>
          <p className="text-neutral-medium mt-16">Hesabınıza giriş yapın</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-16">
            <Input
              label="E-posta"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="ornek@email.com"
              required
            />
            
            <Input
              label="Şifre"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              required
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.remember}
                  onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
                  className="mr-8 text-primary focus:ring-focus"
                />
                <span className="text-small text-neutral-700">Beni Hatırla</span>
              </label>
              <Link href="/sifremi-unuttum" className="text-small text-primary hover:text-primary-hover">
                Şifremi Unuttum
              </Link>
            </div>

            <Button type="submit" size="lg" fullWidth loading={isSubmitting}>
              Giriş Yap
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-neutral-500">veya</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="lg"
            fullWidth
            onClick={handleGoogleSignIn}
            className="flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google ile Giriş Yap
          </Button>

          <div className="mt-24 text-center">
            <p className="text-small text-neutral-600">
              Hesabınız yok mu?{' '}
              <Link href="/kayit" className="text-primary hover:text-primary-hover font-medium">
                Kayıt Olun
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
