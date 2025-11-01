# Lioradg E-Ticaret Sitesi

Modern, hızlı ve kullanıcı dostu bir e-ticaret platformu. Kişisel bakım ve temizlik ürünleri için geliştirilmiştir.

## 🚀 Özellikler

### ✅ Tamamlanan Özellikler

**Müşteri Tarafı:**
- ✅ Modern ve responsive tasarım (Klinik mavi tema, temiz görsel hiyerarşi)
- ✅ Ana sayfa (Hero, kategoriler, öne çıkan ürünler, SSS, newsletter)
- ✅ Ürün listeleme (kategori filtresi, type-ahead arama, sıralama, pagination)
- ✅ Ürün detay sayfası (görseller, tab'lı bilgiler, yorumlar, benzer ürünler)
- ✅ Sepet sistemi (Zustand store, toast bildirimleri, anlık güncelleme)
- ✅ İletişim sayfası (konu bazlı form + Google Maps)
- ✅ Hakkımızda sayfası (güncellenmiş kurumsal metin)
- ✅ SSS sayfası (akordeon yapısı + anasayfa özeti)
- ✅ Kampanyalar sayfası (geçerli linklerle)
- ✅ Müşteri hizmetleri hub sayfası
- ✅ Sipariş takip sayfası
- ✅ İade ve değişim bilgi sayfası
- ✅ Yasal sayfalar (Gizlilik, KVKK, Kullanım Şartları)
- ✅ Güven rozetleri (footer üstünde)

**Admin Paneli:**
- ✅ Admin Dashboard (istatistikler, son siparişler, uyarılar)
- ✅ Ürün yönetimi (listeleme, görüntüleme)
- ✅ Sipariş yönetimi (listeleme, filtreleme, durum takibi)
- ✅ Müşteri yönetimi (listeleme)
- ✅ Ayarlar sayfası

**Database:**
- ✅ 32 ürün ve 6 kategori ile hazır veri
- ✅ Admin hesabı: admin@lioradg.com.tr / Admin123!

### 🔄 Devam Edecek Geliştirmeler

- 🔜 NextAuth.js ile tam kimlik doğrulama sistemi
- 🔜 Gerçek ödeme süreci (Multi-step checkout + iyzico)
- 🔜 Admin panelde ürün ekleme/düzenleme formları
- 🔜 Sipariş detay ve durum güncelleme
- 🔜 E-posta bildirimleri
- 🔜 Yurtiçi Kargo API entegrasyonu

## 🛠️ Teknolojiler

- **Framework:** Next.js 14 (App Router)
- **Dil:** TypeScript
- **Stil:** Tailwind CSS
- **Animasyon:** Framer Motion
- **State Management:** Zustand
- **Database:** Prisma ORM + SQLite (geliştirme), PostgreSQL (production)
- **Auth:** NextAuth.js (yakında)
- **Form:** React Hook Form + Zod

## 📦 Kurulum

1. Projeyi klonlayın:
\`\`\`bash
git clone <repo-url>
cd Lioradg
\`\`\`

2. Bağımlılıkları yükleyin:
\`\`\`bash
npm install
\`\`\`

3. Database'i oluşturun ve seed edin:
\`\`\`bash
npm run db:migrate
npm run db:seed
\`\`\`

4. Development sunucusunu başlatın:
\`\`\`bash
npm run dev
\`\`\`

5. Tarayıcınızda açın: http://localhost:3000

## 📂 Proje Yapısı

\`\`\`
├── app/                    # Next.js App Router
│   ├── (shop)/            # Müşteri tarafı sayfaları
│   ├── (auth)/            # Kimlik doğrulama sayfaları
│   ├── admin/             # Admin paneli
│   └── api/               # API route'ları
├── components/
│   ├── ui/                # Temel UI bileşenleri
│   ├── shop/              # Mağaza bileşenleri
│   └── admin/             # Admin bileşenleri
├── lib/
│   ├── api/               # API fonksiyonları
│   ├── store/             # Zustand store'lar
│   ├── prisma.ts          # Prisma client
│   └── utils.ts           # Yardımcı fonksiyonlar
├── prisma/
│   ├── schema.prisma      # Database şeması
│   └── seed.ts            # Seed data
├── public/
│   └── images/            # Ürün görselleri
└── types/                 # TypeScript tipleri
\`\`\`

## 🗄️ Database

### Admin Hesabı
- **Email:** admin@lioradg.com.tr
- **Şifre:** Admin123!

### Kategoriler
1. Parfümler
2. Tonikler
3. Şampuan & Saç Bakım
4. Krem Bakım
5. Bitkisel Yağlar
6. Oda ve Tekstil Kokuları

### Ürünler
Toplam 32 ürün, gerçek verilerle seed edilmiştir.

## 🎨 Tasarım Sistemi

**Renk Paleti (Klinik Mavi):**
- **Primary:** #0A68A1 (Güven veren mavi)
- **Accent:** #22A699 (Tamamlayıcı yeşil-mavi)
- **Neutral:** 50/200/500/700/900 skalası
- **Signal:** Success (#16A34A), Warning (#EAB308), Danger (#DC2626)

**Tipografi:**
- **Font:** Inter (Google Fonts)
- **Ölçek:** H1 (30/38px), H2 (24/32px), H3 (20/28px), Base (16/24px)
- **Ağırlık:** Başlıklar 700/600, body 400-500

**Tasarım İlkeleri:**
- Klinik, güven veren, sade
- Yüksek kontrast (WCAG 2.1 uyumlu)
- Tutarlı spacing (8-point grid)
- Card radius: 16px, Button/Input: 12px
- Hover: smooth transition + subtle shadow
- Focus: açık görünür ring

## 📱 Responsive Tasarım

- **Mobile:** 640px altı
- **Tablet:** 768px - 1024px
- **Desktop:** 1024px üstü

## 🔧 NPM Komutları

\`\`\`bash
npm run dev          # Development sunucusu
npm run build        # Production build
npm run start        # Production sunucu
npm run lint         # ESLint kontrolü
npm run db:migrate   # Database migration
npm run db:seed      # Database seed
npm run db:studio    # Prisma Studio (database GUI)
\`\`\`

## 📝 Notlar

- Görseller \`public/images/\` klasöründe bulunmaktadır
- Mock ödeme ve kargo sistemleri kullanılmaktadır
- Production için PostgreSQL kullanılması önerilir
- iyzico ve Yurtiçi Kargo API entegrasyonları yapılacaktır

## 👨‍💻 Geliştirme

Bu proje Liora Bitkisel İlaç Kimya Mobilya ve Dış Ticaret Limited Şirketi için geliştirilmektedir.

### İletişim
- **Web:** http://lioradg.com.tr/
- **Telefon:** +90 530 208 47 47
- **E-posta:** info@lioradg.com.tr

## 📄 Lisans

Bu proje Liora şirketi için özel olarak geliştirilmiştir.
\`\`\`

