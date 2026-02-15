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

// Fotoğraf eşleştirme - isim bazlı
function findProductImages(productName, categoryFolder) {
  const imagesPath = path.join(process.cwd(), 'images', categoryFolder);
  
  if (!fs.existsSync(imagesPath)) {
    console.log(`⚠️  Klasör bulunamadı: ${imagesPath}`);
    return [];
  }

  const files = fs.readdirSync(imagesPath);
  const productSlug = slugify(productName);
  
  // Ürün adındaki anahtar kelimeleri al
  const keywords = productSlug.split('-').filter(k => k.length > 2);
  
  // Dosya adlarıyla eşleşme ara
  const matchedFiles = files.filter(file => {
    const fileSlug = slugify(file.replace(/\.(jpg|jpeg|png|webp)$/i, ''));
    
    // Tam eşleşme
    if (fileSlug === productSlug) return true;
    
    // Kısmi eşleşme (en az 1 keyword)
    return keywords.some(keyword => fileSlug.includes(keyword) || keyword.includes(fileSlug));
  });

  // Birden fazla fotoğraf varsa (kutulu/kutusuz) 2'sini de ekle
  if (matchedFiles.length > 0) {
    return matchedFiles.slice(0, 2).map(file => `/images/${categoryFolder}/${file}`);
  }

  return [];
}

async function syncProducts() {
  try {
    console.log('📊 Excel dosyası okunuyor...');
    
    const workbook = XLSX.readFile('./images/urun_listesi_faydalari_guncel.xlsx');
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // İlk satır başlık olarak ayarla
    const data = XLSX.utils.sheet_to_json(worksheet, {
      raw: false, // String olarak oku
      defval: ''  // Boş hücreler için default değer
    });

    console.log(`✅ ${data.length} ürün bulundu\n`);

    // Kategorileri al
    const categories = await prisma.category.findMany();
    const categoryIdMap = {};
    categories.forEach(cat => {
      categoryIdMap[cat.name] = cat.id;
    });

    console.log('📁 Kategoriler:', Object.keys(categoryIdMap).join(', '), '\n');

    // Mevcut ürünleri al
    const existingProducts = await prisma.product.findMany();
    const existingProductNames = existingProducts.map(p => p.name.toLowerCase());
    
    console.log(`📦 Veritabanında ${existingProducts.length} ürün var\n`);

    const processedProducts = [];
    const errors = [];

    // Her ürünü işle
    for (const row of data) {
      try {
        const productName = row['Ürün İsmi'] || row['Urun Ismi'] || row['ÜRÜN İSMİ'];
        const categoryName = row['Kategori'] || row['KATEGORİ'];
        
        // Fiyat alanını bul - farklı sütun isimleri deneniyor
        let price = 0;
        
        // Tüm sütunları kontrol et (boşluklu olabilir)
        for (const field of Object.keys(row)) {
          if (field.toUpperCase().includes('FIYAT') || field.toUpperCase().includes('PRICE')) {
            const priceValue = String(row[field])
              .replace('TL', '')
              .replace('₺', '')
              .replace(',', '.')
              .trim();
            
            price = parseFloat(priceValue);
            if (!isNaN(price) && price > 0) {
              break;
            }
          }
        }
        
        const benefits = row['Bilinen Faydaları'] || row['Bilinen Faydalari'] || row['BİLİNEN FAYDALARI'] || '';
        const usage = row['Kullanım Alanı'] || row['Kullanim Alani'] || row['KULLANIM ALANI'] || '';
        const features = row['Özellikleri'] || row['Ozellikleri'] || row['ÖZELLİKLERİ'] || '';

        if (!productName) {
          errors.push('Ürün ismi boş');
          continue;
        }

        // Kategori bul
        let categoryId = null;
        let categoryFolder = null;

        // Kategori mapping ile eşleştir
        for (const [folder, name] of Object.entries(categoryMap)) {
          if (categoryIdMap[name]) {
            if (categoryName && categoryName.toLowerCase().includes(folder)) {
              categoryId = categoryIdMap[name];
              categoryFolder = folder;
              break;
            }
          }
        }

        // Kategori bulunamazsa fotoğraflara bakarak tahmin et
        if (!categoryId) {
          for (const [folder, name] of Object.entries(categoryMap)) {
            const images = findProductImages(productName, folder);
            if (images.length > 0) {
              categoryId = categoryIdMap[name];
              categoryFolder = folder;
              console.log(`🔍 "${productName}" için kategori tahmin edildi: ${name}`);
              break;
            }
          }
        }

        if (!categoryId) {
          errors.push(`❌ "${productName}" için kategori bulunamadı`);
          continue;
        }

        // Fotoğrafları bul
        const images = findProductImages(productName, categoryFolder);
        
        if (images.length === 0) {
          console.log(`⚠️  "${productName}" için fotoğraf bulunamadı`);
        }

        const slug = slugify(productName);
        
        // Ürün verisi
        const productData = {
          name: productName,
          slug: slug,
          description: features || '',
          content: benefits || '',
          usage: usage || '',
          price: price > 0 ? price : 99.99,
          salePrice: null,
          stock: 100,
          images: images.length > 0 ? images.join(',') : '/images/placeholder.jpg',
          categoryId: categoryId,
          featured: false,
          active: true
        };
        
        console.log(`   💰 Fiyat: ${price} TL`);

        // Ürün var mı kontrol et
        const existingProduct = existingProducts.find(p => 
          p.name.toLowerCase() === productName.toLowerCase() ||
          p.slug === slug
        );

        if (existingProduct) {
          // Güncelle
          await prisma.product.update({
            where: { id: existingProduct.id },
            data: productData
          });
          console.log(`✅ Güncellendi: ${productName} (${images.length} fotoğraf)`);
        } else {
          // Yeni ekle
          await prisma.product.create({
            data: productData
          });
          console.log(`➕ Eklendi: ${productName} (${images.length} fotoğraf)`);
        }

        processedProducts.push(productName.toLowerCase());

      } catch (error) {
        errors.push(`❌ "${row['Ürün İsmi']}" işlenirken hata: ${error.message}`);
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
