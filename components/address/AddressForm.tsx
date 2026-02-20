'use client'

import { useState, useEffect } from 'react'
import { Input, Button } from '@/components/ui'

interface AddressFormData {
  title: string
  fullName: string
  phone: string
  province: string
  provinceCode: string
  district: string
  districtCode: string
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
  initialData,
}: AddressFormProps) {
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const [formData, setFormData] = useState<AddressFormData>({
    title: '',
    fullName: '',
    phone: '',
    province: '',
    provinceCode: '',
    district: '',
    districtCode: '',
    neighborhood: '',
    postalCode: '',
    addressLine: '',
  })

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({ ...prev, ...initialData }))
    }
  }, [initialData])

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '')
    if (digits.length <= 4) return digits
    if (digits.length <= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`
    if (digits.length <= 9) return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 9)} ${digits.slice(9, 11)}`
  }

  const handleChange =
    (field: keyof AddressFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value =
        field === 'phone' ? formatPhone(e.target.value) : e.target.value
      setFormData((prev) => ({ ...prev, [field]: value }))
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: { [key: string]: string } = {}
    if (!formData.fullName.trim()) newErrors.fullName = 'Ad soyad giriniz'
    if (formData.phone.replace(/\D/g, '').length !== 11)
      newErrors.phone = 'Geçerli telefon giriniz (0 ile başlayarak 11 hane)'
    if (!formData.province.trim()) newErrors.province = 'İl giriniz'
    if (!formData.district.trim()) newErrors.district = 'İlçe giriniz'
    if (!formData.addressLine.trim()) newErrors.addressLine = 'Adres detayı giriniz'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // provinceCode / districtCode alanlarını province/district ile doldur (geriye dönük uyumluluk)
    onSubmit({
      ...formData,
      provinceCode: formData.provinceCode || formData.province,
      districtCode: formData.districtCode || formData.district,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        id="title"
        label="Adres Başlığı"
        value={formData.title}
        onChange={handleChange('title')}
        placeholder="Ev, İş, Yazlık vb."
        error={errors.title}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="fullName"
          label="Ad Soyad *"
          value={formData.fullName}
          onChange={handleChange('fullName')}
          required
          error={errors.fullName}
        />
        <Input
          id="phone"
          label="Telefon *"
          type="tel"
          value={formData.phone}
          onChange={handleChange('phone')}
          placeholder="05XX XXX XX XX"
          required
          error={errors.phone}
          helperText="0 ile başlayarak giriniz"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="province"
          label="İl *"
          value={formData.province}
          onChange={handleChange('province')}
          placeholder="İstanbul"
          required
          error={errors.province}
        />
        <Input
          id="district"
          label="İlçe *"
          value={formData.district}
          onChange={handleChange('district')}
          placeholder="Kadıköy"
          required
          error={errors.district}
        />
      </div>

      <Input
        id="neighborhood"
        label="Mahalle / Köy"
        value={formData.neighborhood}
        onChange={handleChange('neighborhood')}
        placeholder="Mahalle veya köy adını giriniz"
        error={errors.neighborhood}
      />

      <div>
        <label className="block text-sm font-medium text-neutral-medium mb-2">
          Adres Detayı <span className="text-danger">*</span>
        </label>
        <textarea
          id="addressLine"
          value={formData.addressLine}
          onChange={handleChange('addressLine')}
          required
          rows={3}
          placeholder="Sokak, cadde, bina no, daire no, kat, apartman adı vb."
          className="w-full px-5 py-3 rounded-button border-[1.5px] border-warm-100 text-base bg-white focus:outline-none focus:border-sage focus:ring-4 focus:ring-sage/10 transition-all resize-none"
        />
        {errors.addressLine && (
          <p className="mt-2 text-sm text-danger">{errors.addressLine}</p>
        )}
      </div>

      <Input
        id="postalCode"
        label="Posta Kodu (Opsiyonel)"
        value={formData.postalCode}
        onChange={handleChange('postalCode')}
        placeholder="34000"
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
        <Button type="submit" fullWidth loading={isSubmitting}>
          {initialData ? 'Adresi Güncelle' : 'Adresi Kaydet'}
        </Button>
      </div>
    </form>
  )
}
