'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui'

interface Subscriber {
  id: string
  email: string
  name: string | null
  active: boolean
  source: string | null
  createdAt: string
}

interface Stats {
  total: number
  active: number
  thisMonth: number
}

export default function NewsletterAdminPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, active: 0, thisMonth: 0 })
  const [search, setSearch] = useState('')
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'passive'>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/newsletter')
    if (res.ok) {
      const data = await res.json()
      setSubscribers(data.subscribers)
      setStats(data.stats)
    }
    setLoading(false)
  }

  const toggleActive = async (id: string, active: boolean) => {
    await fetch('/api/admin/newsletter', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, active: !active }),
    })
    setSubscribers((prev) => prev.map((s) => s.id === id ? { ...s, active: !active } : s))
    setStats((prev) => ({
      ...prev,
      active: !active ? prev.active + 1 : prev.active - 1,
    }))
  }

  const deleteSubscriber = async (id: string) => {
    if (!confirm('Bu aboneyi silmek istediğinize emin misiniz?')) return
    await fetch('/api/admin/newsletter', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setSubscribers((prev) => prev.filter((s) => s.id !== id))
    fetchData()
  }

  const exportCSV = () => {
    const rows = [
      ['E-posta', 'Ad', 'Durum', 'Kaynak', 'Tarih'],
      ...filtered.map((s) => [
        s.email,
        s.name || '',
        s.active ? 'Aktif' : 'Pasif',
        s.source || 'website',
        new Date(s.createdAt).toLocaleDateString('tr-TR'),
      ]),
    ]
    const csv = 'sep=;\n\uFEFF' + rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(';')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `newsletter-aboneleri-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const filtered = subscribers.filter((s) => {
    const matchSearch = s.email.toLowerCase().includes(search.toLowerCase()) ||
      (s.name || '').toLowerCase().includes(search.toLowerCase())
    const matchActive = filterActive === 'all' ||
      (filterActive === 'active' && s.active) ||
      (filterActive === 'passive' && !s.active)
    return matchSearch && matchActive
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">E-Bülten Aboneleri</h1>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Excel İndir
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Toplam Abone', value: stats.total, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Aktif Abone', value: stats.active, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Bu Ay Yeni', value: stats.thisMonth, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((s) => (
          <Card key={s.label} padding="lg">
            <div className={`inline-flex items-center justify-center w-10 h-10 ${s.bg} rounded-lg mb-3`}>
              <svg className={`w-5 h-5 ${s.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="E-posta veya isim ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            {([['all', 'Tümü'], ['active', 'Aktif'], ['passive', 'Pasif']] as const).map(([val, label]) => (
              <button
                key={val}
                onClick={() => setFilterActive(val)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterActive === val ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card padding="none">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Yükleniyor...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Abone bulunamadı.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">E-posta</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ad</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kaynak</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarih</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{s.email}</td>
                    <td className="px-6 py-4 text-gray-600">{s.name || '—'}</td>
                    <td className="px-6 py-4 text-gray-500 capitalize">{s.source || 'website'}</td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(s.createdAt).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        s.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {s.active ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleActive(s.id, s.active)}
                          className={`text-xs px-3 py-1 rounded-lg font-medium transition-colors ${
                            s.active
                              ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {s.active ? 'Pasife Al' : 'Aktif Et'}
                        </button>
                        <button
                          onClick={() => deleteSubscriber(s.id)}
                          className="text-xs px-3 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 font-medium"
                        >
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-6 py-3 border-t border-gray-100 text-xs text-gray-500">
              {filtered.length} abone gösteriliyor (toplam {stats.total})
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
