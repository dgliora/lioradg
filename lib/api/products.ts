import { prisma } from '@/lib/prisma'

export async function getAllProducts(options?: {
  categorySlug?: string
  featured?: boolean
  limit?: number
  skip?: number
  orderBy?: 'newest' | 'price-asc' | 'price-desc' | 'popular'
}) {
  const {
    categorySlug,
    featured,
    limit,
    skip,
    orderBy = 'newest',
  } = options || {}

  const where: any = {
    active: true,
  }

  if (categorySlug) {
    where.category = {
      slug: categorySlug,
    }
  }

  if (featured) {
    where.featured = true
  }

  let order: any = {}
  switch (orderBy) {
    case 'newest':
      order = { createdAt: 'desc' }
      break
    case 'price-asc':
      order = { price: 'asc' }
      break
    case 'price-desc':
      order = { price: 'desc' }
      break
    case 'popular':
      order = { featured: 'desc' }
      break
  }

  const products = await prisma.product.findMany({
    where,
    include: {
      category: true,
    },
    orderBy: order,
    take: limit,
    skip,
  })

  const total = await prisma.product.count({ where })

  return { products, total }
}

export async function getProductBySlug(slug: string) {
  return await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      reviews: {
        where: {
          approved: true,
        },
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })
}

export async function getRelatedProducts(categoryId: string, currentProductId: string, limit = 4) {
  return await prisma.product.findMany({
    where: {
      categoryId,
      active: true,
      id: {
        not: currentProductId,
      },
    },
    include: {
      category: true,
    },
    take: limit,
  })
}

