import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdminAuth } from '@/lib/auth-server'

const DEFAULT_SETTINGS = [
  { key: 'shipping_fee', value: '89.90', label: 'Kargo Ücreti (TL)', type: 'number' },
  { key: 'free_shipping_min_amount', value: '500', label: 'Ücretsiz Kargo Minimum Tutar (TL)', type: 'number' },
  { key: 'delivery_time', value: '2-5 iş günü', label: 'Teslimat Süresi', type: 'text' },
  { key: 'contact_phone', value: '+90 530 208 47 47', label: 'Telefon Numarası', type: 'text' },
  { key: 'contact_email', value: 'info@lioradg.com.tr', label: 'E-posta Adresi', type: 'email' },
  { key: 'contact_address', value: 'İstanbul, Türkiye', label: 'Adres', type: 'text' },
  { key: 'social_instagram', value: 'https://instagram.com/dgliora', label: 'Instagram Linki', type: 'text' },
  { key: 'social_whatsapp', value: '905302084747', label: 'WhatsApp Numarası', type: 'text' },
  { key: 'min_order_amount', value: '0', label: 'Minimum Sipariş Tutarı (TL)', type: 'number' },
  { key: 'cash_on_delivery', value: 'false', label: 'Kapıda Ödeme', type: 'boolean' },
  { key: 'site_title', value: 'LIORADG - Premium Bitkisel Kozmetik', label: 'Site Başlığı', type: 'text' },
  { key: 'site_description', value: 'Premium bitkisel kozmetik ürünleri', label: 'Site Açıklaması', type: 'text' },
  { key: 'email_notifications', value: 'true', label: 'E-posta Bildirimleri', type: 'boolean' },
  { key: 'stock_alert_threshold', value: '5', label: 'Stok Uyarı Eşiği', type: 'number' },
  { key: 'hero_slider_images', value: '', label: 'Slider Fotoğrafları', type: 'text' },
  { key: 'hero_slider_auto_play', value: 'true', label: 'Slider Otomatik Oynatma', type: 'boolean' },
  { key: 'hero_slider_interval', value: '5000', label: 'Slider Hızı (ms)', type: 'number' },
]

export async function GET() {
  try {
    const auth = await checkAdminAuth()
    if (!auth.isAdmin) {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 401 }
      )
    }

    // Mevcut ayarları al
    const existing = await prisma.setting.findMany()
    const existingKeys = new Set(existing.map(s => s.key))

    // Eksik ayarları otomatik oluştur
    const missing = DEFAULT_SETTINGS.filter(s => !existingKeys.has(s.key))
    if (missing.length > 0) {
      await prisma.setting.createMany({ data: missing })
    }

    const settings = await prisma.setting.findMany({
      orderBy: { key: 'asc' },
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Ayarlar getirilirken hata:', error)
    return NextResponse.json(
      { error: 'Ayarlar getirilemedi' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await checkAdminAuth()
    if (!auth.isAdmin) {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 401 }
      )
    }

    const data = await request.json()
    const { key, value } = data

    if (!key || value === undefined) {
      return NextResponse.json(
        { error: 'Key ve value gereklidir' },
        { status: 400 }
      )
    }

    const setting = await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: {
        key,
        value: value.toString(),
        label: data.label || key,
        type: data.type || 'text',
      },
    })

    return NextResponse.json(setting)
  } catch (error) {
    console.error('Ayar güncellenirken hata:', error)
    return NextResponse.json(
      { error: 'Ayar güncellenemedi' },
      { status: 500 }
    )
  }
}

