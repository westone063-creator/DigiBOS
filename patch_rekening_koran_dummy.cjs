const fs = require('fs');
let code = fs.readFileSync('src/components/RekeningKoran.tsx', 'utf8');

code = code.replace(/noRekening: '123-456-789-0',/g, "noRekening: localStorage.getItem('noRekeningSekolah') || '123-456-789-0',");

fs.writeFileSync('src/components/RekeningKoran.tsx', code);
console.log("Patched RekeningKoran.tsx dummy data");
