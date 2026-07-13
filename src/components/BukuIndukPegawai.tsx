import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Search, Filter, ChevronRight, Download, Printer, FileText } from 'lucide-react';
import DetailBukuInduk from './DetailBukuInduk';
import LaporanDaftarI from './LaporanDaftarI';

const initialTableData = [
  { 
    id: 1, 
    nama: 'Budi Santoso, S.Pd', 
    nip: '198001012005011001', 
    nuptk: '1234567890123456',
    tempatLahir: 'Jakarta', 
    tglLahir: '01/01/1980', 
    jk: 'L', 
    agama: 'Islam', 
    status: 'PNS', 
    gol: 'III/c', 
    jabatan: 'Guru Kelas',
    alamat: 'Jl. Merdeka No. 45, Jakarta Selatan',
    email: 'budi.santoso@email.com',
    telp: '081234567890',
    pendidikan: [
      { tingkat: 'S1', instansi: 'Universitas Negeri Jakarta', jurusan: 'Pendidikan Guru SD', tahun: '2003' },
      { tingkat: 'SMA', instansi: 'SMAN 1 Jakarta', jurusan: 'IPA', tahun: '1998' }
    ],
    keluarga: [
      { nama: 'Rini Yulianti', hubungan: 'Istri', jk: 'P', pekerjaan: 'Ibu Rumah Tangga' },
      { nama: 'Agus Santoso', hubungan: 'Anak', jk: 'L', pekerjaan: 'Pelajar' }
    ]
  },
  { 
    id: 2, 
    nama: 'Siti Aminah, M.Pd', 
    nip: '198502022010012002', 
    nuptk: '0987654321098765',
    tempatLahir: 'Bandung', 
    tglLahir: '02/02/1985', 
    jk: 'P', 
    agama: 'Islam', 
    status: 'PPPK', 
    gol: 'IX', 
    jabatan: 'Guru Agama',
    alamat: 'Jl. Sudirman No. 12, Bandung',
    email: 'siti.aminah@email.com',
    telp: '081987654321',
    pendidikan: [
      { tingkat: 'S2', instansi: 'UIN Sunan Gunung Djati', jurusan: 'Pendidikan Agama Islam', tahun: '2012' },
      { tingkat: 'S1', instansi: 'UIN Sunan Gunung Djati', jurusan: 'Pendidikan Agama Islam', tahun: '2007' }
    ],
    keluarga: [
      { nama: 'Dedi Kurniawan', hubungan: 'Suami', jk: 'L', pekerjaan: 'PNS' }
    ]
  },
];

export default function BukuIndukPegawai() {
  const [data, setData] = useState<any[]>(() => {
    const saved = localStorage.getItem('dataGuruStaff');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((item: any, index: number) => ({
          ...item,
          id: item.id || index + 1,
          nuptk: item.nuptk || '-',
          alamat: item.alamat || '-',
          email: item.email || '-',
          pendidikan: item.pendidikan || [],
          keluarga: item.keluarga || [],
        }));
      } catch (e) {
        console.error('Failed to parse dataGuruStaff', e);
      }
    }
    return initialTableData;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('dataGuruStaff');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setData(parsed.map((item: any, index: number) => ({
            ...item,
            id: item.id || index + 1,
            nuptk: item.nuptk || '-',
            alamat: item.alamat || '-',
            email: item.email || '-',
            pendidikan: item.pendidikan || [],
            keluarga: item.keluarga || [],
          })));
        } catch (e) {
          console.error('Failed to parse dataGuruStaff', e);
        }
      }
    };
    
    // Listen to custom event in case it's updated in the same window
    window.addEventListener('localStorageChanged', handleStorageChange);
    return () => window.removeEventListener('localStorageChanged', handleStorageChange);
  }, []);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [showLaporan, setShowLaporan] = useState(false);

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchSearch = String(item.nama || "").toLowerCase().includes(String(searchTerm || "").toLowerCase()) || 
                          String(item.nip || "").toLowerCase().includes(String(searchTerm || "").toLowerCase());
      const matchStatus = statusFilter === '' || item.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [data, searchTerm, statusFilter]);

  if (showLaporan) {
    return <LaporanDaftarI onBack={() => setShowLaporan(false)} />;
  }

  if (selectedEmployee) {
    return <DetailBukuInduk employee={selectedEmployee} onBack={() => setSelectedEmployee(null)} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-display font-bold text-white mb-1 tracking-wide">Buku Induk Pegawai</h2>
        <p className="text-slate-400 text-sm">Arsip dan catatan lengkap informasi pegawai (Master Record)</p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto flex-1">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari nama atau NIP..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
          </div>
          <div className="relative w-full sm:w-auto min-w-[160px]">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none cursor-pointer"
            >
              <option className="bg-slate-800" value="">Semua Status</option>
              <option className="bg-slate-800" value="PNS">PNS</option>
              <option className="bg-slate-800" value="PPPK">PPPK</option>
              <option className="bg-slate-800" value="PPPK PW">PPPK PW</option>
              <option className="bg-slate-800" value="HONORER">HONORER</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
          <button 
            onClick={() => setShowLaporan(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl backdrop-blur-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-all shadow-sm"
          >
            <FileText className="w-4 h-4" /> <span className="hidden sm:inline">Laporan Daftar I</span>
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl backdrop-blur-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium hover:bg-indigo-500/20 transition-all shadow-sm">
            <Printer className="w-4 h-4" /> <span className="hidden sm:inline">Cetak Daftar</span>
          </button>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
      >
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="py-3 px-5 text-xs font-semibold text-slate-400 uppercase tracking-wider w-12 text-center">No</th>
                <th className="py-3 px-5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Nama Pegawai & NIP</th>
                <th className="py-3 px-5 text-xs font-semibold text-slate-400 uppercase tracking-wider">TTL & JK</th>
                <th className="py-3 px-5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status & Jabatan</th>
                <th className="py-3 px-5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredData.length > 0 ? filteredData.map((row, i) => (
                <tr 
                  key={row.id} 
                  className="hover:bg-indigo-500/10 transition-colors group"
                >
                  <td className="py-4 px-5 text-sm text-slate-400 text-center">{i + 1}</td>
                  <td className="py-4 px-5 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold font-display border border-indigo-500/30">
                        {row.nama.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{row.nama}</div>
                        <div className="text-xs font-mono text-slate-400 mt-0.5">{row.nip}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-5 whitespace-nowrap">
                    <div className="text-sm text-slate-300">{row.tempatLahir}, {row.tglLahir}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{row.jk === 'L' ? 'Laki-laki' : 'Perempuan'}</div>
                  </td>
                  <td className="py-4 px-5 whitespace-nowrap">
                    <div className="flex flex-col items-start gap-1.5">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-medium border ${row.status === 'PNS' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : row.status.includes('PPPK') ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                        {row.status}
                      </span>
                      <span className="text-sm text-slate-300">{row.jabatan}</span>
                    </div>
                  </td>
                  <td className="py-4 px-5 whitespace-nowrap">
                    <button 
                      onClick={() => setSelectedEmployee(row)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-xs font-medium border border-indigo-500/20 transition-all"
                    >
                      <BookOpen className="w-3.5 h-3.5" /> Buka Buku Induk
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 text-sm">
                    Data tidak ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
