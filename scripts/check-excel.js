const XLSX = require('xlsx');

const workbook = XLSX.readFile('./images/urun_listesi_faydalari_guncel.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet, {
  raw: false,
  defval: ''
});

console.log('📊 Excel Sütunları:\n');
if (data.length > 0) {
  const firstRow = data[0];
  Object.keys(firstRow).forEach(key => {
    console.log(`   - "${key}" → ${firstRow[key]}`);
  });
}

console.log('\n📦 Tüm Ürünler ve Fiyatlar:\n');
data.forEach((row, i) => {
  const productName = row['Ürün İsmi'] || row['ÜRÜN İSMİ'] || 'N/A';
  
  // Tüm sütunlardaki fiyat bilgisini ara
  let foundPrice = null;
  Object.keys(row).forEach(key => {
    if (key.toUpperCase().includes('FIYAT') || key.toUpperCase().includes('PRICE')) {
      foundPrice = `"${key}" = ${row[key]}`;
    }
  });
  
  console.log(`${i + 1}. ${productName} → ${foundPrice || 'FİYAT YOK'}`);
});
