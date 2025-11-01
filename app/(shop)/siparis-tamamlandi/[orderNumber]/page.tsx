import Link from 'next/link'
import { Button, Card } from '@/components/ui'

interface OrderSuccessPageProps {
  params: { orderNumber: string }
}

export default function OrderSuccessPage({ params }: OrderSuccessPageProps) {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full">
        <Card className="text-center py-32">
          {/* Success Icon */}
          <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-24">
            <svg className="w-12 h-12 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-h1 font-bold text-neutral-900 mb-12">
            Siparişiniz Alındı!
          </h1>
          
          <p className="text-base text-neutral-600 mb-8">
            Siparişiniz başarıyla oluşturuldu. Sipariş detayları e-posta adresinize gönderildi.
          </p>

          <Card className="bg-neutral-50 border-neutral-200 inline-block mx-auto px-24 py-16 mb-32">
            <p className="text-small text-neutral-600 mb-4">Sipariş Numaranız</p>
            <p className="text-h2 font-bold text-primary font-mono">
              #{params.orderNumber}
            </p>
          </Card>

          <div className="space-y-12 mb-24">
            <div className="flex items-start gap-12 text-left">
              <svg className="w-24 h-24 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <div>
                <h3 className="font-semibold text-neutral-900 mb-4">E-posta Gönderildi</h3>
                <p className="text-small text-neutral-600">
                  Sipariş detayları e-posta adresinize gönderildi. Lütfen gelen kutunuzu kontrol edin.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-12 text-left">
              <svg className="w-24 h-24 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              <div>
                <h3 className="font-semibold text-neutral-900 mb-4">Kargoya Teslim</h3>
                <p className="text-small text-neutral-600">
                  Siparişiniz 24-48 saat içinde kargoya teslim edilecektir.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-12 justify-center">
            <Link href="/account">
              <Button size="lg" variant="outline">
                Siparişlerimi Görüntüle
              </Button>
            </Link>
            <Link href="/">
              <Button size="lg">
                Alışverişe Devam Et
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}

