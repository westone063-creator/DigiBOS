const fs = require('fs');
let code = fs.readFileSync('src/components/Pengaturan.tsx', 'utf8');

code = code.replace(/<input type="text" value=\{noRekeningSekolah\} onChange=\{\(e\) => setNoRekeningSekolah\(e.target.value\)\} className="w-full bg-slate-900\/50 border border-white\/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 font-mono tracking-widest" \/>\s*<div className="space-y-2">/g, 
`<input type="text" value={noRekeningSekolah} onChange={(e) => setNoRekeningSekolah(e.target.value)} className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 font-mono tracking-widest" />
                    </div>
                    <div className="space-y-2">`);

fs.writeFileSync('src/components/Pengaturan.tsx', code);
console.log("Fixed Pengaturan.tsx");
