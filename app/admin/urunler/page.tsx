import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui'
import { ProductsTable } from '@/components/admin/ProductsTable'

async function getProducts() {
  return await prisma.product.findMany({
    include: {
      category: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export default async function AdminProductsPage() {
  const products = await getProducts()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ürün Yönetimi</h1>
          <p className="text-gray-600">{products.length} ürün listeleniyor</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/urunler/toplu-ekle">
            <Button size="lg" variant="outline">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Toplu Ekle (Excel)
            </Button>
          </Link>
          <Link href="/admin/urunler/yeni">
            <Button size="lg">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Yeni Ürün Ekle
            </Button>
          </Link>
        </div>
      </div>

      <ProductsTable products={products} />
    </div>
  )
}

