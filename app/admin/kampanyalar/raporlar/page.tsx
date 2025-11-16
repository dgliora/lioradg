'use client'

import { useState, useEffect } from 'react'
import { Card, Badge } from '@/components/ui'
import Link from 'next/link'

interface CampaignStats {
  campaignId: string
  title: string
  productsCount: number
  usageCount: number
  usageLimit: number | null
  active: boolean
  type: string
  value: number
}

export default function CampaignReportsPage() {
  const [stats, setStats] = useState<CampaignStats[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/campaigns/stats')
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Raporlar yüklenirken hata:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Kampanya Raporları</h1>
        <Card>Yükleniyor...</Card>
      </div>
    )
  }

  const totalCampaigns = stats.length
  const activeCampaigns = stats.filter(s => s.active).length
  const totalProductsAffected = stats.reduce((acc, s) => acc + s.productsCount, 0)
  const totalUsage = stats.reduce((acc, s) => acc + s.usageCount, 0)

  // En çok kullanılan kampanyalar
  const topUsedCampaigns = [...stats].sort((a, b) => b.usageCount - a.usageCount).slice(0, 5)

  // En çok ürüne uygulanan kampanyalar
  const topProductsCampaigns = [...stats].sort((a, b) => b.productsCount - a.productsCount).slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Kampanya Raporları</h1>
          <p className="text-gray-600">Tüm kampanya performans verileriniz</p>
        </div>
        <Link href="/admin/kampanyalar">
          <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg transition">
            Geri Dön
          </button>
        </Link>
      </div>

      {/* Özet Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="p-6">
            <p className="text-gray-600 text-sm font-medium mb-2">Toplam Kampanya</p>
            <p className="text-3xl font-bold text-gray-900">{totalCampaigns}</p>
            <p className="text-xs text-green-600 mt-2">
              {activeCampaigns} aktif
            </p>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <p className="text-gray-600 text-sm font-medium mb-2">Etkilenen Ürünler</p>
            <p className="text-3xl font-bold text-gray-900">{totalProductsAffected}</p>
            <p className="text-xs text-gray-500 mt-2">
              Toplam ürünler
            </p>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <p className="text-gray-600 text-sm font-medium mb-2">Kupon Kullanımı</p>
            <p className="text-3xl font-bold text-gray-900">{totalUsage}</p>
            <p className="text-xs text-gray-500 mt-2">
              Toplam kullanım
            </p>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <p className="text-gray-600 text-sm font-medium mb-2">Ortalama Kullanım</p>
            <p className="text-3xl font-bold text-gray-900">
              {totalCampaigns > 0 ? (totalUsage / totalCampaigns).toFixed(1) : '0'}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Per kampanya
            </p>
          </div>
        </Card>
      </div>

      {/* En Çok Kullanılan Kampanyalar */}
      <Card>
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">🏆 En Çok Kullanılan Kampanyalar</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-left text-sm text-gray-600">
                <th className="px-6 py-4 font-medium">Kampanya</th>
                <th className="px-6 py-4 font-medium">Tip</th>
                <th className="px-6 py-4 font-medium">İndirim</th>
                <th className="px-6 py-4 font-medium">Kupon Kullanımı</th>
                <th className="px-6 py-4 font-medium">Sınır</th>
                <th className="px-6 py-4 font-medium">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {topUsedCampaigns.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Veri bulunamadı
                  </td>
                </tr>
              ) : (
                topUsedCampaigns.map((stat) => (
                  <tr key={stat.campaignId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{stat.title}</td>
                    <td className="px-6 py-4">
                      <Badge>
                        {stat.type === 'PERCENTAGE' && 'Yüzde'}
                        {stat.type === 'FIXED' && 'Sabit'}
                        {stat.type === 'FREE_SHIPPING' && 'Kargo'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      {stat.type === 'PERCENTAGE' && `%${stat.value}`}
                      {stat.type === 'FIXED' && `${stat.value} TL`}
                      {stat.type === 'FREE_SHIPPING' && '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-lg font-bold text-green-600">{stat.usageCount}</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {stat.usageLimit ? `${stat.usageCount} / ${stat.usageLimit}` : 'Sınırsız'}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={stat.active ? 'success' : 'default'}>
                        {stat.active ? 'Aktif' : 'Pasif'}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* En Çok Ürüne Uygulanan Kampanyalar */}
      <Card>
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">📦 En Çok Ürüne Uygulanan Kampanyalar</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-left text-sm text-gray-600">
                <th className="px-6 py-4 font-medium">Kampanya</th>
                <th className="px-6 py-4 font-medium">Tip</th>
                <th className="px-6 py-4 font-medium">İndirim</th>
                <th className="px-6 py-4 font-medium">Etkilenen Ürünler</th>
                <th className="px-6 py-4 font-medium">Kullanım</th>
                <th className="px-6 py-4 font-medium">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {topProductsCampaigns.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Veri bulunamadı
                  </td>
                </tr>
              ) : (
                topProductsCampaigns.map((stat) => (
                  <tr key={stat.campaignId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{stat.title}</td>
                    <td className="px-6 py-4">
                      <Badge>
                        {stat.type === 'PERCENTAGE' && 'Yüzde'}
                        {stat.type === 'FIXED' && 'Sabit'}
                        {stat.type === 'FREE_SHIPPING' && 'Kargo'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      {stat.type === 'PERCENTAGE' && `%${stat.value}`}
                      {stat.type === 'FIXED' && `${stat.value} TL`}
                      {stat.type === 'FREE_SHIPPING' && '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-lg font-bold text-blue-600">{stat.productsCount}</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {stat.usageCount} kez
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={stat.active ? 'success' : 'default'}>
                        {stat.active ? 'Aktif' : 'Pasif'}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Tüm Kampanyalar */}
      <Card>
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">📋 Tüm Kampanyalar</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-left text-sm text-gray-600">
                <th className="px-6 py-4 font-medium">Kampanya</th>
                <th className="px-6 py-4 font-medium">Tip</th>
                <th className="px-6 py-4 font-medium">İndirim</th>
                <th className="px-6 py-4 font-medium">Ürün Sayısı</th>
                <th className="px-6 py-4 font-medium">Kupon Kullanımı</th>
                <th className="px-6 py-4 font-medium">Sınır</th>
                <th className="px-6 py-4 font-medium">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stats.map((stat) => (
                <tr key={stat.campaignId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{stat.title}</td>
                  <td className="px-6 py-4">
                    <Badge>
                      {stat.type === 'PERCENTAGE' && 'Yüzde'}
                      {stat.type === 'FIXED' && 'Sabit'}
                      {stat.type === 'FREE_SHIPPING' && 'Kargo'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 font-semibold">
                    {stat.type === 'PERCENTAGE' && `%${stat.value}`}
                    {stat.type === 'FIXED' && `${stat.value} TL`}
                    {stat.type === 'FREE_SHIPPING' && '-'}
                  </td>
                  <td className="px-6 py-4">{stat.productsCount}</td>
                  <td className="px-6 py-4">{stat.usageCount}</td>
                  <td className="px-6 py-4 text-sm">
                    {stat.usageLimit ? `${stat.usageCount} / ${stat.usageLimit}` : 'Sınırsız'}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={stat.active ? 'success' : 'default'}>
                      {stat.active ? 'Aktif' : 'Pasif'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

