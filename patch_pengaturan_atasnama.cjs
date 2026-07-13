const fs = require('fs');
let code = fs.readFileSync('src/components/Pengaturan.tsx', 'utf8');

const stateInsert = `
  const [atasNamaRekening, setAtasNamaRekening] = useState(() => localStorage.getItem('atasNamaRekening') || 'SDN 01 CONTOH');
`;
if (!code.includes("setAtasNamaRekening")) {
  code = code.replace("const [formatSuratPrefix, setFormatSuratPrefix]", stateInsert + "  const [formatSuratPrefix, setFormatSuratPrefix]");
}

const saveRekening = `localStorage.setItem('atasNamaRekening', atasNamaRekening);`;
code = code.replace(/localStorage\.setItem\('noRekeningSekolah', noRekeningSekolah\);/g, `localStorage.setItem('noRekeningSekolah', noRekeningSekolah);\n${saveRekening}`);

const newInputs = `                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Atas Nama Rekening</label>
                      <input type="text" value={atasNamaRekening} onChange={(e) => setAtasNamaRekening(e.target.value)} className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 uppercase" />
                    </div>
                  </div>
                </div>`;
code = code.replace(/<\/div>\n\s*<\/div>\n\s*<\/div>\n\s*<\/div>\n\s*<div>\n\s*<h3 className="text-lg font-semibold text-white border-b/g, newInputs + `\n              </div>\n\n              <div>\n                <h3 className="text-lg font-semibold text-white border-b`);

code = code.replace(/<div className="text-white font-medium uppercase tracking-widest">SDN 01 CONTOH<\/div>/g, '<div className="text-white font-medium uppercase tracking-widest">{atasNamaRekening}</div>');

fs.writeFileSync('src/components/Pengaturan.tsx', code);
console.log("Patched Pengaturan.tsx with atasNamaRekening");
