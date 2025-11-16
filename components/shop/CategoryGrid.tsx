'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Category } from '@/types'
import { Card } from '@/components/ui'

interface CategoryGridProps {
  categories: Category[]
}

export function CategoryGrid({ categories }: CategoryGridProps) {
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
    <section className="section-padding bg-white">
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
              Kategorilerimiz
            </h2>
            <p className="text-body-large text-neutral-medium max-w-2xl mx-auto">
              İhtiyacınıza uygun kategorimizi seçin ve doğal ürünlerimizi keşfedin
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
          >
            {categories.map((category) => (
              <motion.div key={category.id} variants={item}>
                <Link href={`/urunler/${category.slug}`}>
                  <Card
                    hover
                    padding="none"
                    className="group overflow-hidden cursor-pointer h-full relative"
                  >
                    <div className="relative h-56 bg-gradient-to-br from-sage/10 via-warm-50 to-rose/10 overflow-hidden">
                      {/* Emoji Background */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-8xl group-hover:scale-110 transition-transform duration-600 opacity-90">
                          {category.icon || '🏷️'}
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white/95 via-white/80 to-transparent">
                        <h3 className="font-serif font-semibold text-lg mb-1 text-neutral group-hover:text-sage transition-colors">
                          {category.name}
                        </h3>
                        {category.description && (
                          <p className="text-xs text-neutral-light mb-2 line-clamp-1">
                            {category.description}
                          </p>
                        )}
                        <span className="text-xs text-sage font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                          Keşfet
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
