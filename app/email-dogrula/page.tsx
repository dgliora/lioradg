'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { LogoLioraDG } from '@/components/LogoLioraDG'

function EmailVerifyContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [name, setName] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      return
    }

    fetch(`/api/auth/verify-email?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          setName(data.name || '')
          setStatus('success')
        } else {
          setStatus('error')
        }
      })
      .catch(() => setStatus('error'))
  }, [token])

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <Link href="/" className="inline-block">
            <LogoLioraDG variant="full" width={200} height={50} className="text-sage" showImage={true} />
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8">
          {status === 'loading' && (
            <div>
              <div className="w-12 h-12 border-4 border-sage border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-neutral-600">Doğrulanıyor...</p>
            </div>
          )}

          {status === 'success' && (
            <div>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-neutral-900 mb-2">Hoş Geldiniz{name ? `, ${name}` : ''}!</h1>
              <p className="text-neutral-600 mb-6">E-posta adresiniz başarıyla doğrulandı. Artık giriş yapabilirsiniz.</p>
              <Link
                href="/giris"
                className="inline-block bg-sage text-white px-8 py-3 rounded-xl font-semibold hover:bg-sage/90 transition-colors"
              >
                Giriş Yap
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-neutral-900 mb-2">Doğrulama Başarısız</h1>
              <p className="text-neutral-600 mb-6">Link geçersiz veya süresi dolmuş. Tekrar kayıt olabilirsiniz.</p>
              <Link
                href="/kayit"
                className="inline-block bg-sage text-white px-8 py-3 rounded-xl font-semibold hover:bg-sage/90 transition-colors"
              >
                Tekrar Kayıt Ol
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function EmailVerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-sage border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <EmailVerifyContent />
    </Suspense>
  )
}
