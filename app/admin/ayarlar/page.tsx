'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Card, Button } from '@/components/ui'

type Setting = {
  id: string
  key: string
  value: string
  label: string | null
  type: string
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [editedValues, setEditedValues] = useState<Record<string, string>>({})
  const [sliderImages, setSliderImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings')
      if (response.ok) {
        const data = await response.json()
        console.log('Ayarlar yüklendi:', data)
        
        // Eğer shipping_fee yoksa oluştur
        if (!data.find((s: Setting) => s.key === 'shipping_fee')) {
          console.log('shipping_fee ayarı yok, oluşturuluyor...')
          const createResponse = await fetch('/api/admin/settings', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              key: 'shipping_fee',
              value: '89.90',
              label: 'Kargo Ücreti (TL)',
              type: 'number',
            }),
          })
          if (createResponse.ok) {
            // Yeniden yükle
            const newResponse = await fetch('/api/admin/settings')
            if (newResponse.ok) {
              const newData = await newResponse.json()
              setSettings(newData)
              const initialValues: Record<string, string> = {}
              newData.forEach((setting: Setting) => {
                initialValues[setting.key] = setting.value
              })
              setEditedValues(initialValues)
            }
          }
        } else {
          setSettings(data)
          // Başlangıç değerlerini set et
          const initialValues: Record<string, string> = {}
          data.forEach((setting: Setting) => {
            initialValues[setting.key] = setting.value
            // Slider images'ı parse et
            if (setting.key === 'hero_slider_images') {
              setSliderImages(setting.value ? setting.value.split(',').filter(Boolean) : [])
            }
          })
          setEditedValues(initialValues)
        }
      }
    } catch (error) {
      console.error('Ayarlar yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (key: string) => {
    setSaving(key)
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key,
          value: editedValues[key],
        }),
      })

      if (response.ok) {
        alert('✅ Ayar başarıyla güncellendi!')
        fetchSettings() // Yeniden yükle
      } else {
        const data = await response.json()
        alert(data.error || 'Ayar güncellenirken hata oluştu')
      }
    } catch (error) {
      alert('Ayar güncellenirken hata oluştu')
    } finally {
      setSaving(null)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) throw new Error('Yükleme başarısız')
        const data = await response.json()
        return data.url
      })

      const urls = await Promise.all(uploadPromises)
      const newImages = [...sliderImages, ...urls]
      setSliderImages(newImages)
      await saveSliderImages(newImages)
    } catch (error) {
      alert('Fotoğraf yüklenirken hata oluştu')
    } finally {
      setUploading(false)
      // Reset input
      e.target.value = ''
    }
  }

  const handleRemoveImage = async (index: number) => {
    const newImages = sliderImages.filter((_, i) => i !== index)
    setSliderImages(newImages)
    await saveSliderImages(newImages)
  }

  const handleReorderImages = async (newOrder: string[]) => {
    setSliderImages(newOrder)
    await saveSliderImages(newOrder)
  }

  const saveSliderImages = async (images: string[]) => {
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'hero_slider_images',
          value: images.join(','),
        }),
      })

      if (!response.ok) {
        throw new Error('Kaydetme başarısız')
      }

      alert('✅ Slider fotoğrafları güncellendi!')
      fetchSettings()
    } catch (error) {
      alert('Fotoğraflar kaydedilirken hata oluştu')
    }
  }

  const renderSettingField = (key: string) => {
    const setting = settings.find(s => s.key === key)
    if (!setting) return null

    const getInputType = () => {
      if (setting.type === 'email') return 'email'
      if (setting.type === 'number') return 'number'
      if (setting.type === 'boolean') return 'checkbox'
      return 'text'
    }

    const getDescription = () => {
      switch (key) {
        case 'shipping_fee':
          return 'Sepet sayfasında ve mini sepette gösterilecek kargo ücreti'
        case 'free_shipping_min_amount':
          return 'Bu tutarın üzerindeki alışverişlerde kargo ücretsiz olacak (kampanyalar hariç)'
        case 'delivery_time':
          return 'Sepet ve ürün sayfalarında gösterilecek teslimat süresi bilgisi'
        case 'contact_phone':
          return 'Header ve footer\'da gösterilecek telefon numarası'
        case 'contact_email':
          return 'Header ve footer\'da gösterilecek email adresi'
        case 'contact_address':
          return 'Footer\'da gösterilecek adres bilgisi'
        case 'social_instagram':
          return 'Footer\'da gösterilecek Instagram profil linki'
        case 'social_facebook':
          return 'Footer\'da gösterilecek Facebook sayfa linki'
        case 'social_whatsapp':
          return 'WhatsApp iletişim için telefon numarası (ülke kodu ile, örn: 905302084747)'
        case 'min_order_amount':
          return 'Bu tutarın altındaki siparişler kabul edilmeyecek (0 = limit yok)'
        case 'cash_on_delivery':
          return 'Kapıda ödeme seçeneğinin aktif/pasif durumu'
        case 'site_title':
          return 'SEO için kullanılacak site başlığı (meta title)'
        case 'site_description':
          return 'SEO için kullanılacak site açıklaması (meta description)'
        case 'email_notifications':
          return 'Yeni sipariş ve stok uyarıları için email bildirimlerinin aktif/pasif durumu'
        case 'stock_alert_threshold':
          return 'Bu sayının altındaki stoklarda admin paneline uyarı gösterilecek'
        default:
          return ''
      }
    }

    const isBoolean = setting.type === 'boolean'
    const booleanValue = editedValues[setting.key] !== undefined 
      ? editedValues[setting.key] === 'true' 
      : setting.value === 'true'

    return (
      <div key={setting.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {setting.label || setting.key}
          </label>
          {isBoolean ? (
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={booleanValue}
                onChange={(e) => setEditedValues({ ...editedValues, [setting.key]: e.target.checked ? 'true' : 'false' })}
                className="w-5 h-5 text-sage border-gray-300 rounded focus:ring-sage"
              />
              <span className="text-sm text-gray-600">
                {booleanValue ? 'Aktif' : 'Pasif'}
              </span>
            </div>
          ) : (
            <input
              type={getInputType()}
              step={setting.type === 'number' ? '0.01' : undefined}
              value={editedValues[setting.key] || setting.value}
              onChange={(e) => setEditedValues({ ...editedValues, [setting.key]: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent"
              placeholder={setting.value}
            />
          )}
          {getDescription() && (
            <p className="text-xs text-gray-500 mt-1">
              {getDescription()}
            </p>
          )}
        </div>
        <Button
          onClick={() => handleSave(setting.key)}
          disabled={saving === setting.key}
          className="whitespace-nowrap"
        >
          {saving === setting.key ? 'Kaydediliyor...' : 'Kaydet'}
        </Button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Site Ayarları</h1>
        <p className="text-gray-600">Sitenin genel ayarlarını buradan yönetebilirsiniz</p>
      </div>

      {/* Kargo Ayarları */}
      <Card>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Kargo Ayarları</h2>
        <div className="space-y-4">
          {renderSettingField('shipping_fee')}
          {renderSettingField('free_shipping_min_amount')}
          {renderSettingField('delivery_time')}
        </div>
      </Card>

      {/* İletişim Bilgileri */}
      <Card>
        <h2 className="text-xl font-bold text-gray-900 mb-6">İletişim Bilgileri</h2>
        <div className="space-y-4">
          {renderSettingField('contact_phone')}
          {renderSettingField('contact_email')}
          {renderSettingField('contact_address')}
        </div>
      </Card>

      {/* Sosyal Medya */}
      <Card>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Sosyal Medya</h2>
        <div className="space-y-4">
          {renderSettingField('social_instagram')}
          {renderSettingField('social_facebook')}
          {renderSettingField('social_whatsapp')}
        </div>
      </Card>

      {/* Ödeme Ayarları */}
      <Card>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Ödeme Ayarları</h2>
        <div className="space-y-4">
          {renderSettingField('min_order_amount')}
          {renderSettingField('cash_on_delivery')}
        </div>
      </Card>

      {/* Site Bilgileri */}
      <Card>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Site Bilgileri</h2>
        <div className="space-y-4">
          {renderSettingField('site_title')}
          {renderSettingField('site_description')}
        </div>
      </Card>

      {/* Bildirimler */}
      <Card>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Bildirimler</h2>
        <div className="space-y-4">
          {renderSettingField('email_notifications')}
          {renderSettingField('stock_alert_threshold')}
        </div>
      </Card>

      {/* Ana Sayfa Slider */}
      <Card>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Ana Sayfa Slider</h2>
        <div className="space-y-6">
          {/* Slider Ayarları */}
          <div className="space-y-4">
            {renderSettingField('hero_slider_auto_play')}
            {renderSettingField('hero_slider_interval')}
          </div>

          {/* Fotoğraf Yükleme */}
          <div className="border-t pt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slider Fotoğrafları
            </label>
            <p className="text-xs text-gray-500 mb-4">
              Ana sayfada "Premium Doğal Bakım" bölümünde gösterilecek fotoğraflar
            </p>
            
            <div className="mb-4">
              <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-sage text-white rounded-lg hover:bg-sage-dark transition-colors">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {uploading ? 'Yükleniyor...' : 'Fotoğraf Ekle'}
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>

            {/* Fotoğraf Listesi */}
            {sliderImages.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {sliderImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 relative">
                      <Image
                        src={image}
                        alt={`Slider ${index + 1}`}
                        fill
                        sizes="(max-width: 768px) 25vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover"
                      />
                    </div>
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                <p>Henüz fotoğraf eklenmemiş</p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
