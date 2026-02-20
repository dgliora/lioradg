'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui'

interface AdminUser {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'STAFF'
  permissions: string | null
  createdAt: string
  emailVerified: string | null
}

const PERMISSION_LIST = [
  { key: 'analytics',  label: 'Analitik',     icon: '📈' },
  { key: 'products',   label: 'Ürünler',       icon: '📦' },
  { key: 'categories', label: 'Kategoriler',   icon: '🏷️' },
  { key: 'orders',     label: 'Siparişler',    icon: '🛒' },
  { key: 'campaigns',  label: 'Kampanyalar',   icon: '🎁' },
  { key: 'customers',  label: 'Müşteriler',    icon: '👥' },
  { key: 'newsletter', label: 'E-Bülten',      icon: '📧' },
  { key: 'settings',   label: 'Ayarlar',       icon: '⚙️' },
]

const EMPTY_FORM = { name: '', email: '', password: '', permissions: [] as string[] }

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editUser, setEditUser] = useState<AdminUser | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { fetchUsers() }, [])

  const fetchUsers = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/users')
    if (res.ok) setUsers(await res.json())
    setLoading(false)
  }

  const openCreate = () => {
    setEditUser(null)
    setForm(EMPTY_FORM)
    setError('')
    setShowForm(true)
  }

  const openEdit = (u: AdminUser) => {
    setEditUser(u)
    let perms: string[] = []
    try { perms = JSON.parse(u.permissions || '[]') } catch {}
    setForm({ name: u.name, email: u.email, password: '', permissions: perms })
    setError('')
    setShowForm(true)
  }

  const togglePerm = (key: string) => {
    setForm((f) => ({
      ...f,
      permissions: f.permissions.includes(key)
        ? f.permissions.filter((p) => p !== key)
        : [...f.permissions, key],
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      if (editUser) {
        const res = await fetch(`/api/admin/users/${editUser.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            ...(form.password ? { password: form.password } : {}),
            permissions: form.permissions,
          }),
        })
        if (!res.ok) { setError((await res.json()).error || 'Hata'); return }
      } else {
        const res = await fetch('/api/admin/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        if (!res.ok) { setError((await res.json()).error || 'Hata'); return }
      }
      await fetchUsers()
      setShowForm(false)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" kullanıcısını silmek istediğinize emin misiniz?`)) return
    const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' })
    if (res.ok) fetchUsers()
    else alert((await res.json()).error || 'Silinemedi')
  }

  const getPerms = (u: AdminUser) => {
    if (u.role === 'ADMIN') return null
    try { return JSON.parse(u.permissions || '[]') as string[] } catch { return [] }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kullanıcı Yönetimi</h1>
          <p className="text-sm text-gray-500 mt-1">Admin ve personel hesaplarını yönetin</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Yeni Personel Ekle
        </button>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                {editUser ? 'Kullanıcı Düzenle' : 'Yeni Personel Ekle'}
              </h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-gray-100">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Örn: Ahmet Yılmaz"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-posta *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="ornek@lioradg.com.tr"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Şifre {editUser && <span className="text-gray-400 font-normal">(boş bırakılırsa değişmez)</span>}
                  {!editUser && <span className="text-red-500"> *</span>}
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="En az 6 karakter"
                />
              </div>

              {/* Yetkiler */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-700">Yetkili Olduğu Bölümler</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, permissions: PERMISSION_LIST.map((p) => p.key) })}
                      className="text-xs text-primary hover:underline"
                    >
                      Tümünü Seç
                    </button>
                    <span className="text-gray-300">|</span>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, permissions: [] })}
                      className="text-xs text-gray-500 hover:underline"
                    >
                      Temizle
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {PERMISSION_LIST.map((p) => (
                    <label
                      key={p.key}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border cursor-pointer transition-all ${
                        form.permissions.includes(p.key)
                          ? 'border-primary/50 bg-primary/5 text-primary'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={form.permissions.includes(p.key)}
                        onChange={() => togglePerm(p.key)}
                        className="accent-primary"
                      />
                      <span className="text-base">{p.icon}</span>
                      <span className="text-sm font-medium">{p.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 pb-6 flex gap-3 justify-end">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark disabled:opacity-50 flex items-center gap-2"
              >
                {saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {editUser ? 'Kaydet' : 'Oluştur'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Kullanıcı Listesi */}
      <Card padding="none">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Yükleniyor...</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {users.map((u) => {
              const perms = getPerms(u)
              return (
                <div key={u.id} className="px-6 py-5 flex items-start gap-4">
                  {/* Avatar */}
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-base shrink-0 ${
                    u.role === 'ADMIN' ? 'bg-red-500' : 'bg-primary'
                  }`}>
                    {u.name.charAt(0).toUpperCase()}
                  </div>

                  {/* Bilgi */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-900">{u.name}</span>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        u.role === 'ADMIN' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {u.role}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">{u.email}</p>

                    {/* Yetkiler (STAFF) */}
                    {perms !== null && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {perms.length === 0 ? (
                          <span className="text-xs text-orange-500 font-medium">⚠ Hiçbir yetkisi yok</span>
                        ) : (
                          perms.map((key) => {
                            const p = PERMISSION_LIST.find((x) => x.key === key)
                            return p ? (
                              <span key={key} className="inline-flex items-center gap-1 text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                {p.icon} {p.label}
                              </span>
                            ) : null
                          })
                        )}
                      </div>
                    )}
                    {perms === null && (
                      <p className="text-xs text-gray-400 mt-1">Tüm bölümlere tam erişim</p>
                    )}
                  </div>

                  {/* Aksiyonlar */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-gray-400">
                      {new Date(u.createdAt).toLocaleDateString('tr-TR')}
                    </span>
                    {u.role !== 'ADMIN' && (
                      <>
                        <button
                          onClick={() => openEdit(u)}
                          className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
                        >
                          Düzenle
                        </button>
                        <button
                          onClick={() => handleDelete(u.id, u.name)}
                          className="px-3 py-1.5 text-xs bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium"
                        >
                          Sil
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>
    </div>
  )
}
