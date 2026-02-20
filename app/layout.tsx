import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { prisma } from '@/lib/prisma'

const inter = Inter({ subsets: ['latin'] })

export async function generateMetadata(): Promise<Metadata> {
  let siteTitle = 'Liora DG - Kişisel Bakım ve Temizlik Ürünleri'
  let siteDescription = 'Güvenilir, şeffaf ve erişilebilir kişisel bakım ürünleri. Parfüm, tonik, şampuan, krem, bitkisel yağlar ve oda kokuları.'

  try {
    const [titleSetting, descSetting] = await Promise.all([
      prisma.setting.findUnique({ where: { key: 'site_title' } }),
      prisma.setting.findUnique({ where: { key: 'site_description' } }),
    ])
    if (titleSetting?.value) siteTitle = titleSetting.value
    if (descSetting?.value) siteDescription = descSetting.value
  } catch {}

  return {
    title: {
      default: siteTitle,
      template: `%s | Liora DG`,
    },
    description: siteDescription,
    keywords: 'kozmetik, bitkisel ürünler, doğal kozmetik, krem, parfüm, tonik, bakım ürünleri, liora dg',
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://lioradg.com.tr'),
    openGraph: {
      type: 'website',
      locale: 'tr_TR',
      url: process.env.NEXT_PUBLIC_SITE_URL || 'https://lioradg.com.tr',
      siteName: 'Liora DG',
      title: siteTitle,
      description: siteDescription,
    },
    twitter: {
      card: 'summary_large_image',
      title: siteTitle,
      description: siteDescription,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <head>
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-XRSGB1BXFF"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XRSGB1BXFF');
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
