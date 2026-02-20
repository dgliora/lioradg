'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import { Card, Input, Button } from '@/components/ui'

interface Category {
  id: string
  name: string
}

interface Product {
  id: string
  name: string
  slug: string
  description: string
  content: string | null
  usage: string | null
  features: string | null
  benefits: string | null
  barcode: string | null
  price: number
  salePrice: number | null
  sku: string | null
  stock: number
  images: string | null
  categoryId: string
  featured: boolean
  active: boolean
}

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    content: '',
    usage: '',
    features: '',
    benefits: '',
    barcode: '',
    price: '',
    salePrice: '',
    sku: '',
    stock: '',
    images: '',
    categoryId: '',
    featured: false,
    active: true,
    metaTitle: '',
    metaDescription: '',
  })

  useEffect(() => {
    fetchCategories()
    fetchProduct()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`)
      const product: Product = await response.json()

      setFormData({
        name: product.name,
        slug: product.slug,
        description: product.description || '',
        content: product.content || '',
        usage: product.usage || '',
        features: product.features || '',
        benefits: product.benefits || '',
        barcode: product.barcode || '',
        price: product.price.toString(),
        salePrice: product.salePrice?.toString() || '',
        sku: product.sku || '',
        stock: product.stock.toString(),
        images: product.images || '',
        categoryId: product.categoryId,
        featured: product.featured,
        active: product.active,
        metaTitle: (product as any).metaTitle || '',
        metaDescription: (product as any).metaDescription || '',
      })

      // Mevcut fotoğrafları array'e çevir
      if (product.images) {
        const imagesArray = product.images.split(',').filter(img => img.trim())
        setUploadedImages(imagesArray)
      }

      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching product:', error)
      alert('Ürün yüklenirken hata oluştu!')
      router.push('/admin/urunler')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (uploadedImages.length === 0) {
      alert('En az bir fotoğraf olmalıdır!')
      return
    }

    setIsSubmitting(true)

    try {
      // Fotoğrafları virgülle ayırarak string'e çevir
      const imagesString = uploadedImages.join(',')
      
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          images: imagesString,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || 'Hata oluştu!')
        setIsSubmitting(false)
        return
      }

      alert('Ürün başarıyla güncellendi!')
      router.push('/admin/urunler')
    } catch (error) {
      alert('Ürün güncellenirken hata oluştu!')
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        alert('Ürün başarıyla silindi!')
        router.push('/admin/urunler')
      } else {
        alert('Ürün silinirken hata oluştu!')
      }
    } catch (error) {
      alert('Ürün silinirken hata oluştu!')
    }
  }

  const handleFileUpload = async (files: FileList) => {
    const filesArray = Array.from(files)
    
    // Her dosyayı kontrol et
    for (const file of filesArray) {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} bir resim dosyası değil!`)
        continue
      }

      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} dosyası 5MB'dan büyük!`)
        continue
      }
    }

    setIsUploading(true)

    try {
      // Her dosyayı sırayla yükle
      const uploadedUrls: string[] = []
      
      for (const file of filesArray) {
        if (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) {
          continue
        }

        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        const data = await response.json()

        if (response.ok) {
          uploadedUrls.push(data.url)
        }
      }

      if (uploadedUrls.length > 0) {
        setUploadedImages(prev => [...prev, ...uploadedUrls])
      }

      setIsUploading(false)
    } catch (error) {
      alert('Dosya yüklenirken hata oluştu!')
      setIsUploading(false)
    }
  }

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', index.toString())
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleImageDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'))
    
    if (dragIndex === dropIndex) return

    const newImages = [...uploadedImages]
    const [draggedImage] = newImages.splice(dragIndex, 1)
    newImages.splice(dropIndex, 0, draggedImage)
    
    setUploadedImages(newImages)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files)
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage mx-auto mb-4"></div>
          <p className="text-gray-600">Ürün yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ürünü Düzenle</h1>
          <p className="text-gray-600">Ürün bilgilerini güncelleyin</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleDelete} className="text-red-600 hover:text-red-700">
            🗑️ Sil
          </Button>
          <Button variant="outline" onClick={() => router.back()}>
            ← Geri Dön
          </Button>
        </div>
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
                    Açıklama (kısa)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent"
                    placeholder="Ürün kısa açıklaması..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Özellikleri
                  </label>
                  <textarea
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent"
                    placeholder="Ürün özellikleri..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bilinen Faydaları
                  </label>
                  <textarea
                    value={formData.benefits}
                    onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent"
                    placeholder="Bilinen faydalar..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kullanım Alanı
                  </label>
                  <textarea
                    value={formData.usage}
                    onChange={(e) => setFormData({ ...formData, usage: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent"
                    placeholder="Kullanım alanları..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    İçerik Bilgileri (opsiyonel)
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent"
                    placeholder="Ek içerik..."
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
                  label="Barkod"
                  value={formData.barcode}
                  onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                  helperText="Admin panelde görünür, mağazada gösterilmez"
                />

                <Input
                  label="SKU"
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
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </Card>

            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Ürün Görselleri
                {uploadedImages.length > 0 && (
                  <span className="ml-2 text-sm text-gray-500">({uploadedImages.length} fotoğraf)</span>
                )}
              </h2>
              <div className="space-y-4">
                {/* Drag & Drop Upload Area */}
                <div
                  className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                    dragActive
                      ? 'border-sage bg-sage/5'
                      : 'border-gray-300 hover:border-sage hover:bg-gray-50'
                  } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <input
                    type="file"
                    id="file-upload"
                    accept="image/*"
                    multiple
                    onChange={handleFileInput}
                    className="hidden"
                    disabled={isUploading}
                  />
                  
                  {isUploading ? (
                    <div className="py-4">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage mx-auto mb-4"></div>
                      <p className="text-sm text-gray-600">Yükleniyor...</p>
                    </div>
                  ) : (
                    <>
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-sm text-gray-700 mb-2 font-semibold">
                        Yeni Fotoğraf Ekle
                      </p>
                      <p className="text-xs text-gray-500 mb-1">
                        veya sürükleyip bırakın
                      </p>
                      <p className="text-xs text-gray-400">
                        Birden fazla fotoğraf seçebilirsiniz • PNG, JPG, GIF, WEBP (max. 5MB)
                      </p>
                    </>
                  )}
                </div>

                {/* Uploaded Images Grid */}
                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-2 gap-4">
                    {uploadedImages.map((url, index) => (
                      <div
                        key={index}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleImageDrop(e, index)}
                        className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group cursor-move"
                      >
                        <Image
                          src={url}
                          alt={`Ürün görseli ${index + 1}`}
                          fill
                          className="object-cover pointer-events-none"
                        />
                        {/* Ana Fotoğraf Badge */}
                        {index === 0 && (
                          <div className="absolute top-2 left-2 bg-sage text-white text-xs px-2 py-1 rounded">
                            Ana Fotoğraf
                          </div>
                        )}
                        {/* Drag Handle */}
                        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          <div className="bg-black/70 text-white p-1.5 rounded">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                            </svg>
                          </div>
                        </div>
                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
                          title="Sil"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        {/* Sıra Numarası */}
                        <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-xs text-gray-700">
                      <p className="font-semibold mb-1">💡 İpucu:</p>
                      <ul className="list-disc list-inside space-y-0.5">
                        <li>İlk fotoğraf ana görsel olacaktır</li>
                        <li>Fotoğrafları sürükleyerek sırasını değiştirebilirsiniz 🎯</li>
                        <li>Her fotoğrafın üzerine gelip silebilirsiniz</li>
                        <li>Yeni fotoğraf ekleyebilirsiniz</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* SEO */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">SEO</h2>
              <p className="text-sm text-gray-500 mb-5">Boş bırakırsanız ürün adı ve açıklaması kullanılır.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Başlık <span className="text-gray-400 font-normal text-xs">(max 60 karakter)</span>
                  </label>
                  <input
                    type="text"
                    maxLength={60}
                    value={formData.metaTitle}
                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                    placeholder={formData.name || 'Ürün adı kullanılacak'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage"
                  />
                  <p className="text-xs text-gray-400 mt-1 text-right">{formData.metaTitle.length}/60</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Açıklama <span className="text-gray-400 font-normal text-xs">(max 160 karakter)</span>
                  </label>
                  <textarea
                    maxLength={160}
                    rows={3}
                    value={formData.metaDescription}
                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                    placeholder="Ürün açıklaması kullanılacak"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage resize-none"
                  />
                  <p className="text-xs text-gray-400 mt-1 text-right">{formData.metaDescription.length}/160</p>
                </div>
                {(formData.metaTitle || formData.name) && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-2 font-medium">Google Önizleme</p>
                    <p className="text-blue-700 text-base font-medium leading-tight line-clamp-1">
                      {formData.metaTitle || formData.name} — Lioradg
                    </p>
                    <p className="text-green-700 text-xs mt-0.5">lioradg.com.tr/urun/{formData.slug}</p>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2 leading-snug">
                      {formData.metaDescription || formData.description?.slice(0, 160) || 'Açıklama girilmedi.'}
                    </p>
                  </div>
                )}
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

            <Button type="submit" size="lg" fullWidth loading={isSubmitting}>
              Değişiklikleri Kaydet
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

