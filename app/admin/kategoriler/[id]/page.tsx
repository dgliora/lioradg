'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, Button, Badge } from '@/components/ui'
import { EmojiPicker } from '@/components/admin/EmojiPicker'

type Category = {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  image: string | null
  order: number
  _count: {
    products: number
  }
}

export default function EditCategoryPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [category, setCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon: '',
    order: 0,
    metaTitle: '',
    metaDescription: '',
  })

  useEffect(() => {
    fetchCategory()
  }, [params.id])

  const fetchCategory = async () => {
    try {
      const response = await fetch(`/api/admin/categories/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setCategory(data)
        setFormData({
          name: data.name,
          slug: data.slug,
          description: data.description || '',
          icon: data.icon || '',
          order: data.order,
          metaTitle: data.metaTitle || '',
          metaDescription: data.metaDescription || '',
        })
      }
    } catch (error) {
      console.error('Kategori yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name) {
      alert('Kategori adı zorunludur')
      return
    }

    setSaving(true)

    try {
      const response = await fetch(`/api/admin/categories/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        router.push('/admin/kategoriler')
      } else {
        const data = await response.json()
        alert(data.error || 'Kategori güncellenirken hata oluştu')
      }
    } catch (error) {
      alert('Kategori güncellenirken hata oluştu')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!category) return

    if (!confirm(`"${category.name}" kategorisini silmek istediğinizden emin misiniz?`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/categories/${params.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        router.push('/admin/kategoriler')
      } else {
        const data = await response.json()
        alert(data.error || 'Kategori silinirken hata oluştu')
      }
    } catch (error) {
      alert('Kategori silinirken hata oluştu')
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

  if (!category) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Kategori bulunamadı</p>
        <Link href="/admin/kategoriler">
          <Button>Kategorilere Dön</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/kategoriler">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kategoriyi Düzenle</h1>
            <p className="text-gray-600 mt-1">
              <Badge variant="default">{category._count.products} ürün</Badge>
            </p>
          </div>
        </div>
        {category._count.products === 0 && (
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all"
          >
            Kategoriyi Sil
          </button>
        )}
      </div>

      {/* Warning */}
      {category._count.products > 0 && (
        <Card className="bg-amber-50 border-amber-200">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="font-medium text-amber-900">Bu kategoride {category._count.products} ürün var</p>
              <p className="text-sm text-amber-700 mt-1">
                Kategoriyi silmek için önce ürünleri başka bir kategoriye taşımanız gerekiyor.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card>
          <div className="space-y-6">
            {/* Kategori Adı */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori Adı <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent"
                placeholder="Örn: Oda Kokuları, Sabunlar, Tonikler..."
                required
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug (URL)
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent"
                placeholder="Boş bırakılırsa otomatik oluşturulur"
              />
              <p className="text-sm text-gray-500 mt-1">
                URL&apos;de görünecek şekilde. Örn: oda-kokuları
              </p>
            </div>

            {/* Açıklama */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Açıklama
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent"
                placeholder="Kategori hakkında kısa bir açıklama..."
              />
            </div>

            {/* Emoji Picker */}
            <EmojiPicker
              value={formData.icon}
              onChange={(emoji) => setFormData({ ...formData, icon: emoji })}
            />

            {/* Sıra */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sıra
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent"
                min="0"
              />
              <p className="text-sm text-gray-500 mt-1">
                Kategorilerin sıralama numarası (küçükten büyüğe)
              </p>
            </div>
          </div>
        </Card>

        {/* SEO */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-1">SEO</h2>
          <p className="text-sm text-gray-500 mb-5">Boş bırakırsanız kategori adı ve açıklaması kullanılır.</p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Meta Başlık <span className="text-gray-400 font-normal">({formData.metaTitle.length}/60)</span>
              </label>
              <input
                type="text"
                value={formData.metaTitle}
                onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value.slice(0, 60) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent"
                placeholder="Arama sonuçlarında görünecek başlık"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Meta Açıklama <span className="text-gray-400 font-normal">({formData.metaDescription.length}/160)</span>
              </label>
              <textarea
                value={formData.metaDescription}
                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value.slice(0, 160) })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent resize-none"
                placeholder="Arama sonuçlarında görünecek açıklama"
              />
            </div>
            {(formData.metaTitle || formData.name) && (
              <div className="p-3 bg-white border border-gray-200 rounded-lg text-sm">
                <p className="text-[#1a0dab] font-medium truncate">{formData.metaTitle || formData.name} - Lioradg</p>
                <p className="text-[#006621] text-xs">lioradg.com.tr/kategori/{formData.slug}</p>
                <p className="text-gray-600 text-xs mt-0.5 line-clamp-2">{formData.metaDescription || formData.description || 'Açıklama girilmedi'}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Butonlar */}
        <div className="flex gap-4 mt-6">
          <Button
            type="submit"
            disabled={saving}
            className="flex-1"
          >
            {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
          </Button>
          <Link href="/admin/kategoriler" className="flex-1">
            <button
              type="button"
              className="w-full px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
            >
              İptal
            </button>
          </Link>
        </div>
      </form>
    </div>
  )
}

