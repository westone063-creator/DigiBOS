const fs = require('fs');
let code = fs.readFileSync('src/components/Pinbuk.tsx', 'utf8');

code = code.replace(/nomor: '0120042602100',/g, "nomor: localStorage.getItem('noRekeningSekolah') || '0120042602100',");
code = code.replace(/nama: kopSurat\.kopBaris3/g, "nama: localStorage.getItem('atasNamaRekening') || kopSurat.kopBaris3");

fs.writeFileSync('src/components/Pinbuk.tsx', code);
console.log("Patched Pinbuk.tsx dummy data");
