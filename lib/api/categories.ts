import { prisma } from '@/lib/prisma'

export async function getAllCategories() {
  return await prisma.category.findMany({
    orderBy: {
      order: 'asc',
    },
  })
}

export async function getCategoryBySlug(slug: string) {
  return await prisma.category.findUnique({
    where: { slug },
    include: {
      products: {
        where: {
          active: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })
}

