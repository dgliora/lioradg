'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Card, Input, Button, useToast } from '@/components/ui'
import { LogoLioraDG } from '@/components/LogoLioraDG'

export default function RegisterPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    emailConsent: false,
    smsConsent: false,
    termsConsent: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.passwordConfirm) {
      showToast('Şifreler eşleşmiyor!', 'error')
      return
    }

    if (formData.password.length < 6) {
      showToast('Şifre en az 6 karakter olmalı', 'error')
      return
    }

    if (!formData.termsConsent) {
      showToast('Üyelik koşulları ve KVKK metnini onaylamanız gerekmektedir.', 'error')
      return
    }

    setIsSubmitting(true)
    
    try {
      // 1) Kullanıcıyı oluştur
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          emailConsent: formData.emailConsent,
          smsConsent: formData.smsConsent,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        showToast(data.error || 'Kayıt başarısız', 'error')
        return
      }

      window.location.href = `/kayit-basarili?email=${encodeURIComponent(formData.email)}`
    } catch (error) {
      showToast('Bir hata oluştu', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    try {
      await signIn('google', { callbackUrl: '/account' })
    } catch {
      showToast('Google ile kayıt sırasında hata oluştu', 'error')
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <LogoLioraDG 
              variant="full"
              width={200}
              height={50}
              className="text-sage"
              showImage={true}
            />
          </Link>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">
            Hesap Oluşturun
          </h1>
          <p className="text-neutral-600">
            Hızlı ve güvenli alışveriş için üye olun
          </p>
        </div>

        <Card>
          {/* Google ile Kayıt */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGoogleLoading ? (
              <svg className="w-5 h-5 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            Google ile Kayıt Ol
          </button>

          {/* Ayırıcı */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-gray-400">veya</span>
            </div>
          </div>

          {/* Email/Şifre Formu */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Ad Soyad"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Adınız ve soyadınız"
              required
            />
            
            <Input
              label="E-posta Adresi"
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
              placeholder="En az 6 karakter"
              required
            />
            
            <Input
              label="Şifre Tekrar"
              type="password"
              value={formData.passwordConfirm}
              onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
              placeholder="Şifrenizi tekrar girin"
              required
            />

            <div className="space-y-3 pt-2">
              <label className="flex items-start cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.termsConsent}
                  onChange={(e) => setFormData({ ...formData, termsConsent: e.target.checked })}
                  required
                  className="mt-1 mr-3 text-sage focus:ring-sage rounded"
                />
                <span className="text-sm text-neutral-600">
                  <Link href="/kullanim-sartlari" target="_blank" className="text-sage hover:underline font-medium">
                    Üyelik Koşulları
                  </Link>
                  {' '}ve{' '}
                  <Link href="/kvkk" target="_blank" className="text-sage hover:underline font-medium">
                    KVKK Aydınlatma Metni
                  </Link>
                  &apos;ni okudum, kabul ediyorum
                </span>
              </label>

              <label className="flex items-start cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.emailConsent}
                  onChange={(e) => setFormData({ ...formData, emailConsent: e.target.checked })}
                  className="mt-1 mr-3 text-sage focus:ring-sage rounded"
                />
                <span className="text-sm text-neutral-600">
                  Kampanyalar ve yeni ürünler hakkında e-posta almak istiyorum
                </span>
              </label>

              <label className="flex items-start cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.smsConsent}
                  onChange={(e) => setFormData({ ...formData, smsConsent: e.target.checked })}
                  className="mt-1 mr-3 text-sage focus:ring-sage rounded"
                />
                <span className="text-sm text-neutral-600">
                  Özel fırsatlar ve sipariş durumu hakkında SMS almak istiyorum
                </span>
              </label>
            </div>

            <Button type="submit" size="lg" fullWidth loading={isSubmitting}>
              Kayıt Ol
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-600">
              Zaten hesabınız var mı?{' '}
              <Link href="/giris" className="text-primary hover:text-primary-hover font-medium">
                Giriş Yapın
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
