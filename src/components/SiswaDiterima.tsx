import React, { useState } from 'react';
import { getKopSurat } from '../utils/settings';
import { FileText, Search, Plus, Filter, Printer, Trash2, X, Save, Edit, Check, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const DUMMY_DATA = [
  {
    id: 1,
    noSurat: '421.2/005/SD.01/2026',
    tanggal: '2026-07-05',
    namaSiswa: 'Ahmad Maulana',
    nis: '1234',
    nisn: '0123456789',
    jenisKelamin: 'Laki-laki',
    asalSekolah: 'SD Negeri 2 Kedawung',
    nomorSuratPindah: '421.2/010/SD.02/2026',
    tanggalSuratPindah: '2026-07-01',
    kelas: 'V',
    kelasHuruf: 'Lima',
    terhitungMulaiTanggal: '2026-07-06',
    status: 'Aktif',
  },
  {
    id: 2,
    noSurat: '421.2/006/SD.01/2026',
    tanggal: '2026-07-06',
    namaSiswa: 'Siti Aminah',
    nis: '1235',
    nisn: '0987654321',
    jenisKelamin: 'Perempuan',
    asalSekolah: 'MI Muhammadiyah 1',
    nomorSuratPindah: '421.2/015/MI.1/2026',
    tanggalSuratPindah: '2026-07-02',
    kelas: 'VI',
    kelasHuruf: 'Enam',
    terhitungMulaiTanggal: '2026-07-08',
    status: 'Aktif',
  },
];

export default function SiswaDiterima() {
  const kopSurat = getKopSurat();
  const currentNamaKepsek = localStorage.getItem('namaKepsek') || 'Drs. H. Ahmad Sudirman, M.Pd.';
  const currentNipKepsek = localStorage.getItem('nipKepsek') || '19700512 199512 1 003';
  const currentJabatanKepsek = localStorage.getItem('jabatanKepsek') || 'Kepala Sekolah';
  const currentTitimangsa = localStorage.getItem('titimangsa') || 'Cirebon';

  // Load data Peserta Didik
  const [studentList] = useState<any[]>(() => {
    const saved = localStorage.getItem('dataPesertaDidik');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [data, setData] = useState(DUMMY_DATA);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState<any>({});

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

  const handlePreview = (item: any) => {
    setSelectedData(item);
    setIsPreviewOpen(true);
  };

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
        tanggal: formData.tanggal || new Date().toISOString().split('T')[0]
      };
      setData([...data, newItem]);
    }
    setIsModalOpen(false);
    setIsEditMode(false);
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
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
            <FileText className="w-6 h-6 text-blue-400" />
            Siswa Diterima
          </h1>
          <p className="text-slate-400 text-sm mt-1">Kelola dan cetak Surat Keterangan Siswa Diterima.</p>
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
            <Plus className="w-4 h-4" /> Buat Surat Baru
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-end gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto ml-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari nama siswa atau no surat..." 
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
              <th className="px-6 py-4 font-medium">Nama Siswa</th>
              <th className="px-6 py-4 font-medium">Kelas</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-center rounded-tr-2xl">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {data.filter(item => String(item.namaSiswa || "").toLowerCase().includes(String(searchQuery || "").toLowerCase()) || String(item.noSurat || "").toLowerCase().includes(String(searchQuery || "").toLowerCase())).map((item) => (
              <tr key={item.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <span className="font-mono text-blue-400">{item.noSurat}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-white">{new Date(item.tanggal).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                </td>
                <td className="px-6 py-4 text-slate-300">
                  {item.namaSiswa}
                </td>
                <td className="px-6 py-4 text-slate-300">
                  {item.kelas}
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
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
                <td colSpan={6} className="px-6 py-8 text-center text-slate-400">Belum ada data surat keterangan.</td>
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
                    <FileText className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">{isEditMode ? 'Edit Surat Keterangan Diterima' : 'Buat Surat Keterangan Baru'}</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Lengkapi data untuk surat keterangan diterima</p>
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
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-sm font-medium text-slate-300">Nomor Surat</label>
                    <input type="text" value={formData.noSurat || ''} onChange={(e) => handleFormChange('noSurat', e.target.value)} placeholder="Contoh: 421.2/005/SD.01/2026" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all" />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg mb-2">
                    <label className="text-sm font-medium text-blue-300 flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      Pilih dari Data Peserta Didik (Isi Otomatis)
                    </label>
                    <select
                      onChange={(e) => {
                        const selected = studentList.find((s: any, i: number) => s.nisn === e.target.value || i === parseInt(e.target.value));
                        if (selected) {
                          setFormData({
                            ...formData,
                            namaSiswa: selected.nama || '',
                            nis: selected.nis || '',
                            nisn: selected.nisn || '',
                            jenisKelamin: selected.jenisKelamin || 'Laki-laki',
                            kelas: selected.kelas || ''
                          });
                        }
                      }}
                      className="w-full bg-black/40 border border-blue-500/30 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-400 transition-all text-sm"
                    >
                      <option value="">-- Pilih Peserta Didik --</option>
                      {studentList.map((s: any, idx: number) => (
                        <option key={`student-${s.id || idx}`} value={s.nisn || idx}>{s.nama} - {s.kelas} ({s.nisn || s.nis})</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-sm font-medium text-slate-300">Nama Lengkap Siswa</label>
                    <input type="text" value={formData.namaSiswa || ''} onChange={(e) => handleFormChange('namaSiswa', e.target.value)} placeholder="Masukkan nama siswa" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300">NIS</label>
                    <input type="text" value={formData.nis || ''} onChange={(e) => handleFormChange('nis', e.target.value)} placeholder="Masukkan NIS" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300">NISN</label>
                    <input type="text" value={formData.nisn || ''} onChange={(e) => handleFormChange('nisn', e.target.value)} placeholder="Masukkan NISN" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all" />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-sm font-medium text-slate-300">Jenis Kelamin</label>
                    <select value={formData.jenisKelamin || ''} onChange={(e) => handleFormChange('jenisKelamin', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-all [color-scheme:dark]">
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2 pt-2 border-t border-white/10 mt-2">
                    <h3 className="text-sm font-medium text-white mb-3">Keterangan Surat Pindah</h3>
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-sm font-medium text-slate-300">Sesuai Surat Pindah Dari</label>
                    <input type="text" value={formData.asalSekolah || ''} onChange={(e) => handleFormChange('asalSekolah', e.target.value)} placeholder="Contoh: SD Negeri 2 Kedawung" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300">Nomor Surat Pindah</label>
                    <input type="text" value={formData.nomorSuratPindah || ''} onChange={(e) => handleFormChange('nomorSuratPindah', e.target.value)} placeholder="Nomor surat asal" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300">Tertanggal (Surat Pindah)</label>
                    <input type="date" value={formData.tanggalSuratPindah || ''} onChange={(e) => handleFormChange('tanggalSuratPindah', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-all [color-scheme:dark]" />
                  </div>

                  <div className="sm:col-span-2 pt-2 border-t border-white/10 mt-2">
                    <h3 className="text-sm font-medium text-white mb-3">Ditempatkan Pada</h3>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300">Di Kelas (Angka/Simbol)</label>
                    <input type="text" value={formData.kelas || ''} onChange={(e) => handleFormChange('kelas', e.target.value)} placeholder="Contoh: 5" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300">Di Kelas (Huruf)</label>
                    <input type="text" value={formData.kelasHuruf || ''} onChange={(e) => handleFormChange('kelasHuruf', e.target.value)} placeholder="Contoh: Lima" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300">Terhitung Mulai Tanggal</label>
                    <input type="date" value={formData.terhitungMulaiTanggal || ''} onChange={(e) => handleFormChange('terhitungMulaiTanggal', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-all [color-scheme:dark]" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300">Tanggal Ditetapkan (Surat Ini)</label>
                    <input type="date" value={formData.tanggal || ''} onChange={(e) => handleFormChange('tanggal', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-all [color-scheme:dark]" />
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
              className="bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl flex flex-col relative z-10 w-full max-w-3xl"
            >
              <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
                <h3 className="font-semibold text-white">Preview Dokumen</h3>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={printThermal}
                    className="flex items-center gap-2 px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
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

              <div className="p-8 bg-white flex justify-center overflow-y-auto max-h-[70vh] custom-scrollbar">
                <div id="sk-print-area" className="bg-white text-black p-10 font-serif mx-auto" style={{ width: '215.9mm', minHeight: '330.2mm', maxWidth: '100%', boxSizing: 'border-box' }}>
                  
                  <div className="text-center mb-6">
                    <h3 className="font-bold text-lg uppercase leading-tight">{kopSurat.kopBaris1}</h3>
                    <h3 className="font-bold text-lg uppercase leading-tight">{kopSurat.kopBaris2}</h3>
                    <h2 className="font-bold text-xl uppercase mt-1 leading-tight">{kopSurat.kopBaris3}</h2>
                    <p className="text-sm mt-1">{kopSurat.kopBaris4}</p>
                    <div className="border-b-[3px] border-black mt-3 mb-[2px]"></div>
                    <div className="border-b border-black mb-1"></div>
                  </div>

                  <div className="text-center mb-10">
                    <h3 className="font-bold text-xl underline leading-tight">SURAT KETERANGAN DITERIMA PINDAH SEKOLAH</h3>
                    <p className="font-bold mt-1">Nomor: {selectedData.noSurat}</p>
                  </div>

                  <div className="mb-8 text-justify text-[16px] leading-relaxed">
                    <p className="mb-4">
                      Yang bertanda tangan di bawah ini, Kepala {kopSurat.kopBaris3}, dengan ini menerangkan bahwa:
                    </p>
                    <table className="w-full ml-8 mb-4">
                      <tbody>
                        <tr>
                          <td className="w-56 py-1">Nama Lengkap Siswa</td>
                          <td className="w-4 py-1">:</td>
                          <td className="font-bold py-1">{selectedData.namaSiswa}</td>
                        </tr>
                        <tr>
                          <td className="py-1">NIS / NISN</td>
                          <td className="py-1">:</td>
                          <td className="py-1">{selectedData.nis} / {selectedData.nisn}</td>
                        </tr>
                        <tr>
                          <td className="py-1">Jenis Kelamin</td>
                          <td className="py-1">:</td>
                          <td className="py-1">{selectedData.jenisKelamin}</td>
                        </tr>
                        <tr>
                          <td className="py-1">Sesuai Surat Pindah Dari</td>
                          <td className="py-1">:</td>
                          <td className="py-1">{selectedData.asalSekolah}</td>
                        </tr>
                        <tr>
                          <td className="py-1">Nomor Surat Pindah</td>
                          <td className="py-1">:</td>
                          <td className="py-1">{selectedData.nomorSuratPindah}</td>
                        </tr>
                        <tr>
                          <td className="py-1">Tertanggal</td>
                          <td className="py-1">:</td>
                          <td className="py-1">{selectedData.tanggalSuratPindah ? new Date(selectedData.tanggalSuratPindah).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</td>
                        </tr>
                      </tbody>
                    </table>

                    <p className="mb-4">
                      Berdasarkan surat permohonan pindah sekolah dari orang tua / wali murid bertandatangan di
                      bawah ini, maka siswa yang bersangkutan dinyatakan <span className="font-bold">DITERIMA PINDAH</span> menjadi siswa di
                      {kopSurat.kopBaris3} dan ditempatkan pada:
                    </p>
                    
                    <table className="w-full ml-8 mb-4">
                      <tbody>
                        <tr>
                          <td className="w-56 py-1">Di Kelas</td>
                          <td className="w-4 py-1">:</td>
                          <td className="py-1">{selectedData.kelas} ( {selectedData.kelasHuruf} )</td>
                        </tr>
                        <tr>
                          <td className="py-1">Terhitung Mulai Tanggal</td>
                          <td className="py-1">:</td>
                          <td className="py-1">{selectedData.terhitungMulaiTanggal ? new Date(selectedData.terhitungMulaiTanggal).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</td>
                        </tr>
                      </tbody>
                    </table>

                    <p>
                      Demikian surat keterangan ini dibuat dengan sebenarnya untuk dapat dipergunakan
                      sebagaimana mestinya, serta agar dijadikan sebagai dasar pengurusan surat pindah/mutasi
                      selanjutnya dari sekolah asal siswa.
                    </p>
                  </div>
                  
                  <div className="mt-8 mb-4 text-sm italic">
                    * Coret yang tidak perlu
                  </div>

                  <div className="flex justify-end mt-8 pr-8">
                    <div className="w-72 text-[16px] text-center">
                      <div className="mb-1">
                        {currentTitimangsa}, {new Date(selectedData.tanggal).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                      <div className="mb-24">{currentJabatanKepsek}</div>
                      
                      <div className="font-bold border-b border-black pb-0.5 inline-block min-w-full">
                        {currentNamaKepsek}
                      </div>
                      <div className="text-left mt-1">NIP. {currentNipKepsek}</div>
                    </div>
                  </div>
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
                <h3 className="text-xl font-semibold text-white text-center mb-2">Hapus Surat Diterima</h3>
                <p className="text-slate-400 text-center text-sm mb-6">
                  Apakah Anda yakin ingin menghapus surat keterangan ini? Tindakan ini tidak dapat dibatalkan.
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
