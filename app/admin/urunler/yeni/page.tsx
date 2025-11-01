'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, Input, Button } from '@/components/ui'

export default function NewProductPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    content: '',
    usage: '',
    price: '',
    salePrice: '',
    sku: '',
    stock: '',
    categoryId: '',
    featured: false,
    active: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // TODO: API call to create product
      console.log('Create product:', formData)
      alert('Ürün başarıyla oluşturuldu! (API yakında eklenecek)')
      router.push('/admin/urunler')
    } catch (error) {
      alert('Hata oluştu!')
    } finally {
      setIsSubmitting(false)
    }
  }

  const generateSlug = (name: string) => {
    const trMap: { [key: string]: string } = {
      'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
      'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u'
    }
    
    let slug = name
    Object.keys(trMap).forEach(key => {
      slug = slug.replace(new RegExp(key, 'g'), trMap[key])
    })
    
    return slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Yeni Ürün Ekle</h1>
          <p className="text-gray-600">Yeni bir ürün oluşturun</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          ← Geri Dön
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Genel Bilgiler</h2>
              <div className="space-y-6">
                <Input
                  label="Ürün Adı"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ 
                      ...formData, 
                      name: e.target.value,
                      slug: generateSlug(e.target.value)
                    })
                  }}
                  required
                />
                
                <Input
                  label="Slug (URL)"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  helperText="URL'de görünecek benzersiz tanımlayıcı"
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Açıklama
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent"
                    placeholder="Ürün açıklaması..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    İçerik Bilgileri
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent"
                    placeholder="İçerik bilgileri..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kullanım Talimatları
                  </label>
                  <textarea
                    value={formData.usage}
                    onChange={(e) => setFormData({ ...formData, usage: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent"
                    placeholder="Nasıl kullanılır..."
                  />
                </div>
              </div>
            </Card>

            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Fiyat ve Stok</h2>
              <div className="grid grid-cols-2 gap-6">
                <Input
                  label="Normal Fiyat (TL)"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
                
                <Input
                  label="İndirimli Fiyat (TL)"
                  type="number"
                  step="0.01"
                  value={formData.salePrice}
                  onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                  helperText="Boş bırakabilirsiniz"
                />

                <Input
                  label="SKU / Barkod"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                />

                <Input
                  label="Stok Miktarı"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  required
                />
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Kategori</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori Seçin <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage"
                >
                  <option value="">Seçiniz...</option>
                  <option value="1">Parfümler</option>
                  <option value="2">Tonikler</option>
                  <option value="3">Şampuan & Saç Bakım</option>
                  <option value="4">Krem Bakım</option>
                  <option value="5">Bitkisel Yağlar</option>
                  <option value="6">Oda ve Tekstil Kokuları</option>
                </select>
              </div>
            </Card>

            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Durum</h2>
              <div className="space-y-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="mr-3 text-sage focus:ring-sage"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Öne Çıkan</p>
                    <p className="text-sm text-gray-600">Ana sayfada göster</p>
                  </div>
                </label>

                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="mr-3 text-sage focus:ring-sage"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Aktif</p>
                    <p className="text-sm text-gray-600">Sitede yayında</p>
                  </div>
                </label>
              </div>
            </Card>

            <Card className="bg-yellow-50 border-yellow-200">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-yellow-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-gray-700">
                  <p className="font-semibold mb-1">Görsel Yükleme</p>
                  <p>
                    Görsel yükleme özelliği yakında eklenecektir.
                    Şimdilik görseller manuel olarak public/images klasörüne eklenmeli.
                  </p>
                </div>
              </div>
            </Card>

            <Button type="submit" size="lg" fullWidth loading={isSubmitting}>
              Ürünü Kaydet
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

