'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'

interface BlogFormData {
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string
  tags: string
  author: string
  readingTime: number
  published: boolean
  metaTitle: string
  metaDescription: string
}

interface BlogFormProps {
  form: BlogFormData
  setForm: (fn: (f: BlogFormData) => BlogFormData) => void
  onTitleChange?: (val: string) => void
}

export function BlogForm({ form, setForm, onTitleChange }: BlogFormProps) {
  const set = (key: keyof BlogFormData, val: any) =>
    setForm((f) => ({ ...f, [key]: val }))

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setUploadError('')
    const fd = new FormData()
    fd.append('file', file)

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.url) {
        set('coverImage', data.url)
      } else {
        setUploadError(data.error || 'Yükleme başarısız')
      }
    } catch {
      setUploadError('Yükleme sırasında hata oluştu')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <h2 className="font-semibold text-gray-900">İçerik</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Başlık *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => onTitleChange ? onTitleChange(e.target.value) : set('title', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-lg font-medium focus:outline-none focus:ring-2 focus:ring-gray-400"
            placeholder="Blog yazısı başlığı..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug (URL)</label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => set('slug', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            placeholder="blog-yazisi-slug"
          />
          <p className="text-xs text-gray-400 mt-1">lioradg.com.tr/blog/{form.slug || 'slug'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Özet (Excerpt) *</label>
          <textarea
            value={form.excerpt}
            onChange={(e) => set('excerpt', e.target.value)}
            rows={2}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none"
            placeholder="Blog kartında ve arama sonuçlarında görünecek kısa açıklama..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">İçerik (HTML) *</label>
          <textarea
            value={form.content}
            onChange={(e) => set('content', e.target.value)}
            rows={20}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 resize-y"
            placeholder="<h2>Başlık</h2><p>İçerik...</p>"
          />
          <p className="text-xs text-gray-400 mt-1">
            HTML formatında yazın. &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;strong&gt;, &lt;a href=&quot;...&quot;&gt; etiketlerini kullanabilirsiniz.
          </p>
        </div>
      </div>

      {/* Kapak Görseli */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Kapak Görseli</h2>

        {form.coverImage && (
          <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
            <Image
              src={form.coverImage}
              alt="Kapak görseli"
              fill
              className="object-cover"
              unoptimized
            />
            <button
              type="button"
              onClick={() => set('coverImage', '')}
              className="absolute top-2 right-2 bg-white/90 hover:bg-white text-red-500 rounded-full w-8 h-8 flex items-center justify-center shadow text-lg font-bold"
              title="Görseli kaldır"
            >
              ×
            </button>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleImageUpload}
              className="hidden"
              id="blog-cover-upload"
            />
            <label
              htmlFor="blog-cover-upload"
              className={`flex items-center gap-2 px-4 py-2.5 border-2 border-dashed rounded-xl cursor-pointer transition-colors w-full justify-center
                ${uploading
                  ? 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed'
                  : 'border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                  Yükleniyor...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {form.coverImage ? 'Farklı Görsel Yükle' : 'Görsel Yükle (JPG, PNG, WEBP — max 5MB)'}
                </>
              )}
            </label>
            {uploadError && <p className="text-xs text-red-500 mt-1">{uploadError}</p>}
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-400">
            <div className="flex-1 h-px bg-gray-200" />
            <span>ya da URL girin</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <input
            type="text"
            value={form.coverImage}
            onChange={(e) => set('coverImage', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            placeholder="https://images.unsplash.com/... veya /images/blog/..."
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Detaylar</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Etiketler</label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => set('tags', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="oda kokusu, doğal kozmetik"
            />
            <p className="text-xs text-gray-400 mt-1">Virgülle ayırın</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Yazar</label>
            <input
              type="text"
              value={form.author}
              onChange={(e) => set('author', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Okuma Süresi (dk)</label>
            <input
              type="number"
              value={form.readingTime}
              onChange={(e) => set('readingTime', parseInt(e.target.value) || 5)}
              min={1}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">SEO</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Meta Başlık <span className="text-gray-400 font-normal">({form.metaTitle.length}/60)</span>
          </label>
          <input
            type="text"
            value={form.metaTitle}
            onChange={(e) => set('metaTitle', e.target.value.slice(0, 60))}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
            placeholder="Boş bırakırsanız yazı başlığı kullanılır"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Meta Açıklama <span className="text-gray-400 font-normal">({form.metaDescription.length}/160)</span>
          </label>
          <textarea
            value={form.metaDescription}
            onChange={(e) => set('metaDescription', e.target.value.slice(0, 160))}
            rows={3}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none"
            placeholder="Boş bırakırsanız özet kullanılır"
          />
        </div>
      </div>
    </div>
  )
}
