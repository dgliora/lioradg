const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const result = await prisma.user.updateMany({
    where: { role: { in: ['ADMIN', 'STAFF'] } },
    data: { emailVerified: new Date() },
  })
  console.log('Guncellendi:', result.count, 'admin/staff kullanici')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
