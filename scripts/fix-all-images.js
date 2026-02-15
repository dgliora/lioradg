const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Doğru eşleştirme - görselden doğrulandı
const corrections = {
  // BITKISEL YAGLAR (10ml küçük şişe) - sadece bitkiselyaglar klasöründen
  'Gül Yağı 10 ml': '/images/bitkiselyaglar/gul.jpeg',
  'Biberiye Yağı 10 ml': '/images/bitkiselyaglar/biberiye.jpeg',
  'Amber Oud Yağı 10 ml': '', // bitkiselyaglar klasöründe amber/oud yok, resimsiz
  'Vanilya Yağı 10 ml': '/images/bitkiselyaglar/vanilya.jpeg',
  'Sandal Ağacı Yağı 10 ml': '/images/bitkiselyaglar/sandalagaci.jpeg',
  'Okaliptus Yağı 10 ml': '', // resimsiz
  'Japon Kiraz Yağı 10 ml': '', // bitkiselyaglar klasöründe kiraz yok, resimsiz
  'Okyanus Yağı 10 ml': '', // resimsiz
  'Pudra Yağı 10 ml': '/images/bitkiselyaglar/pudra.jpeg',
  'Afrika Yağı 10 ml': '/images/bitkiselyaglar/afrika.jpeg',
  'Sedir Ağacı Yağı 10 ml': '', // sedir fotoğrafı yok (sandalagaci farklı ürün!)
  'Nane Yağı 10 ml': '/images/bitkiselyaglar/nane.jpeg',
  'Mango Yağı 10 ml': '/images/bitkiselyaglar/mango.jpeg',
  'Nar Yağı 10 ml': '/images/bitkiselyaglar/nar.jpeg',
  'Aynısefa Yağı 10 ml': '', // resimsiz
  'Melisa Yağı 10 ml': '', // resimsiz

  // ODA VE TEKSTİL KOKULARI (500ml sprey şişe) - sadece odavetekstil klasöründen
  'Pudra Oda Kokusu 500 ml': '/images/odavetekstil/pudra.jpeg',
  'Oud Oda Kokusu 500 ml': '/images/odavetekstil/oud.jpeg',
  'Amber Oda Kokusu 500 ml': '/images/odavetekstil/amber.jpeg',
  'Beyaz Sabun Oda Kokusu 500 ml': '/images/odavetekstil/beyazsabun.jpeg',
  'Japon Kiraz Çiçeği Oda Kokusu 500 ml': '/images/odavetekstil/kiraz.jpeg',
  'Milano Oda Kokusu 500 ml': '/images/odavetekstil/milano.jpeg',
  'Kudüs Oda Kokusu 500 ml': '/images/odavetekstil/kudus.jpeg',
  'İstanbul Oda Kokusu 500 ml': '/images/odavetekstil/istanbul.jpeg',
  'Gül Oda Kokusu 500 ml': '/images/odavetekstil/gul.jpeg',

  // CİLT BAKIM
  'Hyaluronic Acid Akgünlük Kremi 50 ml': '/images/krembakim/yogunnemlendiriciyuzkremi.jpg,/images/krembakim/yogunnemlendiriciyuzkremi2.png',
  'Collagen Peptit Nemlendirici Krem 50 ml': '/images/krembakim/sikilastiricinemlendiriciyuzkremi2.jpg,/images/krembakim/sikilastiricinemlendiriciyuzkremi.png',
  'Hyalüronik Asit - Collagen Serum 30 ml': '/images/krembakim/yogunnemlendiricserum.jpg,/images/krembakim/yogunnemlendiricserum2.png',
  'Peptit Complex Acid Serum 30 ml': '/images/krembakim/sikilastiricinemlendiricserum.jpg,/images/krembakim/sikilastiricinemlendiricserum2.png',
  'Makyaj Temizleme Suyu 100 ml': '/images/krembakim/tonikmakyatemizleme.png',

  // TONİKLER
  'Saf Biberiye Suyu Tonik 100 ml': '/images/krembakim/biberiye.png',
  'Saf Gül Mayası Tonik 100 ml': '/images/krembakim/gulmayasi.png',
  'Saf Ölmez Çiçek Suyu Tonik 100 ml': '/images/krembakim/olmezcicek.png',

  // ŞAMPUAN & SAÇ BAKIM
  'Japon Kiraz Çiçeği Saç Sirkesi 200 ml': '/images/krembakim/japonkkiraz.png',
};

async function fix() {
  for (const [name, images] of Object.entries(corrections)) {
    const result = await prisma.product.updateMany({
      where: { name },
      data: { images }
    });
    
    const status = images ? (images.includes(',') ? '📸📸' : '📸') : '🚫';
    console.log(`${status} ${name}`);
  }

  await prisma.$disconnect();
  console.log('\n✅ Tüm fotoğraflar düzeltildi!');
}

fix();
