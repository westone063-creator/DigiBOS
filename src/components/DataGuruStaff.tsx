import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Download, Upload, Plus, CheckSquare, X, RefreshCw, Search, Filter } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import FormGuruStaff from './FormGuruStaff';

const statusData = [
  { name: 'PNS', value: 15, color: '#3b82f6', L: 5, P: 10 },
  { name: 'PPPK', value: 12, color: '#10b981', L: 4, P: 8 },
  { name: 'PPPK PW', value: 8, color: '#8b5cf6', L: 3, P: 5 },
  { name: 'HONORER', value: 10, color: '#f59e0b', L: 6, P: 4 },
];

export const initialTableData = [
  { nama: 'Budi Santoso, S.Pd', nip: '198001012005011001', tempatLahir: 'Jakarta', tglLahir: '01/01/1980', jk: 'L', agama: 'Islam', kawin: 'K', anak: 2, ijazah: 'S1', mulaiKerja: '2005', status: 'PNS', gol: 'III/c', jabatan: 'Guru Kelas', tglSk: '01/04/2022', noSk: 'SK/123/2022', gaji: '3.500.000', tugas: 'Guru Mapel', jtm: 24, diklat: 'Ada', statusAktif: 'Aktif', telp: '081234567890' },
  { nama: 'Siti Aminah, M.Pd', nip: '198502022010012002', tempatLahir: 'Bandung', tglLahir: '02/02/1985', jk: 'P', agama: 'Islam', kawin: 'K', anak: 1, ijazah: 'S2', mulaiKerja: '2010', status: 'PPPK', gol: 'IX', jabatan: 'Guru Agama', tglSk: '01/01/2021', noSk: 'SK/456/2021', gaji: '3.100.000', tugas: 'Guru Mapel', jtm: 24, diklat: 'Tidak', statusAktif: 'Aktif', telp: '081987654321' },
  { nama: 'Ahmad Dahlan, S.Kom', nip: '-', tempatLahir: 'Surabaya', tglLahir: '15/05/1990', jk: 'L', agama: 'Islam', kawin: 'TK', anak: 0, ijazah: 'S1', mulaiKerja: '2018', status: 'HONORER', gol: '-', jabatan: 'Operator Sekolah', tglSk: '01/07/2023', noSk: 'SK-HON/001/2023', gaji: '1.500.000', tugas: 'Tenaga Administrasi', jtm: 0, diklat: 'Ada', statusAktif: 'Aktif', telp: '085233445566' },
  { nama: 'Maria Goretti, S.Pd', nip: '199203032021212005', tempatLahir: 'Semarang', tglLahir: '10/10/1992', jk: 'P', agama: 'Katolik', kawin: 'K', anak: 1, ijazah: 'S1', mulaiKerja: '2015', status: 'PPPK PW', gol: 'IX', jabatan: 'Guru Bahasa Inggris', tglSk: '01/02/2022', noSk: 'SK/789/2022', gaji: '2.900.000', tugas: 'Guru Mapel', jtm: 18, diklat: 'Tidak', statusAktif: 'Aktif', telp: '081344556677' },
];

export default function DataGuruStaff() {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('dataGuruStaff');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialTableData;
      }
    }
    return initialTableData;
  });
  
  React.useEffect(() => {
    localStorage.setItem('dataGuruStaff', JSON.stringify(data));
    window.dispatchEvent(new Event('localStorageChanged'));

    // Automatically find and save the Kepala Sekolah details to localStorage
    const matchedKepsek = data.find((staff: any) => {
      const j = (staff.jabatan || '').toLowerCase();
      const t = (staff.tugas || '').toLowerCase();
      return j.includes('kepala') || j.includes('kepsek') || t.includes('kepala') || t.includes('kepsek');
    });
    if (matchedKepsek) {
      localStorage.setItem('namaKepsek', matchedKepsek.nama);
      localStorage.setItem('nipKepsek', matchedKepsek.nip || '-');
      localStorage.setItem('pangkatKepsek', matchedKepsek.gol || '-');
      localStorage.setItem('jabatanKepsek', matchedKepsek.jabatan || 'Kepala Sekolah');
    }

    // Automatically find and save the Bendahara details to localStorage
    const matchedBendahara = data.find((staff: any) => {
      const j = (staff.jabatan || '').toLowerCase();
      const t = (staff.tugas || '').toLowerCase();
      return j.includes('bendahara') || t.includes('bendahara');
    });
    if (matchedBendahara) {
      localStorage.setItem('namaBendahara', matchedBendahara.nama);
      localStorage.setItem('nipBendahara', matchedBendahara.nip || '-');
    }
  }, [data]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [isUpdateMenuOpen, setIsUpdateMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedEmployeeData, setSelectedEmployeeData] = useState<any>(null);
  const [selectedEmployeeIndex, setSelectedEmployeeIndex] = useState<number | null>(null);

  const computedStatusData = useMemo(() => {
    const statuses = [
      { name: 'PNS', color: '#3b82f6', L: 0, P: 0, value: 0 },
      { name: 'PPPK', color: '#10b981', L: 0, P: 0, value: 0 },
      { name: 'PPPK PW', color: '#8b5cf6', L: 0, P: 0, value: 0 },
      { name: 'HONORER', color: '#f59e0b', L: 0, P: 0, value: 0 },
    ];

    data.forEach((staff: any) => {
      const staffStatus = (staff.status || '').trim().toUpperCase();
      const staffJk = (staff.jk || '').trim().toUpperCase();

      let target = statuses.find(s => s.name === staffStatus);
      if (!target && staffStatus && staffStatus !== '-') {
        const colors = ['#ec4899', '#f43f5e', '#06b6d4', '#14b8a6', '#84cc16'];
        const randomColor = colors[statuses.length % colors.length];
        target = { name: staffStatus, color: randomColor, L: 0, P: 0, value: 0 };
        statuses.push(target);
      }

      if (target) {
        target.value += 1;
        if (staffJk === 'L') {
          target.L += 1;
        } else if (staffJk === 'P') {
          target.P += 1;
        }
      }
    });

    return statuses;
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchSearch = String(item.nama || "").toLowerCase().includes(String(searchTerm || "").toLowerCase()) || 
                          String(item.nip || "").toLowerCase().includes(String(searchTerm || "").toLowerCase());
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
    e.stopPropagation(); // prevent row click
    if (selectedRows.includes(index)) {
      setSelectedRows(selectedRows.filter(i => i !== index));
    } else {
      setSelectedRows([...selectedRows, index]);
    }
  };
  
  const handleRowClick = (rowData: any) => {
    setSelectedEmployeeData(rowData);
    const actualIndex = data.indexOf(rowData);
    setSelectedEmployeeIndex(actualIndex);
    setIsFormOpen(true);
  };
  
  const handleAddNew = () => {
    setSelectedEmployeeData(null);
    setSelectedEmployeeIndex(null);
    setIsFormOpen(true);
  };

  const exportToExcel = async (dataToExport: any[], filename: string) => {
    const ExcelJS = (await import('exceljs')).default;
    const { saveAs } = (await import('file-saver')).default ? (await import('file-saver')).default : await import('file-saver');

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Data Pegawai');

    const headers = [
      'Nama Lengkap', 'NIP/NIGK', 'Tempat Lahir', 'Tgl Lahir', 'L/P', 'Agama', 
      'Kawin (K/TK)', 'Anak', 'Ijazah', 'Mulai Kerja', 'Status Kepegawaian', 'Gol', 
      'Jabatan', 'Tgl SK Terakhir', 'No. SK Terakhir', 'Gaji Pokok', 'Tugas', 'JTM', 
      'Diklat', 'Status Aktivitas', 'Nomor Telepon'
    ];

    const headerRow = sheet.addRow(headers);
    
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF3B82F6' } // blue-500
      };
      cell.font = {
        color: { argb: 'FFFFFFFF' },
        bold: true
      };
      cell.border = {
        top: { style: 'thin' }, left: { style: 'thin' },
        bottom: { style: 'thin' }, right: { style: 'thin' }
      };
    });

    dataToExport.forEach(row => {
      sheet.addRow([
        row.nama, row.nip, row.tempatLahir, row.tglLahir, row.jk, row.agama,
        row.kawin, row.anak, row.ijazah, row.mulaiKerja, row.status, row.gol,
        row.jabatan, row.tglSk, row.noSk, row.gaji, row.tugas, row.jtm,
        row.diklat, row.statusAktif, row.telp
      ]);
    });

    sheet.columns.forEach(column => {
      column.width = 20; 
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), filename);
  };

  const handleExport = () => {
    exportToExcel(filteredData, 'data_guru_staff_export.xlsx');
  };

  const handleImport = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.xlsx, .xls, .csv';
    fileInput.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        alert('Data berhasil diimport. (Note: Dalam implementasi penuh, ini akan membaca isi file excel)');
      }
    };
    fileInput.click();
  };

  const handleBulkExport = () => {
    if (selectedRows.length === 0) return;
    const rowsToExport = data.filter((_, i) => selectedRows.includes(i));
    exportToExcel(rowsToExport, 'data_guru_staff_bulk_export.xlsx');
  };

  const handleUpdateStatus = (newStatus: string) => {
    if (selectedRows.length === 0) return;
    const newData = [...data];
    selectedRows.forEach(index => {
      newData[index].statusAktif = newStatus;
    });
    setData(newData);
    setIsUpdateMenuOpen(false);
    setSelectedRows([]);
  };

  return (
    <div className="space-y-6">
      <FormGuruStaff 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        initialData={selectedEmployeeData} 
        onSave={(updatedItem: any) => {
          if (selectedEmployeeIndex !== null) {
            const newData = [...data];
            newData[selectedEmployeeIndex] = updatedItem;
            setData(newData);
          } else {
            setData([...data, updatedItem]);
          }
          setIsFormOpen(false);
        }}
      />
      
      <div>
        <h2 className="text-xl font-display font-bold text-white mb-1 tracking-wide">Data Guru & Staff</h2>
        <p className="text-slate-400 text-sm">Kelola informasi data pendidik dan tenaga kependidikan</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="col-span-1 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 p-6 flex flex-col justify-center items-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-bl-full -mr-8 -mt-8"></div>
          <div className="p-4 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 shadow-inner mb-4">
            <Users className="w-8 h-8 text-blue-400" />
          </div>
          <div className="text-4xl font-display font-bold text-white tracking-tight">{data.length}</div>
          <div className="text-sm font-medium text-slate-400 mt-1">Total Pegawai</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="col-span-1 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex flex-col"
        >
          <h3 className="text-sm font-display font-semibold text-white mb-2 text-center">Status Pegawai</h3>
          <div className="flex-1 min-h-[140px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value: number) => [value, 'Jumlah']}
                />
                <Pie data={computedStatusData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={4} dataKey="value" stroke="none">
                  {computedStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="col-span-1 lg:col-span-2 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex flex-col justify-center"
        >
          <h3 className="text-sm font-display font-semibold text-white mb-4">Jenis Kelamin per Status</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {computedStatusData.map((stat, i) => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + (i * 0.1) }}
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
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="flex flex-col md:flex-row items-center justify-between gap-4"
      >
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto flex-1">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari nama atau NIP..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
          </div>
          <div className="relative w-full sm:w-auto min-w-[160px]">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none cursor-pointer"
            >
              <option className="bg-slate-800" value="">Semua Status</option>
              <option className="bg-slate-800" value="PNS">PNS</option>
              <option className="bg-slate-800" value="PPPK">PPPK</option>
              <option className="bg-slate-800" value="PPPK PW">PPPK PW</option>
              <option className="bg-slate-800" value="HONORER">HONORER</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto shrink-0">
          <button onClick={handleExport} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl backdrop-blur-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-all shadow-sm">
            <Download className="w-4 h-4" /> <span className="hidden sm:inline">Export</span>
          </button>
          <button onClick={handleImport} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl backdrop-blur-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium hover:bg-blue-500/20 transition-all shadow-sm">
            <Upload className="w-4 h-4" /> <span className="hidden sm:inline">Import</span>
          </button>
          <button onClick={handleAddNew} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 border border-blue-500/50 text-white text-sm font-medium shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all">
            <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Tambah Pegawai</span>
          </button>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="w-full rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
      >
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="py-4 px-5 w-12 text-center">
                  <input 
                    type="checkbox" 
                    checked={selectedRows.length === filteredData.length && filteredData.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500/50 cursor-pointer accent-blue-500"
                  />
                </th>
                <th className="py-4 px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">No</th>
                <th className="py-4 px-5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Pegawai</th>
                <th className="py-4 px-5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Tempat, Tgl Lahir</th>
                <th className="py-4 px-5 text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">L/P</th>
                <th className="py-4 px-5 text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">Agama</th>
                <th className="py-4 px-5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status & Jabatan</th>
                <th className="py-4 px-5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Tugas</th>
                <th className="py-4 px-5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status Aktivitas</th>
                <th className="py-4 px-5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Nomor Telepon</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredData.length > 0 ? filteredData.map((row) => {
                const i = data.indexOf(row);
                return (
                  <tr 
                    key={i} 
                    onClick={() => handleRowClick(row)}
                    className={`hover:bg-white/5 transition-colors cursor-pointer ${selectedRows.includes(i) ? 'bg-blue-500/5' : ''}`}
                  >
                    <td className="py-3.5 px-5 text-center">
                      <input 
                        type="checkbox"
                        checked={selectedRows.includes(i)}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => handleSelectRow(e as any, i)}
                        className="w-4 h-4 rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500/50 cursor-pointer accent-blue-500"
                      />
                    </td>
                    <td className="py-3.5 px-2 text-sm text-slate-400">{i + 1}</td>
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{row.nama}</div>
                      <div className="text-xs font-mono text-blue-400 mt-0.5">{row.nip}</div>
                    </td>
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <div className="text-sm text-slate-300">{row.tempatLahir},</div>
                      <div className="text-xs text-slate-400 mt-0.5">{row.tglLahir}</div>
                    </td>
                    <td className="py-3.5 px-5 text-sm text-slate-300 text-center">{row.jk}</td>
                    <td className="py-3.5 px-5 text-sm text-slate-300 text-center">{row.agama}</td>
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <div className="flex flex-col items-start gap-1.5">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-medium border ${row.status === 'PNS' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : row.status.includes('PPPK') ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                          {row.status}
                        </span>
                        <span className="text-sm text-slate-300">{row.jabatan}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-sm text-slate-300">{row.tugas}</td>
                    <td className="py-3.5 px-5 text-sm text-slate-300 whitespace-nowrap">
                      <span className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          {row.statusAktif === 'Aktif' ? (
                            <>
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </>
                          ) : (
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-500"></span>
                          )}
                        </span>
                        {row.statusAktif}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-sm text-slate-300 whitespace-nowrap">{row.telp}</td>
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

      <AnimatePresence>
        {selectedRows.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40"
          >
            <div className="flex items-center gap-4 px-6 py-4 bg-slate-900/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
              <div className="flex items-center gap-3 pr-4 border-r border-white/10">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-medium">
                  {selectedRows.length}
                </div>
                <span className="text-sm font-medium text-white">Terpilih</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="relative">
                  <button 
                    onClick={() => setIsUpdateMenuOpen(!isUpdateMenuOpen)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-medium transition-colors border border-transparent hover:border-white/10"
                  >
                    <RefreshCw className="w-4 h-4" /> Update Status
                  </button>
                  
                  <AnimatePresence>
                    {isUpdateMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute bottom-full left-0 mb-2 w-40 bg-slate-800 border border-white/10 rounded-xl overflow-hidden shadow-xl"
                      >
                        <button onClick={() => handleUpdateStatus('Aktif')} className="w-full text-left px-4 py-2.5 text-sm text-slate-200 hover:bg-white/5 transition-colors flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Set Aktif
                        </button>
                        <button onClick={() => handleUpdateStatus('Tidak Aktif')} className="w-full text-left px-4 py-2.5 text-sm text-slate-200 hover:bg-white/5 transition-colors flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-slate-500"></span> Set Tidak Aktif
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button onClick={handleBulkExport} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-medium transition-colors border border-transparent hover:border-white/10">
                  <Download className="w-4 h-4" /> Bulk Export
                </button>
              </div>

              <div className="pl-2 border-l border-white/10 ml-2">
                <button 
                  onClick={() => setSelectedRows([])}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
