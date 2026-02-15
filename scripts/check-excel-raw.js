const XLSX = require('xlsx');

const workbook = XLSX.readFile('./images/urun_listesi_faydalari_guncel.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

console.log('📊 Excel RAW Data (ilk 10 satır):\n');

// Range'i al
const range = XLSX.utils.decode_range(worksheet['!ref']);
console.log(`Satırlar: ${range.s.r} - ${range.e.r}`);
console.log(`Sütunlar: ${range.s.c} - ${range.e.c}\n`);

// İlk 5 satırı göster
for (let R = range.s.r; R <= Math.min(range.s.r + 5, range.e.r); R++) {
  console.log(`\n━━━ SATIR ${R + 1} ━━━`);
  for (let C = range.s.c; C <= range.e.c; C++) {
    const cell_address = XLSX.utils.encode_cell({ r: R, c: C });
    const cell = worksheet[cell_address];
    if (cell) {
      console.log(`  [${cell_address}] = "${cell.v}"`);
    }
  }
}
