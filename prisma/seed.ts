import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Admin kullanıcısı oluştur
  const hashedPassword = await bcrypt.hash('Admin123!', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@lioradg.com.tr' },
    update: {},
    create: {
      email: 'admin@lioradg.com.tr',
      name: 'Liora Admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })
  console.log('✅ Admin kullanıcısı oluşturuldu:', admin.email)

  // Silinmiş görsellere referans veren ürün ve kategorileri veritabanından kaldır
  const slugsToDelete = [
    'erkek-parfum-100ml', 'kadin-parfum-100ml',
    'saf-biberiye-suyu-tonik-100ml', 'saf-olmez-cicek-suyu-tonik-100ml', 'saf-gul-mayasi-tonik-100ml',
    'japon-kiraz-cicegi-sac-sirkesi-200ml', 'makyaj-temizleme-suyu',
    'biberiye-argan-yasemin-sampuani-400ml', 'melisa-bugday-at-kuyrugu-sac-kremi-400ml', 'tropikal-dus-jeli-400ml',
    'hyaluronic-acid-akyildiz-kremi-50ml', 'collagen-peptit-nemlendirici-krem-50ml',
    'collagen-hyaluronic-acid-serum-30ml', 'peptit-complex-acid-krem-50ml'
  ]
  for (const slug of slugsToDelete) {
    await prisma.product.deleteMany({ where: { slug } })
  }
  await prisma.category.deleteMany({
    where: { slug: { in: ['parfumler', 'tonikler', 'sampuan-sac-bakim', 'krem-bakim'] } }
  })
  console.log('✅ Silinmiş görsellere ait ürün ve kategoriler kaldırıldı')

  // Kategorileri oluştur
  const categories = [
    {
      name: 'Bitkisel Yağlar',
      slug: 'bitkisel-yaglar',
      description: 'Difüzör için doğal esans yağları',
      icon: '🌿',
      image: '/images/bitkiselyaglar/gul.jpeg',
      order: 1,
    },
    {
      name: 'Oda ve Tekstil Kokuları',
      slug: 'oda-tekstil-kokulari',
      description: 'Evinizi ferahlatan oda kokuları',
      icon: '🕯️',
      image: '/images/odavetekstil/amber.jpeg',
      order: 2,
    },
  ]

  const createdCategories: any = {}
  for (const cat of categories) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
    createdCategories[cat.slug] = category
    console.log(`✅ Kategori oluşturuldu: ${category.name}`)
  }

  // Ürünleri oluştur
  const products = [
    // Bitkisel Yağlar (Difüzör)
    {
      name: 'Afrika Yağı - 10 ml',
      slug: 'afrika-yagi-10ml',
      description: 'Egzotik ve sıcak Afrika esansları.',
      content: 'Afrika baharatları ve odunsu notalar.',
      usage: 'Difüzöre 3-4 damla ekleyin.',
      price: 150,
      sku: 'YAG-AFR-001',
      stock: 75,
      images: '/images/bitkiselyaglar/afrika.jpeg',
      categoryId: createdCategories['bitkisel-yaglar'].id,
    },
    {
      name: 'Biberiye Yağı - 10 ml',
      slug: 'biberiye-yagi-10ml',
      description: 'Zihin açıcı ve enerji verici biberiye esansı.',
      content: '%100 saf biberiye esans yağı. Terapötik kalite.',
      usage: 'Difüzöre 3-5 damla ekleyin. Konsantrasyonu artırır.',
      price: 150,
      sku: 'YAG-BBR-001',
      stock: 100,
      images: '/images/bitkiselyaglar/biberiye.jpeg',
      categoryId: createdCategories['bitkisel-yaglar'].id,
    },
    {
      name: 'Gül Yağı - 10 ml',
      slug: 'gul-yagi-10ml',
      description: 'Romantik ve rahatlatıcı gül esansı. Difüzör ve aromaterapi için.',
      content: '%100 saf esans yağı. Sentetik katkı içermez.',
      usage: 'Difüzöre 3-5 damla ekleyin veya seyreltilmiş şekilde masaj yağı olarak kullanın.',
      price: 150,
      sku: 'YAG-GUL-001',
      stock: 120,
      images: '/images/bitkiselyaglar/gul.jpeg',
      featured: true,
      categoryId: createdCategories['bitkisel-yaglar'].id,
    },
    {
      name: 'Mango Yağı - 10 ml',
      slug: 'mango-yagi-10ml',
      description: 'Tropikal ve tatlı mango esansı.',
      content: 'Doğal mango özü ile üretilmiş esans yağı.',
      usage: 'Difüzöre 4-5 damla ekleyin.',
      price: 150,
      sku: 'YAG-MAN-001',
      stock: 85,
      images: '/images/bitkiselyaglar/mango.jpeg',
      categoryId: createdCategories['bitkisel-yaglar'].id,
    },
    {
      name: 'Nane Yağı - 10 ml',
      slug: 'nane-yagi-10ml',
      description: 'Ferahlatıcı ve solunum açıcı nane esansı.',
      content: '%100 saf nane esans yağı.',
      usage: 'Difüzöre 4-5 damla ekleyin. Soğuk algınlığında rahatlatır.',
      price: 150,
      sku: 'YAG-NAN-001',
      stock: 110,
      images: '/images/bitkiselyaglar/nane.jpeg',
      categoryId: createdCategories['bitkisel-yaglar'].id,
    },
    {
      name: 'Nar Yağı - 10 ml',
      slug: 'nar-yagi-10ml',
      description: 'Antioksidan zengin nar esansı.',
      content: 'Doğal nar özü ile üretilmiş esans yağı.',
      usage: 'Difüzöre 3-5 damla ekleyin.',
      price: 150,
      sku: 'YAG-NAR-001',
      stock: 85,
      images: '/images/bitkiselyaglar/nar.jpeg',
      categoryId: createdCategories['bitkisel-yaglar'].id,
    },
    {
      name: 'Pudra Yağı - 10 ml',
      slug: 'pudra-yagi-10ml',
      description: 'Temiz ve pudra kokusu. Bebek pudrası notaları.',
      content: 'Pudra notaları içeren esans karışımı.',
      usage: 'Difüzöre 3-4 damla ekleyin.',
      price: 150,
      sku: 'YAG-PDR-001',
      stock: 100,
      images: '/images/bitkiselyaglar/pudra.jpeg',
      categoryId: createdCategories['bitkisel-yaglar'].id,
    },
    {
      name: 'Sandal Ağacı Yağı - 10 ml',
      slug: 'sandal-agaci-yagi-10ml',
      description: 'Meditasyon ve rahatlama için sandal ağacı esansı.',
      content: '%100 saf sandal ağacı esans yağı.',
      usage: 'Difüzöre 3-4 damla ekleyin. Yoga ve meditasyon için ideal.',
      price: 150,
      sku: 'YAG-SND-001',
      stock: 70,
      images: '/images/bitkiselyaglar/sandalagaci.jpeg',
      categoryId: createdCategories['bitkisel-yaglar'].id,
    },
    {
      name: 'Vanilya Yağı - 10 ml',
      slug: 'vanilya-yagi-10ml',
      description: 'Tatlı ve rahatlatıcı vanilya esansı.',
      content: 'Doğal vanilya özü ile üretilmiş esans yağı.',
      usage: 'Difüzöre 4-5 damla ekleyin.',
      price: 150,
      sku: 'YAG-VAN-001',
      stock: 90,
      images: '/images/bitkiselyaglar/vanilya.jpeg',
      categoryId: createdCategories['bitkisel-yaglar'].id,
    },
    // Oda ve Tekstil Kokuları
    {
      name: 'Amber Kokusu - 500 ml',
      slug: 'amber-kokusu-500ml',
      description: 'Sıcak ve sarıcı amber kokusu.',
      content: 'Amber ve vanilya notaları. Kalıcı etki.',
      usage: 'Ev tekstillerine ve odaya 20-30 cm mesafeden uygulayın.',
      price: 400,
      sku: 'ODA-AMB-001',
      stock: 55,
      images: '/images/odavetekstil/amber.jpeg',
      categoryId: createdCategories['oda-tekstil-kokulari'].id,
    },
    {
      name: 'Beyaz Sabun Kokusu - 500 ml',
      slug: 'beyaz-sabun-kokusu-500ml',
      description: 'Temiz ve ferah beyaz sabun kokusu.',
      content: 'Uzun süre kalıcı formül. Leke yapmaz.',
      usage: 'Tekstillere 20-30 cm uzaktan sıkın. Odaya da kullanılabilir.',
      price: 400,
      sku: 'ODA-BYS-001',
      stock: 60,
      images: '/images/odavetekstil/beyazsabun.jpeg',
      categoryId: createdCategories['oda-tekstil-kokulari'].id,
    },
    {
      name: 'Gül Kokusu - 500 ml',
      slug: 'gul-kokusu-500ml',
      description: 'Zarif ve romantik gül kokusu. Tüm mekanlara uygun.',
      content: 'Çiçeksi notalar. Kalıcı formül.',
      usage: 'Havaya, tekstillere ve perdelere 20-30 cm mesafeden sıkın.',
      price: 400,
      sku: 'ODA-GUL-001',
      stock: 70,
      images: '/images/odavetekstil/gul.jpeg',
      featured: true,
      categoryId: createdCategories['oda-tekstil-kokulari'].id,
    },
    {
      name: 'İstanbul Kokusu - 500 ml',
      slug: 'istanbul-kokusu-500ml',
      description: 'Şehir dokusunu yansıtan özel İstanbul kokusu.',
      content: 'Egzotik ve nostaljik notalar.',
      usage: 'Oturma odası için idealdir. 20-30 cm uzaktan sıkın.',
      price: 400,
      sku: 'ODA-IST-001',
      stock: 50,
      images: '/images/odavetekstil/istanbul.jpeg',
      categoryId: createdCategories['oda-tekstil-kokulari'].id,
    },
    {
      name: 'Kiraz Kokusu - 500 ml',
      slug: 'kiraz-kokusu-500ml',
      description: 'Tatlı ve meyvemsi kiraz kokusu.',
      content: 'Meyve notaları. Rahatlatıcı etki.',
      usage: 'Yatak odası ve banyoda kullanım için ideal.',
      price: 400,
      sku: 'ODA-KRZ-001',
      stock: 65,
      images: '/images/odavetekstil/kiraz.jpeg',
      categoryId: createdCategories['oda-tekstil-kokulari'].id,
    },
    {
      name: 'Kudüs Kokusu - 500 ml',
      slug: 'kudus-kokusu-500ml',
      description: 'Mistik ve derin Kudüs kokusu.',
      content: 'Baharat ve odunsu notalar.',
      usage: '20-30 cm uzaktan sıkın.',
      price: 400,
      sku: 'ODA-KDS-001',
      stock: 45,
      images: '/images/odavetekstil/kudus.jpeg',
      featured: true,
      categoryId: createdCategories['oda-tekstil-kokulari'].id,
    },
    {
      name: 'Milano Kokusu - 500 ml',
      slug: 'milano-kokusu-500ml',
      description: 'İtalyan zerafeti Milano kokusu.',
      content: 'Zarif çiçek ve baharat karışımı.',
      usage: 'Ev tekstillerine 20-30 cm mesafeden uygulayın.',
      price: 400,
      sku: 'ODA-MIL-001',
      stock: 55,
      images: '/images/odavetekstil/milano.jpeg',
      categoryId: createdCategories['oda-tekstil-kokulari'].id,
    },
    {
      name: 'Oud Kokusu - 500 ml',
      slug: 'oud-kokusu-500ml',
      description: 'Lüks ve etkileyici Oud kokusu. Oriental notalar.',
      content: 'Oud ve baharat notaları. Premium kalite.',
      usage: 'Oturma odası ve yatak odası için idealdir. 20-30 cm uzaktan sıkın.',
      price: 400,
      sku: 'ODA-OUD-001',
      stock: 50,
      images: '/images/odavetekstil/oud.jpeg',
      featured: true,
      categoryId: createdCategories['oda-tekstil-kokulari'].id,
    },
    {
      name: 'Pudra Kokusu - 500 ml',
      slug: 'pudra-kokusu-500ml',
      description: 'Temiz ve ferah pudra kokusu. Ev tekstilleri için ideal.',
      content: 'Uzun süre kalıcı formül. Leke yapmaz.',
      usage: 'Tekstillere 20-30 cm uzaktan sıkın. Odaya da kullanılabilir.',
      price: 400,
      sku: 'ODA-PDR-002',
      stock: 60,
      images: '/images/odavetekstil/pudra.jpeg',
      categoryId: createdCategories['oda-tekstil-kokulari'].id,
    },
  ]

  for (const prod of products) {
    const product = await prisma.product.upsert({
      where: { slug: prod.slug },
      update: { images: prod.images },
      create: prod,
    })
    console.log(`✅ Ürün oluşturuldu: ${product.name}`)
  }

  // Ayarları oluştur
  const settings = [
    {
      key: 'shipping_fee',
      value: '89.90',
      label: 'Kargo Ücreti (TL)',
      type: 'number',
    },
    {
      key: 'contact_phone',
      value: '+90 530 208 47 47',
      label: 'Telefon Numarası',
      type: 'text',
    },
    {
      key: 'contact_email',
      value: 'info@lioradg.com.tr',
      label: 'Email Adresi',
      type: 'email',
    },
    {
      key: 'contact_address',
      value: 'İstanbul, Türkiye',
      label: 'Adres',
      type: 'text',
    },
    {
      key: 'social_instagram',
      value: 'https://instagram.com/dgliora',
      label: 'Instagram Linki',
      type: 'text',
    },
    {
      key: 'social_facebook',
      value: 'https://facebook.com/lioradg',
      label: 'Facebook Linki',
      type: 'text',
    },
    {
      key: 'social_whatsapp',
      value: '905302084747',
      label: 'WhatsApp Numarası',
      type: 'text',
    },
    {
      key: 'free_shipping_min_amount',
      value: '500',
      label: 'Ücretsiz Kargo Minimum Tutarı (TL)',
      type: 'number',
    },
    {
      key: 'delivery_time',
      value: '2-3 iş günü',
      label: 'Teslimat Süresi',
      type: 'text',
    },
    {
      key: 'min_order_amount',
      value: '0',
      label: 'Minimum Sipariş Tutarı (TL)',
      type: 'number',
    },
    {
      key: 'cash_on_delivery',
      value: 'true',
      label: 'Kapıda Ödeme',
      type: 'boolean',
    },
    {
      key: 'site_title',
      value: 'Liora DG - Doğal Güzellik Ürünleri',
      label: 'Site Başlığı',
      type: 'text',
    },
    {
      key: 'site_description',
      value: 'Doğal ve organik güzellik ürünleri ile kendinizi şımartın',
      label: 'Site Açıklaması',
      type: 'text',
    },
    {
      key: 'email_notifications',
      value: 'true',
      label: 'Email Bildirimleri',
      type: 'boolean',
    },
    {
      key: 'stock_alert_threshold',
      value: '10',
      label: 'Stok Uyarı Eşiği',
      type: 'number',
    },
    {
      key: 'hero_slider_images',
      value: '',
      label: 'Ana Sayfa Slider Fotoğrafları',
      type: 'text',
    },
    {
      key: 'hero_slider_auto_play',
      value: 'true',
      label: 'Slider Otomatik Oynatma',
      type: 'boolean',
    },
    {
      key: 'hero_slider_interval',
      value: '5000',
      label: 'Slider Geçiş Süresi (ms)',
      type: 'number',
    },
  ]

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    })
    console.log(`✅ Ayar oluşturuldu: ${setting.label} = ${setting.value}`)
  }

  console.log('🎉 Seeding tamamlandı!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

