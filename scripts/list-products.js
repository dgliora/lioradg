const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function run() {
  const products = await p.product.findMany({
    include: { category: true },
    orderBy: { category: { name: 'asc' } }
  });

  let cat = '';
  products.forEach(prod => {
    if (prod.category.name !== cat) {
      cat = prod.category.name;
      console.log(`\n${cat}:`);
    }
    console.log(`  ${prod.name} | ${prod.images.substring(0, 70)}`);
  });

  await p.$disconnect();
}

run();
