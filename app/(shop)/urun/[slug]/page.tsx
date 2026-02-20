import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getProductBySlug, getRelatedProducts } from '@/lib/api/products'
import { ProductDetail } from '@/components/shop/ProductDetail'
import { formatPrice } from '@/lib/utils'

interface ProductPageProps {
  params: { slug: string }
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lioradg.vercel.app'

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug)

  if (!product) {
    return { title: 'Ürün Bulunamadı' }
  }

  const price = product.salePrice || product.price
  const title = ((product as any).metaTitle ? `${(product as any).metaTitle} - Lioradg` : `${product.name} - Lioradg`)
  const description = (product as any).metaDescription ||
    ((product.description?.slice(0, 155) || product.name) +
    (product.description && product.description.length > 155 ? '...' : '') +
    ` | ${formatPrice(price)}`)
  const image = product.images?.split(',')[0]?.trim()
  const imageUrl = image ? (image.startsWith('http') ? image : `${baseUrl}${image.startsWith('/') ? '' : '/'}${image}`) : undefined

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      ...(imageUrl && { images: [{ url: imageUrl, width: 600, height: 600, alt: product.name }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(imageUrl && { images: [imageUrl] }),
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug)

  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(product.categoryId, product.id)

  return (
    <div className="min-h-screen bg-gray-50">
      <ProductDetail product={product} />

      {relatedProducts.length > 0 && (
        <div className="border-t border-gray-200">
          <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Benzer Ürünler
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => {
                const { ProductCard } = require('@/components/shop/ProductCard')
                return <ProductCard key={relatedProduct.id} product={relatedProduct} />
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

