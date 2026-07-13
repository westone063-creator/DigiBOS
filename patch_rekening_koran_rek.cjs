const fs = require('fs');
let code = fs.readFileSync('src/components/RekeningKoran.tsx', 'utf8');

// Patch initialFormState
code = code.replace(/noRekening: '',/g, "noRekening: localStorage.getItem('noRekeningSekolah') || '',");
code = code.replace(/namaRekening: 'SMK Negeri 1 Jakarta',/g, "namaRekening: localStorage.getItem('atasNamaRekening') || 'SMK Negeri 1 Jakarta',");

// Patch Preview Render
code = code.replace(/\{selectedData\.noRekening\}/g, '{selectedData.noRekening || localStorage.getItem("noRekeningSekolah")}');
code = code.replace(/\{selectedData\.namaRekening\}/g, '{selectedData.namaRekening || localStorage.getItem("atasNamaRekening")}');

fs.writeFileSync('src/components/RekeningKoran.tsx', code);
console.log("Patched RekeningKoran.tsx");
