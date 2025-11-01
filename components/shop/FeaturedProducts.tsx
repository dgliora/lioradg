'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Product } from '@/types'
import { ProductCard } from './ProductCard'
import { Button } from '@/components/ui'

interface FeaturedProductsProps {
  products: Product[]
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <section className="section-padding bg-warm-50">
      <div className="container mx-auto px-4">
        <div className="max-w-container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-h2 font-serif font-bold mb-6 text-neutral">
              Öne Çıkan Ürünler
            </h2>
            <p className="text-body-large text-neutral-medium max-w-2xl mx-auto">
              En çok tercih edilen ve beğenilen premium ürünlerimiz
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-16"
          >
            {products.map((product) => (
              <motion.div key={product.id} variants={item}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center">
            <Link href="/urunler/krem-bakim">
              <Button size="lg" variant="outline">
                Tüm Ürünleri Görüntüle
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
