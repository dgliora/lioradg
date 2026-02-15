const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Görselden okunan doğru eşleştirme:
// sikilastiricinemlendiriciyuzkremi = "Sıkılaştırıcı Nemlendirici Yüz Kremi - Kolajen/Peptitler" → Collagen Peptit Nemlendirici Krem
// yogunnemlendiriciyuzkremi = "Yoğun Nemlendirici Yüz Kremi - Hyalüronik Asit/Akgünlük" → Hyaluronic Acid Akgünlük Kremi
// sikilastiricinemlendiricserum = "Sıkılaştırıcı Nemlendirici Serum - Peptitler/Complex Asit" → Peptit Complex Acid Serum
// yogunnemlendiricserum = "Yoğun Nemlendirici Serum - Hyalüronik Asit/Kolajen" → Hyalüronik Asit - Collagen Serum

const imageMapping = {
  'Hyaluronic Acid Akgünlük Kremi 50 ml': '/images/krembakim/yogunnemlendiriciyuzkremi.jpg,/images/krembakim/yogunnemlendiriciyuzkremi2.png',
  'Collagen Peptit Nemlendirici Krem 50 ml': '/images/krembakim/sikilastiricinemlendiriciyuzkremi2.jpg,/images/krembakim/sikilastiricinemlendiriciyuzkremi.png',
  'Hyalüronik Asit - Collagen Serum 30 ml': '/images/krembakim/yogunnemlendiricserum.jpg,/images/krembakim/yogunnemlendiricserum2.png',
  'Peptit Complex Acid Serum 30 ml': '/images/krembakim/sikilastiricinemlendiricserum.jpg,/images/krembakim/sikilastiricinemlendiricserum2.png',
  'Saf Biberiye Suyu Tonik 100 ml': '/images/krembakim/biberiye.png',
  'Saf Gül Mayası Tonik 100 ml': '/images/krembakim/gulmayasi.png',
  'Saf Ölmez Çiçek Suyu Tonik 100 ml': '/images/krembakim/olmezcicek.png',
  'Makyaj Temizleme Suyu 100 ml': '/images/krembakim/tonikmakyatemizleme.png',
  'Japon Kiraz Çiçeği Saç Sirkesi 200 ml': '/images/krembakim/japonkkiraz.png',
};

async function fixImages() {
  for (const [productName, images] of Object.entries(imageMapping)) {
    const result = await prisma.product.updateMany({
      where: { name: productName },
      data: { images: images }
    });
    
    const count = images.split(',').length;
    console.log(`✅ ${productName} → ${count} fotoğraf`);
  }

  await prisma.$disconnect();
  console.log('\n✅ Tüm fotoğraflar düzeltildi!');
}

fixImages();
