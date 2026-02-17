'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, Badge, Button } from '@/components/ui'
import { formatPrice } from '@/lib/utils'
import type { Product, Category } from '@prisma/client'

type ProductWithCategory = Product & {
  category: Category
}

interface ProductsTableProps {
  products: ProductWithCategory[]
}

export function ProductsTable({ products }: ProductsTableProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])

  // Benzersiz kategoriler (ID'ye göre)
  const uniqueCategoryIds = Array.from(new Set(products.map(p => p.categoryId)))
  const categories = uniqueCategoryIds.map(id => {
    return products.find(p => p.categoryId === id)!.category
  })

  // Kategori filtresine göre ürünler (durum sayıları için)
  const productsForStatusCount = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.categoryId === selectedCategory
    return matchesCategory
  })

  // Durum filtresine göre ürünler (kategori sayıları için)
  const productsForCategoryCount = products.filter(product => {
    const matchesStatus = selectedStatus === 'all' || 
                         (selectedStatus === 'active' && product.active) ||
                         (selectedStatus === 'inactive' && !product.active) ||
                         (selectedStatus === 'low-stock' && product.stock > 0 && product.stock <= 10) ||
                         (selectedStatus === 'out-of-stock' && product.stock === 0)
    return matchesStatus
  })

  // Filtrelenmiş ürünler
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.categoryId === selectedCategory
    const matchesStatus = selectedStatus === 'all' || 
                         (selectedStatus === 'active' && product.active) ||
                         (selectedStatus === 'inactive' && !product.active) ||
                         (selectedStatus === 'low-stock' && product.stock > 0 && product.stock <= 10) ||
                         (selectedStatus === 'out-of-stock' && product.stock === 0)
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id))
    }
  }

  const handleSelectProduct = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId))
    } else {
      setSelectedProducts([...selectedProducts, productId])
    }
  }

  const handleBulkDelete = async () => {
    if (!confirm(`${selectedProducts.length} ürünü silmek istediğinizden emin misiniz?`)) {
      return
    }

    try {
      const response = await fetch('/api/admin/products/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds: selectedProducts }),
      })

      if (response.ok) {
        window.location.reload()
      } else {
        alert('Ürünler silinirken hata oluştu')
      }
    } catch (error) {
      alert('Ürünler silinirken hata oluştu')
    }
  }

  const handleBulkActivate = async (active: boolean) => {
    try {
      const response = await fetch('/api/admin/products/bulk-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds: selectedProducts, active }),
      })

      if (response.ok) {
        window.location.reload()
      } else {
        alert('Ürünler güncellenirken hata oluştu')
      }
    } catch (error) {
      alert('Ürünler güncellenirken hata oluştu')
    }
  }

  return (
    <div className="space-y-4">
      {/* Filtreler ve Arama */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Arama */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ara
            </label>
            <input
              type="text"
              placeholder="Ürün adı veya SKU ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent"
            />
          </div>

          {/* Kategori Filtresi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategori
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent"
            >
              <option value="all">Tümü ({productsForCategoryCount.length})</option>
              {categories.map(cat => {
                const count = productsForCategoryCount.filter(p => p.categoryId === cat.id).length
                return (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} ({count})
                  </option>
                )
              })}
            </select>
          </div>

          {/* Durum Filtresi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Durum
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent"
            >
              <option value="all">Tümü ({productsForStatusCount.length})</option>
              <option value="active">Aktif ({productsForStatusCount.filter(p => p.active).length})</option>
              <option value="inactive">Pasif ({productsForStatusCount.filter(p => !p.active).length})</option>
              <option value="low-stock">Düşük Stok ({productsForStatusCount.filter(p => p.stock <= 10 && p.stock > 0).length})</option>
              <option value="out-of-stock">Stokta Yok ({productsForStatusCount.filter(p => p.stock === 0).length})</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Toplu İşlemler */}
      {selectedProducts.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-900">
              {selectedProducts.length} ürün seçildi
            </p>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" onClick={() => handleBulkActivate(true)}>
                Aktif Yap
              </Button>
              <Button size="sm" variant="ghost" onClick={() => handleBulkActivate(false)}>
                Pasif Yap
              </Button>
              <Button size="sm" variant="ghost" onClick={handleBulkDelete} className="text-red-600 hover:text-red-700">
                Sil
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Ürün Tablosu */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-left text-sm text-gray-600">
                <th className="px-6 py-4 font-medium">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-sage border-gray-300 rounded focus:ring-sage"
                  />
                </th>
                <th className="px-6 py-4 font-medium">Ürün</th>
                <th className="px-6 py-4 font-medium">Barkod</th>
                <th className="px-6 py-4 font-medium">Kategori</th>
                <th className="px-6 py-4 font-medium">Fiyat</th>
                <th className="px-6 py-4 font-medium">Stok</th>
                <th className="px-6 py-4 font-medium">Durum</th>
                <th className="px-6 py-4 font-medium">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    {searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all'
                      ? 'Filtrelere uygun ürün bulunamadı'
                      : 'Henüz ürün eklenmemiş'}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => handleSelectProduct(product.id)}
                        className="w-4 h-4 text-sage border-gray-300 rounded focus:ring-sage"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={product.images?.split(',')[0] || '/placeholder.jpg'}
                            alt={product.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">SKU: {product.sku || '-'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">
                      {(product as any).barcode || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {product.category.name}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        {product.salePrice ? (
                          <>
                            <p className="font-semibold text-secondary">
                              {formatPrice(product.salePrice)}
                            </p>
                            <p className="text-xs text-gray-500 line-through">
                              {formatPrice(product.price)}
                            </p>
                          </>
                        ) : (
                          <p className="font-semibold text-gray-900">
                            {formatPrice(product.price)}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 text-sm font-medium ${
                          product.stock === 0
                            ? 'text-red-600'
                            : product.stock <= 10
                            ? 'text-yellow-600'
                            : 'text-green-600'
                        }`}
                      >
                        {product.stock} adet
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={product.active ? 'success' : 'default'}>
                        {product.active ? 'Aktif' : 'Pasif'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/urunler/${product.id}`}>
                          <Button size="sm" variant="ghost">
                            Düzenle
                          </Button>
                        </Link>
                        <Link href={`/urun/${product.slug}`} target="_blank">
                          <Button size="sm" variant="ghost">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Sonuç Sayısı */}
      <div className="text-sm text-gray-600 text-center">
        {filteredProducts.length} ürün gösteriliyor (Toplam: {products.length})
      </div>
    </div>
  )
}

