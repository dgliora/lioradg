import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://lioradg.com.tr'

  // Statik sayfalar
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/urunler`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/hakkimizda`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/iletisim`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]

  // Kategoriler
  let categoryPages: MetadataRoute.Sitemap = []
  try {
    const categories = await prisma.category.findMany({ select: { slug: true, updatedAt: true } })
    categoryPages = categories.map((c) => ({
      url: `${baseUrl}/kategori/${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch { /* DB bağlantı hatası olursa boş dön */ }

  // Ürünler
  let productPages: MetadataRoute.Sitemap = []
  try {
    const products = await prisma.product.findMany({ select: { slug: true, updatedAt: true } })
    productPages = products.map((p) => ({
      url: `${baseUrl}/urun/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  } catch { /* DB bağlantı hatası olursa boş dön */ }

  return [...staticPages, ...categoryPages, ...productPages]
}
