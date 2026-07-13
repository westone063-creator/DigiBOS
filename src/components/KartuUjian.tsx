import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Users, Search, CheckSquare, Printer, Square, 
  Settings2, Hash, ChevronDown, History, Trash2
} from 'lucide-react';

interface RiwayatKartu {
  id: string;
  tanggal: string;
  kelas: string;
  jumlahPeserta: number;
  prefix: string;
}

// Mock student data
const initialStudents = [
  { id: '1', nama: 'Ahmad Fadillah', nisn: '0012345678', kelas: '1A', noUjian: '' },
  { id: '2', nama: 'Budi Santoso', nisn: '0012345679', kelas: '1A', noUjian: '' },
  { id: '3', nama: 'Citra Lestari', nisn: '0012345680', kelas: '1A', noUjian: '' },
  { id: '4', nama: 'Deni Saputra', nisn: '0012345681', kelas: '1B', noUjian: '' },
  { id: '5', nama: 'Eka Putri', nisn: '0012345682', kelas: '1B', noUjian: '' },
  { id: '6', nama: 'Fajar Nugraha', nisn: '0012345683', kelas: '2A', noUjian: '' },
  { id: '7', nama: 'Gita Savitri', nisn: '0012345684', kelas: '2A', noUjian: '' },
  { id: '8', nama: 'Hendra Setiawan', nisn: '0012345685', kelas: '3A', noUjian: '' },
];

export default function KartuUjian() {
  const currentNamaKepsek = localStorage.getItem('namaKepsek') || 'Drs. H. Ahmad Sudirman, M.Pd.';
  const currentNipKepsek = localStorage.getItem('nipKepsek') || '19700512 199512 1 003';
  const currentJabatanKepsek = localStorage.getItem('jabatanKepsek') || 'Kepala Sekolah';
  const currentTitimangsa = localStorage.getItem('titimangsa') || 'Cirebon';
  const [activeTab, setActiveTab] = useState<'generator' | 'riwayat'>('generator');
  
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('kartuUjianStudents');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialStudents;
      }
    }
    return initialStudents;
  });
  
  const [selectedKelas, setSelectedKelas] = useState(() => localStorage.getItem('ku_selectedKelas') || 'Semua');
  const [prefixUjian, setPrefixUjian] = useState(() => localStorage.getItem('ku_prefixUjian') || '01-001-');
  const [startNumber, setStartNumber] = useState(() => localStorage.getItem('ku_startNumber') || '001');
  
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const [riwayat, setRiwayat] = useState<RiwayatKartu[]>(() => {
    const saved = localStorage.getItem('ku_riwayat');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('kartuUjianStudents', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('ku_selectedKelas', selectedKelas);
    localStorage.setItem('ku_prefixUjian', prefixUjian);
    localStorage.setItem('ku_startNumber', startNumber);
  }, [selectedKelas, prefixUjian, startNumber]);

  useEffect(() => {
    localStorage.setItem('ku_riwayat', JSON.stringify(riwayat));
  }, [riwayat]);

  // Get unique classes
  const classes = ['Semua', ...Array.from(new Set(students.map(s => s.kelas))).sort()];

  // Filter students based on class and search
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchKelas = selectedKelas === 'Semua' || student.kelas === selectedKelas;
      const matchSearch = String(student.nama || "").toLowerCase().includes(String(searchTerm || "").toLowerCase()) || 
                          student.nisn.includes(searchTerm);
      return matchKelas && matchSearch;
    });
  }, [students, selectedKelas, searchTerm]);

  // Handle Select All checkbox
  const handleSelectAll = () => {
    if (selectedIds.length === filteredStudents.length && filteredStudents.length > 0) {
      setSelectedIds([]); // Deselect all
    } else {
      setSelectedIds(filteredStudents.map(s => s.id)); // Select all filtered
    }
  };

  // Handle individual checkbox
  const handleSelectRow = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Generate Exam Numbers (only for selected OR filtered if none selected, but let's do selected)
  const handleGenerate = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      // Determine target students: if some are selected, only generate for them.
      // Otherwise, generate for all currently filtered.
      const targetIds = selectedIds.length > 0 
        ? selectedIds 
        : filteredStudents.map(s => s.id);
        
      if (targetIds.length === 0) {
        alert("Tidak ada siswa yang dipilih atau tersedia di kelas ini.");
        setIsGenerating(false);
        return;
      }

      let currentNum = parseInt(startNumber, 10);
      if (isNaN(currentNum)) currentNum = 1;

      const numLength = startNumber.length || 3;

      const newStudents = students.map(student => {
        if (targetIds.includes(student.id)) {
          const paddedNum = currentNum.toString().padStart(numLength, '0');
          const noUjian = `${prefixUjian}${paddedNum}`;
          currentNum++;
          return { ...student, noUjian };
        }
        return student;
      });

      setStudents(newStudents);
      
      // Save history
      const historyItem: RiwayatKartu = {
        id: Date.now().toString(),
        tanggal: new Date().toLocaleString('id-ID'),
        kelas: selectedKelas,
        jumlahPeserta: targetIds.length,
        prefix: prefixUjian
      };
      setRiwayat(prev => [historyItem, ...prev].slice(0, 50));
      
      setIsGenerating(false);
    }, 600);
  };

  // Mock print function
  const handlePrint = () => {
    if (selectedIds.length === 0) {
      alert("Pilih siswa terlebih dahulu untuk mencetak kartu ujian.");
      return;
    }
    window.print();
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto print:max-w-none print:m-0 print:gap-0">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-display font-semibold text-white tracking-wide">Kartu Ujian</h1>
          <p className="text-slate-400 mt-1 text-sm">Kelola dan cetak kartu ujian peserta didik</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors font-medium shadow-lg shadow-indigo-500/20"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Terpilih ({selectedIds.length})</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 print:hidden">
        <button
          onClick={() => setActiveTab('generator')}
          className={`px-4 py-3 text-sm font-medium transition-colors relative ${
            activeTab === 'generator' 
              ? 'text-white' 
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <div className="flex items-center gap-2">
            <Settings2 className="w-4 h-4" />
            Generator & Data
          </div>
          {activeTab === 'generator' && (
            <motion.div layoutId="ku_activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
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
            Riwayat Generate
          </div>
          {activeTab === 'riwayat' && (
            <motion.div layoutId="ku_activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
          )}
        </button>
      </div>

      {activeTab === 'generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 print:hidden">
        {/* Left Column: Generator Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1 flex flex-col gap-6"
        >
          <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/10">
              <Settings2 className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-medium text-white">Generate No. Ujian</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Pilih Kelas</label>
                <div className="relative">
                  <select
                    value={selectedKelas}
                    onChange={(e) => {
                      setSelectedKelas(e.target.value);
                      setSelectedIds([]); // reset selection on class change
                    }}
                    className="w-full bg-slate-800/50 border border-white/10 rounded-lg pl-3 pr-10 py-2.5 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  >
                    {classes.map(c => (
                      <option key={c} value={c}>{c === 'Semua' ? 'Semua Kelas' : `Kelas ${c}`}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Format Prefix</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Hash className="h-4 w-4 text-slate-500" />
                  </div>
                  <input
                    type="text"
                    value={prefixUjian}
                    onChange={(e) => setPrefixUjian(e.target.value)}
                    className="w-full bg-slate-800/50 border border-white/10 rounded-lg pl-10 pr-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    placeholder="Contoh: 01-001-"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Mulai Dari Angka</label>
                <input
                  type="text"
                  value={startNumber}
                  onChange={(e) => setStartNumber(e.target.value)}
                  className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  placeholder="Contoh: 001"
                />
              </div>

              <button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <CheckSquare className="w-4 h-4" />
                )}
                <span>{isGenerating ? 'Memproses...' : 'Generate Nomor'}</span>
              </button>
            </div>
          </div>
          
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 text-sm text-emerald-200/90 leading-relaxed shadow-lg backdrop-blur-md">
            <span className="font-semibold text-emerald-400 block mb-1">Tips:</span>
            Pilih kelas terlebih dahulu, kemudian klik "Generate Nomor" untuk membuat nomor ujian secara otomatis bagi seluruh siswa di kelas tersebut. Anda juga bisa men-ceklis siswa tertentu saja di tabel.
          </div>
        </motion.div>

        {/* Right Column: Students Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-3 bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl flex flex-col shadow-xl overflow-hidden"
        >
          <div className="p-5 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-lg font-medium text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" />
              Daftar Peserta Ujian
            </h2>
            
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Cari nama atau NISN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-800/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/50 border-b border-white/10 text-xs uppercase tracking-wider text-slate-400">
                  <th className="p-4 w-12">
                    <button 
                      onClick={handleSelectAll}
                      className="text-slate-400 hover:text-white transition-colors flex items-center justify-center"
                    >
                      {selectedIds.length > 0 && selectedIds.length === filteredStudents.length ? (
                        <CheckSquare className="w-5 h-5 text-indigo-400" />
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                    </button>
                  </th>
                  <th className="p-4 font-medium">Nama Siswa</th>
                  <th className="p-4 font-medium">NISN</th>
                  <th className="p-4 font-medium">Kelas</th>
                  <th className="p-4 font-medium">No. Ujian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => {
                    const isSelected = selectedIds.includes(student.id);
                    return (
                      <tr 
                        key={student.id} 
                        className={`hover:bg-white/5 transition-colors cursor-pointer ${isSelected ? 'bg-indigo-500/5' : ''}`}
                        onClick={() => handleSelectRow(student.id)}
                      >
                        <td className="p-4">
                          <div className="flex items-center justify-center">
                            {isSelected ? (
                              <CheckSquare className="w-5 h-5 text-indigo-400" />
                            ) : (
                              <Square className="w-5 h-5 text-slate-500" />
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-sm font-medium text-slate-200">{student.nama}</td>
                        <td className="p-4 text-sm text-slate-400">{student.nisn}</td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-slate-300 border border-white/5">
                            {student.kelas}
                          </span>
                        </td>
                        <td className="p-4">
                          {student.noUjian ? (
                            <span className="font-mono text-sm text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20">
                              {student.noUjian}
                            </span>
                          ) : (
                            <span className="text-sm text-slate-500 italic">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400">
                      Tidak ada data siswa ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 border-t border-white/10 bg-slate-800/30 flex justify-between items-center text-sm text-slate-400">
            <span>Menampilkan {filteredStudents.length} siswa</span>
            {selectedIds.length > 0 && (
              <span className="text-indigo-400 font-medium">{selectedIds.length} terpilih</span>
            )}
          </div>
        </motion.div>
      </div>
      )}

      {activeTab === 'riwayat' && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl flex flex-col shadow-xl overflow-hidden print:hidden"
        >
          <div className="p-5 border-b border-white/10 flex justify-between items-center">
            <h2 className="text-lg font-medium text-white flex items-center gap-2">
              <History className="w-5 h-5 text-indigo-400" />
              Riwayat Generate Nomor Ujian
            </h2>
            {riwayat.length > 0 && (
              <button 
                onClick={() => {
                  if(window.confirm('Hapus semua riwayat?')) setRiwayat([]);
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
                  <th className="p-4 font-medium">Kelas</th>
                  <th className="p-4 font-medium">Jumlah Peserta</th>
                  <th className="p-4 font-medium">Format Prefix</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {riwayat.length > 0 ? (
                  riwayat.map((item) => (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 text-sm text-slate-300">{item.tanggal}</td>
                      <td className="p-4 text-sm text-slate-200 font-medium">
                        <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-slate-300 border border-white/5">
                          {item.kelas}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-slate-300">{item.jumlahPeserta} Siswa</td>
                      <td className="p-4 text-sm">
                        <span className="font-mono text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20">
                          {item.prefix}***
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-400">
                      Belum ada riwayat generate.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Print Preview Mode (Only visible when printing) */}
      <div className="hidden print:block w-full">
        <div className="grid grid-cols-2 gap-8 gap-y-12">
          {students
            .filter(student => selectedIds.length === 0 ? true : selectedIds.includes(student.id))
            .map((student) => (
            <div key={`print-${student.id}`} className="border-2 border-black rounded-xl p-6 relative bg-white text-black break-inside-avoid">
              <div className="flex items-center gap-4 border-b-2 border-black pb-4 mb-4">
                {/* Mock Logo Placeholder */}
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center border border-gray-400">
                  <span className="text-xs font-bold text-gray-500">LOGO</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg uppercase tracking-wider">KARTU PESERTA UJIAN</h3>
                  <p className="text-sm font-medium">SEKOLAH DASAR NEGERI 01</p>
                  <p className="text-xs">Tahun Pelajaran 2026/2027</p>
                </div>
              </div>
              
              <table className="w-full text-sm mb-6">
                <tbody>
                  <tr>
                    <td className="py-1.5 font-semibold w-24 align-top">No. Ujian</td>
                    <td className="py-1.5 w-4 align-top">:</td>
                    <td className="py-1.5 font-bold text-base">{student.noUjian || '-'}</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 font-semibold align-top">Nama</td>
                    <td className="py-1.5 align-top">:</td>
                    <td className="py-1.5 uppercase font-bold">{student.nama}</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 font-semibold align-top">NISN</td>
                    <td className="py-1.5 align-top">:</td>
                    <td className="py-1.5">{student.nisn}</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 font-semibold align-top">Kelas</td>
                    <td className="py-1.5 align-top">:</td>
                    <td className="py-1.5 font-bold">{student.kelas}</td>
                  </tr>
                </tbody>
              </table>

              <div className="flex justify-between items-end mt-4">
                <div className="w-24 h-32 border-2 border-gray-300 flex items-center justify-center bg-gray-50">
                  <span className="text-xs text-gray-400">Pas Foto 3x4</span>
                </div>
                <div className="text-center">
                  <p className="text-xs mb-10">{currentJabatanKepsek},</p>
                  <p className="font-bold underline text-sm">{currentNamaKepsek}</p>
                  <p className="text-xs">NIP. {currentNipKepsek}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
