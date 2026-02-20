import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Badge } from '@/components/ui'
import { formatPrice } from '@/lib/utils'

export const dynamic = 'force-dynamic'

async function getCustomer(id: string) {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      orders: {
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: { product: { select: { name: true, images: true } } },
          },
        },
      },
      _count: { select: { orders: true } },
    },
  })
}

export default async function CustomerDetailPage({ params }: { params: { id: string } }) {
  const customer = await getCustomer(params.id)
  if (!customer) notFound()

  const totalSpent = customer.orders.reduce((s, o) => s + o.total, 0)
  const orderCount = customer.orders.length
  const avgBasket = orderCount > 0 ? totalSpent / orderCount : 0
  const lastOrder = customer.orders[0]
  const firstOrder = customer.orders[orderCount - 1]
  const daysSinceLast = lastOrder
    ? Math.floor((Date.now() - new Date(lastOrder.createdAt).getTime()) / 86400000)
    : null

  // Favori ürünler
  const productFreq: Record<string, { name: string; count: number; image: string }> = {}
  customer.orders.forEach((order) => {
    order.items.forEach((item) => {
      if (!productFreq[item.productId]) {
        const images = JSON.parse(item.product.images || '[]')
        productFreq[item.productId] = { name: item.product.name, count: 0, image: images[0] || '' }
      }
      productFreq[item.productId].count += item.quantity
    })
  })
  const topProducts = Object.values(productFreq).sort((a, b) => b.count - a.count).slice(0, 5)

  // Aylık harcama
  const monthlySpend: Record<string, number> = {}
  customer.orders.forEach((order) => {
    const key = new Date(order.createdAt).toLocaleDateString('tr-TR', { month: 'short', year: 'numeric' })
    monthlySpend[key] = (monthlySpend[key] || 0) + order.total
  })

  const statusColors: Record<string, string> = {
    PENDING: 'warning',
    CONFIRMED: 'info',
    PROCESSING: 'info',
    SHIPPED: 'info',
    DELIVERED: 'success',
    CANCELLED: 'danger',
    REFUNDED: 'danger',
  }

  const statusLabels: Record<string, string> = {
    PENDING: 'Bekliyor',
    CONFIRMED: 'Onaylandı',
    PROCESSING: 'Hazırlanıyor',
    SHIPPED: 'Kargoda',
    DELIVERED: 'Teslim Edildi',
    CANCELLED: 'İptal',
    REFUNDED: 'İade',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/musteriler" className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-sage to-sage-dark rounded-full flex items-center justify-center text-white font-bold text-lg">
              {customer.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{customer.name}</h1>
              <p className="text-gray-500 text-sm">{customer.email}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant={customer.emailVerified ? 'success' : 'warning'}>
            {customer.emailVerified ? 'E-posta Onaylı' : 'Onay Bekliyor'}
          </Badge>
          {orderCount > 0 && (
            <Badge variant={daysSinceLast !== null && daysSinceLast <= 90 ? 'success' : 'default'}>
              {daysSinceLast !== null && daysSinceLast <= 90 ? 'Aktif Müşteri' : 'Pasif Müşteri'}
            </Badge>
          )}
        </div>
      </div>

      {/* Özet Kartlar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Toplam Harcama', value: formatPrice(totalSpent), color: 'text-green-600', icon: '💰' },
          { label: 'Sipariş Sayısı', value: orderCount, color: 'text-blue-600', icon: '📦' },
          { label: 'Ort. Sepet', value: formatPrice(avgBasket), color: 'text-gray-900', icon: '🛒' },
          { label: 'Son Sipariş', value: daysSinceLast !== null ? `${daysSinceLast} gün önce` : 'Yok', color: 'text-gray-700', icon: '📅' },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <span>{s.icon}</span>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sol: Müşteri Bilgileri + Favori Ürünler */}
        <div className="space-y-4">
          {/* Müşteri Bilgileri */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Müşteri Bilgileri</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Kayıt Tarihi</span>
                <span className="font-medium">{new Date(customer.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              {firstOrder && (
                <div className="flex justify-between">
                  <span className="text-gray-500">İlk Sipariş</span>
                  <span className="font-medium">{new Date(firstOrder.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
              )}
              {lastOrder && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Son Sipariş</span>
                  <span className="font-medium">{new Date(lastOrder.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
              )}
              {orderCount >= 2 && firstOrder && lastOrder && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Alışveriş Sıklığı</span>
                  <span className="font-medium">
                    ~{Math.round((new Date(firstOrder.createdAt).getTime() - new Date(lastOrder.createdAt).getTime()) / 86400000 / (orderCount - 1))} günde bir
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Favori Ürünler */}
          {topProducts.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h2 className="font-semibold text-gray-900 mb-4">En Çok Aldığı Ürünler</h2>
              <div className="space-y-3">
                {topProducts.map((p, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-5 h-5 flex items-center justify-center text-xs font-bold text-gray-400">{i + 1}</span>
                    {p.image && (
                      <img src={p.image} alt={p.name} className="w-8 h-8 rounded object-cover" />
                    )}
                    <span className="text-sm text-gray-700 flex-1 truncate">{p.name}</span>
                    <span className="text-xs font-semibold text-sage bg-sage/10 px-2 py-0.5 rounded-full">{p.count}x</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Aylık Harcama */}
          {Object.keys(monthlySpend).length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h2 className="font-semibold text-gray-900 mb-4">Aylık Harcama</h2>
              <div className="space-y-2">
                {Object.entries(monthlySpend).slice(0, 6).map(([month, amount]) => (
                  <div key={month} className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">{month}</span>
                    <span className="font-semibold text-green-600">{formatPrice(amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sağ: Sipariş Geçmişi */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Sipariş Geçmişi ({orderCount})</h2>
            {customer.orders.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">Henüz sipariş yok</p>
            ) : (
              <div className="space-y-4">
                {customer.orders.map((order) => (
                  <div key={order.id} className="border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <Link
                          href={`/admin/siparisler`}
                          className="font-semibold text-sage hover:underline text-sm"
                        >
                          #{order.orderNumber}
                        </Link>
                        <p className="text-xs text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant={statusColors[order.status] as any}>{statusLabels[order.status]}</Badge>
                        <p className="font-bold text-green-600 mt-1">{formatPrice(order.total)}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-2 text-xs text-gray-600">
                          {(() => {
                            const imgs = JSON.parse(item.product.images || '[]')
                            return imgs[0] ? <img src={imgs[0]} alt={item.product.name} className="w-6 h-6 rounded object-cover" /> : null
                          })()}
                          <span className="flex-1 truncate">{item.product.name}</span>
                          <span className="text-gray-400">{item.quantity} adet</span>
                          <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                    {order.discount > 0 && (
                      <p className="text-xs text-green-600 mt-2">İndirim: -{formatPrice(order.discount)}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
