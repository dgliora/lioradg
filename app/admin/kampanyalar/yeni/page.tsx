'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, Button } from '@/components/ui'

type Category = {
  id: string
  name: string
  icon: string | null
}

type Product = {
  id: string
  name: string
  price: number
}

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
}

export default function NewCampaignPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="animate-spin w-8 h-8 border-2 border-sage border-t-transparent rounded-full" /></div>}>
      <NewCampaignContent />
    </Suspense>
  )
}

function NewCampaignContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const templateId = searchParams.get('template')
  
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [productSearch, setProductSearch] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'PERCENTAGE',
    scope: 'ALL',
    value: '',
    code: '',
    minAmount: '',
    maxDiscount: '',
    targetCategories: [] as string[],
    targetProducts: [] as string[],
    usageLimit: '',
    startDate: '',
    endDate: '',
    active: true
  })

  useEffect(() => {
    fetchCategories()
    fetchProducts()
    if (templateId) {
      loadTemplateData(templateId)
    }
  }, [templateId])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Kategoriler yüklenirken hata:', error)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
      } else {
        console.error('API hatası:', response.status)
      }
    } catch (error) {
      console.error('Ürünler yüklenirken hata:', error)
    }
  }

  const loadTemplateData = async (id: string) => {
    try {
      const response = await fetch('/api/admin/campaign-templates')
      if (response.ok) {
        const templates: CampaignTemplate[] = await response.json()
        const template = templates.find(t => t.id === id)
        
        if (template) {
          const now = new Date()
          const currentYear = now.getFullYear()
          
          let startDate = new Date(currentYear, template.startMonth - 1, template.startDay)
          let endDate = new Date(currentYear, template.endMonth - 1, template.endDay)
          
          if (endDate < now) {
            startDate = new Date(currentYear + 1, template.startMonth - 1, template.startDay)
            endDate = new Date(currentYear + 1, template.endMonth - 1, template.endDay)
          }

          setFormData(prev => ({
            ...prev,
            title: template.name,
            description: template.description,
            value: template.recommendedDiscount.toString(),
            startDate: startDate.toISOString().slice(0, 16),
            endDate: endDate.toISOString().slice(0, 16),
          }))
        }
      }
    } catch (error) {
      console.error('Şablon yüklenirken hata:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validasyon
    const missingFields = []
    if (!formData.title) missingFields.push('Kampanya Adı')
    if (formData.type !== 'FREE_SHIPPING' && !formData.value) missingFields.push('İndirim Değeri')
    if (!formData.startDate) missingFields.push('Başlangıç Tarihi')
    if (!formData.endDate) missingFields.push('Bitiş Tarihi')
    if (formData.scope === 'CATEGORY' && formData.targetCategories.length === 0) missingFields.push('Kategori Seçimi')
    if (formData.scope === 'PRODUCT' && formData.targetProducts.length === 0) missingFields.push('Ürün Seçimi')
    if (formData.scope === 'CART' && !formData.minAmount) missingFields.push('Minimum Sepet Tutarı')

    if (missingFields.length > 0) {
      alert(`Lütfen aşağıdaki alanları doldurun:\n\n${missingFields.map(field => `- ${field}`).join('\n')}`)
      return
    }

    setLoading(true)

    try {
      const payload = {
        ...formData,
        // datetime-local değerini UTC ISO'ya çevir (tarayıcı yerel saatini kullanır)
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        targetCategories: formData.targetCategories.length > 0 
          ? JSON.stringify(formData.targetCategories) 
          : null,
        targetProducts: formData.targetProducts.length > 0 
          ? JSON.stringify(formData.targetProducts) 
          : null,
      }

      const response = await fetch('/api/admin/campaigns/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        router.push('/admin/kampanyalar')
      } else {
        const data = await response.json()
        alert(data.error || 'Kampanya oluşturulurken hata oluştu')
      }
    } catch (error) {
      alert('Kampanya oluşturulurken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const toggleCategory = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      targetCategories: prev.targetCategories.includes(categoryId)
        ? prev.targetCategories.filter(id => id !== categoryId)
        : [...prev.targetCategories, categoryId]
    }))
  }

  const toggleProduct = (productId: string) => {
    setFormData(prev => ({
      ...prev,
      targetProducts: prev.targetProducts.includes(productId)
        ? prev.targetProducts.filter(id => id !== productId)
        : [...prev.targetProducts, productId]
    }))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/kampanyalar">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {templateId ? '🎁 Şablondan Kampanya' : 'Yeni Kampanya Ekle'}
          </h1>
          <p className="text-gray-600 mt-1">
            {templateId ? 'Şablondaki bilgiler önceden doldurulmuştur' : 'Yeni bir kampanya ve indirim kodu oluşturun'}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Temel Bilgiler */}
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Temel Bilgiler</h2>
            <div className="space-y-4">
              {/* Kampanya Adı */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kampanya Adı <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent"
                  placeholder="Örn: Yaz İndirimi, Kış Kampanyası"
                  required
                />
              </div>

              {/* Açıklama */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Açıklama
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent"
                  placeholder="Kampanya hakkında açıklama..."
                />
              </div>

              {/* Kupon Kodu */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kupon Kodu (Opsiyonel)
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent uppercase"
                  placeholder="Örn: YAZ2024, INDIRIM50"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Boş bırakırsanız otomatik indirim uygulanır. Kupon kodu girerseniz müşteri bunu girmek zorunda kalır.
                </p>
              </div>
            </div>
          </Card>

          {/* İndirim Ayarları */}
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-6">İndirim Ayarları</h2>
            <div className="space-y-4">
              {/* İndirim Tipi */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    İndirim Tipi <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent"
                  >
                    <option value="PERCENTAGE">Yüzde İndirim (%)</option>
                    <option value="FIXED">Sabit İndirim (TL)</option>
                    <option value="FREE_SHIPPING">Ücretsiz Kargo</option>
                  </select>
                </div>

                {/* İndirim Değeri */}
                {formData.type !== 'FREE_SHIPPING' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      İndirim {formData.type === 'PERCENTAGE' ? 'Yüzdesi' : 'Tutarı'} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent"
                      placeholder={formData.type === 'PERCENTAGE' ? '20' : '50'}
                      required
                    />
                  </div>
                )}
              </div>

              {/* Min/Max Tutarlar */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.scope !== 'CART' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Sepet Tutarı (TL)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.minAmount}
                      onChange={(e) => setFormData({ ...formData, minAmount: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent"
                      placeholder="Örn: 500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Kampanyanın geçerli olması için gereken minimum tutar</p>
                  </div>
                )}

                {formData.type === 'PERCENTAGE' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maksimum İndirim Tutarı (TL)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.maxDiscount}
                      onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent"
                      placeholder="Örn: 200"
                    />
                    <p className="text-xs text-gray-500 mt-1">İndirim tutarının üst limiti</p>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Kampanya Kapsamı */}
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Kampanya Kapsamı</h2>
            <div className="space-y-4">
              {/* Kapsam Seçimi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Uygulama Alanı <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.scope}
                  onChange={(e) => setFormData({ ...formData, scope: e.target.value, targetCategories: [], targetProducts: [] })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent"
                >
                  <option value="ALL">Tüm Ürünler</option>
                  <option value="CATEGORY">Belirli Kategoriler</option>
                  <option value="PRODUCT">Belirli Ürünler</option>
                  <option value="CART">Sepet Tutarına Göre</option>
                </select>
              </div>

              {/* Kategori Seçimi */}
              {formData.scope === 'CATEGORY' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Kategoriler Seçin <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {categories.map((category) => (
                      <label
                        key={category.id}
                        className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.targetCategories.includes(category.id)
                            ? 'border-sage bg-sage/5'
                            : 'border-gray-200 hover:border-sage/50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.targetCategories.includes(category.id)}
                          onChange={() => toggleCategory(category.id)}
                          className="w-4 h-4 text-sage focus:ring-sage"
                        />
                        <span className="text-2xl">{category.icon || '🏷️'}</span>
                        <span className="text-sm font-medium text-gray-900">{category.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Ürün Seçimi */}
              {formData.scope === 'PRODUCT' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Ürünler Seçin <span className="text-red-500">*</span>
                  </label>
                  
                  {/* Arama Kutusu */}
                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder="Ürün adı ile ara..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {products.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase())).length} sonuç
                    </p>
                  </div>

                  <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-3 space-y-2">
                    {products
                      .filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()))
                      .map((product) => (
                      <label
                        key={product.id}
                        className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all ${
                          formData.targetProducts.includes(product.id)
                            ? 'border-sage bg-sage/5'
                            : 'border-gray-200 hover:border-sage/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={formData.targetProducts.includes(product.id)}
                            onChange={() => toggleProduct(product.id)}
                            className="w-4 h-4 text-sage focus:ring-sage"
                          />
                          <span className="text-sm font-medium text-gray-900">{product.name}</span>
                        </div>
                        <span className="text-sm text-gray-500">{product.price} TL</span>
                      </label>
                    ))}
                    {products.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase())).length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        Ürün bulunamadı
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Sepet Tutarı Seçimi */}
              {formData.scope === 'CART' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Sepet Tutarı (TL) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.minAmount}
                    onChange={(e) => setFormData({ ...formData, minAmount: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent"
                    placeholder="Örn: 1000"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Kampanyanın uygulanması için sepette olması gereken minimum tutar
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Tarih ve Diğer Ayarlar */}
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Tarih ve Diğer Ayarlar</h2>
            <div className="space-y-4">
              {/* Tarihler */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Başlangıç Tarihi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bitiş Tarihi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Kullanım Limiti */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kullanım Limiti
                </label>
                <input
                  type="number"
                  value={formData.usageLimit}
                  onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent"
                  placeholder="Sınırsız için boş bırakın"
                />
                <p className="text-xs text-gray-500 mt-1">Kampanyanın toplam kaç kere kullanılabileceği</p>
              </div>

              {/* Aktif/Pasif */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4 text-sage focus:ring-sage"
                />
                <label htmlFor="active" className="text-sm font-medium text-gray-700">
                  Kampanyayı hemen aktif et
                </label>
              </div>
            </div>
          </Card>

          {/* Butonlar */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Kaydediliyor...' : 'Kampanyayı Kaydet'}
            </Button>
            <Link href="/admin/kampanyalar" className="flex-1">
              <button
                type="button"
                className="w-full px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
              >
                İptal
              </button>
            </Link>
          </div>
        </div>
      </form>
    </div>
  )
}

