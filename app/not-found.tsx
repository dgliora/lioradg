import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream px-4">
      <h1 className="text-6xl font-bold text-sage-dark mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-charcoal mb-2">Sayfa Bulunamadı</h2>
      <p className="text-charcoal/60 mb-8 text-center max-w-md">
        Aradığınız sayfa mevcut değil veya taşınmış olabilir.
      </p>
      <Link
        href="/"
        className="bg-sage text-white px-6 py-3 rounded-lg hover:bg-sage-dark transition-colors"
      >
        Ana Sayfaya Dön
      </Link>
    </div>
  )
}
