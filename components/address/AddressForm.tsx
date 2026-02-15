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

interface AddressFormData {
  title: string
  fullName: string
  phone: string
  provinceCode: string
  province: string
  districtCode: string
  district: string
  neighborhood: string
  postalCode: string
  addressLine: string
}

interface AddressFormProps {
  onSubmit: (data: AddressFormData) => void
  onCancel: () => void
  isSubmitting?: boolean
  initialData?: Partial<AddressFormData> | null
}

export function AddressForm({ 
  onSubmit, 
  onCancel, 
  isSubmitting = false, 
  initialData 
}: AddressFormProps) {
  const [mounted, setMounted] = useState(false)
  const [provinces, setProvinces] = useState<Province[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  
  const [loading, setLoading] = useState({
    provinces: false,
    districts: false,
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
    neighborhood: '',
    postalCode: '',
    addressLine: '',
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        provinceCode: initialData.provinceCode || '',
        districtCode: initialData.districtCode || '',
      }))

      if (initialData.provinceCode) {
        loadDistricts(initialData.provinceCode)
      }
    }
  }, [initialData])

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

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value
    const selected = provinces.find((p) => p.code === code)
    
    setFormData({
      ...formData,
      provinceCode: code,
      province: selected?.name || '',
      districtCode: '',
      district: '',
    })
    setErrors(prev => ({ ...prev, province: '', district: '' }))

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
    })
    setErrors(prev => ({ ...prev, district: '' }))
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

    if (!formData.provinceCode) newErrors.province = 'İl seçiniz'
    if (!formData.districtCode) newErrors.district = 'İlçe seçiniz'
    if (!formData.neighborhood.trim()) newErrors.neighborhood = 'Mahalle/Köy giriniz'
    if (!formData.addressLine.trim()) newErrors.addressLine = 'Adres detayı giriniz'
    if (!formData.fullName.trim()) newErrors.fullName = 'Ad soyad giriniz'
    if (formData.phone.replace(/\D/g, '').length !== 11) newErrors.phone = 'Geçerli telefon giriniz (0 ile başlayarak 11 hane)'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          helperText="0 ile başlayarak giriniz"
        />
      </div>

      {/* İl ve İlçe */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <option value="">İl Seçiniz...</option>
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
            <option value="">{formData.provinceCode ? 'İlçe Seçiniz...' : 'Önce il seçiniz'}</option>
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

      {/* Mahalle/Köy */}
      <Input
        id="neighborhood"
        label="Mahalle / Köy *"
        value={formData.neighborhood}
        onChange={handleInputChange('neighborhood')}
        placeholder="Mahalle veya köy adını giriniz"
        required
        error={errors.neighborhood}
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
          placeholder="Sokak, cadde, bina no, daire no, kat, apartman adı vb. detaylar"
          className="w-full px-5 py-3 rounded-button border-[1.5px] border-warm-100 text-base bg-white focus:outline-none focus:border-sage focus:ring-4 focus:ring-sage/10 transition-all resize-none"
        />
        {errors.addressLine && <p className="mt-2 text-sm text-danger">{errors.addressLine}</p>}
      </div>

      <Input
        id="postalCode"
        label="Posta Kodu (Opsiyonel)"
        value={formData.postalCode}
        onChange={handleInputChange('postalCode')}
        placeholder="Posta kodu"
      />

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
          {initialData ? 'Adresi Güncelle' : 'Adresi Kaydet'}
        </Button>
      </div>
    </form>
  )
}
