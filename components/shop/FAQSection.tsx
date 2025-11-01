'use client'

import { useState } from 'react'
import Link from 'next/link'
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
    answer: 'Teslimden itibaren 14 gün içinde, açılmamış ve yeniden satılabilir durumda olan ürünler için iade veya değişim kabul edilir.',
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
]

export function FAQSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-h2 font-bold text-neutral-900 mb-4">
              Sıkça Sorulan Sorular
            </h2>
            <p className="text-base text-neutral-600">
              En çok merak edilen sorular ve cevapları
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((faq, index) => (
              <FAQItem key={index} faq={faq} />
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/sss"
              className="inline-flex items-center text-primary hover:text-primary-hover font-medium transition-colors"
            >
              Tüm Soruları Görüntüle
              <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
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
        <h3 className="text-small font-semibold text-neutral-900 pr-4">
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
        <div className="px-6 pb-4 pt-2 text-small text-neutral-700 border-t border-neutral-200">
          {faq.answer}
        </div>
      )}
    </Card>
  )
}

