const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkProducts() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true
      },
      orderBy: {
        category: {
          name: 'asc'
        }
      }
    });

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('📦 ÜRÜN LİSTESİ\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    let currentCategory = '';
    let categoryCount = 0;
    const categoryStats = {};

    products.forEach(product => {
      const catName = product.category.name;
      
      if (catName !== currentCategory) {
        if (currentCategory) {
          console.log(`   └─ ${categoryCount} ürün\n`);
        }
        currentCategory = catName;
        categoryCount = 0;
        console.log(`${product.category.icon} ${catName}:`);
        categoryStats[catName] = 0;
      }
      
      categoryCount++;
      categoryStats[catName]++;
      
      const imageCount = product.images.split(',').filter(img => img && img !== '/images/placeholder.jpg').length;
      const imageIcon = imageCount > 1 ? '📸📸' : imageCount === 1 ? '📸' : '❌';
      
      console.log(`   ${imageIcon} ${product.name} - ${product.price} TL`);
    });

    if (currentCategory) {
      console.log(`   └─ ${categoryCount} ürün\n`);
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('📊 İSTATİSTİKLER\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    let totalProducts = 0;
    let totalWith2Photos = 0;
    let totalWith1Photo = 0;
    let totalWithoutPhoto = 0;

    Object.entries(categoryStats).forEach(([name, count]) => {
      console.log(`   ${count} ürün - ${name}`);
      totalProducts += count;
    });

    products.forEach(p => {
      const imageCount = p.images.split(',').filter(img => img && img !== '/images/placeholder.jpg').length;
      if (imageCount > 1) totalWith2Photos++;
      else if (imageCount === 1) totalWith1Photo++;
      else totalWithoutPhoto++;
    });

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log(`   📦 Toplam: ${totalProducts} ürün`);
    console.log(`   📸📸 2 Fotoğraflı: ${totalWith2Photos} ürün`);
    console.log(`   📸 1 Fotoğraflı: ${totalWith1Photo} ürün`);
    console.log(`   ❌ Fotoğrafsız: ${totalWithoutPhoto} ürün`);
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ HATA:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProducts();
