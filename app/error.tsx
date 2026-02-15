'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Uygulama hatası:', error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream px-4">
      <h1 className="text-4xl font-bold text-sage-dark mb-4">Bir Hata Oluştu</h1>
      <p className="text-charcoal/60 mb-8 text-center max-w-md">
        Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.
      </p>
      <button
        onClick={reset}
        className="bg-sage text-white px-6 py-3 rounded-lg hover:bg-sage-dark transition-colors"
      >
        Tekrar Dene
      </button>
    </div>
  )
}
