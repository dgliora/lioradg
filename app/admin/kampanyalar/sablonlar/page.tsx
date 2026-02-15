'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, Button, Badge } from '@/components/ui'

type CampaignTemplate = {
  id: string
  name: string
  startMonth: number
  startDay: number
  endMonth: number
  endDay: number
  description: string
  recommendedDiscount: number
  tags: string[]
  category: string
}

const categoryColors: Record<string, string> = {
  'resmi-tatil': 'bg-red-100 text-red-800',
  'ozel-gun': 'bg-pink-100 text-pink-800',
  'sezon-kampanyasi': 'bg-blue-100 text-blue-800',
  'ozel-kampanya': 'bg-purple-100 text-purple-800',
  'devam-eden': 'bg-green-100 text-green-800'
}

const categoryNames: Record<string, string> = {
  'resmi-tatil': '📅 Resmi Tatil',
  'ozel-gun': '🎉 Özel Gün',
  'sezon-kampanyasi': '🌤️ Sezon',
  'ozel-kampanya': '🎯 Mega Kampanya',
  'devam-eden': '🔄 Devam Eden'
}

export default function CampaignTemplatesPage() {
  const router = useRouter()
  const [templates, setTemplates] = useState<CampaignTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [activating, setActivating] = useState<string | null>(null)

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/admin/campaign-templates')
      if (response.ok) {
        const data = await response.json()
        setTemplates(data)
      }
    } catch (error) {
      console.error('Şablonlar yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTemplates = selectedCategory === 'all'
    ? templates
    : templates.filter(t => t.category === selectedCategory)

  const categories = Array.from(new Set(templates.map(t => t.category)))

  const handleQuickActivate = async (template: CampaignTemplate) => {
    setActivating(template.id)

    try {
      // Kampanya için başlangıç ve bitiş tarihleri oluştur
      const now = new Date()
      const currentYear = now.getFullYear()
      
      let startDate = new Date(currentYear, template.startMonth - 1, template.startDay)
      let endDate = new Date(currentYear, template.endMonth - 1, template.endDay)
      
      // Eğer geçmiş tarihse, gelecek yıla al
      if (endDate < now) {
        startDate = new Date(currentYear + 1, template.startMonth - 1, template.startDay)
        endDate = new Date(currentYear + 1, template.endMonth - 1, template.endDay)
      }

      const campaignData = {
        title: template.name,
        description: template.description,
        type: 'PERCENTAGE',
        scope: 'ALL',
        value: template.recommendedDiscount,
        code: `${template.id.toUpperCase()}-${currentYear}`,
        minAmount: null,
        maxDiscount: null,
        targetCategories: null,
        targetProducts: null,
        usageLimit: null,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        active: true
      }

      const response = await fetch('/api/admin/campaigns/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campaignData)
      })

      if (response.ok) {
        alert(`✅ ${template.name} kampanyası aktive edildi!`)
        router.push('/admin/kampanyalar')
      } else {
        const error = await response.json()
        alert(error.error || 'Kampanya aktive edilirken hata oluştu')
      }
    } catch (error) {
      alert('Kampanya aktive edilirken hata oluştu')
    } finally {
      setActivating(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Kampanya Şablonları</h1>
          <p className="text-gray-600">Türkiye&apos;nin resmi ve özel gün kampanyaları - Bir tıkla aktive et!</p>
        </div>
        <Link href="/admin/kampanyalar">
          <Button variant="ghost">
            ← Kampanyalara Dön
          </Button>
        </Link>
      </div>

      {/* Kategori Filtresi */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            selectedCategory === 'all'
              ? 'bg-sage text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Tümü ({templates.length})
        </button>
        {categories.map(cat => {
          const count = templates.filter(t => t.category === cat).length
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-sage text-white'
                  : `${categoryColors[cat] || 'bg-gray-100'} hover:opacity-80`
              }`}
            >
              {categoryNames[cat]} ({count})
            </button>
          )
        })}
      </div>

      {/* Şablonlar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map(template => {
          const startDate = new Date(new Date().getFullYear(), template.startMonth - 1, template.startDay)
          const endDate = new Date(new Date().getFullYear(), template.endMonth - 1, template.endDay)
          
          return (
            <Card key={template.id} className="flex flex-col">
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-bold text-gray-900">{template.name}</h3>
                  <Badge variant="default" className={categoryColors[template.category]}>
                    {categoryNames[template.category]}
                  </Badge>
                </div>

                <p className="text-sm text-gray-600">{template.description}</p>

                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-gray-500">Tarihler:</p>
                    <p className="font-medium text-gray-900">
                      {startDate.toLocaleDateString('tr-TR')} - {endDate.toLocaleDateString('tr-TR')}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">Önerilen İndirim:</p>
                    <p className="text-2xl font-bold text-sage">%{template.recommendedDiscount}</p>
                  </div>

                  <div>
                    <p className="text-gray-500 mb-2">Etiketler:</p>
                    <div className="flex flex-wrap gap-1">
                      {template.tags.map(tag => (
                        <Badge key={tag} variant="success">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                <Button
                  onClick={() => handleQuickActivate(template)}
                  disabled={activating === template.id}
                  className="flex-1"
                >
                  {activating === template.id ? 'Aktive Ediliyor...' : '⚡ Aktive Et'}
                </Button>
                <Link href={`/admin/kampanyalar/yeni?template=${template.id}`} className="flex-1">
                  <button className="w-full px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all">
                    ✏️ Özelleştir
                  </button>
                </Link>
              </div>
            </Card>
          )
        })}
      </div>

      {filteredTemplates.length === 0 && (
        <Card className="text-center py-12">
          <p className="text-gray-600">Bu kategoride kampanya şablonu bulunamadı</p>
        </Card>
      )}

      {/* Bilgi */}
      <Card className="bg-blue-50 border-blue-200">
        <div className="flex gap-3">
          <div className="text-2xl">💡</div>
          <div className="text-sm text-blue-900">
            <p className="font-semibold mb-1">Nasıl Kullanılır?</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Aktive Et:</strong> Şablonu otomatik tarihlerle aktive eder</li>
              <li><strong>Özelleştir:</strong> Tarihleri ve indirim oranını değiştirebilirsin</li>
              <li><strong>Not:</strong> Ramazan ve Kurban Bayramı tarihleri her yıl değişir!</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}

