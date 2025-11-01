import Link from 'next/link'
import { Button } from '@/components/ui'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Kategori Bulunamadı
        </h2>
        <p className="text-gray-600 mb-8">
          Aradığınız kategori mevcut değil veya kaldırılmış olabilir.
        </p>
        <Link href="/">
          <Button size="lg">Ana Sayfaya Dön</Button>
        </Link>
      </div>
    </div>
  )
}

