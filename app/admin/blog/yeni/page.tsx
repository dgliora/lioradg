'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BlogForm } from '@/components/admin/BlogForm'

export default function NewBlogPostPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '', slug: '', excerpt: '', content: '',
    coverImage: '', tags: '', author: 'Lioradg Ekibi',
    readingTime: 5, published: false,
    metaTitle: '', metaDescription: '',
  })

  const slugify = (text: string) =>
    text.toLowerCase()
      .replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ı/g, 'i')
      .replace(/ö/g, 'o').replace(/ş/g, 's').replace(/ü/g, 'u')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const handleTitleChange = (val: string) => {
    setForm((f) => ({ ...f, title: val, slug: f.slug || slugify(val) }))
  }

  const handleSave = async (publish = false) => {
    setSaving(true)
    const res = await fetch('/api/admin/blog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, published: publish }),
    })
    setSaving(false)
    if (res.ok) {
      router.push('/admin/blog')
    } else {
      const data = await res.json()
      alert(data.error || 'Hata oluştu')
    }
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/blog" className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-2">
            ← Blog Listesine Dön
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Yeni Blog Yazısı</h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="px-5 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-colors"
          >
            Taslak Kaydet
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="px-5 py-2.5 bg-gray-900 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors"
          >
            {saving ? 'Kaydediliyor...' : 'Yayınla'}
          </button>
        </div>
      </div>

      <BlogForm form={form} setForm={setForm} onTitleChange={handleTitleChange} />
    </div>
  )
}
