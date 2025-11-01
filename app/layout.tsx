import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Lioradg - Kişisel Bakım ve Temizlik Ürünleri',
  description: 'Güvenilir, şeffaf ve erişilebilir kişisel bakım ürünleri. Parfüm, tonik, şampuan, krem, bitkisel yağlar ve oda kokuları.',
  keywords: 'kozmetik, bitkisel ürünler, doğal kozmetik, krem, parfüm, tonik, bakım ürünleri',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

