import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Liora DG - Kişisel Bakım ve Temizlik Ürünleri',
    template: '%s | Liora DG',
  },
  description: 'Güvenilir, şeffaf ve erişilebilir kişisel bakım ürünleri. Parfüm, tonik, şampuan, krem, bitkisel yağlar ve oda kokuları.',
  keywords: 'kozmetik, bitkisel ürünler, doğal kozmetik, krem, parfüm, tonik, bakım ürünleri, liora dg',
  metadataBase: new URL('https://lioradg.com.tr'),
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://lioradg.com.tr',
    siteName: 'Liora DG',
    title: 'Liora DG - Kişisel Bakım ve Temizlik Ürünleri',
    description: 'Güvenilir, şeffaf ve erişilebilir kişisel bakım ürünleri. Parfüm, tonik, şampuan, krem, bitkisel yağlar ve oda kokuları.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Liora DG - Kişisel Bakım ve Temizlik Ürünleri',
    description: 'Güvenilir, şeffaf ve erişilebilir kişisel bakım ürünleri.',
  },
  robots: {
    index: true,
    follow: true,
  },
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
