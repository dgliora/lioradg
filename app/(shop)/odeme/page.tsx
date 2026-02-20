'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Card, Input, Button, useToast } from '@/components/ui'
import { useCartStore } from '@/lib/store/cartStore'
import { formatPrice } from '@/lib/utils'
import { calculateShippingFee } from '@/lib/utils/shipping'

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isGuest = searchParams.get('misafir') === '1'
  const { items, getTotalPrice, clearCart } = useCartStore()
  const { showToast } = useToast()
  const [step, setStep] = useState(1)
  const [mounted, setMounted] = useState(false)
  const [shippingCost, setShippingCost] = useState(0)
  const [formData, setFormData] = useState({
    // Misafir için
    guestEmail: '',
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

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && items.length === 0) {
      router.push('/sepet')
    }
  }, [mounted, items.length, router])

  // Kargo ücretini ayarlardan ve kampanyalardan hesapla
  useEffect(() => {
    if (mounted) {
      calculateShippingFee(getTotalPrice()).then(fee => {
        setShippingCost(fee)
      })
    }
  }, [mounted, items])

  const total = getTotalPrice() + shippingCost

  if (!mounted || items.length === 0) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-sage border-t-transparent rounded-full" /></div>
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

    // Sipariş adresini profil adreslerine otomatik kaydet (sadece giriş yapmış kullanıcılar için)
    if (!isGuest && formData.fullName && formData.city) {
      try {
        const saved = localStorage.getItem('user-addresses')
        const existing: Array<Record<string, unknown>> = saved ? JSON.parse(saved) : []

        // Aynı içerikli adres zaten varsa tekrar ekleme
        const alreadyExists = existing.some(
          (a) =>
            a.province === formData.city &&
            a.district === formData.district &&
            a.addressLine === formData.address
        )

        if (!alreadyExists) {
          const newAddr = {
            id: Date.now().toString(),
            title: `Sipariş ${orderNumber}`,
            fullName: formData.fullName,
            phone: formData.phone,
            province: formData.city,
            provinceCode: formData.city,
            district: formData.district,
            districtCode: formData.district,
            neighborhood: '',
            postalCode: formData.postalCode,
            addressLine: formData.address,
            isDefault: existing.length === 0,
          }
          localStorage.setItem('user-addresses', JSON.stringify([...existing, newAddr]))
        }
      } catch {
        // localStorage hatası sessizce geç
      }
    }

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
                      {isGuest && (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                          <p className="text-sm text-blue-700 mb-3 font-medium">Misafir olarak devam ediyorsunuz</p>
                          <Input
                            label="E-posta Adresiniz"
                            type="email"
                            value={formData.guestEmail}
                            onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                            placeholder="Sipariş bilgileri bu adrese gönderilecek"
                            required
                          />
                        </div>
                      )}
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
                            <Link href="/mesafeli-satis-sozlesmesi" className="text-primary hover:underline" target="_blank">
                              Mesafeli Satış Sözleşmesi
                            </Link>
                            &apos;ni ve{' '}
                            <Link href="/gizlilik-politikasi" className="text-primary hover:underline" target="_blank">
                              Gizlilik Politikası
                            </Link>
                            &apos;nı okudum, kabul ediyorum
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
                            sizes="64px"
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

                {/* Ödeme Güvenliği */}
                <div className="mt-16 pt-16 border-t border-neutral-200">
                  <p className="text-xs text-neutral-500 text-center mb-8">Güvenli Ödeme</p>
                  <div className="flex items-center justify-center gap-3 flex-wrap">
                    {/* Visa */}
                    <div className="bg-gray-50 border border-gray-200 rounded px-2 py-1">
                      <svg viewBox="0 0 780 500" className="h-5 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M293.2 348.73L321.82 152.12H366.72L338.08 348.73H293.2Z" fill="#00579F"/>
                        <path d="M524.28 156.07C515.24 152.54 500.93 148.71 483.07 148.71C438.72 148.71 407.12 171.59 406.9 204.88C406.67 229.71 429.84 243.55 447.41 251.85C465.42 260.35 471.46 265.74 471.39 273.28C471.28 284.97 457.27 290.26 444.17 290.26C425.81 290.26 416.07 287.63 400.96 281.03L395.04 278.32L388.6 319.12C399.19 323.73 418.79 327.71 439.14 327.91C486.36 327.91 517.34 305.3 517.67 269.81C517.84 250.27 506.04 235.27 480.64 222.88C464.37 214.79 454.51 209.45 454.61 201.43C454.61 194.28 462.88 186.64 480.96 186.64C496.21 186.41 507.4 189.83 516.1 193.36L520.32 195.29L526.58 155.77L524.28 156.07Z" fill="#00579F"/>
                        <path d="M640.81 152.12H606.38C595.86 152.12 588.01 155.12 583.47 165.91L517.04 348.72H564.22C564.22 348.72 571.83 328.16 573.55 323.53C578.63 323.53 624.48 323.6 631.01 323.6C632.35 329.5 636.46 348.72 636.46 348.72H678.05L640.81 152.12ZM586.43 288.06C590.06 278.4 604.45 239.49 604.45 239.49C604.22 239.86 607.97 229.86 610.12 223.78L612.97 238.13C612.97 238.13 621.42 277.95 623.1 288.06H586.43V288.06Z" fill="#00579F"/>
                        <path d="M236.27 152.12L192.32 279.23L187.57 255.81C179.37 228.89 153.72 199.55 124.99 185.01L165.15 348.62H212.68L284.86 152.12H236.27V152.12Z" fill="#00579F"/>
                        <path d="M151.23 152.12H77.25L76.62 155.54C133.73 169.73 172.06 203.14 187.57 255.82L171.79 166.11C169.12 155.57 161.42 152.47 151.23 152.12Z" fill="#FAA61A"/>
                      </svg>
                    </div>
                    {/* Mastercard */}
                    <div className="bg-gray-50 border border-gray-200 rounded px-2 py-1">
                      <svg viewBox="0 0 131.39 86.9" className="h-5 w-auto" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="49.75" cy="43.45" r="32.45" fill="#EB001B"/>
                        <circle cx="81.64" cy="43.45" r="32.45" fill="#F79E1B"/>
                        <path d="M65.7 19.2A32.36 32.36 0 0 1 81.64 43.45 32.36 32.36 0 0 1 65.7 67.7a32.36 32.36 0 0 1-15.95-24.25A32.36 32.36 0 0 1 65.7 19.2z" fill="#FF5F00"/>
                      </svg>
                    </div>
                    {/* iyzico */}
                    <div className="bg-gray-50 border border-gray-200 rounded px-2.5 py-1 flex items-center gap-1">
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" fill="#00A86B"/>
                      </svg>
                      <span className="text-xs font-bold text-[#00A86B]">iyzico ile Öde</span>
                    </div>
                    {/* SSL */}
                    <div className="bg-gray-50 border border-gray-200 rounded px-2.5 py-1 flex items-center gap-1">
                      <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                      </svg>
                      <span className="text-xs font-bold text-green-600">256-bit SSL</span>
                    </div>
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

