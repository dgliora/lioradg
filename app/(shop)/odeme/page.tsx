'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Card, Input, Button, useToast } from '@/components/ui'
import { useCartStore } from '@/lib/store/cartStore'
import { formatPrice } from '@/lib/utils'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCartStore()
  const { showToast } = useToast()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    // Step 1: Shipping Address
    fullName: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    postalCode: '',
    // Step 2: Billing (same as shipping)
    billingSame: true,
    // Step 3: Agreements
    salesAgreement: false,
    kvkk: false,
  })

  const shippingCost = getTotalPrice() >= 500 ? 0 : 29.90
  const total = getTotalPrice() + shippingCost

  if (items.length === 0) {
    router.push('/sepet')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (step < 3) {
      setStep(step + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (!formData.salesAgreement || !formData.kvkk) {
      showToast('Lütfen tüm sözleşmeleri onaylayın', 'warning')
      return
    }

    // TODO: Create order API call
    console.log('Create order:', formData)
    
    const orderNumber = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase()
    
    clearCart()
    showToast('Siparişiniz başarıyla oluşturuldu!', 'success')
    router.push(`/siparis-tamamlandi/${orderNumber}`)
  }

  const steps = [
    { number: 1, title: 'Teslimat Bilgileri' },
    { number: 2, title: 'Kargo Seçimi' },
    { number: 3, title: 'Onay ve Ödeme' },
  ]

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-h1 font-bold text-neutral-900 mb-24">Ödeme</h1>

          {/* Progress Steps */}
          <div className="mb-32">
            <div className="flex items-center justify-center">
              {steps.map((s, index) => (
                <div key={s.number} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-32 h-32 rounded-full flex items-center justify-center font-semibold text-base transition-colors ${
                        step >= s.number
                          ? 'bg-primary text-white'
                          : 'bg-neutral-200 text-neutral-500'
                      }`}
                    >
                      {s.number}
                    </div>
                    <span className="text-small text-neutral-700 mt-8 text-center">
                      {s.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-24 md:w-32 h-1 mx-8 transition-colors ${
                        step > s.number ? 'bg-primary' : 'bg-neutral-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <Card>
                <form onSubmit={handleSubmit} className="space-y-24">
                  {step === 1 && (
                    <div className="space-y-16">
                      <h2 className="text-h2 font-semibold text-neutral-900">
                        Teslimat Adresi
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                        <Input
                          label="Ad Soyad"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          required
                        />
                        <Input
                          label="Telefon"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="0500 000 00 00"
                          required
                        />
                      </div>
                      <Input
                        label="Adres"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Mahalle, sokak, bina no, daire no"
                        required
                      />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                        <Input
                          label="İl"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          required
                        />
                        <Input
                          label="İlçe"
                          value={formData.district}
                          onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                          required
                        />
                        <Input
                          label="Posta Kodu"
                          value={formData.postalCode}
                          onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                        />
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-16">
                      <h2 className="text-h2 font-semibold text-neutral-900">
                        Kargo Seçimi
                      </h2>
                      <Card hover className="p-16 border-2 border-primary bg-primary/5 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-neutral-900 mb-4">
                              Yurtiçi Kargo
                            </h3>
                            <p className="text-small text-neutral-600">
                              Teslimat: 2-5 iş günü
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-h3 font-bold text-primary">
                              {shippingCost === 0 ? 'Ücretsiz' : formatPrice(shippingCost)}
                            </p>
                          </div>
                        </div>
                      </Card>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-24">
                      <h2 className="text-h2 font-semibold text-neutral-900">
                        Sipariş Onayı
                      </h2>
                      
                      <div className="space-y-12">
                        <label className="flex items-start cursor-pointer p-12 hover:bg-neutral-50 rounded-lg transition-colors">
                          <input
                            type="checkbox"
                            checked={formData.salesAgreement}
                            onChange={(e) => setFormData({ ...formData, salesAgreement: e.target.checked })}
                            required
                            className="mt-4 mr-12 text-primary focus:ring-focus"
                          />
                          <span className="text-small text-neutral-700">
                            <Link href="/kullanim-sartlari" className="text-primary hover:underline" target="_blank">
                              Mesafeli Satış Sözleşmesi
                            </Link>
                            &apos;ni ve{' '}
                            <Link href="/kullanim-sartlari" className="text-primary hover:underline" target="_blank">
                              Ön Bilgilendirme Formu
                            </Link>
                            &apos;nu okudum, kabul ediyorum
                          </span>
                        </label>

                        <label className="flex items-start cursor-pointer p-12 hover:bg-neutral-50 rounded-lg transition-colors">
                          <input
                            type="checkbox"
                            checked={formData.kvkk}
                            onChange={(e) => setFormData({ ...formData, kvkk: e.target.checked })}
                            required
                            className="mt-4 mr-12 text-primary focus:ring-focus"
                          />
                          <span className="text-small text-neutral-700">
                            <Link href="/kvkk" className="text-primary hover:underline" target="_blank">
                              KVKK Aydınlatma Metni
                            </Link>
                            &apos;ni okudum, kişisel verilerimin işlenmesini kabul ediyorum
                          </span>
                        </label>
                      </div>

                      <Card className="bg-primary/5 border-primary/20">
                        <div className="flex items-start gap-12">
                          <svg className="w-24 h-24 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className="text-small text-neutral-700">
                            <p className="font-semibold mb-4">Mock Ödeme Sistemi</p>
                            <p>
                              Gerçek ödeme entegrasyonu (iyzico) henüz eklenmemiştir.
                              Sipariş oluşturulacak ancak ödeme alınmayacaktır.
                            </p>
                          </div>
                        </div>
                      </Card>
                    </div>
                  )}

                  <div className="flex gap-12 pt-24 border-t border-neutral-200">
                    {step > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        onClick={() => setStep(step - 1)}
                      >
                        Geri
                      </Button>
                    )}
                    <Button type="submit" size="lg" className="flex-1">
                      {step < 3 ? 'Devam Et' : 'Siparişi Tamamla'}
                    </Button>
                  </div>
                </form>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-24">
                <h2 className="text-h3 font-semibold text-neutral-900 mb-16">
                  Sipariş Özeti
                </h2>

                <div className="space-y-12 mb-16">
                  {items.map((item) => {
                    const finalPrice = item.product.salePrice || item.product.price
                    return (
                      <div key={item.product.id} className="flex gap-12">
                        <div className="relative w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-neutral-200">
                          <Image
                            src={item.product.images || '/placeholder.jpg'}
                            alt={item.product.name}
                            fill
                            className="object-contain p-4"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-small font-medium text-neutral-900 truncate">
                            {item.product.name}
                          </p>
                          <p className="text-small text-neutral-600">
                            {item.quantity} x {formatPrice(finalPrice)}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="space-y-12 pt-16 border-t border-neutral-200">
                  <div className="flex justify-between text-small text-neutral-600">
                    <span>Ara Toplam</span>
                    <span>{formatPrice(getTotalPrice())}</span>
                  </div>
                  <div className="flex justify-between text-small text-neutral-600">
                    <span>Kargo</span>
                    <span>
                      {shippingCost === 0 ? (
                        <span className="text-success font-medium">Ücretsiz</span>
                      ) : (
                        formatPrice(shippingCost)
                      )}
                    </span>
                  </div>
                  <div className="border-t border-neutral-200 pt-12 flex justify-between text-base font-bold text-neutral-900">
                    <span>Toplam</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

