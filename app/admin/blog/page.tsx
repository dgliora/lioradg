'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  published: boolean
  tags: string | null
  readingTime: number
  createdAt: string
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/blog')
      .then((r) => r.json())
      .then((data) => { setPosts(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const togglePublish = async (id: string, published: boolean) => {
    const res = await fetch(`/api/admin/blog/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !published }),
    })
    if (res.ok) {
      setPosts((prev) => prev.map((p) => p.id === id ? { ...p, published: !published } : p))
    }
  }

  const deletePost = async (id: string, title: string) => {
    if (!confirm(`"${title}" yazısını silmek istediğinizden emin misiniz?`)) return
    const res = await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' })
    if (res.ok) setPosts((prev) => prev.filter((p) => p.id !== id))
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog Yönetimi</h1>
          <p className="text-gray-500 mt-1">{posts.length} yazı · {posts.filter((p) => p.published).length} yayında</p>
        </div>
        <Link
          href="/admin/blog/yeni"
          className="flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Yeni Yazı
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
          <p className="text-4xl mb-4">📝</p>
          <p className="text-gray-500">Henüz blog yazısı yok.</p>
          <Link href="/admin/blog/yeni" className="inline-block mt-4 text-blue-600 hover:underline text-sm">
            İlk yazıyı oluştur →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-600 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-medium">Başlık</th>
                <th className="px-6 py-4 font-medium">Etiketler</th>
                <th className="px-6 py-4 font-medium">Okuma</th>
                <th className="px-6 py-4 font-medium">Durum</th>
                <th className="px-6 py-4 font-medium">Tarih</th>
                <th className="px-6 py-4 font-medium">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900 max-w-xs truncate">{post.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">/blog/{post.slug}</p>
                  </td>
                  <td className="px-6 py-4">
                    {post.tags ? (
                      <div className="flex flex-wrap gap-1">
                        {post.tags.split(',').slice(0, 2).map((t) => (
                          <span key={t} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{t.trim()}</span>
                        ))}
                      </div>
                    ) : <span className="text-gray-400">—</span>}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{post.readingTime} dk</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => togglePublish(post.id, post.published)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        post.published
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {post.published ? '✓ Yayında' : '○ Taslak'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/blog/${post.id}`}
                        className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                      >
                        Düzenle
                      </Link>
                      <a
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg font-medium transition-colors"
                      >
                        Görüntüle
                      </a>
                      <button
                        onClick={() => deletePost(post.id, post.title)}
                        className="text-xs px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-medium transition-colors"
                      >
                        Sil
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
