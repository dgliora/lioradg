'use client'

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-h2 font-serif font-bold text-neutral mb-1">
          Siparişlerim
        </h2>
        <p className="text-sm text-neutral-medium">
          Geçmiş ve aktif siparişleriniz
        </p>
      </div>

      <div className="text-center py-16 bg-warm-50 rounded-lg border-2 border-dashed border-warm-200">
        <div className="w-16 h-16 bg-warm-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-neutral-medium" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h3 className="text-h3 font-serif text-neutral mb-2">Henüz Sipariş Yok</h3>
        <p className="text-neutral-medium">İlk siparişinizi verin ve burada takip edin</p>
      </div>
    </div>
  )
}
