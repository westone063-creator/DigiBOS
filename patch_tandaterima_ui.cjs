const fs = require('fs');
let code = fs.readFileSync('src/components/TandaTerima.tsx', 'utf8');

const newUI = `                        <div className="flex-1 space-y-1.5">
                          <label className="text-sm font-medium text-slate-300">Pilih Transaksi (Bisa lebih dari satu)</label>
                          <div className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white max-h-48 overflow-y-auto space-y-2 custom-scrollbar">
                            {sumberOptions.length === 0 && <div className="text-slate-400 p-2 text-sm">Tidak ada data</div>}
                            {sumberOptions.map((opt: any) => {
                              const amount = (sumberData === 'bku' || sumberData === 'bku_group') 
                                ? opt.jumlah 
                                : ((Number(opt.jumlahBarang) || 0) * (Number(opt.hargaSatuan) || 0));
                              const isChecked = selectedSumberIds.includes(String(opt.id));
                              return (
                                <label key={opt.id} className="flex items-start gap-3 p-2 hover:bg-white/5 rounded-lg cursor-pointer border border-transparent hover:border-white/5 transition-all">
                                  <input 
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={(e) => handleToggleSumber(String(opt.id), e.target.checked)}
                                    className="mt-1 w-4 h-4 rounded border-slate-600 text-blue-600 focus:ring-blue-500 bg-black/50"
                                  />
                                  <div className="flex-1 min-w-0 text-sm">
                                    <div className="font-medium text-slate-200">
                                      {opt.tanggal} - {opt.uraian?.substring(0, 50) || 'Tanpa Uraian'}{opt.uraian?.length > 50 ? '...' : ''}
                                    </div>
                                    <div className="text-blue-400 font-medium">Rp {amount?.toLocaleString('id-ID')}</div>
                                    {opt.noBukti && <div className="text-slate-500 text-xs mt-0.5">No Bukti: {opt.noBukti}</div>}
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                        </div>`;

if(code.includes('value={selectedSumberId}')) {
    code = code.replace(/                        <div className="flex-1 space-y-1\.5">\s*<label className="text-sm font-medium text-slate-300">Pilih Transaksi<\/label>[\s\S]*?<\/select>\s*<\/div>/, newUI);
    fs.writeFileSync('src/components/TandaTerima.tsx', code);
    console.log("Success");
} else {
    console.log("Failed to find select");
}
