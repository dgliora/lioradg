'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { LogoLioraDG } from '@/components/LogoLioraDG'

function KayitBasariliContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <Link href="/" className="inline-block">
            <LogoLioraDG variant="full" width={200} height={50} className="text-sage" showImage={true} />
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-neutral-900 mb-3">Hesabınız Oluşturuldu!</h1>
          <p className="text-neutral-600 mb-2">
            Doğrulama bağlantısı{' '}
            {email && <strong className="text-neutral-900">{email}</strong>}
            {email ? ' adresine gönderildi.' : 'e-posta adresinize gönderildi.'}
          </p>
          <p className="text-sm text-neutral-500 mb-8">
            E-postanızdaki bağlantıya tıklayarak hesabınızı onaylayın. Spam klasörünü de kontrol etmeyi unutmayın.
          </p>

          <div className="space-y-3">
            <Link
              href="/giris"
              className="block w-full bg-sage text-white py-3 rounded-xl font-semibold hover:bg-sage/90 transition-colors text-center"
            >
              Giriş Sayfasına Git
            </Link>
            <Link
              href="/"
              className="block w-full border border-neutral-200 text-neutral-700 py-3 rounded-xl font-semibold hover:bg-neutral-50 transition-colors text-center"
            >
              Alışverişe Devam Et
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function KayitBasariliPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-sage border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <KayitBasariliContent />
    </Suspense>
  )
}
