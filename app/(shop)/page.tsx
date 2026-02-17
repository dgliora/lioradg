import { Hero } from '@/components/shop/Hero'
import { CategoryGrid } from '@/components/shop/CategoryGrid'
import { FeaturedProducts } from '@/components/shop/FeaturedProducts'
import { FAQSection } from '@/components/shop/FAQSection'
import { Newsletter } from '@/components/shop/Newsletter'
import { CampaignPopup } from '@/components/shop/CampaignPopup'
import { CampaignModal } from '@/components/shop/CampaignModal'
import { getAllCategories } from '@/lib/api/categories'
import { getAllProducts } from '@/lib/api/products'

export default async function HomePage() {
  const categories = await getAllCategories()
  const { products: featuredProducts } = await getAllProducts({
    featured: true,
    limit: 8,
  })

  return (
    <div>
      <Hero />
      <CategoryGrid categories={categories} />
      <FeaturedProducts products={featuredProducts} />
      <FAQSection />
      <Newsletter />
      <CampaignModal />
      <CampaignPopup />
    </div>
  )
}

