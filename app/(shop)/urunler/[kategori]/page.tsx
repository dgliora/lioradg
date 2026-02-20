import { notFound } from 'next/navigation'
import { getCategoryBySlug, getAllCategories } from '@/lib/api/categories'
import { getAllProducts } from '@/lib/api/products'
import { ProductsPageClient } from '@/components/shop/ProductsPageClient'
import { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lioradg.com.tr'

interface ProductListingPageProps {
  params: { kategori: string }
  searchParams: {
    sayfa?: string
    siralama?: string
    arama?: string
  }
}

export async function generateMetadata({
  params,
}: ProductListingPageProps): Promise<Metadata> {
  const category = await getCategoryBySlug(params.kategori)

  if (!category) {
    return { title: 'Kategori Bulunamadı' }
  }

  const title = (category as any).metaTitle
    ? `${(category as any).metaTitle} - Lioradg`
    : `${category.name} - Lioradg`
  const description = (category as any).metaDescription ||
    category.description ||
    `${category.name} kategorisindeki tüm doğal ve organik ürünleri keşfedin. Lioradg — Atelier Istanbul.`
  const canonical = `${baseUrl}/urunler/${category.slug}`
  const imageUrl = (category as any).image
    ? ((category as any).image.startsWith('http') ? (category as any).image : `${baseUrl}${(category as any).image}`)
    : undefined

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'Lioradg',
      locale: 'tr_TR',
      type: 'website',
      ...(imageUrl && { images: [{ url: imageUrl, width: 800, height: 600, alt: category.name }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(imageUrl && { images: [imageUrl] }),
    },
  }
}

export default async function ProductListingPage({
  params,
  searchParams,
}: ProductListingPageProps) {
  const category = await getCategoryBySlug(params.kategori)
  const allCategories = await getAllCategories()

  if (!category) {
    notFound()
  }

  const page = parseInt(searchParams.sayfa || '1')
  const perPage = 12
  const orderBy = (searchParams.siralama as any) || 'newest'
  const searchQuery = searchParams.arama || ''

  const { products: allProducts, total } = await getAllProducts({
    categorySlug: params.kategori,
    orderBy,
  })

  // Client-side filtering for type-ahead search
  let filteredProducts = allProducts
  if (searchQuery) {
    const query = searchQuery.toLowerCase()
    filteredProducts = allProducts
      .map(product => {
        const name = product.name.toLowerCase()
        // Prioritize products starting with search query
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
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-h1 font-bold text-neutral-900 mb-2">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-base text-neutral-600">{category.description}</p>
          )}
          <p className="text-small text-neutral-500 mt-2">
            {totalFiltered} ürün bulundu {searchQuery && `"${searchQuery}" için`}
          </p>
        </div>
      </div>

      {/* Products with Filters */}
      <div className="container mx-auto px-4 py-8">
        <ProductsPageClient
          categories={allCategories}
          currentCategorySlug={params.kategori}
          products={paginatedProducts}
          currentPage={page}
          totalPages={totalPages}
        />
      </div>
    </div>
  )
}

