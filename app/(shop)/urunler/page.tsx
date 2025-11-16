import { getAllProducts } from '@/lib/api/products'
import { getAllCategories } from '@/lib/api/categories'
import { ProductsPageClient } from '@/components/shop/ProductsPageClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tüm Ürünler - Lioradg',
  description: 'Tüm ürünlerimizi keşfedin',
}

interface AllProductsPageProps {
  searchParams: {
    sayfa?: string
    siralama?: string
    arama?: string
  }
}

export default async function AllProductsPage({ searchParams }: AllProductsPageProps) {
  const allCategories = await getAllCategories()
  const page = parseInt(searchParams.sayfa || '1')
  const perPage = 12
  const orderBy = (searchParams.siralama as any) || 'newest'
  const searchQuery = searchParams.arama || ''

  const { products: allProducts } = await getAllProducts({ orderBy })

  // Client-side filtering
  let filteredProducts = allProducts
  if (searchQuery) {
    const query = searchQuery.toLowerCase()
    filteredProducts = allProducts
      .map(product => {
        const name = product.name.toLowerCase()
        const startsWithQuery = name.startsWith(query)
        const includesQuery = name.includes(query)
        
        return {
          product,
          priority: startsWithQuery ? 2 : includesQuery ? 1 : 0
        }
      })
      .filter(item => item.priority > 0)
      .sort((a, b) => b.priority - a.priority)
      .map(item => item.product)
  }

  const totalFiltered = filteredProducts.length
  const paginatedProducts = filteredProducts.slice((page - 1) * perPage, page * perPage)
  const totalPages = Math.ceil(totalFiltered / perPage)

  return (
    <div className="min-h-screen bg-warm-50">
      {/* Header */}
      <div className="bg-white border-b border-warm-100">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-h1 font-serif font-bold text-neutral mb-3">
            Tüm Ürünler
          </h1>
          <p className="text-base text-neutral-medium">
            {totalFiltered} ürün bulundu {searchQuery && `"${searchQuery}" için`}
          </p>
        </div>
      </div>

      {/* Products with Filters */}
      <div className="container mx-auto px-4 py-12">
        <ProductsPageClient
          categories={allCategories}
          currentCategorySlug="all"
          products={paginatedProducts}
          currentPage={page}
          totalPages={totalPages}
        />
      </div>
    </div>
  )
}

