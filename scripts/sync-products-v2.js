const XLSX = require('xlsx');
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

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

// Kategori mapping
const categoryMap = {
  'bitkiselyaglar': 'Bitkisel Yağlar',
  'odavetekstil': 'Oda ve Tekstil Kokuları',
  'krembakim': 'Krem & Bakım',
  'tonikler': 'Tonikler',
  'sampuan-sacbakim': 'Şampuan & Saç Bakım',
  'parfumler': 'Parfümler'
};

// Fotoğraf eşleştirme
function findProductImages(productName, categoryFolder) {
  const imagesPath = path.join(process.cwd(), 'images', categoryFolder);
  
  if (!fs.existsSync(imagesPath)) {
    return [];
  }

  const files = fs.readdirSync(imagesPath);
  const productSlug = slugify(productName);
  const keywords = productSlug.split('-').filter(k => k.length > 2);
  
  const matchedFiles = files.filter(file => {
    const fileSlug = slugify(file.replace(/\.(jpg|jpeg|png|webp)$/i, ''));
    if (fileSlug === productSlug) return true;
    return keywords.some(keyword => fileSlug.includes(keyword) || keyword.includes(fileSlug));
  });

  if (matchedFiles.length > 0) {
    return matchedFiles.slice(0, 2).map(file => `/images/${categoryFolder}/${file}`);
  }

  return [];
}

async function syncProducts() {
  try {
    console.log('📊 Excel dosyası okunuyor (RAW mode)...\n');
    
    const workbook = XLSX.readFile('./images/urun_listesi_faydalari_guncel.xlsx');
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const range = XLSX.utils.decode_range(worksheet['!ref']);

    // Kategorileri al
    const categories = await prisma.category.findMany();
    const categoryIdMap = {};
    categories.forEach(cat => {
      categoryIdMap[cat.name] = cat.id;
    });

    console.log('📁 Kategoriler:', Object.keys(categoryIdMap).join(', '), '\n');

    // Mevcut ürünleri al
    const existingProducts = await prisma.product.findMany();
    console.log(`📦 Veritabanında ${existingProducts.length} ürün var\n`);

    const processedProducts = [];
    const errors = [];

    // Her satırı oku (1. satır başlık, 2. satırdan başla)
    for (let R = range.s.r + 1; R <= range.e.r; R++) {
      try {
        // Hücreleri oku
        const rowNum = R;
        const productName = worksheet[`B${rowNum}`]?.v || '';
        const usage = worksheet[`C${rowNum}`]?.v || '';
        const features = worksheet[`D${rowNum}`]?.v || '';
        const benefits = worksheet[`E${rowNum}`]?.v || '';
        const barcode = worksheet[`F${rowNum}`]?.v || '';
        const priceRaw = worksheet[`G${rowNum}`]?.v || '';

        if (!productName) continue;

        // Fiyatı parse et
        const priceStr = String(priceRaw).replace('TL', '').replace('₺', '').replace(',', '.').trim();
        const price = parseFloat(priceStr) || 99.99;

        console.log(`\n📦 ${productName}`);
        console.log(`   💰 Fiyat: ${price} TL (raw: "${priceRaw}")`);

        // Kategori bul
        let categoryId = null;
        let categoryFolder = null;

        for (const [folder, name] of Object.entries(categoryMap)) {
          const images = findProductImages(productName, folder);
          if (images.length > 0) {
            categoryId = categoryIdMap[name];
            categoryFolder = folder;
            console.log(`   🔍 Kategori: ${name} (${images.length} fotoğraf)`);
            break;
          }
        }

        if (!categoryId) {
          errors.push(`❌ "${productName}" için kategori bulunamadı`);
          console.log(`   ❌ Kategori bulunamadı`);
          continue;
        }

        // Fotoğrafları bul
        const images = findProductImages(productName, categoryFolder);
        const slug = slugify(productName);
        
        // Ürün verisi
        const productData = {
          name: productName,
          slug: slug,
          description: features || '',
          content: benefits || '',
          usage: usage || '',
          price: price,
          salePrice: null,
          sku: barcode ? String(barcode) : '',
          stock: 100,
          images: images.length > 0 ? images.join(',') : '/images/placeholder.jpg',
          categoryId: categoryId,
          featured: false,
          active: true
        };

        // Ürün var mı kontrol et
        const existingProduct = existingProducts.find(p => 
          p.name.toLowerCase() === productName.toLowerCase() ||
          p.slug === slug
        );

        if (existingProduct) {
          await prisma.product.update({
            where: { id: existingProduct.id },
            data: productData
          });
          console.log(`   ✅ Güncellendi`);
        } else {
          await prisma.product.create({
            data: productData
          });
          console.log(`   ➕ Eklendi`);
        }

        processedProducts.push(productName.toLowerCase());

      } catch (error) {
        errors.push(`❌ Satır ${R} işlenirken hata: ${error.message}`);
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Eşleşmeyen ürünleri sil
    const productsToDelete = existingProducts.filter(p => 
      !processedProducts.includes(p.name.toLowerCase())
    );

    if (productsToDelete.length > 0) {
      console.log(`🗑️  ${productsToDelete.length} eşleşmeyen ürün siliniyor:\n`);
      
      for (const product of productsToDelete) {
        await prisma.product.delete({
          where: { id: product.id }
        });
        console.log(`   ❌ Silindi: ${product.name}`);
      }
    } else {
      console.log('✅ Silinecek ürün yok\n');
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('📊 ÖZET:\n');
    console.log(`   ✅ İşlenen ürün: ${processedProducts.length}`);
    console.log(`   🗑️  Silinen ürün: ${productsToDelete.length}`);
    console.log(`   ❌ Hata: ${errors.length}\n`);

    if (errors.length > 0) {
      console.log('⚠️  HATALAR:\n');
      errors.forEach(err => console.log(`   ${err}`));
    }

    console.log('\n✅ Senkronizasyon tamamlandı!\n');

  } catch (error) {
    console.error('❌ HATA:', error);
  } finally {
    await prisma.$disconnect();
  }
}

syncProducts();
