const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const result = await prisma.category.updateMany({
    where: { name: 'Krem & Bakım' },
    data: { name: 'Cilt Bakım', slug: 'cilt-bakim', description: 'Cilt bakım ürünleri, kremler, serumlar, tonikler' }
  });
  console.log('✅ Güncellendi:', result.count);
  await prisma.$disconnect();
}

run();
