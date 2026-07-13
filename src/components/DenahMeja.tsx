import React, { useState, useEffect } from 'react';
import { LayoutGrid, Plus, Search, Edit2, Trash2, X, Printer, Eye, Settings, Maximize, Minimize, History } from 'lucide-react';
import { getKopSurat } from '../utils/settings';
import { motion } from 'motion/react';

interface Peserta {
  noUjian: string;
  nama: string;
  kelas?: string;
}

interface RiwayatDenah {
  id: string;
  tanggal: string;
  ruang: string;
  kelas: string;
  jumlahSiswa: number;
}

export default function DenahMeja() {
  const kopSurat = getKopSurat();
  const [activeTab, setActiveTab] = useState<'denah' | 'riwayat'>('denah');
  const [showPreview, setShowPreview] = useState(false);
  const [presentationMode, setPresentationMode] = useState(false);
  
  const [ruang, setRuang] = useState(() => {
    const saved = localStorage.getItem('denahMejaLayout');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.ruang || 'Ruang 01';
      } catch (e) { return 'Ruang 01'; }
    }
    return 'Ruang 01';
  });
  
  const [cols, setCols] = useState(() => {
    const saved = localStorage.getItem('denahMejaLayout');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.cols || 4;
      } catch (e) { return 4; }
    }
    return 4;
  });
  
  const [rows, setRows] = useState(() => {
    const saved = localStorage.getItem('denahMejaLayout');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.rows || 5;
      } catch (e) { return 5; }
    }
    return 5;
  });
  
  const [selectedKelas, setSelectedKelas] = useState(() => {
    const saved = localStorage.getItem('denahMejaLayout');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.selectedKelas || 'Semua';
      } catch (e) { return 'Semua'; }
    }
    return 'Semua';
  });
  
  const [jumlahSiswa, setJumlahSiswa] = useState(() => {
    const saved = localStorage.getItem('denahMejaLayout');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.jumlahSiswa || 20;
      } catch (e) { return 20; }
    }
    return 20;
  });
  
  const [colorMode, setColorMode] = useState<'none' | 'kelas' | 'noUjian'>(() => {
    const saved = localStorage.getItem('denahMejaLayout');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.colorMode || 'none';
      } catch (e) { return 'none'; }
    }
    return 'none';
  });
  
  const [kartuUjianStudents, setKartuUjianStudents] = useState<any[]>([]);

  const defaultPesertaList = Array(20).fill({ noUjian: '-', nama: '-' });
  const [pesertaList, setPesertaList] = useState<Peserta[]>(() => {
    const saved = localStorage.getItem('denahMejaLayout');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.pesertaList && Array.isArray(parsed.pesertaList)) {
          return parsed.pesertaList;
        }
      } catch (e) { return defaultPesertaList; }
    }
    return defaultPesertaList;
  });
  
  const [riwayat, setRiwayat] = useState<RiwayatDenah[]>(() => {
    const saved = localStorage.getItem('dm_riwayat');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Drag and drop state
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  useEffect(() => {
    const savedKartu = localStorage.getItem('kartuUjianStudents');
    if (savedKartu) {
      try {
        setKartuUjianStudents(JSON.parse(savedKartu));
      } catch (e) {}
    }
  }, []);

  const availableClasses = ['Semua', ...Array.from(new Set(kartuUjianStudents.map(s => s.kelas))).sort()];

  useEffect(() => {
    localStorage.setItem('denahMejaLayout', JSON.stringify({
      ruang, cols, rows, pesertaList, selectedKelas, jumlahSiswa, colorMode
    }));
  }, [ruang, cols, rows, pesertaList, selectedKelas, jumlahSiswa, colorMode]);

  useEffect(() => {
    localStorage.setItem('dm_riwayat', JSON.stringify(riwayat));
  }, [riwayat]);

  const handleGenerate = () => {
    let studentsToFill = kartuUjianStudents;
    if (selectedKelas !== 'Semua') {
      studentsToFill = studentsToFill.filter(s => s.kelas === selectedKelas);
    }
    
    // Sort students?
    // Limit to jumlahSiswa
    studentsToFill = studentsToFill.slice(0, jumlahSiswa);

    const list: Peserta[] = Array(jumlahSiswa).fill({ noUjian: '-', nama: '-' });

    for (let i = 0; i < jumlahSiswa; i++) {
      if (i < studentsToFill.length) {
        list[i] = {
          noUjian: studentsToFill[i].noUjian || '-',
          nama: studentsToFill[i].nama,
          kelas: studentsToFill[i].kelas
        };
      } else {
        list[i] = { noUjian: '-', nama: '-' };
      }
    }
    
    setPesertaList(list);
    
    const historyItem: RiwayatDenah = {
      id: Date.now().toString(),
      tanggal: new Date().toLocaleString('id-ID'),
      ruang,
      kelas: selectedKelas,
      jumlahSiswa
    };
    setRiwayat(prev => [historyItem, ...prev].slice(0, 50));
  };

  const getColorClasses = (p: Peserta) => {
    if (p.noUjian === '-' && p.nama === '-') return 'bg-slate-800 border-slate-700 text-slate-500';

    if (colorMode === 'kelas') {
      if (!p.kelas) return 'bg-slate-800 border-slate-700 text-slate-200';
      const classes = availableClasses.filter(c => c !== 'Semua');
      const idx = classes.indexOf(p.kelas);
      const colors = [
        'bg-blue-500/20 border-blue-500/50 text-blue-200',
        'bg-emerald-500/20 border-emerald-500/50 text-emerald-200',
        'bg-purple-500/20 border-purple-500/50 text-purple-200',
        'bg-amber-500/20 border-amber-500/50 text-amber-200',
        'bg-pink-500/20 border-pink-500/50 text-pink-200',
      ];
      return idx !== -1 ? colors[idx % colors.length] : 'bg-slate-800 border-slate-700 text-slate-200';
    }

    if (colorMode === 'noUjian') {
      const lastChar = p.noUjian.slice(-1);
      if (!isNaN(parseInt(lastChar, 10))) {
        const isEven = parseInt(lastChar, 10) % 2 === 0;
        return isEven 
          ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-200' 
          : 'bg-rose-500/20 border-rose-500/50 text-rose-200';
      }
      return 'bg-slate-800 border-slate-700 text-slate-200';
    }

    return 'bg-slate-800 border-slate-700 text-slate-200';
  };

  const getPrintColorClasses = (p: Peserta) => {
    if (p.noUjian === '-' && p.nama === '-') return 'bg-white border-slate-400/50 text-slate-400';

    if (colorMode === 'kelas') {
      if (!p.kelas) return 'bg-white border-slate-800 text-black';
      const classes = availableClasses.filter(c => c !== 'Semua');
      const idx = classes.indexOf(p.kelas);
      const colors = [
        'bg-blue-50 border-blue-600 text-blue-900',
        'bg-emerald-50 border-emerald-600 text-emerald-900',
        'bg-purple-50 border-purple-600 text-purple-900',
        'bg-amber-50 border-amber-600 text-amber-900',
        'bg-pink-50 border-pink-600 text-pink-900',
      ];
      return idx !== -1 ? colors[idx % colors.length] : 'bg-white border-slate-800 text-black';
    }

    if (colorMode === 'noUjian') {
      const lastChar = p.noUjian.slice(-1);
      if (!isNaN(parseInt(lastChar, 10))) {
        const isEven = parseInt(lastChar, 10) % 2 === 0;
        return isEven 
          ? 'bg-indigo-50 border-indigo-600 text-indigo-900' 
          : 'bg-rose-50 border-rose-600 text-rose-900';
      }
      return 'bg-white border-slate-800 text-black';
    }

    return 'bg-white border-slate-800 text-black';
  };

  const handleDragStart = (e: React.DragEvent, idx: number) => {
    setDraggedIdx(idx);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIdx !== idx) {
      setDragOverIdx(idx);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverIdx(null);
  };

  const handleDrop = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault();
    setDragOverIdx(null);
    if (draggedIdx === null || draggedIdx === targetIdx) return;
    
    const newList = [...pesertaList];
    const temp = newList[draggedIdx];
    newList[draggedIdx] = newList[targetIdx];
    newList[targetIdx] = temp;
    
    setPesertaList(newList);
    setDraggedIdx(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      {!presentationMode && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
              <LayoutGrid className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-semibold text-white tracking-wide">Denah Meja Peserta</h1>
              <p className="text-slate-400 text-sm mt-1">Kelola tata letak tempat duduk ujian</p>
            </div>
          </div>
          
          {activeTab === 'denah' && (
            <div className="flex gap-3 w-full sm:w-auto">
              <button 
                onClick={() => setPresentationMode(true)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border border-indigo-500/30"
              >
                <Maximize className="w-4 h-4" />
                <span>Pratinjau</span>
              </button>
              <button 
                onClick={() => setShowPreview(true)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-700/50 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border border-slate-600/50"
              >
                <Eye className="w-4 h-4" />
                <span>Cetak / PDF</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tabs */}
      {!presentationMode && (
        <div className="flex gap-2 border-b border-white/10">
          <button
            onClick={() => setActiveTab('denah')}
            className={`px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === 'denah' 
                ? 'text-white' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-2">
              <LayoutGrid className="w-4 h-4" />
              Tata Letak Denah
            </div>
            {activeTab === 'denah' && (
              <motion.div layoutId="dm_activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('riwayat')}
            className={`px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === 'riwayat' 
                ? 'text-white' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-2">
              <History className="w-4 h-4" />
              Riwayat Tata Letak
            </div>
            {activeTab === 'riwayat' && (
              <motion.div layoutId="dm_activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
            )}
          </button>
        </div>
      )}

      {presentationMode && (
        <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
          <div className="text-white font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Mode Presentasi Aktif
          </div>
          <button 
            onClick={() => setPresentationMode(false)}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Minimize className="w-4 h-4" />
            Keluar Pratinjau
          </button>
        </div>
      )}

      {activeTab === 'denah' && (
      <div className={`grid grid-cols-1 ${presentationMode ? 'lg:grid-cols-1' : 'lg:grid-cols-4'} gap-6`}>
        {!presentationMode && (
          <div className="lg:col-span-1 bg-white/5 rounded-2xl border border-white/10 p-6 backdrop-blur-sm space-y-4">
            <h2 className="text-lg font-medium text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-orange-400" />
              Pengaturan
            </h2>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Pilih Ruang Ujian</label>
                <div className="flex flex-col gap-2">
                  <select
                    value={ruang.startsWith('Ruang') && parseInt(ruang.split(' ')[1]) <= 30 ? ruang : (ruang === '' ? '' : 'Lainnya')}
                    onChange={(e) => {
                      if (e.target.value !== 'Lainnya') {
                        setRuang(e.target.value);
                      }
                    }}
                    className="w-full bg-slate-800/50 border border-slate-700/50 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all appearance-none"
                  >
                    {[...Array(30)].map((_, i) => {
                      const num = (i + 1).toString().padStart(2, '0');
                      return <option key={`Ruang ${num}`} value={`Ruang ${num}`}>Ruang {num}</option>;
                    })}
                    <option value="Lainnya">Lainnya (Ketik Sendiri)...</option>
                  </select>
                  {(!ruang.startsWith('Ruang ') || parseInt(ruang.split(' ')[1]) > 30 || isNaN(parseInt(ruang.split(' ')[1]))) && (
                    <input 
                      type="text" 
                      value={ruang}
                      onChange={(e) => setRuang(e.target.value)}
                      placeholder="Masukkan nama ruang..."
                      className="w-full bg-slate-800/50 border border-slate-700/50 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
                    />
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Jumlah Kolom (Kanan-Kiri)</label>
                <input 
                  type="number" 
                  value={cols}
                  onChange={(e) => setCols(Number(e.target.value))}
                  min="1" max="10"
                  className="w-full bg-slate-800/50 border border-slate-700/50 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Pilih Kelas</label>
                <select
                  value={selectedKelas}
                  onChange={(e) => setSelectedKelas(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700/50 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all appearance-none"
                >
                  {availableClasses.map(c => (
                    <option key={c} value={c}>{c === 'Semua' ? 'Semua Kelas' : `Kelas ${c}`}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Jumlah Siswa Maksimal</label>
                <input 
                  type="number" 
                  value={jumlahSiswa}
                  onChange={(e) => setJumlahSiswa(Number(e.target.value))}
                  min="1" max="100"
                  className="w-full bg-slate-800/50 border border-slate-700/50 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Pewarnaan Meja</label>
                <select
                  value={colorMode}
                  onChange={(e) => setColorMode(e.target.value as any)}
                  className="w-full bg-slate-800/50 border border-slate-700/50 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all appearance-none"
                >
                  <option value="none">Tanpa Warna</option>
                  <option value="kelas">Berdasarkan Kelas</option>
                  <option value="noUjian">Berdasarkan Ganjil/Genap (No Ujian)</option>
                </select>
              </div>
              <button 
                onClick={handleGenerate}
                className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-orange-900/20 mt-4"
              >
                Generate Ulang Tata Letak
              </button>
              <p className="text-xs text-slate-400 mt-2 text-center">
                * Peringatan: Generate ulang akan menghapus posisi yang sudah diatur (drag & drop).
              </p>
            </div>
          </div>
        )}

        <div className={`${presentationMode ? 'lg:col-span-1' : 'lg:col-span-3'} bg-white/5 rounded-2xl border border-white/10 p-6 backdrop-blur-sm overflow-x-auto`}>
          <div className="min-w-[600px] flex flex-col items-center">
            {presentationMode && (
               <div className="text-center mb-8">
                 <h1 className="text-2xl font-bold text-white uppercase tracking-wider">{ruang}</h1>
                 <p className="text-slate-400 mt-1">Denah Tempat Duduk Peserta Ujian</p>
               </div>
            )}
            
            <div className="w-full max-w-4xl">
              <div className="flex justify-center mb-10">
                <div className="px-16 py-4 bg-slate-800/80 border-2 border-slate-600 rounded-lg text-center font-bold text-slate-300 tracking-widest shadow-inner shadow-black/20">
                  MEJA PENGAWAS
                </div>
              </div>

              <div 
                className="grid gap-4 mx-auto" 
                style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
              >
                {pesertaList.map((p, i) => (
                  <div 
                    key={i} 
                    draggable={!presentationMode}
                    onDragStart={(e) => handleDragStart(e, i)}
                    onDragOver={(e) => handleDragOver(e, i)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, i)}
                    className={`
                      relative border-2 rounded-xl p-3 text-center transition-all group
                      ${getColorClasses(p)}
                      ${!presentationMode ? 'cursor-grab active:cursor-grabbing hover:border-orange-500/50' : ''}
                      ${dragOverIdx === i ? 'border-orange-500 scale-105 shadow-lg shadow-orange-500/20 z-10' : ''}
                      ${draggedIdx === i ? 'opacity-50' : 'opacity-100'}
                    `}
                  >
                    {!presentationMode && (
                      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <LayoutGrid className="w-3 h-3 text-slate-500" />
                      </div>
                    )}
                    <div className="text-xs opacity-70 mb-1 font-mono">{p.noUjian}</div>
                    <div className="text-sm font-medium line-clamp-1" title={p.nama}>{p.nama}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {activeTab === 'riwayat' && !presentationMode && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm overflow-hidden"
        >
          <div className="p-5 border-b border-white/10 flex justify-between items-center">
            <h2 className="text-lg font-medium text-white flex items-center gap-2">
              <History className="w-5 h-5 text-orange-400" />
              Riwayat Generate Denah
            </h2>
            {riwayat.length > 0 && (
              <button 
                onClick={() => {
                  if(window.confirm('Hapus semua riwayat denah?')) setRiwayat([]);
                }}
                className="text-rose-400 hover:text-rose-300 text-sm flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Bersihkan</span>
              </button>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/50 border-b border-white/10 text-xs uppercase tracking-wider text-slate-400">
                  <th className="p-4 font-medium">Waktu</th>
                  <th className="p-4 font-medium">Ruang</th>
                  <th className="p-4 font-medium">Kelas Peserta</th>
                  <th className="p-4 font-medium">Jumlah Peserta (Max)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {riwayat.length > 0 ? (
                  riwayat.map((item) => (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 text-sm text-slate-300">{item.tanggal}</td>
                      <td className="p-4 text-sm text-slate-200 font-medium">
                        {item.ruang}
                      </td>
                      <td className="p-4 text-sm text-slate-300">
                        <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-slate-300 border border-white/5">
                          {item.kelas}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-slate-300">{item.jumlahSiswa} Siswa</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-400">
                      Belum ada riwayat denah meja.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Preview Modal for Print */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden text-slate-900">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-semibold text-lg">Cetak Denah Meja</h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
                >
                  <Printer className="w-4 h-4" />
                  Cetak
                </button>
                <button 
                  onClick={() => setShowPreview(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 print:p-0">
              <div className="max-w-3xl mx-auto space-y-6">
                
                <div className="flex items-center justify-between border-b-2 border-black pb-4 mb-6">
                  <div className="w-20"></div>
                  <div className="text-center flex-1">
                    <h1 className="font-bold text-[14pt] uppercase">{kopSurat.kopBaris1}</h1>
                    <h2 className="font-bold text-[14pt] uppercase">{kopSurat.kopBaris2}</h2>
                    <h3 className="font-bold text-[16pt] uppercase">{kopSurat.kopBaris3}</h3>
                    <p className="text-[10pt]">{kopSurat.kopBaris4}</p>
                  </div>
                  <div className="w-20"></div>
                </div>

                <div className="text-center space-y-1 mb-8">
                  <h1 className="text-xl font-bold uppercase underline">DENAH TEMPAT DUDUK PESERTA</h1>
                  <p className="text-md font-semibold uppercase">{ruang}</p>
                </div>

                <div className="flex justify-center mb-12">
                  <div className="px-16 py-4 border-2 border-slate-800 text-center font-bold tracking-widest">
                    MEJA PENGAWAS
                  </div>
                </div>

                <div 
                  className="grid gap-6 mx-auto" 
                  style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, maxWidth: '800px' }}
                >
                  {pesertaList.map((p, i) => (
                    <div key={i} className={`border-2 p-2 text-center aspect-[4/3] flex flex-col justify-center ${getPrintColorClasses(p)}`}>
                      <div className="font-bold border-b border-current pb-2 mb-2 text-xs font-mono opacity-80">{p.noUjian}</div>
                      <div className="text-xs uppercase font-medium line-clamp-2">{p.nama}</div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-end mt-16 pt-8">
                  <div className="text-center w-64">
                    <p>Mengetahui,</p>
                    <p>Kepala Sekolah,</p>
                    <br /><br /><br /><br />
                    <p className="font-bold underline">NAMA KEPALA SEKOLAH</p>
                    <p>NIP. ............................</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
