import { Card } from '@/components/ui'
import { formatPrice } from '@/lib/utils'
import { getDashboardData } from '@/lib/dashboardStats'
import { RevenueAreaChart, OrderBarChart } from '@/components/admin/DashboardCharts'
import { AbandonedCartTable } from '@/components/admin/AbandonedCartTable'

export const dynamic = 'force-dynamic'

const STATUS_LABELS: Record<string, { label: string; color: string; bgColor: string; badge: string }> = {
  PENDING: { label: 'Bekliyor', color: 'text-yellow-700', bgColor: 'bg-yellow-500', badge: 'bg-yellow-100 text-yellow-800' },
  CONFIRMED: { label: 'Onaylandı', color: 'text-blue-700', bgColor: 'bg-blue-500', badge: 'bg-blue-100 text-blue-800' },
  PROCESSING: { label: 'Hazırlanıyor', color: 'text-purple-700', bgColor: 'bg-purple-500', badge: 'bg-purple-100 text-purple-800' },
  SHIPPED: { label: 'Kargoda', color: 'text-indigo-700', bgColor: 'bg-indigo-500', badge: 'bg-indigo-100 text-indigo-800' },
  DELIVERED: { label: 'Teslim Edildi', color: 'text-green-700', bgColor: 'bg-green-500', badge: 'bg-green-100 text-green-800' },
  CANCELLED: { label: 'İptal', color: 'text-red-700', bgColor: 'bg-red-500', badge: 'bg-red-100 text-red-800' },
  REFUNDED: { label: 'İade', color: 'text-gray-700', bgColor: 'bg-gray-500', badge: 'bg-gray-100 text-gray-800' },
}

export default async function AdminDashboard() {
  const data = await getDashboardData()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Dashboard</h1>
        <p className="text-gray-500">Hoş geldiniz! İşte güncel genel bakış.</p>
      </div>

      {/* ═══════════ 1) Günlük Özet Kartları ═══════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <SummaryCard icon={<TrendUpIcon />} iconBg="bg-emerald-100" iconColor="text-emerald-600" label="Bugünkü Ciro" value={formatPrice(data.daily.todayRevenue)} sub="Sadece ödenen siparişler" />
        <SummaryCard icon={<CartIcon />} iconBg="bg-blue-100" iconColor="text-blue-600" label="Bugünkü Sipariş" value={String(data.daily.todayOrderCount)} sub="Tüm siparişler" />
        <SummaryCard icon={<CheckCircleIcon />} iconBg="bg-green-100" iconColor="text-green-600" label="Başarılı Ödeme" value={String(data.daily.paidOrderCount)} sub="Onaylı + tamamlanan" />
        <SummaryCard icon={<XCircleIcon />} iconBg="bg-red-100" iconColor="text-red-600" label="Başarısız Ödeme" value={String(data.daily.failedOrderCount)} sub="İptal + iade" />
      </div>

      {/* ═══════════ Genel İstatistikler ═══════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard icon="📦" title="Toplam Ürün" value={data.totalProducts} gradient="from-blue-500 to-blue-600" />
        <StatCard icon="🛒" title="Toplam Sipariş" value={data.totalOrders} gradient="from-green-500 to-green-600" />
        <StatCard icon="👥" title="Toplam Müşteri" value={data.totalUsers} gradient="from-purple-500 to-purple-600" />
        <StatCard icon="⏳" title="Bekleyen Sipariş" value={data.pendingOrders} gradient="from-orange-500 to-orange-600" />
      </div>

      {/* ═══════════ Ciro + Ort. Sepet + Kar ═══════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card>
          <p className="text-sm text-gray-500 mb-1">Toplam Gelir</p>
          <p className="text-3xl font-bold text-emerald-600">{formatPrice(data.totalRevenue)}</p>
          <p className="text-xs text-gray-400 mt-1">Onaylı siparişler toplamı</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500 mb-1">Ort. Sepet Tutarı</p>
          <p className="text-3xl font-bold text-indigo-600">{formatPrice(data.averageCartValue)}</p>
          <p className="text-xs text-gray-400 mt-1">Paid sipariş ortalaması</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500 mb-1">Toplam Net Kar</p>
          <p className={`text-3xl font-bold ${data.profitability.summary.totalNetProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {formatPrice(data.profitability.summary.totalNetProfit)}
          </p>
          <p className="text-xs text-gray-400 mt-1">iyzico komisyon dahil</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500 mb-1">Ort. Kar Marjı</p>
          <p className={`text-3xl font-bold ${data.profitability.summary.averageProfitMargin >= 0 ? 'text-teal-600' : 'text-red-600'}`}>
            %{data.profitability.summary.averageProfitMargin.toFixed(1)}
          </p>
          <p className="text-xs text-gray-400 mt-1">iyzico: {formatPrice(data.profitability.summary.iyzicoTotalCommission)}</p>
        </Card>
      </div>

      {/* ═══════════ Google Analytics ═══════════ */}
      {(data.analytics.totalVisitors > 0 || data.analytics.totalSessions > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <Card className="text-center">
            <div className="text-3xl mb-2">👁️</div>
            <p className="text-sm text-gray-500">Toplam Ziyaretçi</p>
            <p className="text-2xl font-bold text-gray-900">{data.analytics.totalVisitors.toLocaleString('tr-TR')}</p>
            <p className="text-xs text-gray-400">Son 30 gün</p>
          </Card>
          <Card className="text-center">
            <div className="text-3xl mb-2">📈</div>
            <p className="text-sm text-gray-500">Son 7 Gün Ziyaretçi</p>
            <p className="text-2xl font-bold text-gray-900">{data.analytics.last7DaysVisitors.toLocaleString('tr-TR')}</p>
          </Card>
          <Card className="text-center">
            <div className="text-3xl mb-2">🔄</div>
            <p className="text-sm text-gray-500">Oturum Sayısı</p>
            <p className="text-2xl font-bold text-gray-900">{data.analytics.totalSessions.toLocaleString('tr-TR')}</p>
            <p className="text-xs text-gray-400">Son 30 gün</p>
          </Card>
        </div>
      )}

      {/* ═══════════ 2) Satış Grafikleri ═══════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Son 7 Gün — Ciro</h2>
          {data.revenueChart.some((d) => d.revenue > 0) ? (
            <RevenueAreaChart data={data.revenueChart} />
          ) : (
            <EmptyChartPlaceholder />
          )}
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Son 7 Gün — Sipariş Sayısı</h2>
          {data.revenueChart.some((d) => d.orderCount > 0) ? (
            <OrderBarChart data={data.revenueChart} />
          ) : (
            <EmptyChartPlaceholder />
          )}
        </Card>
      </div>

      {/* ═══════════ 3) En Çok Satan + En Karlı ═══════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* En Çok Satan */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-5">En Çok Satan 5 Ürün</h2>
          {data.topProducts.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">Henüz satış verisi yok</p>
          ) : (
            <div className="space-y-4">
              {data.topProducts.map((item, i) => {
                const maxQty = data.topProducts[0].totalQuantity || 1
                return (
                  <div key={item.productId} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">{i + 1}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.productName}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                        <span>{item.totalQuantity} adet</span>
                        <span className="font-semibold text-emerald-600">{formatPrice(item.totalRevenue)}</span>
                      </div>
                    </div>
                    <div className="w-24 bg-gray-100 rounded-full h-2 flex-shrink-0">
                      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all" style={{ width: `${(item.totalQuantity / maxQty) * 100}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Card>

        {/* En Karlı 5 Ürün */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-5">En Karlı 5 Ürün</h2>
          {data.profitability.topProfitable.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">Henüz karlılık verisi yok</p>
          ) : (
            <div className="space-y-4">
              {data.profitability.topProfitable.map((item, i) => {
                const maxProfit = data.profitability.topProfitable[0].netProfit || 1
                return (
                  <div key={item.productId} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">{i + 1}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.productName}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                        <span className="font-semibold text-emerald-600">{formatPrice(item.netProfit)} kar</span>
                        <span>%{item.profitMargin.toFixed(0)} marj</span>
                      </div>
                    </div>
                    <div className="w-24 bg-gray-100 rounded-full h-2 flex-shrink-0">
                      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all" style={{ width: `${Math.max((item.netProfit / maxProfit) * 100, 5)}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Card>
      </div>

      {/* ═══════════ 4) Stok Uyarıları + Terk Edilen Sepetler ═══════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Stok Uyarıları */}
        <Card className={data.stockAlert.outOfStock > 0 ? 'border-red-200 bg-red-50/30' : ''}>
          <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
            <span className="text-xl">⚠️</span> Stok Uyarıları
          </h2>
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-red-600">{data.stockAlert.outOfStock}</p>
              <p className="text-xs text-red-500 mt-1">Stokta Yok</p>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-amber-600">{data.stockAlert.lowStock}</p>
              <p className="text-xs text-amber-500 mt-1">5&apos;in Altında</p>
            </div>
          </div>
          {data.stockAlert.lowStockProducts.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Kritik Ürünler</p>
              {data.stockAlert.lowStockProducts.map((p) => (
                <div key={p.id} className="flex items-center justify-between text-sm py-1.5 border-b border-gray-100 last:border-0">
                  <span className="text-gray-700 truncate max-w-[200px]">{p.name}</span>
                  <span className={`font-bold ${p.stock === 0 ? 'text-red-600' : 'text-amber-600'}`}>
                    {p.stock === 0 ? 'Tükendi' : `${p.stock} adet`}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-green-600 text-center py-4">Tüm stoklar yeterli seviyede</p>
          )}
        </Card>

        {/* Terk Edilen Sepetler Özet */}
        <Card className={data.abandonedCarts.abandonedLast24h > 0 ? 'border-orange-200 bg-orange-50/20' : ''}>
          <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
            <span className="text-xl">🛒</span> Terk Edilen Sepetler
          </h2>
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-orange-600">{data.abandonedCarts.abandonedLast24h}</p>
              <p className="text-xs text-orange-500 mt-1">Son 24 Saat</p>
            </div>
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-red-600">{formatPrice(data.abandonedCarts.abandonedPotentialRevenue)}</p>
              <p className="text-xs text-red-500 mt-1">Potansiyel Kayıp</p>
            </div>
          </div>
          {data.abandonedCarts.abandonedCarts.length > 0 && (
            <p className="text-xs text-gray-400">Detay için aşağıdaki tabloya bakın</p>
          )}
        </Card>
      </div>

      {/* ═══════════ Sipariş Durumları ═══════════ */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-5">Sipariş Durumları</h2>
        {data.ordersByStatus.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">Henüz sipariş yok</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.ordersByStatus.map((item) => {
              const config = STATUS_LABELS[item.status] || { label: item.status, color: 'text-gray-700', bgColor: 'bg-gray-500' }
              const pct = data.totalOrders > 0 ? (item.count / data.totalOrders) * 100 : 0
              return (
                <div key={item.status} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-medium ${config.color}`}>{config.label}</span>
                    <span className="text-sm font-bold text-gray-900">{item.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`${config.bgColor} h-2 rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{pct.toFixed(0)}%</p>
                </div>
              )
            })}
          </div>
        )}
      </Card>

      {/* ═══════════ 6) Son 5 Sipariş ═══════════ */}
      <Card>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900">Son 5 Sipariş</h2>
          <a href="/admin/siparisler" className="text-sm text-indigo-600 hover:underline font-medium">Tümünü Gör →</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 text-left text-xs text-gray-500 uppercase tracking-wider">
                <th className="pb-3 font-medium">Sipariş No</th>
                <th className="pb-3 font-medium">Müşteri</th>
                <th className="pb-3 font-medium">Toplam</th>
                <th className="pb-3 font-medium">Durum</th>
                <th className="pb-3 font-medium">Tarih</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {data.recentOrders.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center text-gray-400">Henüz sipariş bulunmuyor</td></tr>
              ) : (
                data.recentOrders.map((order) => {
                  const config = STATUS_LABELS[order.status] || { label: order.status, badge: 'bg-gray-100 text-gray-800' }
                  return (
                    <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                      <td className="py-3.5 font-semibold text-gray-900">#{order.orderNumber}</td>
                      <td className="py-3.5">
                        <p className="font-medium text-gray-800">{order.customerName}</p>
                        <p className="text-xs text-gray-400">{order.customerEmail}</p>
                      </td>
                      <td className="py-3.5 font-semibold">{formatPrice(order.total)}</td>
                      <td className="py-3.5">
                        <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${config.badge}`}>{config.label}</span>
                      </td>
                      <td className="py-3.5 text-gray-500">{new Date(order.createdAt).toLocaleDateString('tr-TR')}</td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ═══════════ 5) Terk Edilen Sepet Tablosu + Hatırlat Butonu ═══════════ */}
      {data.abandonedCarts.abandonedCarts.length > 0 && (
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-5">📧 Terk Edilen Sepetler — Hatırlatma</h2>
          <AbandonedCartTable carts={data.abandonedCarts.abandonedCarts} />
        </Card>
      )}

      {/* ═══════════ Aktif Kampanyalar ═══════════ */}
      <Card>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900">🎁 Aktif Kampanyalar</h2>
        </div>
        {data.activeCampaigns.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">Şu an aktif kampanya bulunmuyor</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {data.activeCampaigns.map((c) => (
              <div key={c.id} className="py-4 flex items-center justify-between hover:bg-gray-50/50 transition rounded-lg px-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{c.title}</h3>
                  {c.description && <p className="text-sm text-gray-500 mt-0.5">{c.description}</p>}
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <div className="text-lg font-bold text-emerald-600">
                    {c.type === 'PERCENTAGE' && `%${c.value}`}
                    {c.type === 'FIXED' && `${c.value} TL`}
                    {c.type === 'FREE_SHIPPING' && 'Ücretsiz Kargo'}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(c.startDate).toLocaleDateString('tr-TR')} – {new Date(c.endDate).toLocaleDateString('tr-TR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

/* ═══════════ Alt Bileşenler ═══════════ */

function SummaryCard({ icon, iconBg, iconColor, label, value, sub }: {
  icon: React.ReactNode; iconBg: string; iconColor: string; label: string; value: string; sub: string
}) {
  return (
    <Card padding="lg">
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0 ${iconColor}`}>{icon}</div>
        <div className="min-w-0">
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
          <p className="text-xs text-gray-400 mt-1">{sub}</p>
        </div>
      </div>
    </Card>
  )
}

function StatCard({ icon, title, value, gradient }: { icon: string; title: string; value: number; gradient: string }) {
  return (
    <Card padding="lg" className="relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-10 rounded-full -mr-16 -mt-16`} />
      <div className="relative">
        <div className="text-3xl mb-2">{icon}</div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
    </Card>
  )
}

function EmptyChartPlaceholder() {
  return (
    <div className="h-[300px] flex items-center justify-center text-gray-400 text-sm">
      <div className="text-center">
        <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Henüz grafik verisi yok
      </div>
    </div>
  )
}

/* ═══════════ SVG İkonlar ═══════════ */

function TrendUpIcon() {
  return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
}
function CartIcon() {
  return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
}
function CheckCircleIcon() {
  return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
}
function XCircleIcon() {
  return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
}
