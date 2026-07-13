const fs = require('fs');
let code = fs.readFileSync('src/components/Pengaturan.tsx', 'utf8');

// 1. Add states
const stateInsert = `
  const [namaBankSekolah, setNamaBankSekolah] = useState(() => localStorage.getItem('namaBankSekolah') || 'BANK JABAR BANTEN');
  const [noRekeningSekolah, setNoRekeningSekolah] = useState(() => localStorage.getItem('noRekeningSekolah') || '0123 4567 8901');
`;
if (!code.includes("setNamaBankSekolah")) {
  code = code.replace("const [formatSuratPrefix, setFormatSuratPrefix]", stateInsert + "  const [formatSuratPrefix, setFormatSuratPrefix]");
}

// 2. Add to handleTabChange for 'administrasi-surat' save
const saveRekening = `          localStorage.setItem('namaBankSekolah', namaBankSekolah);
          localStorage.setItem('noRekeningSekolah', noRekeningSekolah);`;
code = code.replace(/localStorage\.setItem\('formatSuratSuffix', formatSuratSuffix\);/g, `localStorage.setItem('formatSuratSuffix', formatSuratSuffix);\n${saveRekening}`);

// 3. Update the inputs
code = code.replace(/defaultValue="BANK JABAR BANTEN"/g, 'value={namaBankSekolah} onChange={(e) => setNamaBankSekolah(e.target.value)}');
code = code.replace(/defaultValue="0123 4567 8901"/g, 'value={noRekeningSekolah} onChange={(e) => setNoRekeningSekolah(e.target.value)}');
code = code.replace(/<div className="text-white font-bold text-lg tracking-wider">BANK JABAR BANTEN<\/div>/g, '<div className="text-white font-bold text-lg tracking-wider">{namaBankSekolah}</div>');
code = code.replace(/<div className="text-white font-mono text-2xl tracking-\[0\.15em\] font-medium">0123 4567 8901<\/div>/g, '<div className="text-white font-mono text-2xl tracking-[0.15em] font-medium">{noRekeningSekolah}</div>');

fs.writeFileSync('src/components/Pengaturan.tsx', code);
console.log("Patched Pengaturan.tsx");
