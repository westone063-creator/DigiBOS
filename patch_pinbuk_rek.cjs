const fs = require('fs');
let code = fs.readFileSync('src/components/Pinbuk.tsx', 'utf8');

code = code.replace(/\{selectedData\.rekeningSumber\.nomor\}/g, '{localStorage.getItem("noRekeningSekolah") || selectedData.rekeningSumber.nomor}');
code = code.replace(/\{selectedData\.rekeningSumber\.nama\}/g, '{localStorage.getItem("atasNamaRekening") || selectedData.rekeningSumber.nama}');

fs.writeFileSync('src/components/Pinbuk.tsx', code);
console.log("Patched Pinbuk.tsx");
