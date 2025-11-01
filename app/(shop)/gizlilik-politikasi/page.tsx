import { Card } from '@/components/ui'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Gizlilik Politikası</h1>

          <Card>
            <div className="prose prose-lg max-w-none">
              <p className="text-sm text-gray-500 mb-6">Son Güncelleme: 29 Ekim 2025</p>

              <h2>1. Giriş</h2>
              <p>
                LİORA BİTKİSEL İLAÇ KİMYA MOBİLYA VE DIŞ TİCARET LİMİTED ŞİRKETİ olarak, kişisel verilerinizin
                güvenliğine önem veriyoruz. Bu gizlilik politikası, web sitemizi ziyaret ettiğinizde toplanan
                bilgilerin nasıl kullanıldığını açıklamaktadır.
              </p>

              <h2>2. Toplanan Bilgiler</h2>
              <p>Web sitemizi kullanırken aşağıdaki bilgileri toplayabiliriz:</p>
              <ul>
                <li>Ad, soyad</li>
                <li>E-posta adresi</li>
                <li>Telefon numarası</li>
                <li>Teslimat adresi</li>
                <li>Fatura bilgileri</li>
                <li>Sipariş geçmişi</li>
                <li>IP adresi ve tarayıcı bilgileri</li>
              </ul>

              <h2>3. Bilgilerin Kullanımı</h2>
              <p>Topladığımız bilgiler şu amaçlarla kullanılır:</p>
              <ul>
                <li>Siparişlerinizi işlemek ve teslim etmek</li>
                <li>Müşteri hizmetleri desteği sağlamak</li>
                <li>Ürün ve hizmetlerimizi geliştirmek</li>
                <li>Kampanya ve özel teklifleri iletmek (izniniz dahilinde)</li>
                <li>Yasal yükümlülükleri yerine getirmek</li>
              </ul>

              <h2>4. Çerezler (Cookies)</h2>
              <p>
                Web sitemiz, kullanıcı deneyimini iyileştirmek için çerezler kullanır. Çerezler, tarayıcınız
                tarafından bilgisayarınızda saklanan küçük metin dosyalarıdır. Tarayıcı ayarlarınızdan çerezleri
                devre dışı bırakabilirsiniz.
              </p>

              <h2>5. Üçüncü Taraf Paylaşımı</h2>
              <p>
                Kişisel bilgileriniz, yasal zorunluluklar veya hizmet sağlayıcılar (kargo firmaları, ödeme
                sistemleri) dışında üçüncü taraflarla paylaşılmaz. Hizmet sağlayıcılarımız, verilerinizi yalnızca
                belirlenen amaçlar doğrultusunda kullanır.
              </p>

              <h2>6. Veri Güvenliği</h2>
              <p>
                Kişisel verilerinizin güvenliğini sağlamak için endüstri standardı güvenlik önlemleri alıyoruz.
                Tüm hassas bilgiler SSL şifreleme ile korunur.
              </p>

              <h2>7. Haklarınız</h2>
              <p>6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında aşağıdaki haklara sahipsiniz:</p>
              <ul>
                <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                <li>İşlenmişse buna ilişkin bilgi talep etme</li>
                <li>Verilerinizin düzeltilmesini isteme</li>
                <li>Verilerinizin silinmesini isteme</li>
                <li>İşleme faaliyetlerine itiraz etme</li>
              </ul>

              <h2>8. İletişim</h2>
              <p>
                Gizlilik politikamız hakkında sorularınız için bize{' '}
                <a href="mailto:info@lioradg.com.tr" className="text-primary hover:underline">
                  info@lioradg.com.tr
                </a>{' '}
                adresinden ulaşabilirsiniz.
              </p>

              <h2>9. Değişiklikler</h2>
              <p>
                Bu gizlilik politikası zaman zaman güncellenebilir. Önemli değişiklikler olduğunda sizi
                bilgilendireceğiz.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

