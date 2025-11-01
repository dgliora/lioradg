import { Card } from '@/components/ui'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Kullanım Şartları</h1>

          <Card>
            <div className="prose prose-lg max-w-none">
              <p className="text-sm text-gray-500 mb-6">Son Güncelleme: 29 Ekim 2025</p>

              <h2>1. Genel Hükümler</h2>
              <p>
                Bu web sitesi LİORA BİTKİSEL İLAÇ KİMYA MOBİLYA VE DIŞ TİCARET LİMİTED ŞİRKETİ tarafından
                işletilmektedir. Sitemizi kullanarak bu şartları kabul etmiş sayılırsınız.
              </p>

              <h2>2. Üyelik</h2>
              <p>Üyelik için gereklilikler:</p>
              <ul>
                <li>18 yaşını doldurmuş olmak</li>
                <li>Doğru ve güncel bilgiler sağlamak</li>
                <li>Hesap güvenliğinden sorumlu olmak</li>
                <li>Şifrenizi kimseyle paylaşmamak</li>
              </ul>

              <h2>3. Sipariş ve Ödeme</h2>
              <ul>
                <li>Tüm fiyatlar TL cinsindendir ve KDV dahildir</li>
                <li>Ödeme güvenliği için SSL şifreleme kullanılır</li>
                <li>Stok durumuna göre siparişler iptal edilebilir</li>
                <li>Fiyat ve ürün bilgileri değiştirilebilir</li>
              </ul>

              <h2>4. Teslimat</h2>
              <ul>
                <li>Kargo süresi 2-5 iş günüdür</li>
                <li>500 TL üzeri siparişlerde kargo ücretsizdir</li>
                <li>Teslimat adresi değişiklikleri kargo öncesi yapılabilir</li>
                <li>Teslim edilemeyen ürünler iade edilir</li>
              </ul>

              <h2>5. İade ve Cayma Hakkı</h2>
              <ul>
                <li>Ürün teslim tarihinden itibaren 14 gün içinde cayma hakkı kullanılabilir</li>
                <li>Ürün kullanılmamış ve ambalajı açılmamış olmalıdır</li>
                <li>Hijyenik ürünler iade edilemez</li>
                <li>İade kargo ücreti müşteriye aittir</li>
              </ul>

              <h2>6. Fikri Mülkiyet</h2>
              <p>
                Bu sitedeki tüm içerik (metin, görsel, logo, tasarım) Liora&apos;ya aittir ve telif hakları
                ile korunmaktadır. İzinsiz kullanılamaz, kopyalanamaz veya dağıtılamaz.
              </p>

              <h2>7. Sorumluluk Sınırlaması</h2>
              <ul>
                <li>Ürünler tanıtıldığı gibidir</li>
                <li>Yanlış kullanımdan kaynaklanan zararlardan sorumlu değiliz</li>
                <li>Alerjik reaksiyonlar için sorumlu tutulamayız</li>
                <li>Site kesintilerinden sorumlu değiliz</li>
              </ul>

              <h2>8. Yasak Kullanımlar</h2>
              <p>Sitemizi kullanırken şunları yapamazsınız:</p>
              <ul>
                <li>Yasa dışı faaliyetler</li>
                <li>Spam veya zararlı içerik gönderme</li>
                <li>Başkasının hesabını kullanma</li>
                <li>Site güvenliğini tehdit etme</li>
              </ul>

              <h2>9. Değişiklikler</h2>
              <p>
                Bu kullanım şartları herhangi bir zamanda değiştirilebilir. Değişiklikler sitede
                yayınlandığında yürürlüğe girer.
              </p>

              <h2>10. Uygulanacak Hukuk</h2>
              <p>
                Bu şartlar Türkiye Cumhuriyeti kanunlarına tabidir. Uyuşmazlıklar İstanbul mahkemelerinde
                çözülür.
              </p>

              <h2>11. İletişim</h2>
              <p>
                Sorularınız için:{' '}
                <a href="mailto:info@lioradg.com.tr" className="text-primary hover:underline">
                  info@lioradg.com.tr
                </a>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

