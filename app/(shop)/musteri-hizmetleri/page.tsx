import Link from 'next/link'
import { Card } from '@/components/ui'

export default function CustomerServicePage() {
  const services = [
    {
      title: 'Hesabım',
      description: 'Profil bilgilerinizi ve siparişlerinizi yönetin',
      icon: '👤',
      href: '/account',
    },
    {
      title: 'Sipariş Takip',
      description: 'Siparişinizin durumunu anlık takip edin',
      icon: '📦',
      href: '/siparis-takip',
    },
    {
      title: 'İade ve Değişim',
      description: 'İade ve değişim işlemleriniz için bilgi alın',
      icon: '🔄',
      href: '/iade-degisim',
    },
    {
      title: 'Sıkça Sorulan Sorular',
      description: 'En çok merak edilen soruların cevapları',
      icon: '❓',
      href: '/sss',
    },
    {
      title: 'İletişim',
      description: 'Bize ulaşın, size yardımcı olalım',
      icon: '📞',
      href: '/iletisim',
    },
  ]

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-h1 font-bold text-neutral-900 mb-4">
              Müşteri Hizmetleri
            </h1>
            <p className="text-base text-neutral-600">
              Size nasıl yardımcı olabiliriz?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service) => (
              <Link key={service.href} href={service.href}>
                <Card hover className="h-full p-6 group">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{service.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-h3 font-semibold text-neutral-900 mb-2 group-hover:text-primary transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-small text-neutral-600">
                        {service.description}
                      </p>
                    </div>
                    <svg className="w-5 h-5 text-neutral-400 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {/* Contact Info */}
          <Card className="mt-12 bg-primary/5 border-primary/20">
            <div className="text-center py-8">
              <h3 className="text-h3 font-semibold text-neutral-900 mb-2">
                Hala yardıma mı ihtiyacınız var?
              </h3>
              <p className="text-neutral-600 mb-6">
                Müşteri hizmetleri ekibimiz size yardımcı olmak için hazır
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:+905302084747"
                  className="inline-flex items-center justify-center h-44 px-24 bg-primary text-white rounded-button font-semibold hover:bg-primary-hover transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Bizi Arayın
                </a>
                <a
                  href="mailto:destek@lioradg.com.tr"
                  className="inline-flex items-center justify-center h-44 px-24 bg-white text-primary border-2 border-primary rounded-button font-semibold hover:bg-primary hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  E-posta Gönderin
                </a>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

