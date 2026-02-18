import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mesafeli Satış Sözleşmesi',
  description: 'LIORADG Mesafeli Satış Sözleşmesi - 6502 sayılı Tüketicinin Korunması Hakkında Kanun kapsamında.',
}

export default function MesafeliSatisSozlesmesiPage() {
  const today = new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' })

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Mesafeli Satış Sözleşmesi</h1>
          <p className="text-sm text-gray-500 mb-8">Son Güncelleme: {today}</p>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 prose prose-lg max-w-none text-gray-700 space-y-6">

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 not-prose">
              <p className="text-sm text-amber-800">
                Bu sözleşme, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği (RG: 27.11.2014 / 29188) kapsamında düzenlenmiştir.
              </p>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mt-8">MADDE 1 – TARAFLAR</h2>

            <h3 className="font-semibold text-gray-800">1.1. SATICI</h3>
            <table className="w-full text-sm border-collapse not-prose">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-2 pr-4 font-medium text-gray-600 w-1/3">Ticaret Unvanı</td>
                  <td className="py-2">LİORA BİTKİSEL İLAÇ KİMYA MOBİLYA VE DIŞ TİCARET LİMİTED ŞİRKETİ</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 pr-4 font-medium text-gray-600">Kısa Ad</td>
                  <td className="py-2">LIORADG</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 pr-4 font-medium text-gray-600">Adres</td>
                  <td className="py-2">İstanbul, Türkiye</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 pr-4 font-medium text-gray-600">E-posta</td>
                  <td className="py-2">info@lioradg.com.tr</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 pr-4 font-medium text-gray-600">Telefon</td>
                  <td className="py-2">+90 530 208 47 47</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium text-gray-600">Web Sitesi</td>
                  <td className="py-2">www.lioradg.com.tr</td>
                </tr>
              </tbody>
            </table>

            <h3 className="font-semibold text-gray-800 mt-4">1.2. ALICI</h3>
            <p>
              Sipariş sırasında alıcı tarafından beyan edilen ad, soyad, adres, telefon ve e-posta bilgilerine sahip kişidir. Alıcı, sözleşme konusu ürünü satın alarak bu sözleşmedeki tüm koşulları kabul etmiş sayılır.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8">MADDE 2 – TANIMLAR</h2>
            <ul>
              <li><strong>Kanun:</strong> 6502 sayılı Tüketicinin Korunması Hakkında Kanun</li>
              <li><strong>Yönetmelik:</strong> Mesafeli Sözleşmeler Yönetmeliği (RG: 27.11.2014 / 29188)</li>
              <li><strong>Hizmet:</strong> Bir ücret veya menfaat karşılığında yapılan işlem</li>
              <li><strong>Satıcı:</strong> Yukarıda bilgileri verilen şirket</li>
              <li><strong>Alıcı/Tüketici:</strong> Sipariş veren gerçek veya tüzel kişi</li>
              <li><strong>Sipariş:</strong> Alıcının sitede seçip onayladığı ürün/hizmet talebinin toplamı</li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 mt-8">MADDE 3 – SÖZLEŞMENİN KONUSU</h2>
            <p>
              Bu sözleşme; Alıcının, Satıcıya ait <strong>www.lioradg.com.tr</strong> adresli internet sitesinden elektronik ortamda sipariş verdiği, sözleşmede belirtilen niteliklere sahip ürün/ürünlerin satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerini düzenler.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8">MADDE 4 – ÜRÜN BİLGİLERİ</h2>
            <p>
              Sözleşme konusu ürünlerin temel özellikleri, fiyatı (vergiler dahil) ve tüm masraflar sipariş tamamlanmadan önce site üzerinde gösterilmektedir. Fiyatlar Türk Lirası (TL) olarak belirtilmiş olup vergiler dahildir.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8">MADDE 5 – ÖDEME</h2>
            <p>
              Sipariş toplamı, teslimat ücreti ve varsa diğer masraflar sipariş onay sayfasında gösterilir. Ödeme, aşağıdaki yöntemlerle gerçekleştirilebilir:
            </p>
            <ul>
              <li>Kredi Kartı / Banka Kartı (Visa, Mastercard)</li>
              <li>iyzico güvenli ödeme altyapısı üzerinden</li>
            </ul>
            <p>
              Ödeme işlemleri, iyzico ödeme kuruluşu aracılığıyla gerçekleştirilmektedir. Kart bilgileriniz tarafımızca saklanmaz; yalnızca iyzico altyapısında PCI DSS standartlarına uygun şekilde işlenir.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8">MADDE 6 – TESLİMAT</h2>
            <ul>
              <li>Teslimat, ödemenin onaylanmasının ardından <strong>2–5 iş günü</strong> içinde gerçekleştirilir.</li>
              <li>Stok yetersizliği veya öngörülemeyen nedenlerle bu süre uzayabilir; Alıcı derhal bilgilendirilir.</li>
              <li>Teslimat adresi Alıcı tarafından sipariş formunda bildirilir; yanlış adres nedeniyle oluşan gecikme veya ek ücretler Alıcıya aittir.</li>
              <li>Teslimat yurtiçi kargo şirketi aracılığıyla yapılır.</li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 mt-8">MADDE 7 – KARGO ÜCRETİ</h2>
            <p>
              Kargo ücreti, sipariş tutarı belirli bir miktarın altında ise Alıcı tarafından karşılanır; üzerinde ise ücretsizdir. Güncel kargo ücreti ve ücretsiz kargo limiti sipariş özetinde gösterilir.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8">MADDE 8 – CAYMA HAKKI</h2>
            <p>
              Alıcı, teslim aldığı tarihten itibaren <strong>14 (on dört) gün</strong> içinde herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma hakkına sahiptir.
            </p>
            <p>Cayma hakkının kullanılabilmesi için:</p>
            <ul>
              <li>Ürünün orijinal ambalajında, kullanılmamış ve hasarsız olması gerekmektedir.</li>
              <li>Cayma bildiriminin <strong>info@lioradg.com.tr</strong> adresine yazılı olarak iletilmesi yeterlidir.</li>
              <li>Cayma hakkı kullanıldığında, Satıcı bildirim tarihinden itibaren <strong>14 gün</strong> içinde ödemeyi iade eder.</li>
              <li>İade kargo ücreti Alıcıya aittir; ancak ürün hatalıysa veya ayıplıysa kargo ücreti Satıcı tarafından karşılanır.</li>
            </ul>

            <h3 className="font-semibold text-gray-800 mt-4">8.1. Cayma Hakkının İstisnaları (6502 S.K. Md. 15)</h3>
            <p>Aşağıdaki ürünlerde cayma hakkı kullanılamaz:</p>
            <ul>
              <li>Fiyatı finansal piyasalardaki dalgalanmalara göre değişen ürünler</li>
              <li>Alıcının isteğine veya kişisel ihtiyaçlarına göre hazırlanan ürünler</li>
              <li>Teslimattan sonra ambalajı açılmış; sağlık ve hijyen açısından iadesi uygun olmayan ürünler (kozmetik, kişisel bakım ürünleri ambalajı açıldıktan sonra bu kapsama girer)</li>
              <li>Karışabilen veya bozulabilen nitelikteki ürünler</li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 mt-8">MADDE 9 – GARANTİ VE AYIPLI MAL</h2>
            <p>
              Ürünlerde gizli ayıp veya imalat hatası çıkması durumunda Alıcı; onarım, değişim, ücretsiz iade veya bedel indirimi haklarından birini kullanabilir. Bu talepler <strong>info@lioradg.com.tr</strong> adresine iletilmelidir.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8">MADDE 10 – GİZLİLİK VE KİŞİSEL VERİLER</h2>
            <p>
              Alıcıya ait kişisel veriler, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) ve Gizlilik Politikamız kapsamında işlenir. Detaylı bilgi için sitemizin <strong>Gizlilik Politikası</strong> ve <strong>KVKK Aydınlatma Metni</strong> sayfalarını inceleyebilirsiniz.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8">MADDE 11 – UYUŞMAZLIK ÇÖZÜMÜ</h2>
            <p>
              Bu sözleşmeden doğabilecek uyuşmazlıklarda öncelikle Satıcı müşteri hizmetlerine başvurulması tavsiye edilir. Taraflar arasında çözüme kavuşturulamazsa;
            </p>
            <ul>
              <li>Tüketici Hakem Heyeti (yasal sınırlar dahilinde)</li>
              <li>Tüketici Mahkemeleri</li>
              <li>Alternatif Uyuşmazlık Çözüm Organları</li>
            </ul>
            <p>yetkilidir. Türk Hukuku uygulanır.</p>

            <h2 className="text-xl font-bold text-gray-900 mt-8">MADDE 12 – GENEL HÜKÜMLER</h2>
            <ul>
              <li>Alıcı, sipariş onayı öncesinde bu sözleşmeyi okuduğunu ve kabul ettiğini beyan eder.</li>
              <li>Satıcı, haklı gerekçelerle siparişi iptal etme hakkını saklı tutar; bu durumda ödeme iade edilir.</li>
              <li>Sözleşme elektronik ortamda akdedilmiş ve Alıcıya sipariş onay e-postasıyla iletilmiştir.</li>
              <li>Bu sözleşme, Türkiye Cumhuriyeti kanun ve nizamlarına tabidir.</li>
            </ul>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 not-prose mt-8">
              <h3 className="font-semibold text-gray-800 mb-3">İletişim</h3>
              <p className="text-sm text-gray-600">Sözleşme hakkında sorularınız için:</p>
              <ul className="text-sm text-gray-700 mt-2 space-y-1">
                <li>📧 <a href="mailto:info@lioradg.com.tr" className="text-sage hover:underline">info@lioradg.com.tr</a></li>
                <li>📞 <a href="tel:+905302084747" className="text-sage hover:underline">+90 530 208 47 47</a></li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
