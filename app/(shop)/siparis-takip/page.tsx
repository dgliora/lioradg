'use client'

import { useState } from 'react'
import { Card, Input, Button } from '@/components/ui'

export default function OrderTrackingPage() {
  const [orderNumber, setOrderNumber] = useState('')
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Track order
    console.log('Track order:', { orderNumber, email })
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-h1 font-bold text-neutral-900 mb-4">
              Sipariş Takip
            </h1>
            <p className="text-base text-neutral-600">
              Siparişinizin durumunu takip edin
            </p>
          </div>

          <Card>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Sipariş Numarası"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="Örn: ORD-123456"
                required
              />
              <Input
                label="E-posta Adresi"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@email.com"
                required
              />
              <Button type="submit" size="lg" fullWidth>
                Siparişimi Takip Et
              </Button>
            </form>
          </Card>

          <Card className="mt-8 bg-primary/5 border-primary/20">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-small text-neutral-700">
                <p className="font-semibold mb-2">Sipariş numaranızı bulamıyor musunuz?</p>
                <p>
                  Sipariş numaranız, sipariş onay e-postasında bulunmaktadır.
                  Eğer e-postayı bulamıyorsanız,{' '}
                  <a href="/account" className="text-primary hover:underline">
                    hesabınızdan
                  </a>{' '}
                  veya{' '}
                  <a href="/iletisim" className="text-primary hover:underline">
                    müşteri hizmetlerinden
                  </a>{' '}
                  kontrol edebilirsiniz.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

