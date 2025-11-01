'use client'

import { useState } from 'react'
import { Button, useToast } from '@/components/ui'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { showToast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // TODO: Newsletter subscription API
    console.log('Newsletter subscription:', email)
    
    // Simulate API call
    setTimeout(() => {
      showToast('E-bültene başarıyla abone oldunuz!', 'success')
      setEmail('')
      setIsSubmitting(false)
    }, 1000)
  }

  return (
    <section className="py-24 bg-gradient-to-br from-sage to-sage-dark relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-8">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <h2 className="text-h2 font-serif font-bold mb-4 text-white">
            Kampanyalardan Haberdar Olun
          </h2>
          <p className="text-lg text-white mb-12">
            E-bültenimize kayıt olun, özel fırsatları ve yeni ürünleri ilk siz öğrenin
          </p>

          <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3 bg-white/95 backdrop-blur-sm p-2 rounded-2xl shadow-lg">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-posta adresiniz"
                required
                className="flex-1 px-6 py-4 rounded-xl text-base focus:outline-none bg-transparent text-neutral placeholder:text-neutral-medium"
              />
              <Button
                type="submit"
                size="lg"
                loading={isSubmitting}
                className="whitespace-nowrap bg-white text-sage hover:bg-warm-50 shadow-button border-2 border-sage/20"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Abone Ol
              </Button>
            </div>
            <p className="text-sm text-white/90 mt-4">
              ✓ E-posta adresiniz gizli kalacak • İstediğiniz zaman abonelikten çıkabilirsiniz
            </p>
          </form>

          {/* Stats */}
          <div className="mt-16 flex flex-wrap justify-center gap-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">500+</div>
              <div className="text-sm text-white/80">Mutlu Müşteri</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">32</div>
              <div className="text-sm text-white/80">Premium Ürün</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">%100</div>
              <div className="text-sm text-white/80">Doğal İçerik</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
