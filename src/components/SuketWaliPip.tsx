import React, { useState, useEffect, useMemo } from 'react';
import { getKopSurat } from '../utils/settings';
import { FileText, Search, Plus, Filter, Printer, Trash2, X, Save, Edit, ChevronDown, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const DUMMY_DATA = [
  {
    id: 1,
    noSurat: '421.2/005/SD.01/2026',
    tanggal: '2026-07-05',
    namaWali: 'Budi Santoso',
    tempatLahirWali: 'Cirebon',
    tanggalLahirWali: '1980-05-12',
    pekerjaanWali: 'Wiraswasta',
    alamatWali: 'Jl. Merdeka No. 10, Cirebon',
    hubunganKeluarga: 'Paman',
    namaSiswa: 'Ahmad Maulana',
    tempatLahirSiswa: 'Cirebon',
    tanggalLahirSiswa: '2015-05-12',
    nisn: '0123456789',
    kelas: 'V',
    namaOrtu: 'Ridwan',
    status: 'Aktif',
    tahunPelajaran: '2025/2026'
  },
  {
    id: 2,
    noSurat: '421.2/006/SD.01/2026',
    tanggal: '2026-07-06',
    namaWali: 'Asep Supriatna',
    tempatLahirWali: 'Kuningan',
    tanggalLahirWali: '1975-08-20',
    pekerjaanWali: 'PNS',
    alamatWali: 'Jl. Sudirman No. 25, Kuningan',
    hubunganKeluarga: 'Kakek',
    namaSiswa: 'Siti Aminah',
    tempatLahirSiswa: 'Kuningan',
    tanggalLahirSiswa: '2014-08-20',
    nisn: '0987654321',
    kelas: 'VI',
    namaOrtu: 'Sulaeman',
    status: 'Aktif',
    tahunPelajaran: '2025/2026'
  },
];

export default function SuketWaliPip() {
  const kopSurat = getKopSurat();
  const currentNamaKepsek = localStorage.getItem('namaKepsek') || 'Drs. H. Ahmad Sudirman, M.Pd.';
  const currentNipKepsek = localStorage.getItem('nipKepsek') || '19700512 199512 1 003';
  const currentJabatanKepsek = localStorage.getItem('jabatanKepsek') || 'Kepala Sekolah';
  const currentTitimangsa = localStorage.getItem('titimangsa') || 'Cirebon';
  
  const [data, setData] = useState<any[]>(() => {
    const saved = localStorage.getItem('suket_wali_pip_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DUMMY_DATA;
      }
    }
    return DUMMY_DATA;
  });

  useEffect(() => {
    localStorage.setItem('suket_wali_pip_data', JSON.stringify(data));
  }, [data]);

  // Ambil data siswa dari Manajemen PIP (localStorage)
  const pipStudents = useMemo(() => {
    const saved = localStorage.getItem('dataPesertaDidik');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error("Gagal mengambil data Manajemen PIP", e);
      }
    }
    // Jika kosong di localStorage, gunakan default dummy data dari Manajemen PIP agar list terisi
    return [
      {
        id: 1,
        namaSiswa: 'Ahmad Maulana',
        nisn: '0123456789',
        kelas: 'V',
        noRekening: '0234-01-012345-53-1',
        bank: 'BRI',
        nominal: 'Rp 450.000',
        tahap: 'Tahap 1',
        tanggalCair: '2026-03-15',
        status: 'Sudah Cair',
      },
      {
        id: 2,
        namaSiswa: 'Siti Aminah',
        nisn: '0987654321',
        kelas: 'VI',
        noRekening: '0234-01-098765-53-2',
        bank: 'BRI',
        nominal: 'Rp 450.000',
        tahap: 'Tahap 1',
        tanggalCair: '',
        status: 'Belum Cair',
      }
    ];
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState<any>({});
  const [pipSearchQuery, setPipSearchQuery] = useState('');
  const [showPipDropdown, setShowPipDropdown] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);

  const handleDeleteClick = (item: any) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setData(data.filter((item) => item.id !== itemToDelete.id));
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const filteredPipStudents = useMemo(() => {
    if (!pipSearchQuery) return pipStudents;
    const query = pipSearchQuery.toLowerCase();
    return pipStudents.filter((student: any) => 
      (student.nama || student.namaSiswa || '').toLowerCase().includes(query) ||
      (student.nisn || '').toLowerCase().includes(query) ||
      (student.rombel || student.kelas || '').toLowerCase().includes(query)
    );
  }, [pipStudents, pipSearchQuery]);

  const handlePreview = (item: any) => {
    setSelectedData(item);
    setIsPreviewOpen(true);
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSaveData = () => {
    if (!formData.namaSiswa || !formData.noSurat) {
      alert('Nama Siswa dan Nomor Surat harus diisi!');
      return;
    }

    const nextData = {
      ...formData,
      id: formData.id || Date.now(),
      status: formData.status || 'Aktif',
      tahunPelajaran: formData.tahunPelajaran || '2025/2026'
    };

    if (formData.id) {
      setData(data.map((item: any) => item.id === formData.id ? nextData : item));
    } else {
      setData([...data, nextData]);
    }

    setIsModalOpen(false);
    setFormData({});
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data surat ini?')) {
      setData(data.filter((item) => item.id !== id));
    }
  };

  const handleEdit = (item: any) => {
    setFormData(item);
    setPipSearchQuery(item.namaSiswa || '');
    setShowPipDropdown(false);
    setIsModalOpen(true);
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
            Surat Kuasa Wali PIP
          </h1>
          <p className="text-slate-400 text-sm mt-1">Kelola dan cetak Surat Keterangan Surat Kuasa Wali PIP.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              setFormData({});
              setPipSearchQuery('');
              setShowPipDropdown(false);
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
                  <div className="font-medium text-white">
                    {item.tanggal ? new Date(item.tanggal).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' }) : '-'}
                  </div>
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
                      onClick={() => handleEdit(item)}
                      className="p-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-lg transition-colors" 
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(item)}
                      className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors" 
                      title="Hapus"
                    >
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
                    <h2 className="text-lg font-semibold text-white">
                      {formData.id ? 'Edit Surat Keterangan' : 'Buat Surat Keterangan Baru'}
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">Lengkapi data untuk surat keterangan kuasa wali penerima PIP</p>
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
                    <input 
                      type="text" 
                      placeholder="Contoh: 421.2/005/SD.01/2026" 
                      value={formData.noSurat || ''}
                      onChange={(e) => handleFormChange('noSurat', e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300">Tanggal Surat</label>
                    <input 
                      type="date" 
                      value={formData.tanggal || ''}
                      onChange={(e) => handleFormChange('tanggal', e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-all [color-scheme:dark]" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300">Tahun Pelajaran</label>
                    <input 
                      type="text" 
                      placeholder="Contoh: 2025/2026" 
                      value={formData.tahunPelajaran || '2025/2026'}
                      onChange={(e) => handleFormChange('tahunPelajaran', e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all" 
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2 pt-2 border-t border-white/10 mt-2">
                    <h3 className="text-sm font-medium text-white mb-3">Data Wali</h3>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300">Nama Wali</label>
                    <input 
                      type="text" 
                      placeholder="Masukkan nama wali" 
                      value={formData.namaWali || ''}
                      onChange={(e) => handleFormChange('namaWali', e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300">Hubungan Keluarga</label>
                    <input 
                      type="text" 
                      placeholder="Contoh: Paman, Kakek" 
                      value={formData.hubunganKeluarga || ''}
                      onChange={(e) => handleFormChange('hubunganKeluarga', e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300">Tempat Lahir Wali</label>
                    <input 
                      type="text" 
                      placeholder="Contoh: Cirebon" 
                      value={formData.tempatLahirWali || ''}
                      onChange={(e) => handleFormChange('tempatLahirWali', e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300">Tanggal Lahir Wali</label>
                    <input 
                      type="date" 
                      value={formData.tanggalLahirWali || ''}
                      onChange={(e) => handleFormChange('tanggalLahirWali', e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-all [color-scheme:dark]" 
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-sm font-medium text-slate-300">Pekerjaan Wali</label>
                    <input 
                      type="text" 
                      placeholder="Contoh: Wiraswasta" 
                      value={formData.pekerjaanWali || ''}
                      onChange={(e) => handleFormChange('pekerjaanWali', e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all" 
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-sm font-medium text-slate-300">Alamat Wali</label>
                    <textarea 
                      rows={2} 
                      placeholder="Masukkan alamat lengkap wali..." 
                      value={formData.alamatWali || ''}
                      onChange={(e) => handleFormChange('alamatWali', e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all"
                    ></textarea>
                  </div>

                  <div className="sm:col-span-2 pt-2 border-t border-white/10 mt-2">
                    <h3 className="text-sm font-medium text-white mb-3">Data Siswa</h3>
                  </div>

                  {/* dropdown ambil dari manajemen pip dengan fitur pencarian */}
                  <div className="sm:col-span-2 space-y-1.5 bg-blue-500/5 p-3 rounded-lg border border-blue-500/20 relative">
                    <label className="text-xs font-semibold uppercase tracking-wider text-blue-400">Ambil data dari Peserta Didik</label>
                    <div className="relative">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <input
                          type="text"
                          placeholder="Cari nama atau NISN siswa..."
                          value={pipSearchQuery}
                          onChange={(e) => {
                            setPipSearchQuery(e.target.value);
                            setShowPipDropdown(true);
                          }}
                          onFocus={() => setShowPipDropdown(true)}
                          className="w-full pl-10 pr-10 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPipDropdown(!showPipDropdown)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                        >
                          <ChevronDown className={`w-4 h-4 transition-transform ${showPipDropdown ? 'rotate-180' : ''}`} />
                        </button>
                      </div>

                      {showPipDropdown && (
                        <>
                          {/* Backdrop to close dropdown on click outside */}
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setShowPipDropdown(false)} 
                          />
                          <div className="absolute left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-[#1e293b] border border-white/15 rounded-lg shadow-2xl z-20 custom-scrollbar divide-y divide-white/5">
                            {filteredPipStudents.length > 0 ? (
                              filteredPipStudents.map((student: any) => (
                                <button
                                  key={student.id}
                                  type="button"
                                  onClick={() => {
                                    setFormData((prev: any) => ({
                                      ...prev,
                                      namaSiswa: student.nama || student.namaSiswa || '',
                                      nisn: student.nisn || '',
                                      kelas: student.rombel || student.kelas || '',
                                      namaOrtu: student.namaIbu || student.namaAyah || '',
                                      tempatLahirSiswa: student.tempatLahir || '',
                                      tanggalLahirSiswa: student.tglLahir || student.tanggalLahir || '',
                                    }));
                                    setPipSearchQuery(student.namaSiswa);
                                    setShowPipDropdown(false);
                                  }}
                                  className="w-full text-left px-4 py-2.5 text-sm text-slate-200 hover:bg-blue-600 hover:text-white transition-colors flex flex-col gap-0.5"
                                >
                                  <span className="font-medium">{student.namaSiswa}</span>
                                  <span className="text-xs text-slate-400 group-hover:text-blue-200">
                                    NISN: {student.nisn || '-'} | Kelas: {student.kelas || '-'}
                                  </span>
                                </button>
                              ))
                            ) : (
                              <div className="px-4 py-3 text-sm text-slate-400 italic">
                                Siswa tidak ditemukan
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Cari dan pilih siswa untuk mengisi form isian Data Siswa di bawah ini secara otomatis.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300">Nama Siswa</label>
                    <input 
                      type="text" 
                      placeholder="Masukkan nama siswa" 
                      value={formData.namaSiswa || ''}
                      onChange={(e) => handleFormChange('namaSiswa', e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300">NIS / NISN</label>
                    <input 
                      type="text" 
                      placeholder="Masukkan NIS/NISN" 
                      value={formData.nisn || ''}
                      onChange={(e) => handleFormChange('nisn', e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300">Tempat Lahir Siswa</label>
                    <input 
                      type="text" 
                      placeholder="Contoh: Cirebon" 
                      value={formData.tempatLahirSiswa || ''}
                      onChange={(e) => handleFormChange('tempatLahirSiswa', e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300">Tanggal Lahir Siswa</label>
                    <input 
                      type="date" 
                      value={formData.tanggalLahirSiswa || ''}
                      onChange={(e) => handleFormChange('tanggalLahirSiswa', e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-all [color-scheme:dark]" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300">Kelas</label>
                    <input 
                      type="text" 
                      placeholder="Contoh: V" 
                      value={formData.kelas || ''}
                      onChange={(e) => handleFormChange('kelas', e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300">Nama Orang Tua Kandung</label>
                    <input 
                      type="text" 
                      placeholder="Masukkan nama orang tua" 
                      value={formData.namaOrtu || ''}
                      onChange={(e) => handleFormChange('namaOrtu', e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all" 
                    />
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
                  onClick={handleSaveData} 
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
                    <p className="text-sm">Surat Elektronik: [Email Sekolah] | Telepon: [No. Telepon Sekolah]</p>
                    <div className="border-b-[3px] border-black mt-3 mb-[2px]"></div>
                    <div className="border-b border-black mb-1"></div>
                  </div>

                  <div className="text-center mb-10">
                    <h3 className="font-bold text-xl underline leading-tight">SURAT KETERANGAN KUASA WALI PENERIMA PIP</h3>
                    <p className="font-bold mt-1">Nomor: {selectedData.noSurat || '[Nomor Surat]'}</p>
                  </div>

                  <div className="mb-8 text-justify text-[16px] leading-relaxed">
                    <p className="mb-4">
                      Yang bertanda tangan di bawah ini, Kepala {kopSurat.kopBaris3}, menerangkan dengan sesungguhnya bahwa:
                    </p>
                    <table className="w-full ml-8 mb-4">
                      <tbody>
                        <tr>
                          <td className="w-48 py-1">Nama Wali</td>
                          <td className="w-4 py-1">:</td>
                          <td className="font-bold py-1">{selectedData.namaWali || '[Nama Wali]'}</td>
                        </tr>
                        <tr>
                          <td className="py-1">Tempat, Tanggal Lahir</td>
                          <td className="py-1">:</td>
                          <td className="py-1">
                            {selectedData.tempatLahirWali || '[Tempat]'}
                            {selectedData.tanggalLahirWali ? `, ${new Date(selectedData.tanggalLahirWali).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}` : ''}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-1">Pekerjaan</td>
                          <td className="py-1">:</td>
                          <td className="py-1">{selectedData.pekerjaanWali || '[Pekerjaan Wali]'}</td>
                        </tr>
                        <tr>
                          <td className="py-1 align-top">Alamat</td>
                          <td className="py-1 align-top">:</td>
                          <td className="py-1 align-top">{selectedData.alamatWali || '[Alamat Wali]'}</td>
                        </tr>
                        <tr>
                          <td className="py-1">Hubungan dengan Siswa</td>
                          <td className="py-1">:</td>
                          <td className="py-1">{selectedData.hubunganKeluarga || '[Hubungan Keluarga]'}</td>
                        </tr>
                      </tbody>
                    </table>

                    <p className="mb-4">
                      Nama tersebut di atas adalah benar-benar diberi Kuasa/Wali dari siswa penerima Bantuan Program Indonesia Pintar (PIP), sebagai berikut:
                    </p>
                    
                    <table className="w-full ml-8 mb-4">
                      <tbody>
                        <tr>
                          <td className="w-48 py-1">Nama Siswa</td>
                          <td className="w-4 py-1">:</td>
                          <td className="font-bold py-1">{selectedData.namaSiswa || '[Nama Siswa]'}</td>
                        </tr>
                        <tr>
                          <td className="py-1">Tempat, Tanggal Lahir</td>
                          <td className="py-1">:</td>
                          <td className="py-1">
                            {selectedData.tempatLahirSiswa || '[Tempat]'}
                            {selectedData.tanggalLahirSiswa ? `, ${new Date(selectedData.tanggalLahirSiswa).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}` : ''}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-1">NIS / NISN</td>
                          <td className="py-1">:</td>
                          <td className="py-1">{selectedData.nisn || '[NISN]'}</td>
                        </tr>
                        <tr>
                          <td className="py-1">Kelas</td>
                          <td className="py-1">:</td>
                          <td className="py-1">{selectedData.kelas || '[Kelas]'}</td>
                        </tr>
                        <tr>
                          <td className="py-1">Nama Orang Tua Kandung</td>
                          <td className="py-1">:</td>
                          <td className="py-1">{selectedData.namaOrtu || '[Nama Orang Tua]'}</td>
                        </tr>
                      </tbody>
                    </table>

                    <p className="mb-4">
                      Surat Keterangan Kuasa Wali ini diberikan untuk keperluan administrasi <span className="font-bold">Pencairan Dana Bantuan Program Indonesia Pintar (PIP) Tahun Pelajaran {selectedData.tahunPelajaran || '2025/2026'}</span>, berhubung orang tua kandung siswa tidak dapat hadir.
                    </p>

                    <p>
                      Demikian surat keterangan ini dibuat dengan sebenar-benarnya agar dapat dipergunakan sebagaimana mestinya dan penuh tanggung jawab.
                    </p>
                  </div>

                  <div className="flex justify-end mt-16 pr-8">
                    <div className="w-72 text-[16px]">
                      <table className="w-full text-left mb-6">
                        <tbody>
                          <tr>
                            <td className="w-24">Ditetapkan di</td>
                            <td className="w-4">:</td>
                            <td>{currentTitimangsa}</td>
                          </tr>
                          <tr>
                            <td>Pada tanggal</td>
                            <td>:</td>
                            <td>
                              {selectedData.tanggal ? new Date(selectedData.tanggal).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      
                      <div className="mb-24">{currentJabatanKepsek},</div>
                      
                      <div className="font-bold border-b border-black pb-0.5 inline-block min-w-full">{currentNamaKepsek}</div>
                      <div>NIP. {currentNipKepsek}</div>
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
                <h3 className="text-xl font-semibold text-white text-center mb-2">Hapus Surat Kuasa Wali PIP</h3>
                <p className="text-slate-400 text-center text-sm mb-6">
                  Apakah Anda yakin ingin menghapus surat kuasa ini? Tindakan ini tidak dapat dibatalkan.
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
