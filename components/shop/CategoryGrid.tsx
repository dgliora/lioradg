'use client'

import Link from 'next/link'
import Image from 'next/image'
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
                    <div className="relative h-56 bg-warm-50">
                      <Image
                        src={category.image || '/placeholder.jpg'}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-600"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral/80 via-neutral/40 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="font-serif font-semibold text-lg text-white mb-1">
                          {category.name}
                        </h3>
                        <span className="text-xs text-white/80 flex items-center gap-1 group-hover:gap-2 transition-all">
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
