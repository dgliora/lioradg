'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, Button } from '@/components/ui'
import * as XLSX from 'xlsx'

interface ProductRow {
  'Ürün İsmi': string
  'Kullanım Alanı': string
  'Özellikleri': string
  'Bilinen Faydaları': string
  'BARKOD': string
  'FİYAT': number
  'Kategori': string
  'Stok': number
}

interface UploadProgress {
  total: number
  current: number
  status: 'idle' | 'processing' | 'success' | 'error'
  errors: string[]
  success: number
}

export default function BulkProductUploadPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [progress, setProgress] = useState<UploadProgress>({
    total: 0,
    current: 0,
    status: 'idle',
    errors: [],
    success: 0
  })

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

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const handleFileSelect = (selectedFile: File) => {
    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv'
    ]

    if (!validTypes.includes(selectedFile.type) && !selectedFile.name.match(/\.(xlsx|xls|csv)$/)) {
      alert('Lütfen Excel (.xlsx, .xls) veya CSV dosyası yükleyin')
      return
    }

    setFile(selectedFile)
    setProgress({
      total: 0,
      current: 0,
      status: 'idle',
      errors: [],
      success: 0
    })
  }

  const generateSlug = (name: string): string => {
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

  const parseExcel = async (file: File): Promise<ProductRow[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (e) => {
        try {
          const data = e.target?.result
          const workbook = XLSX.read(data, { type: 'binary' })
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]
          const jsonData = XLSX.utils.sheet_to_json<ProductRow>(worksheet)
          resolve(jsonData)
        } catch (error) {
          reject(error)
        }
      }

      reader.onerror = () => reject(new Error('Dosya okunamadı'))
      reader.readAsBinaryString(file)
    })
  }

  const handleUpload = async () => {
    if (!file) {
      alert('Lütfen bir dosya seçin')
      return
    }

    try {
      setProgress(prev => ({ ...prev, status: 'processing' }))

      // Excel'i parse et
      const products = await parseExcel(file)

      if (products.length === 0) {
        alert('Dosyada ürün bulunamadı')
        setProgress(prev => ({ ...prev, status: 'idle' }))
        return
      }

      setProgress(prev => ({ ...prev, total: products.length }))

      const errors: string[] = []
      let successCount = 0

      // Her ürünü tek tek ekle
      for (let i = 0; i < products.length; i++) {
        const row = products[i]

        setProgress(prev => ({ ...prev, current: i + 1 }))

        try {
          // Veriyi hazırla
          const productData = {
            name: row['Ürün İsmi'] || '',
            slug: generateSlug(row['Ürün İsmi'] || '') + '-' + Date.now() + '-' + i,
            description: row['Özellikleri'] || '',
            content: row['Bilinen Faydaları'] || '',
            usage: row['Kullanım Alanı'] || '',
            price: parseFloat(String(row['FİYAT'] || 0)),
            salePrice: null,
            sku: row['BARKOD'] || '',
            stock: parseInt(String(row['Stok'] || 0)),
            images: '/images/placeholder.jpg',
            categoryId: row['Kategori'] || '',
            featured: false,
            active: true
          }

          // Validasyon
          if (!productData.name || !productData.price || !productData.categoryId) {
            errors.push(`Satır ${i + 2}: Eksik bilgi (Ürün İsmi, Fiyat veya Kategori eksik)`)
            continue
          }

          // API'ye gönder
          const response = await fetch('/api/admin/products/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
          })

          if (response.ok) {
            successCount++
          } else {
            const data = await response.json()
            errors.push(`Satır ${i + 2} (${productData.name}): ${data.error}`)
          }

          // Kısa bir bekleme (rate limiting için)
          await new Promise(resolve => setTimeout(resolve, 100))

        } catch (error) {
          errors.push(`Satır ${i + 2}: Beklenmeyen hata`)
        }
      }

      setProgress({
        total: products.length,
        current: products.length,
        status: successCount > 0 ? 'success' : 'error',
        errors,
        success: successCount
      })

    } catch (error) {
      alert('Dosya işlenirken hata oluştu')
      setProgress(prev => ({ ...prev, status: 'error' }))
    }
  }

  const downloadTemplate = () => {
    // Örnek veri
    const template = [
      {
        'Ürün İsmi': 'Örnek Ürün',
        'Kullanım Alanı': 'Cilt bakımı için',
        'Özellikleri': 'Nemlendirici, yatıştırıcı',
        'Bilinen Faydaları': 'Cildi nemlendirir ve yatıştırır',
        'BARKOD': '1234567890',
        'FİYAT': 99.90,
        'Kategori': 'kategori-id-buraya',
        'Stok': 50
      }
    ]

    const ws = XLSX.utils.json_to_sheet(template)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Ürünler')
    XLSX.writeFile(wb, 'urun-sablonu.xlsx')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Toplu Ürün Ekle</h1>
          <p className="text-gray-600">Excel veya CSV dosyasından toplu ürün yükleyin</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/urunler/toplu-ekle/kategoriler">
            <Button variant="outline">📋 Kategori ID'lerini Gör</Button>
          </Link>
          <Link href="/admin/urunler">
            <Button variant="outline">← Geri Dön</Button>
          </Link>
        </div>
      </div>

      {/* Template Download */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Excel Şablonunu İndir</h3>
            <p className="text-sm text-gray-600">Örnek Excel dosyasını indirip doldurun</p>
          </div>
          <Button onClick={downloadTemplate} variant="outline">
            📥 Şablonu İndir
          </Button>
        </div>
      </Card>

      {/* Upload Area */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Dosya Yükle</h2>
        
        <div
          className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer ${
            dragActive
              ? 'border-sage bg-sage/5'
              : 'border-gray-300 hover:border-sage hover:bg-gray-50'
          } ${progress.status === 'processing' ? 'opacity-50 pointer-events-none' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          <input
            type="file"
            id="file-upload"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileInput}
            className="hidden"
            disabled={progress.status === 'processing'}
          />
          
          {file ? (
            <div className="space-y-3">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
              <Button 
                onClick={(e) => {
                  e.stopPropagation()
                  setFile(null)
                  setProgress({
                    total: 0,
                    current: 0,
                    status: 'idle',
                    errors: [],
                    success: 0
                  })
                }}
                variant="outline"
                size="sm"
              >
                Dosyayı Değiştir
              </Button>
            </div>
          ) : (
            <>
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-lg font-semibold text-gray-700 mb-2">
                Excel/CSV Dosyası Yükle
              </p>
              <p className="text-sm text-gray-500">
                Tıklayın veya sürükleyip bırakın
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Desteklenen formatlar: .xlsx, .xls, .csv
              </p>
            </>
          )}
        </div>

        {/* Progress */}
        {progress.status !== 'idle' && (
          <div className="mt-6 space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-700">
                  {progress.status === 'processing' && '⏳ İşleniyor...'}
                  {progress.status === 'success' && '✅ Tamamlandı!'}
                  {progress.status === 'error' && '⚠️ Hatalar var'}
                </span>
                <span className="text-gray-600">
                  {progress.current} / {progress.total}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    progress.status === 'success' ? 'bg-green-500' :
                    progress.status === 'error' ? 'bg-yellow-500' :
                    'bg-sage'
                  }`}
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                />
              </div>
            </div>

            {/* Success Count */}
            {progress.success > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-semibold">
                  ✅ {progress.success} ürün başarıyla eklendi!
                </p>
              </div>
            )}

            {/* Errors */}
            {progress.errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-h-64 overflow-y-auto">
                <p className="font-semibold text-red-800 mb-2">
                  ⚠️ Hatalar ({progress.errors.length}):
                </p>
                <ul className="space-y-1 text-sm text-red-700">
                  {progress.errors.map((error, i) => (
                    <li key={i}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Upload Button */}
        {file && progress.status === 'idle' && (
          <div className="mt-6">
            <Button onClick={handleUpload} size="lg" fullWidth>
              📦 Ürünleri Yükle
            </Button>
          </div>
        )}

        {/* Done Button */}
        {progress.status !== 'idle' && progress.status !== 'processing' && (
          <div className="mt-6">
            <Button onClick={() => router.push('/admin/urunler')} size="lg" fullWidth>
              ✅ Tamamlandı - Ürünlere Git
            </Button>
          </div>
        )}
      </Card>

      {/* Instructions */}
      <Card>
        <h3 className="font-semibold text-gray-900 mb-3">📋 Kullanım Talimatları</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-sage font-bold">1.</span>
            <span>Yukarıdaki butona tıklayarak şablon Excel dosyasını indirin</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-sage font-bold">2.</span>
            <span>Tüm sütunları eksiksiz doldurun (özellikle Kategori ID'sini doğru girin)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-sage font-bold">3.</span>
            <span>Dosyayı kaydedin ve yukarıdaki alana yükleyin</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-sage font-bold">4.</span>
            <span>"Ürünleri Yükle" butonuna tıklayın</span>
          </li>
        </ul>
        
        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-sm text-yellow-800">
            <strong>⚠️ Önemli:</strong> Kategori alanına kategori ID'sini girmelisiniz. 
            Kategorileri admin panelinden kontrol edebilirsiniz.
          </p>
        </div>
      </Card>
    </div>
  )
}
