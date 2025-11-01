import { Card } from '@/components/ui'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Hakkımızda</h1>
            <p className="text-lg text-gray-600">
              Doğal ve bitkisel kozmetik ürünlerinde güvenin adresi
            </p>
          </div>

          <div className="space-y-8">
            {/* Company Info */}
            <Card>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
                Lioradg
              </h2>
              <div className="prose prose-lg max-w-none text-neutral-700">
                <p>
                  Lioradg, kişisel bakım ve temizlik kategorilerinde güvenilir, şeffaf ve erişilebilir ürünler geliştirmek için çalışır. Ar-Ge odaklı yapımızla formülasyonlarımızı sürekli iyileştirir, tedarik ve üretim süreçlerinde kalite standartlarını uygularız.
                </p>
                <p>
                  Müşteri deneyimini merkez alır, her siparişi vaat ettiğimiz hız ve özenle teslim ederiz. Ürün sayfalarında içerik, kullanım ve güvenlik bilgilerini açıkça paylaşır; sorularınızı uzman ekibimiz yanıtlar.
                </p>
                <p>
                  Bugün, daha iyi bir günlük bakım rutini için yalın ve etkili çözümler sunuyoruz.
                </p>
              </div>
            </Card>

            {/* Mission & Vision */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Misyonumuz</h3>
                  <p className="text-gray-600">
                    Doğanın sunduğu en kaliteli hammaddeleri kullanarak, insan sağlığına ve çevreye
                    duyarlı ürünler üretmek ve müşterilerimize güvenilir, etkili kozmetik çözümleri sunmak.
                  </p>
                </div>
              </Card>

              <Card>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-secondary to-secondary-dark rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Vizyonumuz</h3>
                  <p className="text-gray-600">
                    Türkiye&apos;nin en güvenilir bitkisel kozmetik markası olmak ve doğal güzellik
                    anlayışını her eve taşıyarak, sektörde lider konuma ulaşmak.
                  </p>
                </div>
              </Card>
            </div>

            {/* Values */}
            <Card>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Değerlerimiz</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">%100 Doğal</h4>
                    <p className="text-sm text-gray-600">
                      Ürünlerimiz tamamen doğal ve bitkisel içeriklerden üretilir
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Güvenilirlik</h4>
                    <p className="text-sm text-gray-600">
                      Tüm ürünlerimiz laboratuvar testlerinden geçer
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Çevre Dostu</h4>
                    <p className="text-sm text-gray-600">
                      Sürdürülebilir ve çevre dostu üretim yöntemleri
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Müşteri Memnuniyeti</h4>
                    <p className="text-sm text-gray-600">
                      Müşteri memnuniyeti her zaman önceliğimizdir
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Company Details */}
            <Card className="bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Şirket Bilgileri</h2>
              <div className="space-y-2 text-sm text-gray-700">
                <p>
                  <strong>Ticaret Ünvanı:</strong> LİORA BİTKİSEL İLAÇ KİMYA MOBİLYA VE DIŞ TİCARET LİMİTED ŞİRKETİ
                </p>
                <p>
                  <strong>Vergi No:</strong> 6091435386
                </p>
                <p>
                  <strong>Adres:</strong> ARDIÇLI MAH. DOĞAN ARASLI BLV. MEYDAN ARDIÇLI A3 BLOK NO: 230-232C İÇ KAPI NO: 58 ESENYURT/İSTANBUL
                </p>
                <p>
                  <strong>Telefon:</strong> +90 530 208 47 47
                </p>
                <p>
                  <strong>E-posta:</strong> info@lioradg.com.tr
                </p>
                <p>
                  <strong>Web:</strong> http://lioradg.com.tr/
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

