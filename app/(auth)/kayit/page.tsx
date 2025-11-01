'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, Input, Button, useToast } from '@/components/ui'
import { useAuth } from '@/lib/contexts/AuthContext'

export default function RegisterPage() {
  const router = useRouter()
  const { login } = useAuth()
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.passwordConfirm) {
      alert('Şifreler eşleşmiyor!')
      return
    }

    if (!formData.termsConsent) {
      alert('Üyelik koşulları ve KVKK metnini onaylamanız gerekmektedir.')
      return
    }

    setIsSubmitting(true)
    
    try {
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

      // Auto-login after registration
      login(data.user)
      
      showToast(`Hoş geldiniz ${data.user.name}! Hesabınıza e-posta gönderildi.`, 'success')
      router.push('/account')
    } catch (error) {
      showToast('Bir hata oluştu', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-32">
          <Link href="/" className="inline-block mb-24">
            <span className="text-h1 font-bold text-primary">LIORADG</span>
          </Link>
          <h1 className="text-h2 font-bold text-neutral-900 mb-8">
            Hesap Oluşturun
          </h1>
          <p className="text-neutral-600">
            Hızlı ve güvenli alışveriş için üye olun
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-16">
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
              placeholder="En az 8 karakter"
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

            <div className="space-y-3">
              <label className="flex items-start cursor-pointer p-3 rounded-lg hover:bg-warm-50 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.termsConsent}
                  onChange={(e) => setFormData({ ...formData, termsConsent: e.target.checked })}
                  required
                  className="mt-1 mr-3 text-sage focus:ring-sage"
                />
                <span className="text-sm text-neutral-medium">
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

              <label className="flex items-start cursor-pointer p-3 rounded-lg hover:bg-warm-50 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.emailConsent}
                  onChange={(e) => setFormData({ ...formData, emailConsent: e.target.checked })}
                  className="mt-1 mr-3 text-sage focus:ring-sage"
                />
                <span className="text-sm text-neutral-medium">
                  Kampanyalar ve yeni ürünler hakkında e-posta ile bilgilendirme almak istiyorum
                </span>
              </label>

              <label className="flex items-start cursor-pointer p-3 rounded-lg hover:bg-warm-50 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.smsConsent}
                  onChange={(e) => setFormData({ ...formData, smsConsent: e.target.checked })}
                  className="mt-1 mr-3 text-sage focus:ring-sage"
                />
                <span className="text-sm text-neutral-medium">
                  Özel fırsatlar ve sipariş durumu hakkında SMS ile bilgilendirme almak istiyorum
                </span>
              </label>
            </div>

            <Button type="submit" size="lg" fullWidth loading={isSubmitting}>
              Kayıt Ol
            </Button>
          </form>

          <div className="mt-24 text-center">
            <p className="text-small text-neutral-600">
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

