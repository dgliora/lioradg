import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

const categorySlugMap: Record<string, string> = {
  'Bitkisel Yağlar': 'bitkisel-yaglar',
  'Cilt Bakım': 'krem-bakim',
  'Oda ve Tekstil Kokuları': 'oda-tekstil-kokulari',
  'Tonik': 'tonikler',
  'Şampuan & Saç Bakım': 'sampuan-sac-bakim',
}

const categoryDefaultImage: Record<string, string> = {
  'bitkisel-yaglar': '/images/bitkiselyaglar/gul.jpeg',
  'krem-bakim': '/images/krembakim/yogunnemlendiriciyuzkremi.jpg',
  'oda-tekstil-kokulari': '/images/odavetekstil/amber.jpeg',
  'tonikler': '/images/tonikler/1.jpg',
  'sampuan-sac-bakim': '/images/sampuan-sacbakim/1.jpg',
}

function slugFromName(name: string): string {
  const tr: Record<string, string> = { 'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u', 'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u' }
  let s = name
  for (const [k, v] of Object.entries(tr)) s = s.replace(new RegExp(k, 'g'), v)
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

function parsePrice(fiyat: string | number): number {
  if (typeof fiyat === 'number') return fiyat
  const num = fiyat.replace(/[^\d,.]/g, '').replace(',', '.')
  return parseFloat(num) || 0
}

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

  // Kategorileri oluştur
  const categories = [
    {
      name: 'Parfümler',
      slug: 'parfumler',
      description: 'Kalıcı ve büyüleyici parfüm koleksiyonumuz',
      icon: '💉',
      image: '/images/parfumler/1.jpg',
      order: 1,
    },
    {
      name: 'Tonikler',
      slug: 'tonikler',
      description: 'Cildinizi canlandıran doğal tonikler',
      icon: '💧',
      image: '/images/tonikler/1.jpg',
      order: 2,
    },
    {
      name: 'Şampuan & Saç Bakım',
      slug: 'sampuan-sac-bakim',
      description: 'Saçlarınız için doğal bakım ürünleri',
      icon: '💆',
      image: '/images/sampuan-sacbakim/1.jpg',
      order: 3,
    },
    {
      name: 'Krem Bakım',
      slug: 'krem-bakim',
      description: 'Cildinizi besleyen profesyonel bakım kremleri',
      icon: '🧴',
      image: '/images/krembakim/yogunnemlendiriciyuzkremi.jpg',
      order: 4,
    },
    {
      name: 'Bitkisel Yağlar',
      slug: 'bitkisel-yaglar',
      description: 'Difüzör için doğal esans yağları',
      icon: '🌿',
      image: '/images/bitkiselyaglar/gul.jpeg',
      order: 5,
    },
    {
      name: 'Oda ve Tekstil Kokuları',
      slug: 'oda-tekstil-kokulari',
      description: 'Evinizi ferahlatan oda kokuları',
      icon: '🕯️',
      image: '/images/odavetekstil/amber.jpeg',
      order: 6,
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

  // JSON'dan ürünleri yükle (images/urun_listesi_faydalari_guncel.json)
  const jsonPath = path.join(process.cwd(), 'images', 'urun_listesi_faydalari_guncel.json')
  let jsonItems: Array<{
    'Kategori': string
    'Ürün İsmi': string
    'Kullanım Alanı': string
    'Özellikleri': string
    'Bilinen Faydaları': string
    'BARKOD ': number
    'FİYAT ': string
  }> = []
  try {
    const raw = fs.readFileSync(jsonPath, 'utf-8').trim()
    jsonItems = JSON.parse('[' + raw + ']')
  } catch (e) {
    console.warn('⚠️ JSON ürün listesi okunamadı, atlanıyor:', e)
  }

  for (const item of jsonItems) {
    const catSlug = categorySlugMap[item['Kategori']]
    if (!catSlug || !createdCategories[catSlug]) {
      console.warn(`⚠️ Bilinmeyen kategori: ${item['Kategori']}, atlanıyor.`)
      continue
    }
    const name = (item['Ürün İsmi'] || '').trim()
    const slug = slugFromName(name)
    const price = parsePrice(item['FİYAT '] ?? item['FİYAT'] ?? '0')
    const barcode = item['BARKOD '] != null ? String(item['BARKOD ']) : (item as any)['BARKOD'] != null ? String((item as any)['BARKOD']) : null
    const defaultImg = categoryDefaultImage[catSlug] || '/images/placeholder.jpg'

    const product = await prisma.product.upsert({
      where: { slug },
      update: {
        name,
        description: (item['Bilinen Faydaları'] || '').slice(0, 500),
        content: item['Özellikleri'] || null,
        usage: item['Kullanım Alanı'] || null,
        features: item['Özellikleri'] || null,
        benefits: item['Bilinen Faydaları'] || null,
        barcode: barcode || undefined,
        price,
        sku: barcode || undefined,
        categoryId: createdCategories[catSlug].id,
      },
      create: {
        name,
        slug,
        description: (item['Bilinen Faydaları'] || '').slice(0, 500),
        content: item['Özellikleri'] || null,
        usage: item['Kullanım Alanı'] || null,
        features: item['Özellikleri'] || null,
        benefits: item['Bilinen Faydaları'] || null,
        barcode: barcode || undefined,
        price,
        sku: barcode || undefined,
        stock: 50,
        images: defaultImg,
        categoryId: createdCategories[catSlug].id,
        featured: false,
        active: true,
      },
    })
    console.log(`✅ Ürün: ${product.name}`)
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

