'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, Input, Button, useToast } from '@/components/ui'
import { useAuth } from '@/lib/contexts/AuthContext'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
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
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        showToast(data.error || 'Giriş başarısız', 'error')
        return
      }

      // Login user with context
      login(data.user)
      
      showToast(`Hoş geldiniz, ${data.user.name}!`, 'success')
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
            Hesabınıza Giriş Yapın
          </h1>
          <p className="text-neutral-600">
            Siparişlerinizi takip edin ve özel fırsatlardan yararlanın
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-16">
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

          <div className="mt-24 text-center">
            <p className="text-small text-neutral-600">
              Hesabınız yok mu?{' '}
              <Link href="/kayit" className="text-primary hover:text-primary-hover font-medium">
                Kayıt Olun
              </Link>
            </p>
          </div>
        </Card>

        <Card className="mt-16 bg-primary/5 border-primary/20">
          <div className="text-center text-small text-neutral-700">
            <p>
              <strong>Not:</strong> Kimlik doğrulama sistemi yakında eklenecektir.
              Şimdilik tüm sayfalar erişilebilir durumdadır.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

