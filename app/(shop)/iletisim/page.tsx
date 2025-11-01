'use client'

import { useState } from 'react'
import { Button, Input, Card } from '@/components/ui'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'genel',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // TODO: Send email based on subject
    console.log('Contact form:', formData)
    
    setTimeout(() => {
      alert('Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.')
      setFormData({ name: '', email: '', subject: 'genel', message: '' })
      setIsSubmitting(false)
    }, 1000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">İletişim</h1>
            <p className="text-lg text-gray-600">
              Sorularınız için bize ulaşabilirsiniz
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <Card>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Bize Yazın
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Ad Soyad"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="E-posta"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Konu <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="genel">Genel Sorular (info@lioradg.com.tr)</option>
                    <option value="destek">Teknik Destek (destek@lioradg.com.tr)</option>
                    <option value="satis">Satış & Sipariş (satis@lioradg.com.tr)</option>
                    <option value="fatura">Fatura İşlemleri (fatura@lioradg.com.tr)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mesajınız <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <Button type="submit" size="lg" fullWidth loading={isSubmitting}>
                  Gönder
                </Button>
              </form>
            </Card>

            {/* Contact Info */}
            <div className="space-y-6">
              <Card>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  İletişim Bilgileri
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-primary flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Adres</h3>
                      <p className="text-gray-600 text-sm">
                        ARDIÇLI MAH. DOĞAN ARASLI BLV.<br />
                        MEYDAN ARDIÇLI A3 BLOK NO: 230-232C<br />
                        İÇ KAPI NO: 58<br />
                        ESENYURT/İSTANBUL
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-primary flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Telefon</h3>
                      <a href="tel:+905302084747" className="text-gray-600 hover:text-primary">
                        +90 530 208 47 47
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-primary flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">E-posta</h3>
                      <div className="text-sm space-y-1">
                        <p>
                          <strong>Genel:</strong>{' '}
                          <a href="mailto:info@lioradg.com.tr" className="text-gray-600 hover:text-primary">
                            info@lioradg.com.tr
                          </a>
                        </p>
                        <p>
                          <strong>Destek:</strong>{' '}
                          <a href="mailto:destek@lioradg.com.tr" className="text-gray-600 hover:text-primary">
                            destek@lioradg.com.tr
                          </a>
                        </p>
                        <p>
                          <strong>Satış:</strong>{' '}
                          <a href="mailto:satis@lioradg.com.tr" className="text-gray-600 hover:text-primary">
                            satis@lioradg.com.tr
                          </a>
                        </p>
                        <p>
                          <strong>Fatura:</strong>{' '}
                          <a href="mailto:fatura@lioradg.com.tr" className="text-gray-600 hover:text-primary">
                            fatura@lioradg.com.tr
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-primary flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Çalışma Saatleri</h3>
                      <p className="text-gray-600 text-sm">
                        Pazartesi - Cumartesi: 09:00 - 18:00<br />
                        Pazar: Kapalı
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Map */}
              <Card padding="none" className="overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3010.7545825229973!2d28.6524!3d41.0082!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDAwJzI5LjUiTiAyOMKwMzknMDguNiJF!5e0!3m2!1str!2str!4v1234567890"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

