'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, Button, Modal, useToast } from '@/components/ui'
import { AddressForm } from '@/components/address/AddressForm'

interface SavedAddress {
  id: string
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
  isDefault?: boolean
}

export default function AddressesPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [addresses, setAddresses] = useState<SavedAddress[]>([])
  const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Hydration için mounted state
  useEffect(() => {
    setMounted(true)
  }, [])

  // LocalStorage'dan adresleri yükle
  useEffect(() => {
    if (mounted) {
      const loadAddresses = () => {
        try {
          const saved = localStorage.getItem('user-addresses')
          if (saved) {
            const parsedAddresses = JSON.parse(saved)
            // Varsayılan adres yoksa ilk adresi varsayılan yap
            if (parsedAddresses.length > 0) {
              const hasDefault = parsedAddresses.some((addr: SavedAddress) => addr.isDefault)
              if (!hasDefault) {
                const updatedAddresses = parsedAddresses.map((addr: SavedAddress, index: number) => ({
                  ...addr,
                  isDefault: index === 0
                }))
                localStorage.setItem('user-addresses', JSON.stringify(updatedAddresses))
                setAddresses(updatedAddresses)
              } else {
                setAddresses(parsedAddresses)
              }
            } else {
              setAddresses([])
            }
          } else {
            setAddresses([])
          }
        } catch (error) {
          console.error('Adres yükleme hatası:', error)
          setAddresses([])
          localStorage.removeItem('user-addresses')
        }
      }

      loadAddresses()
    }
  }, [mounted])

  if (!mounted) {
    return null
  }

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true)
    
    try {
      let updatedAddresses: SavedAddress[]
      let newAddress: SavedAddress

      if (editingAddress) {
        // Düzenleme modu
        newAddress = {
          ...editingAddress,
          ...data,
          isDefault: editingAddress.isDefault,
        }
        updatedAddresses = addresses.map((addr) =>
          addr.id === editingAddress.id ? newAddress : addr
        )
        showToast('Adres güncellendi', 'success')
      } else {
        // Yeni adres ekleme
        newAddress = {
          id: Date.now().toString(),
          ...data,
          isDefault: addresses.length === 0, // İlk adres varsayılan
        }
        updatedAddresses = [...addresses, newAddress]
        showToast('Adres başarıyla kaydedildi!', 'success')
      }

      // LocalStorage'a kaydet
      localStorage.setItem('user-addresses', JSON.stringify(updatedAddresses))
      setAddresses(updatedAddresses)
      
      setIsModalOpen(false)
      setEditingAddress(null)
    } catch (error) {
      console.error('Adres kaydetme hatası:', error)
      showToast('Adres kaydedilemedi', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = (id: string) => {
    if (confirm('Bu adresi silmek istediğinizden emin misiniz?')) {
      const addressToDelete = addresses.find(addr => addr.id === id)
      const remainingAddresses = addresses.filter(addr => addr.id !== id)
      
      if (addressToDelete?.isDefault && remainingAddresses.length > 0) {
        // Varsayılan adres siliniyorsa ilk kalan adresi varsayılan yap
        const updatedAddresses = remainingAddresses.map((addr, index) => ({
          ...addr,
          isDefault: index === 0
        }))
        localStorage.setItem('user-addresses', JSON.stringify(updatedAddresses))
        setAddresses(updatedAddresses)
      } else {
        localStorage.setItem('user-addresses', JSON.stringify(remainingAddresses))
        setAddresses(remainingAddresses)
      }
      
      showToast('Adres silindi', 'success')
    }
  }

  const handleSetDefault = (id: string) => {
    const updatedAddresses = addresses.map((addr) => ({
      ...addr,
      isDefault: addr.id === id,
    }))
    localStorage.setItem('user-addresses', JSON.stringify(updatedAddresses))
    setAddresses(updatedAddresses)
    showToast('Varsayılan adres güncellendi', 'success')
  }

  const handleEdit = (address: SavedAddress) => {
    setEditingAddress(address)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-h2 font-serif font-bold text-neutral mb-1">
            Adreslerim
          </h2>
          <p className="text-sm text-neutral-medium">
            {addresses.length} adres kayıtlı • Teslimat adreslerinizi yönetin
          </p>
        </div>
        <Button onClick={() => {
          setEditingAddress(null)
          setIsModalOpen(true)
        }}>
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Yeni Adres Ekle
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-16 bg-warm-50 rounded-lg border-2 border-dashed border-warm-200">
          <div className="w-16 h-16 bg-warm-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-neutral-medium" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
          </div>
          <h3 className="text-h3 font-serif text-neutral mb-2">Kayıtlı Adres Yok</h3>
          <p className="text-neutral-medium mb-6">Hızlı alışveriş için adres ekleyin</p>
          <Button onClick={() => setIsModalOpen(true)}>
            + Yeni Adres Ekle
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <Card key={address.id} hover className="relative p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2 flex-1">
                  <h3 className="font-serif font-semibold text-neutral truncate">
                    {address.title}
                  </h3>
                  {address.isDefault && (
                    <span className="text-xs bg-sage/10 text-sage px-2 py-1 rounded-full font-medium">
                      Varsayılan
                    </span>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2 ml-4 flex-shrink-0">
                  {!address.isDefault && (
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => handleSetDefault(address.id)}
                      className="h-8 px-3 text-xs"
                    >
                      Varsayılan Yap
                    </Button>
                  )}
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => handleEdit(address)}
                    className="h-8 px-3 text-xs"
                  >
                    Düzenle
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-danger h-8 px-3 text-xs ml-auto"
                    onClick={() => handleDelete(address.id)}
                  >
                    Sil
                  </Button>
                </div>
              </div>
              
              {/* Address Details */}
              <div className="space-y-2 text-sm text-neutral-medium mb-4">
                <p className="font-medium text-neutral">{address.fullName}</p>
                <p className="text-xs">{address.phone}</p>
                <div className="space-y-1">
                  <p className="text-xs">{address.addressLine}</p>
                  {address.street && <p className="text-xs">{address.street}</p>}
                  <p className="text-xs">{address.neighborhood}, {address.district}/{address.province}</p>
                  <p className="text-xs font-mono bg-warm-50 inline-block px-2 py-1 rounded">
                    {address.postalCode}
                  </p>
                </div>
              </div>

              {/* Copy Address Button */}
              <div className="pt-4 border-t border-warm-100">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full text-xs h-8"
                  onClick={() => {
                    const fullAddress = `${address.addressLine}${address.street ? `, ${address.street}` : ''}, ${address.neighborhood}, ${address.district}, ${address.province} ${address.postalCode}`
                    navigator.clipboard.writeText(fullAddress)
                    showToast('Adres kopyalandı', 'success')
                  }}
                >
                  Adresi Kopyala
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Address Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingAddress(null)
        }}
        title={editingAddress ? 'Adresi Düzenle' : 'Yeni Adres Ekle'}
        size="xl"
      >
        <AddressForm
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false)
            setEditingAddress(null)
          }}
          isSubmitting={isSubmitting}
          initialData={editingAddress} // Düzenleme için initial data
        />
      </Modal>
    </div>
  )
}
