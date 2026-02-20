import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const posts = [
  {
    title: 'Çubuklu Oda Kokusu Nedir? Evde Doğal Koku Kullanım Rehberi',
    slug: 'cubuklu-oda-kokusu-nedir-kullanim-rehberi',
    excerpt: 'Çubuklu oda kokuları, evlerinize hem estetik hem de uzun süreli bir ferahlık katmanın en doğal yolu. Bu rehberde doğru ürün seçimi ve kullanım ipuçlarını bulabilirsiniz.',
    tags: 'oda kokusu, çubuklu oda kokusu, doğal koku',
    author: 'Lioradg Ekibi',
    readingTime: 6,
    metaTitle: 'Çubuklu Oda Kokusu Nedir, Nasıl Kullanılır?',
    metaDescription: 'Çubuklu oda kokularının kullanımı, seçimi ve faydaları hakkında kapsamlı rehber. Evde doğal koku oluşturmanın püf noktaları.',
    published: true,
    content: `
<p>Evlerimizin havası, içinde bulunduğumuz ruh halini doğrudan etkiler. Çubuklu oda kokuları (reed diffuser), hem dekoratif bir unsur hem de uzun süreli doğal koku kaynağı olarak son yıllarda çok popüler hale geldi.</p>

<h2>Çubuklu Oda Kokusu Nasıl Çalışır?</h2>
<p>Çubuklu oda kokuları; aromalı sıvı içeren bir şişe ve bu sıvıyı emerek havaya yayan bambu ya da rattan çubuklardan oluşur. Çubuklar, kapiler etki sayesinde koku yağını emer ve yavaş yavaş buharlaştırarak ortama yayar. Bu sayede koku en az <strong>2-3 ay</strong> boyunca düzenli bir şekilde salınır.</p>

<h2>Hangi Odaya Hangi Koku?</h2>
<ul>
  <li><strong>Yatak Odası:</strong> Lavanta, papatya veya beyaz çay gibi sakinleştirici kokular uyku kalitesini artırır.</li>
  <li><strong>Oturma Odası:</strong> Sandal ağacı, amber veya vanilya gibi sıcak ve davetkar kokular misafirlerinize hoş bir atmosfer sunar.</li>
  <li><strong>Banyo:</strong> Citrus, okyanus veya taze nane gibi temiz ve ferahlatıcı kokular idealdir.</li>
  <li><strong>Mutfak:</strong> Limon veya yeşil elma gibi hafif meyvemsi kokular yemek kokularını dengeler.</li>
</ul>

<h2>Çubukları Ne Zaman Çevirmeliyim?</h2>
<p>Koku yoğunluğunu artırmak istediğinizde çubukları ters çevirin. Ancak bunu çok sık yaparsanız sıvı daha hızlı tükenir. <strong>Haftada bir kez</strong> çevirmek genellikle idealdir.</p>

<h2>Doğru Çubuklu Oda Kokusu Nasıl Seçilir?</h2>
<p>Piyasadaki ucuz ürünlerin çoğu yapay parfüm ve alkol bazlı çözücüler içerir. Bu maddeler başağrısı ve alerjik reaksiyonlara yol açabilir. <strong>Doğal bitkisel esans ve taşıyıcı yağ</strong> bazlı ürünleri tercih etmelisiniz.</p>
<p>Lioradg'ın çubuklu oda kokuları tamamen doğal bitkisel yağlardan üretilmekte olup paraben, sülfat ve yapay boyar madde içermez.</p>

<h2>Uzun Ömür İçin İpuçları</h2>
<ul>
  <li>Şişeyi güneş ışığından uzak tutun.</li>
  <li>Hava akımı olan (pencere kenarı gibi) yerlerde koku daha hızlı tükenir.</li>
  <li>Şişenin ağzını kapattığınız dönemlerde çubuklardan bazılarını çıkarın.</li>
</ul>

<p>Doğal ve uzun kalıcı bir oda kokusu arıyorsanız <a href="/urunler">ürün sayfamızı</a> ziyaret edebilirsiniz.</p>
    `,
  },
  {
    title: 'Doğal Saç Bakımı: Bitkisel Yağların Saça Faydaları ve Kullanımı',
    slug: 'dogal-sac-bakimi-bitkisel-yaglarin-faydalari',
    excerpt: 'Kimyasal ürünlere alternatif arıyorsanız bitkisel yağlar saç bakımında mükemmel bir çözüm sunuyor. Hangi yağ hangi saç tipine uygun, nasıl kullanılır?',
    tags: 'doğal saç bakımı, bitkisel yağ, saç sağlığı',
    author: 'Lioradg Ekibi',
    readingTime: 7,
    metaTitle: 'Bitkisel Yağlarla Doğal Saç Bakımı Rehberi',
    metaDescription: 'Doğal bitkisel yağlarla saç bakımı nasıl yapılır? Hangi yağ hangi soruna iyi gelir? Argan, hint yağı, jojoba ve daha fazlası.',
    published: true,
    content: `
<p>Saçlarımız her gün ısı, kimyasal ve çevresel faktörlerden zarar görür. Şampuan, fön ve boyalar saç liflerini zayıflatarak kırılgan ve cansız görünmesine yol açar. <strong>Bitkisel yağlar</strong>, saçı besleyen, onarıcı ve koruyucu doğal bir alternatif sunar.</p>

<h2>Neden Bitkisel Yağ Kullanmalıyım?</h2>
<p>Bitkisel yağlar; vitamin E, omega yağ asitleri ve antioksidanlar bakımından zengindir. Saç liflerinin içine nüfuz ederek derin nemlendirme sağlar, dökülmeyi azaltır ve parlaklık katar. Üstelik kimyasal içermediği için alerjik reaksiyona yol açmaz.</p>

<h2>Saç Tipine Göre Yağ Seçimi</h2>
<ul>
  <li><strong>Kuru ve hasarlı saçlar:</strong> Argan yağı — yoğun nem ve onarım sağlar.</li>
  <li><strong>Dökülme sorunu:</strong> Hint yağı (castor oil) — saç köklerini güçlendirir, büyümeyi hızlandırır.</li>
  <li><strong>Yağlı saçlar:</strong> Jojoba yağı — sebum dengesini normalleştirir.</li>
  <li><strong>İnce ve kırılgan saçlar:</strong> Badem yağı — saçı kalınlaştırır ve güçlendirir.</li>
  <li><strong>Kaşıntı ve kepek:</strong> Çay ağacı yağı — antifungal özelliğiyle kepekle savaşır.</li>
</ul>

<h2>Saç Yağı Nasıl Kullanılır?</h2>
<p><strong>Yıkama öncesi bakım (pre-wash):</strong> Yıkamadan 30-60 dakika önce saç uçlarına ve deriye masaj yaparak uygulayın. Şampuanla yıkayın.</p>
<p><strong>Serum olarak kullanım:</strong> Birkaç damla yağı avuçlarınızda ısıtın, saç uçlarına hafifçe uygulayın. Saç köklerine değmemesine dikkat edin.</p>
<p><strong>Gece maskesi:</strong> Yatmadan önce saçınıza uygulayın, sabah yıkayın. Haftada 1-2 kez yeterlidir.</p>

<h2>Japon Kiraz Çiçeği Saç Sirkesi ile Fark Yaratın</h2>
<p>Saç sirkesi, bitkisel yağların yanında harika bir tamamlayıcıdır. pH dengesini koruyarak saçın doğal parlaklığını geri kazandırır. Lioradg'ın <strong>Japon Kiraz Çiçeği Saç Sirkesi</strong>, doğal fermente sirke tabanıyla saç liflerini kapatır ve ayna gibi parlaklık verir.</p>

<p>Doğal saç bakım ürünlerimizi keşfetmek için <a href="/urunler">ürünlerimize göz atın</a>.</p>
    `,
  },
  {
    title: 'Esansiyel Yağlar Nedir? Kullanım Alanları ve Faydaları',
    slug: 'esansiyel-yaglar-nedir-kullanim-alanlari-faydalari',
    excerpt: 'Esansiyel yağlar binlerce yıldır şifa ve güzellik amacıyla kullanılıyor. Lavanta\'dan ökaliptüse, nane\'den gül yağına — her birinin farklı bir gücü var.',
    tags: 'esansiyel yağ, aromaterapi, doğal tedavi',
    author: 'Lioradg Ekibi',
    readingTime: 8,
    metaTitle: 'Esansiyel Yağlar Nedir? Faydaları ve Kullanım Rehberi',
    metaDescription: 'Esansiyel yağların ne olduğunu, nasıl kullanıldığını ve hangi yağın ne işe yaradığını öğrenin. Aromaterapi başlangıç rehberi.',
    published: true,
    content: `
<p>Esansiyel yağlar (uçucu yağlar), bitkilerden buhar damıtması veya soğuk sıkma yöntemiyle elde edilen yoğunlaştırılmış bitkisel özlerdir. Bir çiçeğin, yaprağın, kabuğun ya da köklerin aromatik bileşiklerini içeren bu yağlar, <strong>binlerce yıldır tıp, kozmetik ve aromaterapi</strong> alanlarında kullanılmaktadır.</p>

<h2>Esansiyel Yağlar Nasıl Kullanılır?</h2>

<h3>1. Aromaterapi (Difüzör ile)</h3>
<p>En yaygın kullanım şeklidir. Difüzöre su ve birkaç damla esansiyel yağ ekleyerek ortama yayın. Stres azaltma, uyku kalitesini artırma ve odaklanmaya yardımcı olur.</p>

<h3>2. Topikal Uygulama (Cilde)</h3>
<p>Esansiyel yağlar yüksek konsantrasyonlu olduğundan <strong>mutlaka taşıyıcı yağla (jojoba, badem, hindistancevizi) seyreltilerek</strong> kullanılmalıdır. %2-3 oranı (10 ml taşıyıcı yağda 4-6 damla) güvenlidir.</p>

<h3>3. Banyo</h3>
<p>Küvetinize 5-10 damla esansiyel yağ ekleyin. Lavanta veya gül yağı rahatlatıcı bir banyo deneyimi sunar.</p>

<h2>Popüler Esansiyel Yağlar ve Faydaları</h2>
<ul>
  <li><strong>Lavanta:</strong> Stres, anksiyete ve uyku sorunlarına karşı en çok araştırılan yağ. Sakinleştirici ve anti-inflamatuar.</li>
  <li><strong>Nane (Peppermint):</strong> Baş ağrısı, bulantı ve enerji artışı için. Serinletici ve canlandırıcı.</li>
  <li><strong>Çay Ağacı (Tea Tree):</strong> Güçlü antibakteriyel ve antifungal etki. Sivilce ve kepek tedavisinde etkili.</li>
  <li><strong>Ökaliptüs:</strong> Solunum yolu rahatsızlıklarında nefes açıcı etki. Soğuk algınlığında idealdir.</li>
  <li><strong>Gül (Rose):</strong> Cilt nemlendiricisi, ruh hali iyileştirici. Anti-aging özellikleri var.</li>
  <li><strong>Limon:</strong> Temizleyici, enerjik ve ferahlatıcı. Doğal koku giderici.</li>
</ul>

<h2>Dikkat Edilmesi Gerekenler</h2>
<ul>
  <li>Hamilelikte bazı esansiyel yağlar (adaçayı, biberiye, tarçın) kontrendikedir.</li>
  <li>Gözlerden ve mukoz zarlardan uzak tutun.</li>
  <li>Serin ve karanlık yerde saklayın; güneş ışığı bileşenleri bozar.</li>
  <li>Çocuklarda kullanmadan önce pediatrist görüşü alın.</li>
</ul>

<p>Lioradg'ın saf ve doğal esansiyel yağları ile aromaterapi deneyiminizi başlatmak için <a href="/urunler">ürünlerimize bakın</a>.</p>
    `,
  },
  {
    title: 'Oda Spreyi Nasıl Seçilir? Ev Kokusu Rehberi',
    slug: 'oda-spreyi-nasil-secilir-ev-kokusu-rehberi',
    excerpt: 'Piyasadaki yüzlerce oda spreyi arasında doğru olanı bulmak zor olabilir. Kimyasal mi, doğal mı? Kalıcı mı, anlık mı? İşte bilmeniz gereken her şey.',
    tags: 'oda spreyi, ev kokusu, doğal kozmetik',
    author: 'Lioradg Ekibi',
    readingTime: 5,
    metaTitle: 'Oda Spreyi Seçerken Dikkat Edilmesi Gerekenler',
    metaDescription: 'Doğal ve kalıcı oda spreyi nasıl seçilir? İçerik, koku yoğunluğu ve kalıcılık açısından değerlendirme rehberi.',
    published: true,
    content: `
<p>Kapıdan giren misafirinizin ilk hissettiği şey kokunuzdur. Ev kokusu, yaşam alanının atmosferini şekillendiren en güçlü duyusal unsurlardan biridir. Peki piyasadaki onlarca oda spreyi arasından hangisini seçmelisiniz?</p>

<h2>Kimyasal ve Doğal Oda Spreyi Farkı</h2>
<p>Marketlerde satılan ucuz oda sprey ve oda parfümlerinin büyük çoğunluğu <strong>formaldehit, ftalatlar ve yapay musk bileşikleri</strong> içerir. Bu maddeler uzun vadede solunum yolu tahrişine, baş ağrısına ve alerjik reaksiyonlara yol açabilir.</p>
<p>Buna karşılık, bitkisel esans bazlı doğal oda spreyleri hem sağlığınıza hem de çevreye daha dostane bir seçenektir.</p>

<h2>Kalıcılık Nasıl Artırılır?</h2>
<ul>
  <li>Spreyi doğrudan tekstile (perde, halı, kanepe) püskürtmek kokuyu uzun süre taşıtır.</li>
  <li>Küçük ve kapalı odalarda koku daha uzun süre kalır.</li>
  <li>Spreyi duvara veya havaya değil, yüzeylerin 30-40 cm uzağından ve hafif kavisli bir hareketle uygulayın.</li>
</ul>

<h2>Koku Notları: Taze, Çiçeksi, Odunsu</h2>
<p>Oda spreyleri genellikle üç ana koku kategorisinde bulunur:</p>
<ul>
  <li><strong>Taze/Citrus:</strong> Limon, bergamot, okyanus. Mutfak ve banyo için ideal.</li>
  <li><strong>Çiçeksi:</strong> Gül, lavanta, yasemin. Yatak odası ve oturma odası için.</li>
  <li><strong>Odunsu/Sıcak:</strong> Sandal ağacı, amber, vanilya. Kış aylarında ve akşam saatlerinde hoş bir atmosfer yaratır.</li>
</ul>

<h2>Etiket Okumayı Öğrenin</h2>
<p>Oda spreyi satın alırken etikette şunlara bakın:</p>
<ul>
  <li>Paraben içermez mi?</li>
  <li>Sülfat (SLS/SLES) içermez mi?</li>
  <li>Vegan ve hayvan deneyi içermez mi?</li>
</ul>
<p>Lioradg'ın tüm oda spreyleri bu kriterleri karşılamaktadır. <a href="/urunler">Ürünlerimizi incelemeye</a> davet ediyoruz.</p>
    `,
  },
  {
    title: 'Organik Kozmetik Nedir? Doğal Ürünleri Seçmenin 7 Nedeni',
    slug: 'organik-kozmetik-nedir-dogal-urunleri-secmenin-nedenleri',
    excerpt: 'Organik ve doğal kozmetik trend olmaktan çıktı, artık bilinçli bir tercih. Cildine, sağlığına ve gezegene saygı duyuyorsan bu yazıyı mutlaka oku.',
    tags: 'organik kozmetik, doğal cilt bakımı, sağlıklı güzellik',
    author: 'Lioradg Ekibi',
    readingTime: 6,
    metaTitle: 'Organik Kozmetik Nedir? 7 Nedeni ile Doğal Ürün Seçin',
    metaDescription: 'Organik ve doğal kozmetik ürünlerin ne olduğunu ve neden tercih edilmesi gerektiğini açıklıyoruz. Kimyasallardan uzak güzelliğe adım atın.',
    published: true,
    content: `
<p>Güzellik ürünleri söz konusu olduğunda cildimize sürdüğümüz şeylerin içeriğini kaç kez gerçekten okumuşuzdur? Araştırmalar, kadınların her gün ortalama <strong>168 kimyasal maddeye</strong> kozmetik yoluyla maruz kaldığını gösteriyor. İşte tam bu noktada organik kozmetik devreye giriyor.</p>

<h2>Organik Kozmetik Ne Demek?</h2>
<p>Organik kozmetik; tarım ilaçları, yapay gübreler ve genetiği değiştirilmiş organizmalar kullanılmadan yetiştirilmiş bitkisel hammaddelerden üretilen kozmetik ürünlerdir. Gerçek anlamda organik bir ürün, içeriğinin en az %95'inin organik sertifikalı ham madde içermesi gerekir.</p>

<h2>Doğal Ürünleri Seçmenin 7 Nedeni</h2>

<p><strong>1. Cilt sağlığı için daha güvenli</strong><br/>Paraben, silikon ve yapay parfüm içermeyen formüller, hassas ciltler için çok daha az reaksiyon riski taşır.</p>

<p><strong>2. Uzun vadede daha etkili</strong><br/>Bitkisel aktif bileşenler, cildin doğal süreçlerini destekler. Kimyasal bazlı ürünler kısa vadede hızlı sonuç verse de zamanla cilt bariyer fonksiyonunu bozabilir.</p>

<p><strong>3. Çevreye saygılı</strong><br/>Doğal ürünler biyobozunur formüllere sahiptir; atık suları ve toprağı daha az kirletir.</p>

<p><strong>4. Hayvan dostu</strong><br/>Güvenilir doğal kozmetik markaları hayvanlar üzerinde test yapmaz.</p>

<p><strong>5. Koku hassasiyetleri azalır</strong><br/>Yapay parfümler migren, astım ve cilt tahrişinin başlıca tetikleyicileri arasında. Doğal esanslarla kokulandırılan ürünler bu riski minimize eder.</p>

<p><strong>6. Bütünsel yaklaşım</strong><br/>Doğal kozmetik, cildi yalnızca görsel olarak değil; besleyerek, onararak ve koruyarak bütünsel bir bakım sunar.</p>

<p><strong>7. Şeffaf içerik listesi</strong><br/>INCI adlarıyla listelenen doğal içerikler, ne sürdüğünüzü gerçekten anlamanızı sağlar.</p>

<h2>Nasıl Başlarsınız?</h2>
<p>Her şeyi bir anda değiştirmenize gerek yok. Önce en sık kullandığınız ürünleri — şampuan, nemlendirici, deodorant — doğal alternatiflerle değiştirmeyi deneyin.</p>
<p>Lioradg olarak tamamen doğal ve şeffaf içerikli ürünler sunuyoruz. <a href="/urunler">Keşfetmek için tıklayın.</a></p>
    `,
  },
  {
    title: 'Aromaterapi ile Stres Yönetimi: Evde Uygulanabilir 5 Yöntem',
    slug: 'aromaterapi-ile-stres-yonetimi-evde-uygulanabilir-yontemler',
    excerpt: 'Günlük hayatın stresini azaltmak için ilaç yerine kokuları deneyin. Aromaterapi, bilimsel olarak kanıtlanmış doğal bir stres yönetimi yöntemi.',
    tags: 'aromaterapi, stres yönetimi, oda kokusu, esansiyel yağ',
    author: 'Lioradg Ekibi',
    readingTime: 5,
    metaTitle: 'Aromaterapi ile Stres Nasıl Azaltılır? Evde 5 Yöntem',
    metaDescription: 'Aromaterapi yöntemleriyle stresi doğal olarak azaltın. Lavanta, bergamot ve diğer esansiyel yağlarla evde rahatlama teknikleri.',
    published: true,
    content: `
<p>Stres, modern hayatın vazgeçilmez bir parçası haline geldi. Ancak her strese karşı ilaç kullanmak zorunda değilsiniz. <strong>Aromaterapi</strong>, koku duyusunu kullanarak sinir sistemini dengelemenin bilimsel olarak desteklenen doğal bir yoludur.</p>

<h2>Aromaterapi Nasıl İşe Yarar?</h2>
<p>Koku molekülleri burnumuzdan geçerek <strong>limbik sisteme</strong> ulaşır. Limbik sistem, duygular, hafıza ve stres tepkilerini yöneten beyin bölgesidir. Belirli esansiyel yağlar, kortizol (stres hormonu) düzeyini düşürürken serotonin ve dopamin salgısını artırır.</p>

<h2>5 Evde Uygulanabilir Aromaterapi Yöntemi</h2>

<h3>1. Difüzör ile Ortam Kokulandırma</h3>
<p>En kolay ve etkili yöntem. Su hazneli bir difüzöre 3-5 damla <strong>lavanta veya bergamot</strong> yağı ekleyin. Akşam saatlerinde 30-60 dakika çalıştırın. Stres hormonu düzeyini ölçülebilir biçimde azalttığı kanıtlanmıştır.</p>

<h3>2. Uyku Öncesi Yastık Spreyi</h3>
<p>Yatmadan 15 dakika önce yastığınıza lavanta içerikli bir uyku spreyi püskürtün. Uyku kalitesini ve derinliğini artırır, sabah dinç uyanmanızı sağlar.</p>

<h3>3. Aromaterapi Banyosu</h3>
<p>Sıcak küvete 1 tatlı kaşığı tatlı badem yağı ve 5 damla <strong>gül veya papatya</strong> esansiyel yağı ekleyin. 20 dakika dinlendirici bir banyo yapın. Kas gerginliğini ve zihinsel stresi azaltır.</p>

<h3>4. Bilek Noktası Masajı</h3>
<p>Birkaç damla seyreltilmiş lavanta veya nane yağını (10 ml jojoba + 3 damla esansiyel yağ) bileklerinize, şakaklarınıza ve boyun arkasına masaj yaparak uygulayın. Günün herhangi bir anında kullanılabilir.</p>

<h3>5. Çalışma Alanı Spreyi</h3>
<p>Stresli bir iş gününde masanıza ya da çalışma ortamına <strong>nane veya limon</strong> içerikli bir oda spreyi sıkın. Bu kokular odaklanmayı artırırken zihinsel yorgunluğu azaltır.</p>

<h2>Hangi Koku Hangi Etkiyi Sağlar?</h2>
<ul>
  <li><strong>Lavanta:</strong> Sakinleştirici, uyku destekleyici</li>
  <li><strong>Bergamot:</strong> Anksiyete azaltıcı, ruh hali düzenleyici</li>
  <li><strong>Nane:</strong> Odaklanma artırıcı, baş ağrısı giderici</li>
  <li><strong>Gül:</strong> Duygusal denge, stres azaltma</li>
  <li><strong>Sandal ağacı:</strong> Derin rahatlama, meditasyon desteği</li>
</ul>

<p>Aromaterapi yolculuğunuza başlamak için Lioradg'ın doğal esansiyel yağlarını ve oda kokularını <a href="/urunler">keşfedin.</a></p>
    `,
  },
]

async function main() {
  console.log('Blog yazıları ekleniyor...')
  let added = 0

  for (const post of posts) {
    const existing = await prisma.blogPost.findUnique({ where: { slug: post.slug } })
    if (existing) {
      console.log(`Zaten var: ${post.slug}`)
      continue
    }
    await prisma.blogPost.create({ data: post })
    console.log(`✓ Eklendi: ${post.title}`)
    added++
  }

  console.log(`\nTamamlandı: ${added} yeni yazı eklendi.`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
