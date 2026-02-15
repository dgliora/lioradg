'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { LogoLioraDG } from '@/components/LogoLioraDG'

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-900"><div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full" /></div>}>
      <AuthErrorContent />
    </Suspense>
  )
}

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const errorMessages: Record<string, string> = {
    Configuration: 'Sunucu yapılandırma hatası',
    AccessDenied: 'Erişim reddedildi',
    Verification: 'Doğrulama başarısız',
    Default: 'Giriş sırasında bir hata oluştu',
  }

  const message = errorMessages[error || 'Default'] || errorMessages.Default

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <LogoLioraDG 
          variant="full"
          width={180}
          height={45}
          className="mx-auto mb-8"
          showImage={true}
        />
        
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-2">Giriş Hatası</h1>
          <p className="text-gray-400 mb-6">{message}</p>
          
          {error && (
            <p className="text-sm text-gray-500 mb-6">Hata kodu: {error}</p>
          )}
          
          <Link
            href="/admin/giris"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sage to-sage-dark text-white font-semibold rounded-lg hover:from-sage-dark hover:to-sage transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Tekrar Dene
          </Link>
        </div>
      </div>
    </div>
  )
}

