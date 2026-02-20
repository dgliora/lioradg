'use client'

import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui'
import { useAuth } from '@/lib/contexts/AuthContext'
import { useFavoritesStore } from '@/lib/store/favoritesStore'
import { useCartStore } from '@/lib/store/cartStore'

export default function AccountPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { items: favorites } = useFavoritesStore()
  const { items: cartItems } = useCartStore()

  // Adres sayısını localStorage'dan al
  const addressCount = typeof window !== 'undefined' 
    ? (() => {
        const saved = localStorage.getItem('user-addresses')
        return saved ? JSON.parse(saved).length : 0
      })()
    : 0

  // Toplam sepet sayısı
  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  if (!user) return null

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-sage/5 to-rose/5 rounded-xl p-4 md:p-6 border-2 border-sage/20">
        <div className="flex items-start gap-3 md:gap-4">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-sage to-sage-dark flex items-center justify-center text-white text-xl md:text-2xl font-serif flex-shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl md:text-h3 font-serif text-sage mb-1 md:mb-2">
              🎉 Hoş Geldiniz!
            </h2>
            <p className="text-sm md:text-base text-neutral-medium mb-2 md:mb-3">
              <strong className="text-neutral">{user.name}</strong>, Lioradg ailesine katıldığınız için teşekkür ederiz.
            </p>
            <p className="text-xs md:text-sm text-neutral-medium hidden sm:block">
              E-posta adresinize bir hoş geldiniz mesajı gönderdik. Özel fırsatlardan haberdar olmak için e-posta kutunuzu kontrol edin.
            </p>
            <div className="mt-3 pt-3 border-t border-sage/20">
              <p className="text-xs md:text-sm text-neutral-medium break-all">
                <span className="font-medium text-sage">{user.email}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        <div className="bg-gradient-to-br from-sage/10 to-sage/5 rounded-xl p-3 md:p-6 text-center border border-sage/20">
          <div className="text-2xl md:text-4xl font-serif font-bold text-sage mb-1 md:mb-2">0</div>
          <div className="text-[11px] md:text-sm text-neutral-medium font-medium leading-tight">Toplam<br className="sm:hidden" /> Sipariş</div>
        </div>
        <div className="bg-gradient-to-br from-rose/10 to-rose/5 rounded-xl p-3 md:p-6 text-center border border-rose/20">
          <div className="text-2xl md:text-4xl font-serif font-bold text-rose mb-1 md:mb-2">{favorites.length}</div>
          <div className="text-[11px] md:text-sm text-neutral-medium font-medium leading-tight">Favori<br className="sm:hidden" /> Ürün</div>
        </div>
        <div className="bg-gradient-to-br from-warm-100 to-warm-50 rounded-xl p-3 md:p-6 text-center border border-warm-200">
          <div className="text-2xl md:text-4xl font-serif font-bold text-neutral mb-1 md:mb-2">{addressCount}</div>
          <div className="text-[11px] md:text-sm text-neutral-medium font-medium leading-tight">Kayıtlı<br className="sm:hidden" /> Adres</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-serif font-semibold text-neutral mb-4">
          Hızlı İşlemler
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card hover className="cursor-pointer" onClick={() => router.push('/account/siparislerim')}>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-sage/10 flex items-center justify-center text-3xl flex-shrink-0">
                📦
              </div>
              <div>
                <h4 className="font-semibold text-neutral mb-1">Siparişlerim</h4>
                <p className="text-sm text-neutral-medium">Aktif ve geçmiş siparişleriniz</p>
              </div>
            </div>
          </Card>

          <Card hover className="cursor-pointer" onClick={() => router.push('/account/adreslerim')}>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-rose/10 flex items-center justify-center text-3xl flex-shrink-0">
                📍
              </div>
              <div>
                <h4 className="font-semibold text-neutral mb-1">Adreslerim</h4>
                <p className="text-sm text-neutral-medium">Teslimat adreslerinizi yönetin</p>
              </div>
            </div>
          </Card>

          <Card hover className="cursor-pointer" onClick={() => router.push('/account/favorilerim')}>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-danger/10 flex items-center justify-center text-3xl flex-shrink-0">
                ❤️
              </div>
              <div>
                <h4 className="font-semibold text-neutral mb-1">Favorilerim</h4>
                <p className="text-sm text-neutral-medium">Beğendiğiniz ürünler ({favorites.length})</p>
              </div>
            </div>
          </Card>

          <a
            href="https://wa.me/905XXXXXXXXX"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Card hover className="cursor-pointer h-full">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center text-3xl flex-shrink-0">
                  💬
                </div>
                <div>
                  <h4 className="font-semibold text-neutral mb-1">WhatsApp Destek</h4>
                  <p className="text-sm text-neutral-medium">7/24 canlı destek</p>
                </div>
              </div>
            </Card>
          </a>
        </div>
      </div>
    </div>
  )
}
