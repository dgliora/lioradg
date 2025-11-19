import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [images, autoPlay, interval] = await Promise.all([
      prisma.setting.findUnique({ where: { key: 'hero_slider_images' } }),
      prisma.setting.findUnique({ where: { key: 'hero_slider_auto_play' } }),
      prisma.setting.findUnique({ where: { key: 'hero_slider_interval' } }),
    ])

    const sliderImages = images?.value ? images.value.split(',').filter(Boolean) : []
    const autoPlayValue = autoPlay?.value === 'true'
    const intervalValue = interval ? parseInt(interval.value) : 5000

    return NextResponse.json({
      images: sliderImages,
      autoPlay: autoPlayValue,
      interval: intervalValue,
    })
  } catch (error) {
    console.error('Slider ayarları getirilirken hata:', error)
    return NextResponse.json(
      { images: [], autoPlay: true, interval: 5000 },
      { status: 200 }
    )
  }
}

