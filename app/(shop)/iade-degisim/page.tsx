import { Card } from '@/components/ui'

export default function ReturnExchangePage() {
  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-h1 font-bold text-neutral-900 mb-4">
              İade ve Değişim
            </h1>
            <p className="text-base text-neutral-600">
              İade ve değişim işlemleriniz hakkında bilgi
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <h2 className="text-h2 font-semibold text-neutral-900 mb-4">
                İade Şartları
              </h2>
              <div className="prose prose-lg max-w-none text-neutral-700 space-y-4">
                <ul className="list-disc pl-5 space-y-2">
                  <li>Ürün teslim tarihinden itibaren 14 gün içinde iade hakkınız vardır</li>
                  <li>Ürün ambalajı açılmamış ve kullanılmamış olmalıdır</li>
                  <li>Ürün orijinal ambalajında ve eksiksiz olmalıdır</li>
                  <li>Fatura veya sipariş belgesi ile birlikte gönderilmelidir</li>
                </ul>
              </div>
            </Card>

            <Card>
              <h2 className="text-h2 font-semibold text-neutral-900 mb-4">
                İade Süreci
              </h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-1">İade Talebinizi Bildirin</h3>
                    <p className="text-small text-neutral-600">
                      destek@lioradg.com.tr adresine sipariş numaranız ve iade sebebinizi gönderin
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-1">Onay Alın</h3>
                    <p className="text-small text-neutral-600">
                      Müşteri hizmetleri ekibimiz iadenizi onaylayacak ve iade adresi gönderecektir
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-1">Ürünü Gönderin</h3>
                    <p className="text-small text-neutral-600">
                      Ürünü verilen adrese kargo ile gönderin (kargo ücreti tarafınıza aittir)
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-1">İade İşlemi</h3>
                    <p className="text-small text-neutral-600">
                      Ürün tarafımıza ulaştıktan sonra 5-7 iş günü içinde ödemeniz iade edilir
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <h2 className="text-h2 font-semibold text-neutral-900 mb-4">
                İade Edilemeyen Ürünler
              </h2>
              <div className="prose prose-lg max-w-none text-neutral-700">
                <ul className="list-disc pl-5 space-y-2">
                  <li>Ambalajı açılmış hijyenik ürünler</li>
                  <li>Kullanılmış veya bozulmuş ürünler</li>
                  <li>Özel olarak hazırlanan kişiye özel ürünler</li>
                  <li>Kampanyalı veya özel fiyatlı ürünler (belirtilmişse)</li>
                </ul>
              </div>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <div className="text-center">
                <h3 className="text-h3 font-semibold text-neutral-900 mb-2">
                  Yardıma mı ihtiyacınız var?
                </h3>
                <p className="text-neutral-600 mb-4">
                  İade ve değişim ile ilgili sorularınız için bizimle iletişime geçin
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a href="tel:+905302084747" className="text-primary hover:underline font-medium">
                    +90 530 208 47 47
                  </a>
                  <span className="hidden sm:inline text-neutral-400">|</span>
                  <a href="mailto:destek@lioradg.com.tr" className="text-primary hover:underline font-medium">
                    destek@lioradg.com.tr
                  </a>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

