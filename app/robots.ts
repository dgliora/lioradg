import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/sepet', '/odeme'],
      },
    ],
    sitemap: 'https://lioradg.com.tr/sitemap.xml',
  }
}
