'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, Button } from '@/components/ui'
import { EmojiPicker } from '@/components/admin/EmojiPicker'

export default function NewCategoryPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon: '',
    order: 0,
    metaTitle: '',
    metaDescription: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name) {
      alert('Kategori adı zorunludur')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/admin/categories/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        router.push('/admin/kategoriler')
      } else {
        const data = await response.json()
        alert(data.error || 'Kategori oluşturulurken hata oluştu')
      }
    } catch (error) {
      alert('Kategori oluşturulurken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/kategoriler">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Yeni Kategori Ekle</h1>
          <p className="text-gray-600 mt-1">Yeni bir ürün kategorisi oluşturun</p>
        </div>
      </div>

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
                <p className="text-[#006621] text-xs">lioradg.com.tr/kategori/{formData.slug || 'kategori-slug'}</p>
                <p className="text-gray-600 text-xs mt-0.5 line-clamp-2">{formData.metaDescription || formData.description || 'Açıklama girilmedi'}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Butonlar */}
        <div className="flex gap-4 mt-6">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1"
          >
            {loading ? 'Kaydediliyor...' : 'Kategoriyi Kaydet'}
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

