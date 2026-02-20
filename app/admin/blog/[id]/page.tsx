'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { BlogForm } from '@/components/admin/BlogForm'

export default function EditBlogPostPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [form, setForm] = useState({
    title: '', slug: '', excerpt: '', content: '',
    coverImage: '', tags: '', author: 'Lioradg Ekibi',
    readingTime: 5, published: false,
    metaTitle: '', metaDescription: '',
  })

  useEffect(() => {
    fetch(`/api/admin/blog/${id}`)
      .then((r) => {
        if (!r.ok) { setNotFound(true); setLoading(false); return null }
        return r.json()
      })
      .then((data) => {
        if (!data) return
        setForm({
          title: data.title || '',
          slug: data.slug || '',
          excerpt: data.excerpt || '',
          content: data.content || '',
          coverImage: data.coverImage || '',
          tags: data.tags || '',
          author: data.author || 'Lioradg Ekibi',
          readingTime: data.readingTime || 5,
          published: data.published || false,
          metaTitle: data.metaTitle || '',
          metaDescription: data.metaDescription || '',
        })
        setLoading(false)
      })
      .catch(() => { setNotFound(true); setLoading(false) })
  }, [id])

  const handleSave = async (publish?: boolean) => {
    setSaving(true)
    const body = { ...form }
    if (publish !== undefined) body.published = publish

    const res = await fetch(`/api/admin/blog/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    setSaving(false)
    if (res.ok) {
      router.push('/admin/blog')
    } else {
      const data = await res.json()
      alert(data.error || 'Hata oluştu')
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
    </div>
  )

  if (notFound) return (
    <div className="text-center py-16">
      <p className="text-gray-500 text-lg mb-4">Blog yazısı bulunamadı.</p>
      <Link href="/admin/blog" className="text-blue-600 hover:underline">← Geri dön</Link>
    </div>
  )

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/blog" className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-2">
            ← Blog Listesine Dön
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Blog Yazısını Düzenle</h1>
          <p className="text-sm text-gray-400 mt-0.5">/blog/{form.slug}</p>
        </div>
        <div className="flex gap-3">
          {form.published ? (
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="px-5 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-colors"
            >
              Taslağa Al
            </button>
          ) : (
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="px-5 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-colors"
            >
              Taslak Kaydet
            </button>
          )}
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="px-5 py-2.5 bg-gray-900 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors"
          >
            {saving ? 'Kaydediliyor...' : form.published ? 'Güncelle' : 'Yayınla'}
          </button>
        </div>
      </div>

      <BlogForm form={form} setForm={setForm} />
    </div>
  )
}
