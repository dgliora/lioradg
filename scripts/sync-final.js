const XLSX = require('xlsx');
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

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

function findProductImages(productName) {
  const folders = ['bitkiselyaglar', 'odavetekstil', 'krembakim', 'tonikler', 'sampuan-sacbakim', 'parfumler'];
  const productSlug = slugify(productName);
  const keywords = productSlug.split('-').filter(k => k.length > 2);
  
  for (const folder of folders) {
    const imagesPath = path.join(process.cwd(), 'images', folder);
    if (!fs.existsSync(imagesPath)) continue;
    
    const files = fs.readdirSync(imagesPath);
    const matchedFiles = files.filter(file => {
      const fileSlug = slugify(file.replace(/\.(jpg|jpeg|png|webp)$/i, ''));
      if (fileSlug === productSlug) return true;
      return keywords.some(keyword => fileSlug.includes(keyword) || keyword.includes(fileSlug));
    });

    if (matchedFiles.length > 0) {
      return matchedFiles.map(file => `/images/${folder}/${file}`);
    }
  }
  return [];
}

// Excel'deki kategori adını DB'deki kategori adıyla eşleştir
const categoryNameMap = {
  'Bitkisel Yağlar': 'Bitkisel Yağlar',
  'Cilt Bakım': 'Cilt Bakım',
  'Oda ve Tekstil Kokuları': 'Oda ve Tekstil Kokuları',
  'Tonik': 'Tonikler',
  'Şampuan & Saç Bakım': 'Şampuan & Saç Bakım',
  'Parfümler': 'Parfümler',
};

async function syncProducts() {
  try {
    console.log('📊 Excel dosyası okunuyor...\n');
    
    const workbook = XLSX.readFile('./images/urun_listesi_faydalari_guncel.xlsx');
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const range = XLSX.utils.decode_range(worksheet['!ref']);

    // Kategorileri al
    const categories = await prisma.category.findMany();
    const categoryIdMap = {};
    categories.forEach(cat => { categoryIdMap[cat.name] = cat.id; });

    // "Tonik" kategorisini kontrol et, yoksa "Tonikler"i "Tonik" olarak güncelle
    if (!categoryIdMap['Tonik'] && categoryIdMap['Tonikler']) {
      // Tonikler'i de kabul et
      categoryIdMap['Tonik'] = categoryIdMap['Tonikler'];
    }

    console.log('📁 Kategoriler:', JSON.stringify(categoryIdMap, null, 2), '\n');

    // TÜM ürünleri sil
    await prisma.cartItem.deleteMany({});
    await prisma.product.deleteMany({});
    console.log('🗑️  Mevcut ürünler silindi.\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    let successCount = 0;
    let errorCount = 0;

    // Excel yapısı:
    // B = Kategori, C = Ürün İsmi, D = Kullanım Alanı, E = Özellikleri, F = Bilinen Faydaları, G = BARKOD, H = FİYAT
    
    for (let R = 1; R <= range.e.r; R++) {
      const rowNum = R + 1;
      
      const categoryRaw = worksheet[`B${rowNum}`]?.v;
      const productName = worksheet[`C${rowNum}`]?.v;
      if (!productName || productName === 'Ürün İsmi') continue;
      
      const usage = worksheet[`D${rowNum}`]?.v || '';
      const features = worksheet[`E${rowNum}`]?.v || '';
      const benefits = worksheet[`F${rowNum}`]?.v || '';
      const barcode = worksheet[`G${rowNum}`]?.v || '';
      const priceRaw = worksheet[`H${rowNum}`]?.v || '';
      
      const priceStr = String(priceRaw).replace('TL', '').replace('₺', '').replace(',', '.').trim();
      const price = parseFloat(priceStr) || 0;

      // Fotoğrafları bul
      const images = findProductImages(productName);

      // Kategori eşleştir
      const categoryName = categoryRaw ? categoryRaw.trim() : '';
      let categoryId = categoryIdMap[categoryName];
      
      // Eşleşmezse mapping'den dene
      if (!categoryId && categoryNameMap[categoryName]) {
        categoryId = categoryIdMap[categoryNameMap[categoryName]];
      }

      if (!categoryId) {
        console.log(`❌ "${productName}" - Kategori bulunamadı: "${categoryName}"`);
        errorCount++;
        continue;
      }

      const slug = slugify(productName);
      
      try {
        await prisma.product.create({
          data: {
            name: String(productName),
            slug: slug,
            description: String(features),
            content: String(benefits),
            usage: String(usage),
            price: price,
            salePrice: null,
            sku: barcode ? String(barcode) : null,
            stock: 100,
            images: images.length > 0 ? images.join(',') : '',
            categoryId: categoryId,
            featured: false,
            active: true
          }
        });

        const imgInfo = images.length > 1 ? `📸x${images.length}` : images.length === 1 ? '📸' : '🚫';
        console.log(`✅ [${categoryName}] ${productName} | ${price} TL | ${imgInfo}`);
        successCount++;
        
      } catch (error) {
        console.log(`❌ ${productName} - HATA: ${error.message.substring(0, 100)}`);
        errorCount++;
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`\n📊 SONUÇ: ${successCount} ürün eklendi, ${errorCount} hata\n`);

  } catch (error) {
    console.error('❌ HATA:', error);
  } finally {
    await prisma.$disconnect();
  }
}

syncProducts();
