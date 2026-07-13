import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap, Download, Upload, Plus, Search, Filter } from 'lucide-react';
import FormPesertaDidik from './FormPesertaDidik';

const initialTableData = [
  { nama: 'Siti Sarah', nipd: '1235', nisn: '0123456790', jk: 'P', tempatLahir: 'Bandung', tglLahir: '15/08/2013', nik: '3271234567890001', agama: 'Islam', alamat: 'Jl. Sudirman No. 5', rt: '03', rw: '04', dusun: '-', kelurahan: 'Cicendo', kecamatan: 'Cicendo', kodePos: '40171', rombel: 'Kelas 5', status: 'Set Lulus', namaAyah: 'Asep Sunandar', tahunLahirAyah: '1978', pekerjaanAyah: 'PNS', nikAyah: '3271234567890002', namaIbu: 'Euis Nengsih', tahunLahirIbu: '1980', pekerjaanIbu: 'Guru', nikIbu: '3271234567890003' },
  { nama: 'Budi Santoso', nipd: '1236', nisn: '0123456791', jk: 'L', tempatLahir: 'Surabaya', tglLahir: '12/04/2012', nik: '3571234567890001', agama: 'Kristen', alamat: 'Jl. Pahlawan No. 10', rt: '01', rw: '02', dusun: '-', kelurahan: 'Alun-alun', kecamatan: 'Surabaya', kodePos: '60171', rombel: 'Kelas 6', status: 'Set Pindah', namaAyah: 'Joko', tahunLahirAyah: '1975', pekerjaanAyah: 'Wiraswasta', nikAyah: '3571234567890002', namaIbu: 'Sri', tahunLahirIbu: '1980', pekerjaanIbu: 'Ibu Rumah Tangga', nikIbu: '3571234567890003' },
];

export default function PDKeluar() {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('dataPdKeluar');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return initialTableData;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [selectedStudentData, setSelectedStudentData] = useState<any>(null);
  const [selectedStudentIndex, setSelectedStudentIndex] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem('dataPdKeluar', JSON.stringify(data));
  }, [data]);

  const computedRombelData = useMemo(() => {
    const baseRombels = ['Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4', 'Kelas 5', 'Kelas 6'];
    const map: Record<string, { name: string, L: number, P: number }> = {};
    
    baseRombels.forEach(name => {
      map[name] = { name, L: 0, P: 0 };
    });

    data.forEach((student: any) => {
      const r = student.rombel || 'Kelas 5';
      const jk = (student.jk || '').toUpperCase();
      if (!map[r]) {
        map[r] = { name: r, L: 0, P: 0 };
      }
      if (jk === 'L') {
        map[r].L += 1;
      } else if (jk === 'P') {
        map[r].P += 1;
      }
    });

    const result: { name: string, L: number, P: number }[] = [];
    baseRombels.forEach(name => {
      result.push(map[name]);
    });
    Object.keys(map).forEach(name => {
      if (!baseRombels.includes(name)) {
        result.push(map[name]);
      }
    });
    return result;
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter((item: any) => {
      const matchSearch = (item.nama || '').toLowerCase().includes(String(searchTerm || "").toLowerCase()) || 
                          (item.nisn || '').includes(searchTerm) ||
                          (item.nipd || '').includes(searchTerm);
      const matchStatus = statusFilter === '' || item.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [data, searchTerm, statusFilter]);

  const handleSelectAll = () => {
    if (selectedRows.length === filteredData.length && filteredData.length > 0) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredData.map(row => data.indexOf(row)));
    }
  };

  const handleSelectRow = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    if (selectedRows.includes(index)) {
      setSelectedRows(selectedRows.filter(i => i !== index));
    } else {
      setSelectedRows([...selectedRows, index]);
    }
  };
  
  const handleRowClick = (rowData: any) => {
    setSelectedStudentData(rowData);
    const actualIndex = data.indexOf(rowData);
    setSelectedStudentIndex(actualIndex);
    setIsFormOpen(true);
  };
  
  const handleAddNew = () => {
    setSelectedStudentData(null);
    setSelectedStudentIndex(null);
    setIsFormOpen(true);
  };

  const totalSiswa = data.length;

  return (
    <div className="space-y-6">
      <FormPesertaDidik 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        initialData={selectedStudentData} 
        onSave={(updatedItem: any) => {
          if (selectedStudentIndex !== null) {
            const newData = [...data];
            newData[selectedStudentIndex] = updatedItem;
            setData(newData);
          } else {
            setData([...data, updatedItem]);
          }
          setIsFormOpen(false);
        }}
      />
      
      <div>
        <h2 className="text-xl font-display font-bold text-white mb-1 tracking-wide">Data Peserta Didik Keluar</h2>
        <p className="text-slate-400 text-sm">Kelola informasi peserta didik yang sudah lulus, pindah, atau keluar</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="col-span-1 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 p-6 flex flex-col justify-center items-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-rose-500/10 to-pink-500/10 rounded-bl-full -mr-8 -mt-8"></div>
          <div className="p-4 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 shadow-inner mb-4">
            <GraduationCap className="w-8 h-8 text-rose-400" />
          </div>
          <div className="text-4xl font-display font-bold text-white tracking-tight">{totalSiswa}</div>
          <div className="text-sm font-medium text-slate-400 mt-1">Total PD Keluar</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="col-span-1 lg:col-span-3 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex flex-col justify-center"
        >
          <h3 className="text-sm font-display font-semibold text-white mb-4">Rekapitulasi PD Keluar per Rombel Terakhir</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {computedRombelData.map((stat, i) => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + (i * 0.05) }}
                key={stat.name} className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col items-center hover:bg-white/10 transition-colors"
              >
                <div className="text-xs font-semibold text-slate-300 mb-2">{stat.name}</div>
                <div className="flex gap-3 text-sm font-medium w-full justify-center">
                  <div className="flex items-center gap-1.5 text-blue-400">
                    <span className="text-[10px] text-slate-400">L</span>
                    <span>{stat.L}</span>
                  </div>
                  <div className="w-px h-4 bg-white/10"></div>
                  <div className="flex items-center gap-1.5 text-pink-400">
                    <span className="text-[10px] text-slate-400">P</span>
                    <span>{stat.P}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="flex flex-col md:flex-row items-center justify-between gap-4"
      >
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto flex-1">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari nama, NISN, NIPD..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
            />
          </div>
          <div className="relative w-full sm:w-auto min-w-[160px]">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all appearance-none cursor-pointer"
            >
              <option className="bg-slate-800" value="">Semua Status Keluar</option>
              <option className="bg-slate-800" value="Set Lulus">Set Lulus</option>
              <option className="bg-slate-800" value="Set Pindah">Set Pindah</option>
              <option className="bg-slate-800" value="Set Keluar">Set Keluar</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
          <AnimatePresence>
            {selectedRows.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: 20 }}
                className="flex items-center gap-2"
              >
                <select 
                  className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none cursor-pointer"
                  onChange={(e) => {
                    const newStatus = e.target.value;
                    if (newStatus) {
                      const newData = [...data];
                      selectedRows.forEach(idx => {
                        newData[idx] = { ...newData[idx], status: newStatus };
                      });
                      setData(newData);
                      setSelectedRows([]);
                      e.target.value = '';
                    }
                  }}
                >
                  <option className="bg-slate-800" value="">Update Status...</option>
                  <option className="bg-slate-800" value="Set Lulus">Set Lulus</option>
                  <option className="bg-slate-800" value="Set Pindah">Set Pindah</option>
                  <option className="bg-slate-800" value="Set Keluar">Set Keluar</option>
                </select>
              </motion.div>
            )}
          </AnimatePresence>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl backdrop-blur-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-all shadow-sm">
            <Download className="w-4 h-4" /> <span className="hidden sm:inline">Export</span>
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl backdrop-blur-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium hover:bg-blue-500/20 transition-all shadow-sm">
            <Upload className="w-4 h-4" /> <span className="hidden sm:inline">Import</span>
          </button>
          <button onClick={handleAddNew} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 border border-emerald-500/50 text-white text-sm font-medium shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all">
            <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Tambah PD Keluar</span>
          </button>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="w-full rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
      >
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="py-2.5 px-3 w-10 text-center">
                  <input 
                    type="checkbox" 
                    checked={selectedRows.length === filteredData.length && filteredData.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-emerald-500 focus:ring-emerald-500/50 cursor-pointer accent-emerald-500"
                  />
                </th>
                <th className="py-2.5 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider w-12">No</th>
                <th className="py-2.5 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Nama</th>
                <th className="py-2.5 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">NIPD / NISN</th>
                <th className="py-2.5 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">JK</th>
                <th className="py-2.5 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Tempat, Tanggal Lahir</th>
                <th className="py-2.5 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">NIK</th>
                <th className="py-2.5 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">Agama</th>
                <th className="py-2.5 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Rombel Terakhir</th>
                <th className="py-2.5 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">Status Keluar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredData.length > 0 ? filteredData.map((row: any) => {
                const i = data.indexOf(row);
                return (
                <tr 
                  key={i} 
                  onClick={() => handleRowClick(row)}
                  className={`hover:bg-emerald-500/10 transition-colors cursor-pointer group ${selectedRows.includes(i) ? 'bg-emerald-500/5' : ''}`}
                >
                  <td className="py-2.5 px-3 text-center">
                    <input 
                      type="checkbox"
                      checked={selectedRows.includes(i)}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => handleSelectRow(e as any, i)}
                      className="w-4 h-4 rounded border-white/20 bg-white/5 text-emerald-500 focus:ring-emerald-500/50 cursor-pointer accent-emerald-500"
                    />
                  </td>
                  <td className="py-2.5 px-3 text-sm text-slate-400">{i + 1}</td>
                  <td className="py-2.5 px-3 text-sm font-medium text-white whitespace-nowrap">{row.nama}</td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <div className="text-sm font-mono text-emerald-400">{row.nipd}</div>
                    <div className="text-xs font-mono text-blue-400 mt-0.5">{row.nisn}</div>
                  </td>
                  <td className="py-2.5 px-3 text-sm text-slate-300 text-center">{row.jk}</td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <div className="text-sm text-slate-300">{row.tempatLahir},</div>
                    <div className="text-xs text-slate-400 mt-0.5">{row.tglLahir}</div>
                  </td>
                  <td className="py-2.5 px-3 text-sm font-mono text-slate-300 whitespace-nowrap">{row.nik}</td>
                  <td className="py-2.5 px-3 text-sm text-slate-300 text-center">{row.agama}</td>
                  <td className="py-2.5 px-3 text-sm whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-medium border bg-white/10 text-slate-300 border-white/20">
                      {row.rombel}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-sm text-center whitespace-nowrap">
                    {row.status ? (
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-medium border ${
                        row.status === 'Set Lulus' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        row.status === 'Set Pindah' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}>
                        {row.status}
                      </span>
                    ) : (
                      <span className="text-slate-500">-</span>
                    )}
                  </td>
                </tr>
                );
              }) : (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400 text-sm">
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
