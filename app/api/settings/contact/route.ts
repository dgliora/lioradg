import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const [phone, email, address, instagram, facebook, whatsapp] = await Promise.all([
      prisma.setting.findUnique({ where: { key: 'contact_phone' } }),
      prisma.setting.findUnique({ where: { key: 'contact_email' } }),
      prisma.setting.findUnique({ where: { key: 'contact_address' } }),
      prisma.setting.findUnique({ where: { key: 'social_instagram' } }),
      prisma.setting.findUnique({ where: { key: 'social_facebook' } }),
      prisma.setting.findUnique({ where: { key: 'social_whatsapp' } }),
    ])

    return NextResponse.json({
      phone: phone?.value || '+90 530 208 47 47',
      email: email?.value || 'info@lioradg.com.tr',
      address: address?.value || 'İstanbul, Türkiye',
      instagram: instagram?.value || 'https://instagram.com/dgliora',
      facebook: facebook?.value || 'https://facebook.com/lioradg',
      whatsapp: whatsapp?.value || '905302084747',
    })
  } catch (error) {
    console.error('İletişim bilgileri getirilirken hata:', error)
    return NextResponse.json(
      {
        phone: '+90 530 208 47 47',
        email: 'info@lioradg.com.tr',
        address: 'İstanbul, Türkiye',
        instagram: 'https://instagram.com/dgliora',
        facebook: 'https://facebook.com/lioradg',
        whatsapp: '905302084747',
      },
      { status: 200 }
    )
  }
}

