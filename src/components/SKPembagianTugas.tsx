import React, { useState } from 'react';
import { getKopSurat } from '../utils/settings';
import { FileText, Search, Plus, Filter, Printer, Trash2, X, Save, Edit, Users, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { initialTableData } from './DataGuruStaff';

const DUMMY_DATA = [
  {
    id: 1,
    noSk: '421.2/005/SD.01/2024',
    tanggal: '2024-07-10',
    tahunPelajaran: '2024/2025',
    semester: 'Ganjil',
    status: 'Aktif',
  },
  {
    id: 2,
    noSk: '421.2/042/SD.01/2023',
    tanggal: '2024-01-05',
    tahunPelajaran: '2023/2024',
    semester: 'Genap',
    status: 'Arsip',
  },
];

const sortDUK = (staffList: any[]) => {
  return [...staffList].sort((a, b) => {
    // 1. Kepala Sekolah
    const aIsKepsek = a.jabatan?.toLowerCase().includes('kepala sekolah') ? 1 : 0;
    const bIsKepsek = b.jabatan?.toLowerCase().includes('kepala sekolah') ? 1 : 0;
    if (aIsKepsek !== bIsKepsek) return bIsKepsek - aIsKepsek;

    // 2. Status PNS / PPPK vs Honorer
    const statusPriority = (status: string) => {
      const s = status?.toLowerCase() || '';
      if (s.includes('pns')) return 3;
      if (s.includes('pppk')) return 2;
      return 1;
    };
    const aStatus = statusPriority(a.status);
    const bStatus = statusPriority(b.status);
    if (aStatus !== bStatus) return bStatus - aStatus;
    
    // 3. Golongan
    const getGolWeight = (gol: string) => {
      if (!gol || gol === '-') return 0;
      const g = String(gol).toUpperCase();
      let weight = 0;
      if (g.startsWith('IV')) weight = 40;
      else if (g.startsWith('III')) weight = 30;
      else if (g.startsWith('II')) weight = 20;
      else if (g.startsWith('I')) weight = 10;
      
      if (g === 'XI') return 35;
      if (g === 'X') return 34;
      if (g === 'IX') return 33;
      
      const sub = g.split('/')[1];
      if (sub) {
        weight += sub.charCodeAt(0) - 65; 
      }
      return weight;
    };
    
    const aGol = getGolWeight(a.gol);
    const bGol = getGolWeight(b.gol);
    if (aGol !== bGol) return bGol - aGol;
    
    // 4. Mulai Kerja (masa kerja)
    const aTahun = parseInt(a.mulaiKerja) || 9999;
    const bTahun = parseInt(b.mulaiKerja) || 9999;
    return aTahun - bTahun;
  });
};

export default function SKPembagianTugas() {
  const kopSurat = getKopSurat();
  const currentNamaKepsek = localStorage.getItem('namaKepsek') || 'Drs. H. Ahmad Sudirman, M.Pd.';
  const currentNipKepsek = localStorage.getItem('nipKepsek') || '19700512 199512 1 003';
  const currentJabatanKepsek = localStorage.getItem('jabatanKepsek') || 'Kepala Sekolah';
  const currentTitimangsa = localStorage.getItem('titimangsa') || 'Cirebon';
  const [data, setData] = useState(DUMMY_DATA);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState<any>({});
  const [formLampiran, setFormLampiran] = useState<any[]>([]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);

  const [isEditMode, setIsEditMode] = useState(false);

  const handleEditClick = (item: any) => {
    setFormData(item);
    setFormLampiran(item.lampiran || []);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (item: any) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setData(data.filter(item => item.id !== itemToDelete.id));
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const handlePreview = (item: any) => {
    setSelectedData(item);
    setIsPreviewOpen(true);
  };

  const handleSave = () => {
    const finalData = { ...formData, lampiran: formLampiran };
    if (isEditMode) {
      setData(data.map(d => d.id === formData.id ? { ...d, ...finalData } : d));
    } else {
      const newItem = {
        ...finalData,
        id: data.length > 0 ? Math.max(...data.map(d => d.id)) + 1 : 1,
        status: 'Aktif',
      };
      setData([...data, newItem]);
    }
    setIsModalOpen(false);
    setIsEditMode(false);
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleLampiranChange = (id: number, field: string, value: string) => {
    setFormLampiran(formLampiran.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const addLampiran = () => {
    setFormLampiran([...formLampiran, { id: Date.now(), nama: '', nip: '', golongan: '', jabatan: '', tugasMengajar: '', tugasTambahan: '' }]);
  };

  const removeLampiran = (id: number) => {
    setFormLampiran(formLampiran.filter(item => item.id !== id));
  };

  const printThermal = () => {
    const printContent = document.getElementById('sk-print-area');
    if (printContent) {
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContent.innerHTML;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload(); 
    }
  };

  return (
    <div className="w-full h-full flex flex-col space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-400" />
            SK Pembagian Tugas
          </h1>
          <p className="text-slate-400 text-sm mt-1">Kelola dan cetak SK Pembagian Tugas Mengajar Guru.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              setFormData({});
              
              let loadedStaff = initialTableData;
              try {
                const saved = localStorage.getItem('dataGuruStaff');
                if (saved) loadedStaff = JSON.parse(saved);
              } catch (e) {}
              
              const activeStaff = loadedStaff.filter((s: any) => s.statusAktif === 'Aktif' || !s.statusAktif);
              const sorted = sortDUK(activeStaff);
              const mapped = sorted.map((s: any, idx: number) => ({
                id: Date.now() + idx,
                nama: s.nama,
                nip: s.nip !== '-' ? s.nip : '',
                golongan: s.gol !== '-' ? s.gol : '',
                jabatan: s.jabatan || '', // Used for 'Tugas Mengajar' in UI
                tugasTambahan: s.tugas || ''
              }));
              
              setFormLampiran(mapped);
              setIsEditMode(false);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" /> Buat SK Baru
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-end gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto ml-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari no SK atau tahun pelajaran..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-white/5 border border-white/10 rounded-2xl custom-scrollbar relative">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="text-xs text-slate-400 uppercase bg-black/20 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-4 font-medium rounded-tl-2xl">No SK</th>
              <th className="px-6 py-4 font-medium">Tanggal</th>
              <th className="px-6 py-4 font-medium">Tahun Pelajaran</th>
              <th className="px-6 py-4 font-medium">Semester</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-center rounded-tr-2xl">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {data.filter(item => String(item.noSk || "").toLowerCase().includes(String(searchQuery || "").toLowerCase()) || String(item.tahunPelajaran || "").toLowerCase().includes(String(searchQuery || "").toLowerCase())).map((item) => (
              <tr key={item.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <span className="font-mono text-blue-400">{item.noSk}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-white">{item.tanggal}</div>
                </td>
                <td className="px-6 py-4 text-slate-300">
                  {item.tahunPelajaran}
                </td>
                <td className="px-6 py-4 text-slate-300">
                  {item.semester}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${item.status === 'Aktif' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => handlePreview(item)}
                      className="p-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors" 
                      title="Lihat / Cetak"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleEditClick(item)}
                      className="p-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-lg transition-colors" title="Edit">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteClick(item)} className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors" title="Hapus">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-400">Belum ada data SK.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-[#0f172a] border border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col overflow-hidden relative z-10 max-h-[90vh]"
            >
              <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/10 shrink-0 bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">{isEditMode ? 'Edit SK Pembagian Tugas' : 'Buat SK Pembagian Tugas Baru'}</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Lengkapi data untuk membuat surat keputusan</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 md:p-6 custom-scrollbar overflow-y-auto space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300">Tahun Pelajaran</label>
                    <input type="text" value={formData.tahunPelajaran || ''} onChange={(e) => handleFormChange('tahunPelajaran', e.target.value)} placeholder="Contoh: 2024/2025" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300">Semester</label>
                    <select value={formData.semester || ''} onChange={(e) => handleFormChange('semester', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-all">
                      <option value="Ganjil">Ganjil</option>
                      <option value="Genap">Genap</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300">Nomor SK</label>
                    <input type="text" value={formData.noSk || ''} onChange={(e) => handleFormChange('noSk', e.target.value)} placeholder="Contoh: 421.2/005/SD.01/2024" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300">Tanggal SK</label>
                    <input type="date" value={formData.tanggal || ''} onChange={(e) => handleFormChange('tanggal', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-all [color-scheme:dark]" />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-sm font-medium text-slate-300">Menimbang (Isi)</label>
                    <textarea rows={3} value={formData.menimbang || ''} onChange={(e) => handleFormChange('menimbang', e.target.value)} placeholder="Tuliskan poin-poin menimbang..." className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all"></textarea>
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-sm font-medium text-slate-300">Mengingat (Isi)</label>
                    <textarea rows={3} value={formData.mengingat || ''} onChange={(e) => handleFormChange('mengingat', e.target.value)} placeholder="Tuliskan poin-poin mengingat..." className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all"></textarea>
                  </div>
                  
                  {/* Daftar Pembagian Tugas Mengajar */}
                  <div className="sm:col-span-2 mt-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-white">Daftar Pembagian Tugas Mengajar</h3>
                      <button 
                        onClick={addLampiran}
                        type="button"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs font-medium rounded-lg transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" /> Tambah Guru
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {formLampiran.map((item, index) => (
                        <div key={item.id} className="p-4 bg-black/20 border border-white/10 rounded-xl relative group">
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => removeLampiran(item.id)}
                              type="button"
                              className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pr-8">
                            <div className="space-y-1">
                              <label className="text-xs text-slate-400">Nama Guru</label>
                              <input 
                                type="text" 
                                value={item.nama}
                                onChange={(e) => handleLampiranChange(item.id, 'nama', e.target.value)}
                                placeholder="Nama Guru, S.Pd" 
                                className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-all" 
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs text-slate-400">NIP</label>
                              <input 
                                type="text" 
                                value={item.nip}
                                onChange={(e) => handleLampiranChange(item.id, 'nip', e.target.value)}
                                placeholder="NIP / -" 
                                className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-all" 
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs text-slate-400">Golongan / Jabatan</label>
                              <input 
                                type="text" 
                                value={item.golongan}
                                onChange={(e) => handleLampiranChange(item.id, 'golongan', e.target.value)}
                                placeholder="Misal: Pembina / IV.a" 
                                className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-all" 
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs text-slate-400">Tugas Mengajar</label>
                              <input 
                                type="text" 
                                value={item.jabatan}
                                onChange={(e) => handleLampiranChange(item.id, 'jabatan', e.target.value)}
                                placeholder="Misal: Guru Kelas IA" 
                                className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-all" 
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs text-slate-400">Tugas Tambahan</label>
                              <input 
                                type="text" 
                                value={item.tugasTambahan}
                                onChange={(e) => handleLampiranChange(item.id, 'tugasTambahan', e.target.value)}
                                placeholder="Misal: Pembina Pramuka" 
                                className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-all" 
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              <div className="p-4 md:p-6 border-t border-white/10 bg-white/5 shrink-0 flex items-center justify-end gap-3">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button 
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/20"
                >
                  <Save className="w-4 h-4" /> Simpan Data
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isPreviewOpen && selectedData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPreviewOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl flex flex-col relative z-10 w-full max-w-4xl"
            >
              <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
                <h2 className="text-base font-semibold text-white">Preview SK Pembagian Tugas</h2>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={printThermal}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <Printer className="w-4 h-4" /> Cetak
                  </button>
                  <button 
                    onClick={() => setIsPreviewOpen(false)}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-8 bg-white flex justify-center overflow-y-auto max-h-[75vh] custom-scrollbar">
                <div id="sk-print-area" className="bg-white text-black font-serif mx-auto print-container" style={{ width: '215.9mm', maxWidth: '100%', boxSizing: 'border-box' }}>
                  
                  {/* Halaman 1 - Surat Keputusan */}
                  <div className="p-10" style={{ minHeight: '330.2mm' }}>
                    <div className="text-center mb-6">
                      <h3 className="font-bold text-lg uppercase leading-tight">{kopSurat.kopBaris1}</h3>
                      <h3 className="font-bold text-lg uppercase leading-tight">{kopSurat.kopBaris2}</h3>
                      <h2 className="font-bold text-xl uppercase mt-1 leading-tight">{kopSurat.kopBaris3}</h2>
                      <p className="text-sm mt-1 max-w-3xl mx-auto">{kopSurat.kopBaris4}</p>
                      <div className="border-b-[3px] border-black mt-3 mb-[2px]"></div>
                      <div className="border-b border-black mb-1"></div>
                    </div>
                    
                    <div className="text-center mb-6">
                      <h3 className="font-bold text-lg underline leading-tight">KEPUTUSAN KEPALA {kopSurat.kopBaris3}</h3>
                      <p className="font-bold mt-1">NOMOR: {selectedData.noSk}</p>
                    </div>
                    
                    <div className="text-center mb-6">
                      <p className="font-bold mb-1">TENTANG</p>
                      <p className="font-bold uppercase leading-tight">
                        PEMBAGIAN TUGAS MENGAJAR DAN TUGAS TAMBAHAN GURU<br/>
                        SEMESTER {String(selectedData.semester || "").toUpperCase()} TAHUN PELAJARAN {selectedData.tahunPelajaran}
                      </p>
                    </div>

                    <div className="mb-4 text-justify text-[15px]">
                      <table className="w-full align-top">
                        <tbody>
                          <tr>
                            <td className="w-28 align-top font-bold pr-2">Menimbang</td>
                            <td className="w-4 align-top">:</td>
                            <td className="align-top">
                              <ol className="list-[lower-alpha] pl-4 m-0 space-y-1">
                                <li>bahwa dalam rangka memperlancar proses belajar mengajar di {kopSurat.kopBaris3}, perlu menetapkan pembagian tugas mengajar dan tugas tambahan bagi guru;</li>
                                <li>bahwa guru yang namanya tercantum dalam lampiran keputusan ini dipandang cakap dan memenuhi syarat untuk melaksanakan tugas tersebut.</li>
                              </ol>
                            </td>
                          </tr>
                          <tr><td colSpan={3} className="h-4"></td></tr>
                          <tr>
                            <td className="w-28 align-top font-bold pr-2">Mengingat</td>
                            <td className="w-4 align-top">:</td>
                            <td className="align-top">
                              <ol className="list-decimal pl-4 m-0 space-y-1">
                                <li>Undang-Undang Nomor 20 Tahun 2003 tentang Sistem Pendidikan Nasional;</li>
                                <li>Undang-Undang Nomor 14 Tahun 2005 tentang Guru dan Dosen;</li>
                                <li>Peraturan Pemerintah Nomor 19 Tahun 2005 tentang Standar Nasional Pendidikan sebagaimana telah diubah terakhir dengan Peraturan Pemerintah Nomor 4 Tahun 2022.</li>
                              </ol>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="text-center font-bold mb-4 mt-6 text-[15px]">MEMUTUSKAN:</div>

                    <div className="mb-8 text-justify text-[15px]">
                      <table className="w-full align-top">
                        <tbody>
                          <tr>
                            <td className="w-28 align-top font-bold pr-2">Menetapkan</td>
                            <td className="w-4 align-top font-bold">:</td>
                            <td className="align-top"></td>
                          </tr>
                          <tr>
                            <td className="w-28 align-top font-bold pr-2">KESATU</td>
                            <td className="w-4 align-top font-bold">:</td>
                            <td className="align-top">
                              Menetapkan Pembagian Tugas Mengajar dan Tugas Tambahan Guru pada {kopSurat.kopBaris3} sebagaimana tercantum dalam lampiran keputusan ini.
                            </td>
                          </tr>
                          <tr><td colSpan={3} className="h-3"></td></tr>
                          <tr>
                            <td className="w-28 align-top font-bold pr-2">KEDUA</td>
                            <td className="w-4 align-top font-bold">:</td>
                            <td className="align-top">
                              Masing-masing guru wajib melaporkan pelaksanaan tugasnya secara berkala kepada Kepala Sekolah.
                            </td>
                          </tr>
                          <tr><td colSpan={3} className="h-3"></td></tr>
                          <tr>
                            <td className="w-28 align-top font-bold pr-2">KETIGA</td>
                            <td className="w-4 align-top font-bold">:</td>
                            <td className="align-top">
                              Segala biaya yang timbul akibat keputusan ini dibebankan pada anggaran yang sesuai (BOS).
                            </td>
                          </tr>
                          <tr><td colSpan={3} className="h-3"></td></tr>
                          <tr>
                            <td className="w-28 align-top font-bold pr-2">KEEMPAT</td>
                            <td className="w-4 align-top font-bold">:</td>
                            <td className="align-top">
                              Keputusan ini mulai berlaku pada tanggal ditetapkan dengan ketentuan akan diperbaiki sebagaimana mestinya apabila terdapat kekeliruan.
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="flex justify-end mt-12 pr-8">
                      <div className="w-72 text-[15px]">
                        <table className="w-full text-left mb-6">
                          <tbody>
                            <tr>
                              <td className="w-28">Ditetapkan di</td>
                              <td className="w-4">:</td>
                              <td>{currentTitimangsa}</td>
                            </tr>
                            <tr>
                              <td>Pada tanggal</td>
                              <td>:</td>
                              <td>{new Date(selectedData.tanggal).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                            </tr>
                          </tbody>
                        </table>
                        
                        <div className="mb-24 font-bold">{currentJabatanKepsek},</div>
                        
                        <div className="font-bold border-b border-black pb-0.5 inline-block min-w-full">{currentNamaKepsek}</div>
                        <div>NIP. {currentNipKepsek}</div>
                      </div>
                    </div>
                  </div>

                  <div className="break-before-page" style={{ pageBreakBefore: 'always' }}></div>

                  {/* Halaman 2 - Lampiran */}
                  <div className="p-10" style={{ minHeight: '330.2mm' }}>
                    <div className="flex justify-end mb-8 text-[15px]">
                      <table className="w-[450px]">
                        <tbody>
                          <tr>
                            <td className="w-64 align-top pr-2">Lampiran Keputusan Kepala</td>
                            <td className="align-top">: {kopSurat?.kopBaris3 || 'SDN 1 CIREBON'}</td>
                          </tr>
                          <tr>
                            <td className="align-top pr-2">Nomor</td>
                            <td className="align-top">: {selectedData.noSk}</td>
                          </tr>
                          <tr>
                            <td className="align-top pr-2">Tanggal</td>
                            <td className="align-top">: {new Date(selectedData.tanggal).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="text-center font-bold text-base mb-6">
                      DAFTAR PEMBAGIAN TUGAS MENGAJAR DAN TUGAS TAMBAHAN GURU<br/>
                      SEMESTER {String(selectedData.semester || "").toUpperCase()} TAHUN PELAJARAN {selectedData.tahunPelajaran}
                    </div>

                    <table className="w-full border-collapse border border-black text-[13px] text-center mb-8">
                      <thead>
                        <tr>
                          <th className="border border-black px-2 py-1.5 align-middle font-bold">NO</th>
                          <th className="border border-black px-2 py-1.5 align-middle font-bold">NAMA / NIP</th>
                          <th className="border border-black px-2 py-1.5 align-middle font-bold">JABATAN/<br/>GOL</th>
                          <th className="border border-black px-2 py-1.5 align-middle font-bold">TUGAS MENGAJAR<br/>(KELAS/MAPEL)</th>
                          <th className="border border-black px-2 py-1.5 align-middle font-bold">TUGAS<br/>TAMBAHAN</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formLampiran.map((guru, index) => (
                          <tr key={guru.id}>
                            <td className="border border-black px-2 py-1.5 align-middle">{index + 1}</td>
                            <td className="border border-black px-2 py-1.5 text-left align-middle">
                              <div className="font-bold">{guru.nama ? guru.nama : '[Nama Guru, S.Pd.]'}</div>
                              <div>NIP. {guru.nip ? guru.nip : '-'}</div>
                            </td>
                            <td className="border border-black px-2 py-1.5 align-middle">{guru.golongan ? guru.golongan : '-'}</td>
                            <td className="border border-black px-2 py-1.5 align-middle">{guru.jabatan ? guru.jabatan : '-'}</td>
                            <td className="border border-black px-2 py-1.5 align-middle">{guru.tugasTambahan ? guru.tugasTambahan : '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="flex justify-end mt-12 pr-8">
                      <div className="w-72 text-[15px]">
                        <div className="mb-24 font-bold">{currentJabatanKepsek},</div>
                        
                        <div className="font-bold border-b border-black pb-0.5 inline-block min-w-full">{currentNamaKepsek}</div>
                        <div>NIP. {currentNipKepsek}</div>
                      </div>
                    </div>
                  </div>

                  <style dangerouslySetInnerHTML={{__html: `
                    @media print {
                      @page { size: 215.9mm 330.2mm; margin: 0; }
                      body { -webkit-print-color-adjust: exact; }
                      .break-before-page { page-break-before: always; }
                    }
                  `}} />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Hapus */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-[#0f172a] border border-white/10 w-full max-w-md rounded-2xl shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mb-4 mx-auto">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-xl font-semibold text-white text-center mb-2">Hapus SK Pembagian Tugas</h3>
                <p className="text-slate-400 text-center text-sm mb-6">
                  Apakah Anda yakin ingin menghapus SK <span className="text-white font-medium">{itemToDelete?.noSk}</span>? Tindakan ini tidak dapat dibatalkan.
                </p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="flex-1 py-2.5 text-sm font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                  >
                    Batal
                  </button>
                  <button 
                    onClick={confirmDelete}
                    className="flex-1 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-lg shadow-red-500/20"
                  >
                    Ya, Hapus
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
