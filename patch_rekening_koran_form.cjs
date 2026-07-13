const fs = require('fs');
let code = fs.readFileSync('src/components/RekeningKoran.tsx', 'utf8');

const regexNoRekening = /<input type="text" required placeholder="Masukkan nomor rekening" value=\{formData\.noRekening\} onChange=\{e => setFormData\(\{\.\.\.formData, noRekening: e\.target\.value\}\)\} className="w-full bg-black\/20 border border-white\/10 rounded-lg px-4 py-2\.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 font-mono" \/>/g;

code = code.replace(regexNoRekening, `<input type="text" required placeholder="Masukkan nomor rekening" value={localStorage.getItem("noRekeningSekolah") || formData.noRekening} readOnly className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-2.5 text-slate-300 placeholder:text-slate-500 focus:outline-none cursor-not-allowed font-mono" />`);

const regexNamaRekening = /<input type="text" required placeholder="Contoh: SMK Negeri 1 Jakarta" value=\{formData\.namaRekening\} onChange=\{e => setFormData\(\{\.\.\.formData, namaRekening: e\.target\.value\}\)\} className="w-full bg-black\/20 border border-white\/10 rounded-lg px-4 py-2\.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500" \/>/g;

code = code.replace(regexNamaRekening, `<input type="text" required placeholder="Contoh: SMK Negeri 1 Jakarta" value={localStorage.getItem("atasNamaRekening") || formData.namaRekening} readOnly className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-2.5 text-slate-300 placeholder:text-slate-500 focus:outline-none cursor-not-allowed" />`);

// Also fix the preview to unconditionally use localStorage first, wait it already does that, wait:
code = code.replace(/\{selectedData\.noRekening \|\| localStorage\.getItem\("noRekeningSekolah"\)\}/g, '{localStorage.getItem("noRekeningSekolah") || selectedData.noRekening}');
code = code.replace(/\{selectedData\.namaRekening \|\| localStorage\.getItem\("atasNamaRekening"\)\}/g, '{localStorage.getItem("atasNamaRekening") || selectedData.namaRekening}');

fs.writeFileSync('src/components/RekeningKoran.tsx', code);
console.log("Patched RekeningKoran.tsx form");
