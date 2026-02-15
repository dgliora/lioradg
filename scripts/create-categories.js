const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Türkçe karakter dönüştürme
function slugify(text) {
  const trMap = {
    'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
    'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u'
  };
  
  let slug = text;
  Object.keys(trMap).forEach(key => {
    slug = slug.replace(new RegExp(key, 'g'), trMap[key]);
  });
  
  return slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

async function createCategories() {
  try {
    const categories = [
      {
        name: 'Krem & Bakım',
        description: 'Yüz ve cilt bakım ürünleri, kremler, serumlar',
        icon: '🧴',
        order: 4
      },
      {
        name: 'Tonikler',
        description: 'Doğal tonik ve yüz suları',
        icon: '💧',
        order: 5
      },
      {
        name: 'Şampuan & Saç Bakım',
        description: 'Saç bakım ürünleri ve şampuanlar',
        icon: '🧴',
        order: 6
      },
      {
        name: 'Parfümler',
        description: 'Doğal parfümler ve kokular',
        icon: '🌸',
        order: 7
      }
    ];

    console.log('📁 Kategoriler oluşturuluyor...\n');

    for (const category of categories) {
      const slug = slugify(category.name);
      
      // Var mı kontrol et
      const existing = await prisma.category.findUnique({
        where: { slug }
      });

      if (existing) {
        console.log(`✅ Zaten var: ${category.name}`);
        continue;
      }

      // Oluştur
      await prisma.category.create({
        data: {
          ...category,
          slug
        }
      });

      console.log(`➕ Eklendi: ${category.name} (${category.icon})`);
    }

    console.log('\n✅ Kategoriler hazır!\n');
    
    // Tüm kategorileri göster
    const allCategories = await prisma.category.findMany({
      orderBy: { order: 'asc' }
    });

    console.log('📊 TÜM KATEGORİLER:\n');
    allCategories.forEach(cat => {
      console.log(`   ${cat.icon} ${cat.name} (${cat.slug})`);
    });

  } catch (error) {
    console.error('❌ HATA:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createCategories();
