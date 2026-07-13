import React, { useState, useEffect, useMemo } from 'react';
import { getKopSurat } from '../utils/settings';
import { FileText, Search, Plus, Filter, Printer, Trash2, X, Save, Edit, Check, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function SiswaAktif() {
  const customKop = getKopSurat();

  const currentNamaKepsek = localStorage.getItem('namaKepsek') || 'Drs. H. Ahmad Sudirman, M.Pd.';
  const currentNipKepsek = localStorage.getItem('nipKepsek') || '19700512 199512 1 003';
  const currentPangkatKepsek = localStorage.getItem('pangkatKepsek') || 'Pembina Utama Muda, IV/c';
  const currentJabatanKepsek = localStorage.getItem('jabatanKepsek') || 'Kepala Sekolah';
  const currentTitimangsa = localStorage.getItem('titimangsa') || 'Cirebon';
  const currentNamaSekolah = customKop.kopBaris3; // Baris 3 is Nama Sekolah

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

  // Load data from localStorage or fallback to defaults matching SMAN 1 Cirebon style
  const [data, setData] = useState<any[]>(() => {
    const saved = localStorage.getItem('siswaAktifLetters');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse siswaAktifLetters', e);
      }
    }
    return [
      {
        id: 1,
        noSurat: '421.3 / 123 - SMAN1 / VII / 2026',
        tanggal: '2026-07-06',
        namaSiswa: 'Ahmad Maulana',
        nis: '232410105',
        nisn: '0123456789',
        tempatLahir: 'Cirebon',
        tanggalLahir: '2009-05-12',
        kelas: 'XI IPA 1',
        tahunPelajaran: '2025/2026',
        alamatSiswa: 'Jl. Merdeka No. 10, RT 02 RW 01, Kel. Kejaksan, Kec. Kejaksan, Kota Cirebon',
        keperluan: 'Pengajuan Tunjangan Keluarga',
        status: 'Aktif',
        namaKepsek: 'Drs. H. Ahmad Sudirman, M.Pd.',
        nipKepsek: '19700512 199512 1 003',
        pangkatKepsek: 'Pembina Utama Muda, IV/c',
        jabatanKepsek: 'Kepala Sekolah',
        useCirebonKop: true,
      },
      {
        id: 2,
        noSurat: '421.3 / 124 - SMAN1 / VII / 2026',
        tanggal: '2026-07-06',
        namaSiswa: 'Siti Aminah',
        nis: '232410106',
        nisn: '0987654321',
        tempatLahir: 'Cirebon',
        tanggalLahir: '2009-08-20',
        kelas: 'XI IPA 1',
        tahunPelajaran: '2025/2026',
        alamatSiswa: 'Jl. Sudirman No. 25, RT 01 RW 04, Kel. Harjamukti, Kec. Harjamukti, Kota Cirebon',
        keperluan: 'Pendaftaran Beasiswa Unggulan',
        status: 'Aktif',
        namaKepsek: 'Drs. H. Ahmad Sudirman, M.Pd.',
        nipKepsek: '19700512 199512 1 003',
        pangkatKepsek: 'Pembina Utama Muda, IV/c',
        jabatanKepsek: 'Kepala Sekolah',
        useCirebonKop: true,
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('siswaAktifLetters', JSON.stringify(data));
  }, [data]);

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

  const handleEdit = (item: any) => {
    setFormData({
      ...item,
      namaKepsek: item.namaKepsek || 'Drs. H. Ahmad Sudirman, M.Pd.',
      nipKepsek: item.nipKepsek || '19700512 199512 1 003',
      pangkatKepsek: item.pangkatKepsek || 'Pembina Utama Muda, IV/c',
      jabatanKepsek: item.jabatanKepsek || 'Kepala Sekolah',
      useCirebonKop: item.useCirebonKop !== undefined ? item.useCirebonKop : true,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus surat keterangan ini?')) {
      setData(data.filter(item => item.id !== id));
    }
  };

  const openNewModal = () => {
    setFormData({
      id: 0,
      noSurat: `421.3 / ${data.length + 125} - SMAN1 / VII / 2026`,
      tanggal: '2026-07-06',
      namaSiswa: '',
      nis: '',
      nisn: '',
      tempatLahir: 'Cirebon',
      tanggalLahir: '2009-01-01',
      kelas: 'XI IPA 1',
      tahunPelajaran: '2025/2026',
      alamatSiswa: '',
      keperluan: 'Pengajuan Tunjangan Keluarga',
      status: 'Aktif',
      namaKepsek: 'Drs. H. Ahmad Sudirman, M.Pd.',
      nipKepsek: '19700512 199512 1 003',
      pangkatKepsek: 'Pembina Utama Muda, IV/c',
      jabatanKepsek: 'Kepala Sekolah',
      useCirebonKop: true,
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.noSurat) {
      alert('Nomor Surat wajib diisi!');
      return;
    }
    if (!formData.namaSiswa) {
      alert('Nama Siswa wajib diisi!');
      return;
    }

    if (formData.id === 0) {
      const newItem = {
        ...formData,
        id: Date.now(),
      };
      setData([...data, newItem]);
    } else {
      setData(data.map(item => item.id === formData.id ? formData : item));
    }
    setIsModalOpen(false);
  };

  const formatIndoDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

  const filteredData = useMemo(() => {
    const q = String(searchQuery || "").toLowerCase();
    return data.filter(item => 
      (item.namaSiswa || '').toLowerCase().includes(q) ||
      (item.noSurat || '').toLowerCase().includes(q) ||
      (item.nisn || '').toLowerCase().includes(q) ||
      (item.kelas || '').toLowerCase().includes(q)
    );
  }, [data, searchQuery]);

  const printDocument = () => {
    const printContent = document.getElementById('sk-print-area');
    if (printContent) {
      const originalContents = document.body.innerHTML;
      
      // Inject temporary inline print styles for flawless formatting
      const style = document.createElement('style');
      style.innerHTML = `
        @media print {
          body {
            background: white !important;
            color: black !important;
            font-family: 'Times New Roman', Georgia, serif !important;
          }
          #sk-print-area {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
          }
        }
      `;
      document.head.appendChild(style);

      document.body.innerHTML = printContent.innerHTML;
      window.print();
      
      // Restore layout
      document.head.removeChild(style);
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
            Siswa Aktif
          </h1>
          <p className="text-slate-400 text-sm mt-1">Kelola dan cetak Surat Keterangan Siswa Aktif.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={openNewModal}
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
              placeholder="Cari nama, no surat, atau NISN..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>
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
              <th className="px-6 py-4 font-medium">NIS / NISN</th>
              <th className="px-6 py-4 font-medium text-center rounded-tr-2xl">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {filteredData.map((item) => (
              <tr key={item.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <span className="font-mono text-blue-400">{item.noSurat}</span>
                </td>
                <td className="px-6 py-4 text-slate-300">
                  <div className="font-medium text-white">{formatIndoDate(item.tanggal)}</div>
                </td>
                <td className="px-6 py-4 text-slate-300 font-medium">
                  {item.namaSiswa}
                </td>
                <td className="px-6 py-4 text-slate-300">
                  {item.kelas}
                </td>
                <td className="px-6 py-4 text-slate-300 font-mono text-xs">
                  {item.nis || '-'} / {item.nisn || '-'}
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
            {filteredData.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-400">Belum ada data surat keterangan yang cocok.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm fixed"
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-[#0f172a] border border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col overflow-hidden relative z-10 my-8 max-h-[90vh]"
            >
              <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/10 shrink-0 bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      {formData.id === 0 ? 'Buat Surat Keterangan Baru' : 'Edit Surat Keterangan'}
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">Lengkapi isian data Surat Keterangan Siswa Aktif</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
                <div className="p-4 md:p-6 space-y-6">
                  {/* Template KOP Setting */}
                  <div className="p-3 bg-white/5 rounded-lg border border-white/10 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-white">Template KOP SMAN 1 Cirebon</h4>
                      <p className="text-xs text-slate-400">Gunakan kop dinas SMAN 1 Cirebon sesuai dokumen lampiran</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={!!formData.useCirebonKop} 
                        onChange={(e) => setFormData({ ...formData, useCirebonKop: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-sm font-medium text-slate-300">Nomor Surat</label>
                      <input 
                        type="text" 
                        value={formData.noSurat || ''} 
                        onChange={(e) => setFormData({ ...formData, noSurat: e.target.value })}
                        placeholder="Contoh: 421.3 / 123 - SMAN1 / VII / 2026" 
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all text-sm" 
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-300">Tanggal Surat</label>
                      <input 
                        type="date" 
                        value={formData.tanggal || ''} 
                        onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-all text-sm [color-scheme:dark]" 
                        required
                      />
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
                              tempatLahir: selected.tempatLahir || '',
                              tanggalLahir: selected.tanggalLahir || '',
                              kelas: selected.kelas || '',
                              alamatSiswa: selected.alamat || ''
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

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-300">Nama Lengkap Siswa</label>
                      <input 
                        type="text" 
                        value={formData.namaSiswa || ''} 
                        onChange={(e) => setFormData({ ...formData, namaSiswa: e.target.value })}
                        placeholder="Nama lengkap siswa" 
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all text-sm" 
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-300">Nomor Induk Siswa (NIS)</label>
                      <input 
                        type="text" 
                        value={formData.nis || ''} 
                        onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                        placeholder="Masukkan NIS" 
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all text-sm" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-300">NISN (Nasional)</label>
                      <input 
                        type="text" 
                        value={formData.nisn || ''} 
                        onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                        placeholder="Masukkan NISN" 
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all text-sm" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-300">Tempat Lahir</label>
                      <input 
                        type="text" 
                        value={formData.tempatLahir || ''} 
                        onChange={(e) => setFormData({ ...formData, tempatLahir: e.target.value })}
                        placeholder="Contoh: Cirebon" 
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all text-sm" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-300">Tanggal Lahir</label>
                      <input 
                        type="date" 
                        value={formData.tanggalLahir || ''} 
                        onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })}
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-all text-sm [color-scheme:dark]" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-300">Kelas</label>
                      <input 
                        type="text" 
                        value={formData.kelas || ''} 
                        onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
                        placeholder="Contoh: XI IPA 1" 
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all text-sm" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-300">Tahun Pelajaran</label>
                      <input 
                        type="text" 
                        value={formData.tahunPelajaran || ''} 
                        onChange={(e) => setFormData({ ...formData, tahunPelajaran: e.target.value })}
                        placeholder="Contoh: 2025/2026" 
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all text-sm" 
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-sm font-medium text-slate-300">Alamat Lengkap Siswa</label>
                      <textarea 
                        rows={2} 
                        value={formData.alamatSiswa || ''} 
                        onChange={(e) => setFormData({ ...formData, alamatSiswa: e.target.value })}
                        placeholder="Alamat Lengkap Siswa sesuai KK/KTP..." 
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all text-sm"
                      ></textarea>
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-sm font-medium text-slate-300">Keperluan / Tujuan Pembuatan Surat</label>
                      <input 
                        type="text" 
                        value={formData.keperluan || ''} 
                        onChange={(e) => setFormData({ ...formData, keperluan: e.target.value })}
                        placeholder="Contoh: Pengajuan Tunjangan Keluarga" 
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all text-sm" 
                      />
                    </div>

                    <div className="sm:col-span-2 pt-4 border-t border-white/10 mt-2 flex justify-between items-center">
                      <h3 className="text-sm font-medium text-blue-400">Identitas Pejabat / Kepala Sekolah</h3>
                      <span className="text-[10px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded font-medium">Diambil dari Pengaturan</span>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-300">Nama Kepala Sekolah</label>
                      <input 
                        type="text" 
                        value={currentNamaKepsek} 
                        disabled
                        className="w-full bg-white/5 border border-white/5 rounded-lg px-4 py-2.5 text-slate-400 cursor-not-allowed text-sm" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-300">NIP Kepala Sekolah</label>
                      <input 
                        type="text" 
                        value={currentNipKepsek} 
                        disabled
                        className="w-full bg-white/5 border border-white/5 rounded-lg px-4 py-2.5 text-slate-400 cursor-not-allowed text-sm" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-300">Pangkat / Golongan Ruang</label>
                      <input 
                        type="text" 
                        value={currentPangkatKepsek} 
                        disabled
                        className="w-full bg-white/5 border border-white/5 rounded-lg px-4 py-2.5 text-slate-400 cursor-not-allowed text-sm" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-300">Jabatan</label>
                      <input 
                        type="text" 
                        value={currentJabatanKepsek} 
                        disabled
                        className="w-full bg-white/5 border border-white/5 rounded-lg px-4 py-2.5 text-slate-400 cursor-not-allowed text-sm" 
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 md:p-6 border-t border-white/10 bg-white/5 shrink-0 flex items-center justify-end gap-3 mt-auto">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/20"
                  >
                    <Save className="w-4 h-4" /> Simpan Data
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isPreviewOpen && selectedData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPreviewOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm fixed"
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl flex flex-col relative z-10 w-full max-w-4xl max-h-[90vh]"
            >
              <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5 shrink-0">
                <h3 className="font-semibold text-white">Preview Dokumen (Siswa Aktif)</h3>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={printDocument}
                    className="flex items-center gap-2 px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <Printer className="w-4 h-4" /> Cetak Dokumen
                  </button>
                  <button 
                    onClick={() => setIsPreviewOpen(false)}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-4 md:p-8 bg-[#1e293b] flex justify-center overflow-y-auto custom-scrollbar">
                <div 
                  id="sk-print-area" 
                  className="bg-white text-black p-12 md:p-16 font-serif shadow-2xl mx-auto printable-card" 
                  style={{ width: '210mm', minHeight: '297mm', boxSizing: 'border-box' }}
                >
                  {/* Dynamic KOP Surat */}
                  <div className="text-center mb-6 relative">
                    <h3 className="font-bold text-base uppercase leading-tight font-serif tracking-wide" style={{ fontSize: '14pt' }}>{customKop.kopBaris1}</h3>
                    <h3 className="font-bold text-lg uppercase leading-tight font-serif tracking-wide" style={{ fontSize: '15pt' }}>{customKop.kopBaris2}</h3>
                    <h2 className="font-bold text-xl uppercase mt-0.5 leading-tight font-serif tracking-wider" style={{ fontSize: '17pt' }}>{customKop.kopBaris3}</h2>
                    <p className="text-xs font-serif leading-normal mt-1" style={{ fontSize: '10pt' }}>{customKop.kopBaris4}</p>
                    <div className="border-b-[3px] border-black mt-3 mb-[1px]"></div>
                    <div className="border-b border-black"></div>
                  </div>

                  {/* Document Title */}
                  <div className="text-center mb-8 mt-6">
                    <h3 className="font-bold text-base md:text-lg underline leading-tight font-serif tracking-wide" style={{ fontSize: '14pt' }}>SURAT KETERANGAN SISWA AKTIF</h3>
                    <p className="font-medium mt-1 font-serif text-sm" style={{ fontSize: '11pt' }}>Nomor: {selectedData.noSurat}</p>
                  </div>

                  {/* Body Paragraph 1 */}
                  <div className="text-justify leading-relaxed font-serif text-[11.5pt] mb-4">
                    <p className="mb-4">
                      Yang bertanda tangan di bawah ini {currentJabatanKepsek} {currentNamaSekolah}, Provinsi {localStorage.getItem('provinsi') || 'Jawa Barat'}, dengan ini menerangkan bahwa:
                    </p>
                    
                    {/* Kepala Sekolah Table */}
                    <table className="w-full mb-5" style={{ marginLeft: '1.5rem', width: 'calc(100% - 1.5rem)' }}>
                      <tbody>
                        <tr>
                          <td className="py-1 text-slate-950 font-serif" style={{ width: '200px' }}>Nama</td>
                          <td className="py-1 text-slate-950 font-serif" style={{ width: '15px' }}>:</td>
                          <td className="py-1 text-slate-950 font-serif font-bold">{currentNamaKepsek}</td>
                        </tr>
                        <tr>
                          <td className="py-1 text-slate-950 font-serif">NIP</td>
                          <td className="py-1 text-slate-950 font-serif">:</td>
                          <td className="py-1 text-slate-950 font-serif">{currentNipKepsek}</td>
                        </tr>
                        <tr>
                          <td className="py-1 text-slate-950 font-serif">Pangkat/Gol. Ruang</td>
                          <td className="py-1 text-slate-950 font-serif">:</td>
                          <td className="py-1 text-slate-950 font-serif">{currentPangkatKepsek}</td>
                        </tr>
                        <tr>
                          <td className="py-1 text-slate-950 font-serif">Jabatan</td>
                          <td className="py-1 text-slate-950 font-serif">:</td>
                          <td className="py-1 text-slate-950 font-serif">{currentJabatanKepsek}</td>
                        </tr>
                      </tbody>
                    </table>

                    <p className="mb-4">
                      Memberikan keterangan dengan sebenarnya bahwa:
                    </p>

                    {/* Student Table */}
                    <table className="w-full mb-5" style={{ marginLeft: '1.5rem', width: 'calc(100% - 1.5rem)' }}>
                      <tbody>
                        <tr>
                          <td className="py-1 text-slate-950 font-serif" style={{ width: '200px' }}>Nama Siswa</td>
                          <td className="py-1 text-slate-950 font-serif" style={{ width: '15px' }}>:</td>
                          <td className="py-1 text-slate-950 font-serif font-bold uppercase">{selectedData.namaSiswa}</td>
                        </tr>
                        <tr>
                          <td className="py-1 text-slate-950 font-serif">Tempat, Tanggal Lahir</td>
                          <td className="py-1 text-slate-950 font-serif">:</td>
                          <td className="py-1 text-slate-950 font-serif">
                             {selectedData.tempatLahir || '-'}, {formatIndoDate(selectedData.tanggalLahir)}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-1 text-slate-950 font-serif">NIS / NISN</td>
                          <td className="py-1 text-slate-950 font-serif">:</td>
                          <td className="py-1 text-slate-950 font-serif">
                            {selectedData.nis || '-'} / {selectedData.nisn || '-'}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-1 text-slate-950 font-serif">Kelas</td>
                          <td className="py-1 text-slate-950 font-serif">:</td>
                          <td className="py-1 text-slate-950 font-serif">{selectedData.kelas || '-'}</td>
                        </tr>
                        <tr>
                          <td className="py-1 text-slate-950 font-serif">Tahun Pelajaran</td>
                          <td className="py-1 text-slate-950 font-serif">:</td>
                          <td className="py-1 text-slate-950 font-serif">{selectedData.tahunPelajaran || '2025/2026'}</td>
                        </tr>
                        <tr>
                          <td className="py-1 text-slate-950 font-serif align-top">Alamat Lengkap</td>
                          <td className="py-1 text-slate-950 font-serif align-top">:</td>
                          <td className="py-1 text-slate-950 font-serif align-top leading-normal">
                            {selectedData.alamatSiswa || '-'}
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    {/* Footer text */}
                    <p className="mb-4 text-justify">
                      Adalah benar siswa/siswi tersebut di atas terdaftar dan masih aktif belajar di {currentNamaSekolah} pada Tahun Pelajaran {selectedData.tahunPelajaran || '2025/2026'}.
                    </p>

                    <p className="mb-4 text-justify">
                      Surat keterangan ini diberikan kepada yang bersangkutan untuk dipergunakan sebagai persyaratan <span className="font-bold">{selectedData.keperluan || 'Pengajuan Tunjangan Keluarga / Beasiswa / Syarat Administrasi Lainnya'}</span>.
                    </p>

                    <p className="mb-12 text-justify">
                      Demikian surat keterangan ini dibuat dengan sesungguhnya, untuk dapat dipergunakan sebagaimana mestinya.
                    </p>
                  </div>

                  {/* Signatures */}
                  <div className="flex justify-end pr-4">
                    <div className="text-left font-serif text-[11.5pt]" style={{ width: '280px' }}>
                      <p className="mb-1 font-serif">{currentTitimangsa}, {formatIndoDate(selectedData.tanggal)}</p>
                      <p className="mb-16 font-serif font-medium">{currentJabatanKepsek},</p>
                      
                      <p className="font-bold font-serif text-[12pt] mb-0.5">{currentNamaKepsek}</p>
                      <p className="font-serif text-xs" style={{ fontSize: '10.5pt' }}>NIP. {currentNipKepsek}</p>
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
                <h3 className="text-xl font-semibold text-white text-center mb-2">Hapus Surat Keterangan</h3>
                <p className="text-slate-400 text-center text-sm mb-6">
                  Apakah Anda yakin ingin menghapus surat ini? Tindakan ini tidak dapat dibatalkan.
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
