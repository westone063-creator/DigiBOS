import React, { useState } from 'react';
import { getKopSurat } from '../utils/settings';
import { FileText, Search, Plus, Filter, Printer, Trash2, X, Save, Edit, Briefcase, Sparkles, Loader2, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { initialTableData } from './DataGuruStaff';

const DUMMY_DATA = [
  {
    id: 1,
    noSurat: '090/012/SD.01/2024',
    noSppd: '090/012.a/SD.01/2024',
    tanggal: '2024-08-15',
    namaPegawai: 'Budi Santoso, S.Pd',
    tujuan: 'Dinas Pendidikan Kabupaten',
    maksud: 'Mengikuti Bimbingan Teknis BOS',
    status: 'Selesai',
  },
  {
    id: 2,
    noSurat: '090/015/SD.01/2024',
    noSppd: '090/015.a/SD.01/2024',
    tanggal: '2024-09-02',
    namaPegawai: 'Siti Aminah, M.Pd',
    tujuan: 'Kecamatan Pintar',
    maksud: 'Rapat Koordinasi KKG',
    status: 'Aktif',
  },
];

export default function SuratTugas() {
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
  const [isGenerating, setIsGenerating] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);

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

  const [staffList] = useState<any[]>(() => {
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

  const [isEditMode, setIsEditMode] = useState(false);

  const handleEditClick = (item: any) => {
    setFormData(item);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (isEditMode) {
      setData(data.map((d: any) => d.id === formData.id ? { ...d, ...formData } : d));
    } else {
      const newItem = {
        ...formData,
        id: data.length > 0 ? Math.max(...data.map((d: any) => d.id)) + 1 : 1,
        status: 'Selesai',
      };
      setData([...data, newItem]);
    }
    setIsModalOpen(false);
    setIsEditMode(false);
  };

  const handlePreview = (item: any) => {
    setSelectedData(item);
    setIsPreviewOpen(true);
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleAddPengikut = () => {
    const currentPengikut = formData.pengikut || [];
    setFormData({ ...formData, pengikut: [...currentPengikut, { nama: '', nip: '', keterangan: '' }] });
  };

  const handleRemovePengikut = (index: number) => {
    const currentPengikut = [...(formData.pengikut || [])];
    currentPengikut.splice(index, 1);
    setFormData({ ...formData, pengikut: currentPengikut });
  };

  const handlePengikutChange = (index: number, field: string, value: string) => {
    const currentPengikut = [...(formData.pengikut || [])];
    currentPengikut[index] = { ...currentPengikut[index], [field]: value };
    setFormData({ ...formData, pengikut: currentPengikut });
  };

  const generateNotulen = async () => {
    if (!formData.maksud && !formData.tujuan) {
      alert("Isi Tempat Tujuan dan Maksud Perjalanan terlebih dahulu.");
      return;
    }
    
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-notulen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          maksud: formData.maksud,
          tujuan: formData.tujuan,
          namaPegawai: formData.namaPegawai,
        })
      });
      const data = await res.json();
      if (data.notulen) {
        handleFormChange('notulen', data.notulen);
      } else {
        alert("Gagal menghasilkan notulen");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat memanggil AI.");
    } finally {
      setIsGenerating(false);
    }
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
            <Briefcase className="w-6 h-6 text-blue-400" />
            Surat Tugas (SPPD)
          </h1>
          <p className="text-slate-400 text-sm mt-1">Kelola dan cetak Surat Tugas dan SPPD Pegawai.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              setFormData({});
              setIsEditMode(false);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" /> Buat Surat Tugas
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-end gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto ml-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari nama pegawai atau no surat..." 
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
              <th className="px-6 py-4 font-medium rounded-tl-2xl">No Surat</th>
              <th className="px-6 py-4 font-medium">Tanggal</th>
              <th className="px-6 py-4 font-medium">Nama Pegawai</th>
              <th className="px-6 py-4 font-medium">Tempat Tujuan</th>
              <th className="px-6 py-4 font-medium">Maksud</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-center rounded-tr-2xl">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {data.filter(item => String(item.namaPegawai || "").toLowerCase().includes(String(searchQuery || "").toLowerCase()) || String(item.noSurat || "").toLowerCase().includes(String(searchQuery || "").toLowerCase())).map((item) => (
              <tr key={item.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <span className="font-mono text-blue-400">{item.noSurat}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-white">{item.tanggal}</div>
                </td>
                <td className="px-6 py-4 text-slate-300">
                  {item.namaPegawai}
                </td>
                <td className="px-6 py-4 text-slate-300">
                  {item.tujuan}
                </td>
                <td className="px-6 py-4 text-slate-300 max-w-[200px] truncate">
                  {item.maksud}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${item.status === 'Selesai' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
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
                <td colSpan={7} className="px-6 py-8 text-center text-slate-400">Belum ada data Surat Tugas.</td>
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
              className="bg-[#0f172a] border border-white/10 w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col overflow-hidden relative z-10 max-h-[90vh]"
            >
              <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/10 shrink-0 bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">{isEditMode ? 'Edit Surat Tugas (SPPD)' : 'Buat Surat Tugas (SPPD) Baru'}</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Lengkapi data untuk membuat surat tugas</p>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Kolom Kiri */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Informasi Surat</h3>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-300">Nomor Surat Tugas</label>
                      <input type="text" placeholder="Contoh: 090/012/SD.01/2024" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-300">Nomor SPPD</label>
                      <input type="text" placeholder="Contoh: 090/012.a/SD.01/2024" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-300">Tanggal Surat</label>
                      <input type="date" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-all [color-scheme:dark]" />
                    </div>
                    
                    <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2 mt-6">Pegawai yang Ditugaskan</h3>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-300">Nama Pegawai</label>
                      <select 
                        value={formData.namaPegawai || ''}
                        onChange={(e) => {
                          const selectedNama = e.target.value;
                          const staff = staffList.find(s => s.nama === selectedNama);
                          handleFormChange('namaPegawai', selectedNama);
                          if (staff) {
                            handleFormChange('nipPegawai', staff.nip !== '-' ? staff.nip : '');
                            handleFormChange('pangkatGolongan', staff.gol !== '-' ? staff.gol : '');
                            handleFormChange('jabatan', staff.jabatan || '');
                          }
                        }}
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer"
                      >
                        <option value="" disabled className="bg-slate-800 text-slate-400">Pilih Pegawai...</option>
                        {staffList.map((staff, idx) => (
                          <option key={idx} value={staff.nama} className="bg-slate-800 text-white">
                            {staff.nama} {staff.nip !== '-' ? `- ${staff.nip}` : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-300">NIP</label>
                      <input type="text" value={formData.nipPegawai || ''} onChange={(e) => handleFormChange('nipPegawai', e.target.value)} placeholder="NIP Pegawai" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-300">Pangkat / Golongan</label>
                      <input type="text" value={formData.pangkatGolongan || ''} onChange={(e) => handleFormChange('pangkatGolongan', e.target.value)} placeholder="Contoh: Penata Tk.I / III/d" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-300">Jabatan</label>
                      <input type="text" value={formData.jabatan || ''} onChange={(e) => handleFormChange('jabatan', e.target.value)} placeholder="Contoh: Guru Kelas" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all" />
                    </div>
                  </div>

                  {/* Kolom Kanan */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Detail Perjalanan</h3>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-300">Maksud Perjalanan Dinas</label>
                      <textarea rows={2} value={formData.maksud || ''} onChange={(e) => handleFormChange('maksud', e.target.value)} placeholder="Tuliskan maksud perjalanan..." className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all"></textarea>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-300">Tempat Berangkat</label>
                        <input type="text" defaultValue={kopSurat.kopBaris3} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-300">Tempat Tujuan</label>
                        <input type="text" value={formData.tujuan || ''} onChange={(e) => handleFormChange('tujuan', e.target.value)} placeholder="Tempat tujuan" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-300">Tgl Berangkat</label>
                        <input type="date" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-all [color-scheme:dark]" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-300">Tgl Kembali</label>
                        <input type="date" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-all [color-scheme:dark]" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-300">Lama Perjalanan</label>
                        <div className="flex items-center gap-2">
                          <input type="number" placeholder="1" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all" />
                          <span className="text-slate-400 text-sm">Hari</span>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-300">Kendaraan</label>
                        <select className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-all">
                          <option value="Kendaraan Umum">Kendaraan Umum</option>
                          <option value="Kendaraan Dinas">Kendaraan Dinas</option>
                          <option value="Kendaraan Pribadi">Kendaraan Pribadi</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-300">Beban Anggaran</label>
                      <input type="text" defaultValue="Dana BOS Reguler" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all" />
                    </div>

                    <div className="space-y-1.5 pt-2">
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-sm font-medium text-slate-300">Laporan Hasil / Notulen</label>
                        <button 
                          onClick={generateNotulen}
                          disabled={isGenerating}
                          className="flex items-center gap-1.5 px-3 py-1 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-400 text-xs font-medium rounded-lg transition-colors border border-indigo-500/30"
                        >
                          {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                          Buat dengan AI
                        </button>
                      </div>
                      <textarea 
                        rows={4} 
                        value={formData.notulen || ''}
                        onChange={(e) => handleFormChange('notulen', e.target.value)}
                        placeholder="Tuliskan laporan hasil atau generate menggunakan AI..." 
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all"
                      ></textarea>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-slate-300">Pengikut</label>
                        <button 
                          onClick={handleAddPengikut}
                          className="flex items-center gap-1.5 px-3 py-1 bg-white/5 hover:bg-white/10 text-white text-xs font-medium rounded-lg transition-colors border border-white/10"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Tambah Pengikut
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        {(formData.pengikut || []).map((p: any, index: number) => (
                          <div key={index} className="flex items-start gap-2 bg-black/10 p-3 rounded-lg border border-white/5 relative">
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <input type="text" value={p.nama || ''} onChange={(e) => handlePengikutChange(index, 'nama', e.target.value)} placeholder="Nama Pengikut" className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all" />
                              </div>
                              <div className="space-y-1">
                                <input type="text" value={p.nip || ''} onChange={(e) => handlePengikutChange(index, 'nip', e.target.value)} placeholder="NIP / Jabatan" className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all" />
                              </div>
                              <div className="col-span-1 md:col-span-2 space-y-1">
                                <input type="text" value={p.keterangan || ''} onChange={(e) => handlePengikutChange(index, 'keterangan', e.target.value)} placeholder="Keterangan" className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all" />
                              </div>
                            </div>
                            <button onClick={() => handleRemovePengikut(index)} className="p-1.5 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors mt-0.5">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        {(!formData.pengikut || formData.pengikut.length === 0) && (
                          <div className="text-center py-4 text-slate-500 text-sm bg-black/5 rounded-lg border border-white/5">
                            Belum ada pengikut ditambahkan
                          </div>
                        )}
                      </div>
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
                <h2 className="text-base font-semibold text-white">Preview Surat Tugas & SPPD</h2>
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
                  
                  {/* Halaman 1 - Surat Tugas */}
                  <div className="p-10" style={{ minHeight: '330.2mm' }}>
                    <div className="text-center mb-6">
                      <h3 className="font-bold text-lg uppercase leading-tight">{kopSurat.kopBaris1}</h3>
                      <h3 className="font-bold text-lg uppercase leading-tight">{kopSurat.kopBaris2}</h3>
                      <h2 className="font-bold text-xl uppercase mt-1 leading-tight">{kopSurat.kopBaris3}</h2>
                      <p className="text-sm mt-1">{kopSurat.kopBaris4}</p>
                      <div className="border-b-[3px] border-black mt-3 mb-[2px]"></div>
                      <div className="border-b border-black mb-1"></div>
                    </div>
                    
                    <div className="text-center mb-8">
                      <h3 className="font-bold text-xl underline leading-tight">SURAT PERINTAH TUGAS</h3>
                      <p className="font-bold mt-1">Nomor: {selectedData.noSurat}</p>
                    </div>

                    <div className="mb-4 text-justify text-[15px]">
                      <table className="w-full align-top">
                        <tbody>
                          <tr>
                            <td className="w-28 align-top font-bold pr-2">Menimbang</td>
                            <td className="w-4 align-top font-bold">:</td>
                            <td className="align-top">
                              <ol className="list-[lower-alpha] pl-4 m-0 space-y-2">
                                <li>Bahwa dalam rangka kelancaran pelaksanaan tugas pada instansi <span className="font-bold">SEKOLAH DASAR NEGERI 1 SLANGIT</span>, dipandang perlu melakukan perjalanan dinas/penugasan khusus;</li>
                                <li>Bahwa pegawai di bawah ini dipandang cakap dan mampu melaksanakan tugas tersebut.</li>
                              </ol>
                            </td>
                          </tr>
                          <tr><td colSpan={3} className="h-4"></td></tr>
                          <tr>
                            <td className="w-28 align-top font-bold pr-2">Dasar</td>
                            <td className="w-4 align-top font-bold">:</td>
                            <td className="align-top">
                              <ol className="list-decimal pl-4 m-0 space-y-1">
                                <li>{selectedData.maksud}</li>
                              </ol>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="text-center font-bold mb-6 text-lg tracking-widest mt-6">MEMERINTAHKAN:</div>

                    <div className="mb-8 text-justify text-[15px]">
                      <table className="w-full align-top">
                        <tbody>
                          <tr>
                            <td className="w-28 align-top font-bold pr-2">Kepada</td>
                            <td className="w-4 align-top font-bold">:</td>
                            <td className="align-top">
                              <table className="w-full">
                                <tbody>
                                  <tr>
                                    <td className="w-40 py-1">Nama Lengkap</td>
                                    <td className="w-4 py-1">:</td>
                                    <td className="font-bold py-1">{selectedData.namaPegawai}</td>
                                  </tr>
                                  <tr>
                                    <td className="py-1">NIP / NIGK</td>
                                    <td className="py-1">:</td>
                                    <td className="py-1">{selectedData.nipPegawai || '-'}</td>
                                  </tr>
                                  <tr>
                                    <td className="py-1">Pangkat / Golongan</td>
                                    <td className="py-1">:</td>
                                    <td className="py-1">{selectedData.pangkatGolongan || '-'}</td>
                                  </tr>
                                  <tr>
                                    <td className="py-1">Jabatan</td>
                                    <td className="py-1">:</td>
                                    <td className="py-1">{selectedData.jabatan || '-'}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                          <tr><td colSpan={3} className="h-6"></td></tr>
                          <tr>
                            <td className="w-28 align-top font-bold pr-2">Untuk</td>
                            <td className="w-4 align-top font-bold">:</td>
                            <td className="align-top">
                              <ol className="list-decimal pl-4 m-0 space-y-3">
                                <li>
                                  Melaksanakan tugas dengan maksud:
                                  <div className="font-bold italic mt-1">{selectedData.maksud}</div>
                                </li>
                                <li>
                                  Tugas dilaksanakan pada:
                                  <table className="w-full mt-1">
                                    <tbody>
                                      <tr>
                                        <td className="w-32 text-slate-700">Hari, Tanggal</td>
                                        <td className="w-4">:</td>
                                        <td className="font-bold">{new Date(selectedData.tanggal).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} s.d. Selesai</td>
                                      </tr>
                                      <tr>
                                        <td className="text-slate-700">Waktu</td>
                                        <td>:</td>
                                        <td className="font-bold">08:00 WIB s.d. Selesai</td>
                                      </tr>
                                      <tr>
                                        <td className="text-slate-700">Tempat Tujuan</td>
                                        <td>:</td>
                                        <td className="font-bold">{selectedData.tujuan}</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </li>
                                <li>Melaporkan hasil tugas tertulis kepada Kepala Sekolah setelah tugas selesai.</li>
                                <li>Biaya pelaksanaan Surat Perintah Tugas ini dibebankan pada anggaran instansi.</li>
                              </ol>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="flex justify-end mt-16 pr-8">
                      <div className="w-72 text-[15px]">
                        <table className="w-full text-center mb-6">
                          <tbody>
                            <tr>
                              <td className="text-right w-24">Ditetapkan di</td>
                              <td className="w-4">:</td>
                              <td className="text-left">Slangit</td>
                            </tr>
                            <tr>
                              <td className="text-right">Pada tanggal</td>
                              <td>:</td>
                              <td className="text-left border-b border-black pb-1">{new Date(selectedData.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                            </tr>
                          </tbody>
                        </table>
                        
                        <div className="mb-24 font-bold text-center">{currentJabatanKepsek.toUpperCase()}</div>
                        
                        <div className="text-center">
                          <div className="font-bold border-b border-black pb-0.5 inline-block">{currentNamaKepsek}</div>
                          <div>NIP. {currentNipKepsek}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="break-before-page" style={{ pageBreakBefore: 'always' }}></div>

                  {/* Halaman 2 - SPPD */}
                  <div className="p-10" style={{ minHeight: '330.2mm' }}>
                    <div className="flex justify-end mb-4 text-sm">
                      <table className="w-80">
                        <tbody>
                          <tr>
                            <td className="w-20 align-top">Lembar Ke</td>
                            <td className="w-4 align-top">:</td>
                            <td className="align-top">1 (Satu)</td>
                          </tr>
                          <tr>
                            <td className="align-top">Kode No</td>
                            <td className="align-top">:</td>
                            <td className="align-top"></td>
                          </tr>
                          <tr>
                            <td className="align-top">Nomor</td>
                            <td className="align-top">:</td>
                            <td className="align-top">{selectedData.noSppd}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="text-center mb-6">
                      <h3 className="font-bold text-lg underline leading-tight">SURAT PERINTAH PERJALANAN DINAS</h3>
                      <h3 className="font-bold text-lg leading-tight">(S P P D)</h3>
                    </div>

                    <table className="w-full border-collapse border border-black text-sm text-left mb-8">
                      <tbody>
                        <tr>
                          <td className="border border-black p-2 w-8 text-center">1.</td>
                          <td className="border border-black p-2 w-64">Pejabat berwenang yang memberi perintah</td>
                          <td className="border border-black p-2">Kepala {kopSurat.kopBaris3}</td>
                        </tr>
                        <tr>
                          <td className="border border-black p-2 text-center">2.</td>
                          <td className="border border-black p-2">Nama/NIP Pegawai yang diperintahkan</td>
                          <td className="border border-black p-2 font-bold">
                            {selectedData.namaPegawai}<br/>
                            <span className="font-normal">NIP. {selectedData.nipPegawai || '-'}</span>
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-black p-2 text-center">3.</td>
                          <td className="border border-black p-2">
                            a. Pangkat dan Golongan ruang gaji menurut PP No. 6 Tahun 1997<br/>
                            b. Jabatan / Instansi<br/>
                            c. Tingkat Biaya Perjalanan Dinas
                          </td>
                          <td className="border border-black p-2 align-top">
                            a. {selectedData.pangkatGolongan || '-'}<br/>
                            b. {selectedData.jabatan || '-'} / {kopSurat.kopBaris3}<br/>
                            c. -
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-black p-2 text-center">4.</td>
                          <td className="border border-black p-2">Maksud Perjalanan Dinas</td>
                          <td className="border border-black p-2">{selectedData.maksud}</td>
                        </tr>
                        <tr>
                          <td className="border border-black p-2 text-center">5.</td>
                          <td className="border border-black p-2">Alat angkutan yang dipergunakan</td>
                          <td className="border border-black p-2">Kendaraan Umum</td>
                        </tr>
                        <tr>
                          <td className="border border-black p-2 text-center">6.</td>
                          <td className="border border-black p-2">
                            a. Tempat Berangkat<br/>
                            b. Tempat Tujuan
                          </td>
                          <td className="border border-black p-2 align-top">
                            a. {kopSurat.kopBaris3}<br/>
                            b. {selectedData.tujuan}
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-black p-2 text-center">7.</td>
                          <td className="border border-black p-2">
                            a. Lamanya Perjalanan Dinas<br/>
                            b. Tanggal Berangkat<br/>
                            c. Tanggal harus kembali/tiba ditempat baru
                          </td>
                          <td className="border border-black p-2 align-top">
                            a. 1 (Satu) Hari<br/>
                            b. {new Date(selectedData.tanggal).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}<br/>
                            c. {new Date(selectedData.tanggal).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-black p-2 text-center align-top">8.</td>
                          <td className="border border-black p-2 align-top" colSpan={2}>
                            <div className="grid grid-cols-[30px_1fr_1fr_1fr] font-bold border-b border-black mb-1 pb-1">
                              <div>No.</div>
                              <div>Pengikut: Nama</div>
                              <div>NIP / Jabatan</div>
                              <div>Keterangan</div>
                            </div>
                            {(!selectedData.pengikut || selectedData.pengikut.length === 0) ? (
                              <div className="text-center italic my-2">- Tidak ada pengikut -</div>
                            ) : (
                              <div className="space-y-1">
                                {selectedData.pengikut.map((p: any, idx: number) => (
                                  <div key={idx} className="grid grid-cols-[30px_1fr_1fr_1fr]">
                                    <div>{idx + 1}.</div>
                                    <div>{p.nama || '-'}</div>
                                    <div>{p.nip || '-'}</div>
                                    <div>{p.keterangan || '-'}</div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-black p-2 text-center">9.</td>
                          <td className="border border-black p-2">
                            Pembebanan Anggaran<br/>
                            a. Instansi<br/>
                            b. Mata Anggaran
                          </td>
                          <td className="border border-black p-2 align-top">
                            <br/>
                            a. {kopSurat.kopBaris3}<br/>
                            b. Dana BOS Reguler
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-black p-2 text-center align-top">10.</td>
                          <td className="border border-black p-2 align-top">Keterangan lain-lain</td>
                          <td className="border border-black p-2">
                            -
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <div className="flex justify-end mt-8 pr-8">
                      <div className="w-64 text-[15px]">
                        <table className="w-full text-left mb-6">
                          <tbody>
                            <tr>
                              <td className="w-24">Dikeluarkan di</td>
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
                        
                        <div className="mb-24">{currentJabatanKepsek},</div>
                        
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
                <h3 className="text-xl font-semibold text-white text-center mb-2">Hapus Surat Tugas</h3>
                <p className="text-slate-400 text-center text-sm mb-6">
                  Apakah Anda yakin ingin menghapus Surat Tugas <span className="text-white font-medium">{itemToDelete?.noSurat}</span>? Tindakan ini tidak dapat dibatalkan.
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
