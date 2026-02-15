const XLSX = require('xlsx');

const workbook = XLSX.readFile('./images/urun_listesi_faydalari_guncel.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const range = XLSX.utils.decode_range(worksheet['!ref']);

console.log('📊 Excel RAW Data - Tüm Satırlar:\n');
console.log(`Toplam satır: ${range.e.r}, Toplam sütun: ${range.e.c}\n`);

for (let R = 0; R <= range.e.r; R++) {
  const rowNum = R + 1;
  const cells = {};
  for (let C = 0; C <= range.e.c; C++) {
    const addr = XLSX.utils.encode_cell({ r: R, c: C });
    if (worksheet[addr]) {
      const colLetter = String.fromCharCode(65 + C);
      cells[colLetter] = worksheet[addr].v;
    }
  }
  if (Object.keys(cells).length > 0) {
    console.log(`Satır ${rowNum}:`, JSON.stringify(cells));
  }
}
