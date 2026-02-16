import { Card } from '@/components/ui'
import { getAnalyticsData } from '@/lib/services/analytics'

export const dynamic = 'force-dynamic'

export default async function AdminAnalitikPage() {
  const data = await getAnalyticsData()
  const hasData = data.totalVisitors > 0 || data.totalSessions > 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Google Analitik</h1>
        <p className="text-gray-500">Ziyaretçi ve oturum verileri (GA4).</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="text-center">
          <div className="text-3xl mb-2">👁️</div>
          <p className="text-sm text-gray-500">Toplam Ziyaretçi</p>
          <p className="text-2xl font-bold text-gray-900">{data.totalVisitors.toLocaleString('tr-TR')}</p>
          <p className="text-xs text-gray-400">Son 30 gün</p>
        </Card>
        <Card className="text-center">
          <div className="text-3xl mb-2">📈</div>
          <p className="text-sm text-gray-500">Son 7 Gün Ziyaretçi</p>
          <p className="text-2xl font-bold text-gray-900">{data.last7DaysVisitors.toLocaleString('tr-TR')}</p>
        </Card>
        <Card className="text-center">
          <div className="text-3xl mb-2">🔄</div>
          <p className="text-sm text-gray-500">Oturum Sayısı</p>
          <p className="text-2xl font-bold text-gray-900">{data.totalSessions.toLocaleString('tr-TR')}</p>
          <p className="text-xs text-gray-400">Son 30 gün</p>
        </Card>
      </div>

      <Card className="border-2 border-dashed border-gray-200 bg-gray-50/50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Google Analytics&apos;te tam rapor</h2>
            <p className="text-sm text-gray-500">
              Demografik, cihaz, sayfa performansı ve daha fazlası için Google Analytics&apos;i ayrı sekmede açın.
            </p>
          </div>
          <a
            href="https://analytics.google.com/analytics/web/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 bg-[#E37400] hover:bg-[#d46900] text-white font-medium rounded-lg transition-colors shrink-0"
          >
            <span>Google Analytics&apos;i Aç</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </Card>

      {!hasData && (
        <Card className="border-amber-200 bg-amber-50/50">
          <p className="text-sm text-amber-800">
            <strong>Veri görünmüyorsa</strong> Vercel / .env içinde <code className="bg-amber-100 px-1 rounded">GA_PROPERTY_ID</code>,{' '}
            <code className="bg-amber-100 px-1 rounded">GOOGLE_SERVICE_ACCOUNT_EMAIL</code> ve{' '}
            <code className="bg-amber-100 px-1 rounded">GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY</code> tanımlı olmalı.
            GA4&apos;te Data API açık ve service account property&apos;ye Viewer eklenmiş olmalı.
          </p>
        </Card>
      )}
    </div>
  )
}
