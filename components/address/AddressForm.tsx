'use client'

import { useState, useEffect } from 'react'
import { Input, Button } from '@/components/ui'

interface Province {
  code: string
  name: string
}

interface District {
  code: string
  name: string
  provinceCode: string
}

interface Neighborhood {
  code: string
  name: string
  districtCode: string
  postalCode: string
}

interface Street {
  code: string
  name: string
  neighborhoodCode: string
}

interface AddressFormData {
  title: string
  fullName: string
  phone: string
  provinceCode: string
  province: string
  districtCode: string
  district: string
  neighborhoodCode: string
  neighborhood: string
  streetCode?: string
  street?: string
  postalCode: string
  addressLine: string
}

interface AddressFormProps {
  onSubmit: (data: AddressFormData) => void
  onCancel: () => void
  isSubmitting?: boolean
  initialData?: Partial<AddressFormData> | null  // ← Düzenleme için initial data
}

export function AddressForm({ 
  onSubmit, 
  onCancel, 
  isSubmitting = false, 
  initialData 
}: AddressFormProps) {
  const [provinces, setProvinces] = useState<Province[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([])
  const [streets, setStreets] = useState<Street[]>([])
  
  const [loading, setLoading] = useState({
    provinces: false,
    districts: false,
    neighborhoods: false,
    streets: false,
  })

  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const [formData, setFormData] = useState<AddressFormData>({
    title: '',
    fullName: '',
    phone: '',
    provinceCode: '',
    province: '',
    districtCode: '',
    district: '',
    neighborhoodCode: '',
    neighborhood: '',
    streetCode: '',
    street: '',
    postalCode: '',
    addressLine: '',
  })

  // Initial data varsa formu doldur
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        // Kategori seçimlerini de ayarla
        provinceCode: initialData.provinceCode || '',
        districtCode: initialData.districtCode || '',
        neighborhoodCode: initialData.neighborhoodCode || '',
        streetCode: initialData.streetCode || '',
      }))

      // Eğer düzenleme modundaysa ilgili verileri yükle
      if (initialData.provinceCode) {
        loadDistricts(initialData.provinceCode)
      }
      if (initialData.districtCode) {
        loadNeighborhoods(initialData.districtCode)
      }
      if (initialData.neighborhoodCode) {
        loadStreets(initialData.neighborhoodCode)
      }
    }
  }, [initialData])

  // Load provinces on mount
  useEffect(() => {
    loadProvinces()
  }, [])

  const loadProvinces = async () => {
    setLoading((prev) => ({ ...prev, provinces: true }))
    try {
      const res = await fetch('/api/addresses/provinces')
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data)) {
          setProvinces(data)
        } else {
          setProvinces([])
          setErrors((prev) => ({ ...prev, provinces: 'İller yüklenemedi' }))
        }
      } else {
        setProvinces([])
        setErrors((prev) => ({ ...prev, provinces: 'İller yüklenemedi' }))
      }
    } catch (error) {
      console.error('Provinces load error:', error)
      setProvinces([])
      setErrors((prev) => ({ ...prev, provinces: 'İller yüklenemedi' }))
    } finally {
      setLoading((prev) => ({ ...prev, provinces: false }))
    }
  }

  const loadDistricts = async (provinceCode: string) => {
    setLoading((prev) => ({ ...prev, districts: true }))
    setDistricts([])
    setNeighborhoods([])
    setStreets([])
    try {
      const res = await fetch(`/api/addresses/districts?province=${provinceCode}`)
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data)) {
          setDistricts(data)
        } else {
          setDistricts([])
          setErrors((prev) => ({ ...prev, districts: 'İlçeler yüklenemedi' }))
        }
      } else {
        setDistricts([])
        setErrors((prev) => ({ ...prev, districts: 'İlçeler yüklenemedi' }))
      }
    } catch (error) {
      console.error('Districts load error:', error)
      setDistricts([])
      setErrors((prev) => ({ ...prev, districts: 'İlçeler yüklenemedi' }))
    } finally {
      setLoading((prev) => ({ ...prev, districts: false }))
    }
  }

  const loadNeighborhoods = async (districtCode: string) => {
    setLoading((prev) => ({ ...prev, neighborhoods: true }))
    setNeighborhoods([])
    setStreets([])
    try {
      const res = await fetch(`/api/addresses/neighborhoods?district=${districtCode}`)
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data)) {
          setNeighborhoods(data)
        } else {
          setNeighborhoods([])
          setErrors((prev) => ({ ...prev, neighborhoods: 'Mahalleler yüklenemedi' }))
        }
      } else {
        setNeighborhoods([])
        setErrors((prev) => ({ ...prev, neighborhoods: 'Mahalleler yüklenemedi' }))
      }
    } catch (error) {
      console.error('Neighborhoods load error:', error)
      setNeighborhoods([])
      setErrors((prev) => ({ ...prev, neighborhoods: 'Mahalleler yüklenemedi' }))
    } finally {
      setLoading((prev) => ({ ...prev, neighborhoods: false }))
    }
  }

  const loadStreets = async (neighborhoodCode: string) => {
    setLoading((prev) => ({ ...prev, streets: true }))
    setStreets([])
    try {
      const res = await fetch(`/api/addresses/streets?neighborhood=${neighborhoodCode}`)
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data)) {
          setStreets(data)
        } else {
          setStreets([])
        }
      } else {
        setStreets([])
      }
    } catch (error) {
      console.error('Streets load error:', error)
      setStreets([])
    } finally {
      setLoading((prev) => ({ ...prev, streets: false }))
    }
  }

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value
    const selected = provinces.find((p) => p.code === code)
    
    setFormData({
      ...formData,
      provinceCode: code,
      province: selected?.name || '',
      districtCode: '',
      district: '',
      neighborhoodCode: '',
      neighborhood: '',
      streetCode: '',
      street: '',
      postalCode: '',
    })
    setErrors(prev => {
      const { province, district, neighborhood } = prev
      return { ...prev, province: '', district, neighborhood }
    })

    if (code) {
      loadDistricts(code)
    }
  }

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value
    const selected = districts.find((d) => d.code === code)
    
    setFormData({
      ...formData,
      districtCode: code,
      district: selected?.name || '',
      neighborhoodCode: '',
      neighborhood: '',
      streetCode: '',
      street: '',
      postalCode: '',
    })
    setErrors(prev => {
      const { district, neighborhood } = prev
      return { ...prev, district: '', neighborhood }
    })

    if (code) {
      loadNeighborhoods(code)
    }
  }

  const handleNeighborhoodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value
    const selected = neighborhoods.find((n) => n.code === code)
    
    setFormData({
      ...formData,
      neighborhoodCode: code,
      neighborhood: selected?.name || '',
      postalCode: selected?.postalCode || '',
      streetCode: '',
      street: '',
    })
    setErrors(prev => ({ ...prev, neighborhood: '' }))

    if (code) {
      loadStreets(code)
    }
  }

  const handleStreetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value
    const selected = streets.find((s) => s.code === code)
    
    setFormData({
      ...formData,
      streetCode: code,
      street: selected?.name || '',
    })
  }

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '')
    if (digits.length <= 4) return digits
    if (digits.length <= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`
    if (digits.length <= 9) return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 9)} ${digits.slice(9, 11)}`
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value)
    setFormData({ ...formData, phone: formatted })
    setErrors(prev => ({ ...prev, phone: '' }))
  }

  const handleInputChange = (field: keyof AddressFormData) => 
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value
      setFormData(prev => ({ ...prev, [field]: value }))
      setErrors(prev => ({ ...prev, [field]: '' }))
    }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newErrors: { [key: string]: string } = {}

    // Zorunlu alanlar kontrolü
    if (!formData.provinceCode) newErrors.province = 'İl seçiniz'
    if (!formData.districtCode) newErrors.district = 'İlçe seçiniz'
    if (!formData.neighborhoodCode) newErrors.neighborhood = 'Mahalle seçiniz'
    if (!formData.addressLine.trim()) newErrors.addressLine = 'Adres detayı giriniz'
    if (!formData.fullName.trim()) newErrors.fullName = 'Ad soyad giriniz'
    if (formData.phone.replace(/\D/g, '').length !== 11) newErrors.phone = 'Geçerli telefon giriniz (0 ile başlayarak 11 hane)'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      // İlk hatayı odakla
      const firstErrorField = Object.keys(newErrors)[0] as keyof AddressFormData
      const element = document.getElementById(firstErrorField)
      element?.focus?.()
      return
    }

    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        id="title"
        label="Adres Başlığı"
        value={formData.title}
        onChange={handleInputChange('title')}
        placeholder="Ev, İş, Yazlık vb."
        error={errors.title}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          id="fullName"
          label="Ad Soyad *"
          value={formData.fullName}
          onChange={handleInputChange('fullName')}
          required
          error={errors.fullName}
        />
        <Input
          id="phone"
          label="Telefon *"
          type="tel"
          value={formData.phone}
          onChange={handlePhoneChange}
          placeholder="05XX XXX XX XX"
          required
          error={errors.phone}
          helperText="0 ile başlayarak giriniz (örn: 0532 123 45 67)"
        />
      </div>

      {/* Adres Seçimi */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-medium mb-2">
            İl <span className="text-danger">*</span>
          </label>
          <select
            id="province"
            value={formData.provinceCode}
            onChange={handleProvinceChange}
            required
            disabled={loading.provinces}
            className="w-full h-[52px] px-5 rounded-button border-[1.5px] border-warm-100 text-base bg-white focus:outline-none focus:border-sage focus:ring-4 focus:ring-sage/10 transition-all disabled:bg-warm-50 disabled:cursor-not-allowed"
          >
            <option value="">Seçiniz...</option>
            {provinces.map((province) => (
              <option key={province.code} value={province.code}>
                {province.name}
              </option>
            ))}
          </select>
          {errors.province && <p className="mt-2 text-sm text-danger">{errors.province}</p>}
          {loading.provinces && <p className="mt-2 text-sm text-neutral-medium">İller yükleniyor...</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-medium mb-2">
            İlçe <span className="text-danger">*</span>
          </label>
          <select
            id="district"
            value={formData.districtCode}
            onChange={handleDistrictChange}
            required
            disabled={!formData.provinceCode || loading.districts}
            className="w-full h-[52px] px-5 rounded-button border-[1.5px] border-warm-100 text-base bg-white focus:outline-none focus:border-sage focus:ring-4 focus:ring-sage/10 transition-all disabled:bg-warm-50 disabled:cursor-not-allowed"
          >
            <option value="">Seçiniz...</option>
            {districts.map((district) => (
              <option key={district.code} value={district.code}>
                {district.name}
              </option>
            ))}
          </select>
          {errors.district && <p className="mt-2 text-sm text-danger">{errors.district}</p>}
          {loading.districts && <p className="mt-2 text-sm text-neutral-medium">İlçeler yükleniyor...</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-medium mb-2">
            Mahalle <span className="text-danger">*</span>
          </label>
          <select
            id="neighborhood"
            value={formData.neighborhoodCode}
            onChange={handleNeighborhoodChange}
            required
            disabled={!formData.districtCode || loading.neighborhoods}
            className="w-full h-[52px] px-5 rounded-button border-[1.5px] border-warm-100 text-base bg-white focus:outline-none focus:border-sage focus:ring-4 focus:ring-sage/10 transition-all disabled:bg-warm-50 disabled:cursor-not-allowed"
          >
            <option value="">Seçiniz...</option>
            {neighborhoods.map((neighborhood) => (
              <option key={neighborhood.code} value={neighborhood.code}>
                {neighborhood.name}
              </option>
            ))}
          </select>
          {errors.neighborhood && <p className="mt-2 text-sm text-danger">{errors.neighborhood}</p>}
          {loading.neighborhoods && <p className="mt-2 text-sm text-neutral-medium">Mahalleler yükleniyor...</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-medium mb-2">
            Sokak
          </label>
          <select
            id="street"
            value={formData.streetCode}
            onChange={handleStreetChange}
            disabled={!formData.neighborhoodCode || loading.streets || streets.length === 0}
            className="w-full h-[52px] px-5 rounded-button border-[1.5px] border-warm-100 text-base bg-white focus:outline-none focus:border-sage focus:ring-4 focus:ring-sage/10 transition-all disabled:bg-warm-50 disabled:cursor-not-allowed"
          >
            <option value="">
              {streets.length === 0 ? 'Sokak verisi yok' : 'Seçiniz...'}
            </option>
            {streets.map((street) => (
              <option key={street.code} value={street.code}>
                {street.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Input
        id="postalCode"
        label="Posta Kodu"
        value={formData.postalCode}
        readOnly
        helperText="Mahalle seçimine göre otomatik doldurulur"
        className="bg-warm-50 cursor-not-allowed"
      />

      <div>
        <label className="block text-sm font-medium text-neutral-medium mb-2">
          Adres Detayı <span className="text-danger">*</span>
        </label>
        <textarea
          id="addressLine"
          value={formData.addressLine}
          onChange={handleInputChange('addressLine')}
          required
          rows={3}
          placeholder="Bina no, daire no, kat, apartman adı vb. detaylar"
          className="w-full px-5 py-3 rounded-button border-[1.5px] border-warm-100 text-base bg-white focus:outline-none focus:border-sage focus:ring-4 focus:ring-sage/10 transition-all resize-none"
        />
        {errors.addressLine && <p className="mt-2 text-sm text-danger">{errors.addressLine}</p>}
      </div>

      <div className="flex gap-3 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          fullWidth 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          İptal
        </Button>
        <Button 
          type="submit" 
          fullWidth 
          loading={isSubmitting}
          disabled={!mounted}
        >
          {editingAddress ? 'Adresi Güncelle' : 'Adresi Kaydet'}
        </Button>
      </div>
    </form>
  )
}

