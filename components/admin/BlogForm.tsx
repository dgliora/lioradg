'use client'

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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Kapak Görseli URL</label>
            <input
              type="text"
              value={form.coverImage}
              onChange={(e) => set('coverImage', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="/images/blog/yazi-gorseli.jpg"
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
