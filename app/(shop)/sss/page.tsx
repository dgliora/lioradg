'use client'

import { useState } from 'react'
import { Card } from '@/components/ui'
import { cn } from '@/lib/utils'

const faqs = [
  {
    question: 'Ürünleriniz güvenli mi?',
    answer: 'Tüm ürünlerimiz ilgili mevzuata uygun üretilir ve satılmadan önce kalite kontrollerinden geçer. Güvenlik verileri ve kullanım talimatları ürün sayfalarında yer alır.',
  },
  {
    question: 'Kargo sürem nedir?',
    answer: 'Stokta olan ürünler 24-48 saat içinde kargoya verilir. Resmi tatiller hariçtir.',
  },
  {
    question: 'İade ve değişim şartları nelerdir?',
    answer: 'Teslimden itibaren 14 gün içinde, açılmamış ve yeniden satılabilir durumda olan ürünler için iade veya değişim kabul edilir. Detaylar için /iade-degisim sayfasını inceleyin.',
  },
  {
    question: 'Siparişimi nasıl takip ederim?',
    answer: '/siparis-takip sayfasından sipariş numarası ve e-posta ile anlık durumunuzu görüntüleyebilirsiniz.',
  },
  {
    question: 'Kurumsal/toplu alım yapabilir miyim?',
    answer: 'Evet. satis@lioradg.com.tr adresine adet ve ürün bilgisi iletin; satış ekibimiz dönüş yapar.',
  },
  {
    question: 'Ödeme yöntemleri nelerdir?',
    answer: 'Kredi/banka kartı ve 3D Secure desteklidir. Bazı kampanyalarda kapıda ödeme sunulmaz.',
  },
  {
    question: 'Ürünleriniz orijinal mi?',
    answer: 'Tedarik zinciri denetlenir; orijinallik ve kalite kontrol süreçleri kayıt altındadır.',
  },
  {
    question: 'Fatura nasıl kesilir?',
    answer: 'Sipariş onaylandığında e-fatura/e-arşiv elektronik ortamda düzenlenir ve e-posta ile gönderilir.',
  },
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-h1 font-bold text-neutral-900 mb-4">
              Sıkça Sorulan Sorular
            </h1>
            <p className="text-base text-neutral-600">
              Merak ettiğiniz sorulara yanıt bulabilirsiniz
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <FAQItem key={index} faq={faq} />
            ))}
          </div>

          <Card className="mt-12 bg-primary/5 border-primary/20">
            <div className="text-center py-8">
              <h3 className="text-h3 font-semibold text-neutral-900 mb-2">
                Sorunuz cevaplanmadı mı?
              </h3>
              <p className="text-neutral-600 mb-6">
                Bizimle iletişime geçin, size yardımcı olmaktan mutluluk duyarız.
              </p>
              <a
                href="/iletisim"
                className="inline-flex items-center justify-center h-44 px-24 bg-primary text-white rounded-button font-semibold hover:bg-primary-hover transition-colors"
              >
                İletişime Geç
              </a>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function FAQItem({ faq }: { faq: { question: string; answer: string } }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Card className="overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors"
      >
        <h3 className="text-base font-semibold text-neutral-900 pr-4">
          {faq.question}
        </h3>
        <svg
          className={cn(
            'w-5 h-5 text-neutral-500 flex-shrink-0 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-6 pb-4 pt-2 text-neutral-700 border-t border-neutral-200">
          {faq.answer}
        </div>
      )}
    </Card>
  )
}

