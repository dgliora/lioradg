'use client'

import { Input, Button } from '@/components/ui'
import { useAuth } from '@/lib/contexts/AuthContext'

export default function ProfilePage() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-h2 font-serif font-bold text-neutral mb-1">
          Profil Bilgilerim
        </h2>
        <p className="text-sm text-neutral-medium">
          Hesap bilgilerinizi güncelleyin
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-warm-50 rounded-lg p-6">
          <h3 className="font-serif font-semibold text-neutral mb-4">
            Kişisel Bilgiler
          </h3>
          <form className="space-y-4">
            <Input
              label="Ad Soyad"
              defaultValue={user.name}
              placeholder="Adınız Soyadınız"
            />

            <Input
              label="E-posta"
              type="email"
              defaultValue={user.email}
              placeholder="ornek@email.com"
            />

            <Input
              label="Telefon"
              type="tel"
              placeholder="05XX XXX XX XX"
            />

            <div className="pt-2">
              <Button fullWidth>
                Bilgileri Güncelle
              </Button>
            </div>
          </form>
        </div>

        <div className="bg-warm-50 rounded-lg p-6">
          <h3 className="font-serif font-semibold text-neutral mb-4">
            Şifre Değiştir
          </h3>
          <form className="space-y-4">
            <Input
              label="Mevcut Şifre"
              type="password"
              placeholder="••••••••"
            />

            <Input
              label="Yeni Şifre"
              type="password"
              placeholder="••••••••"
            />

            <Input
              label="Yeni Şifre (Tekrar)"
              type="password"
              placeholder="••••••••"
            />

            <div className="pt-2">
              <Button fullWidth variant="outline">
                Şifreyi Güncelle
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
