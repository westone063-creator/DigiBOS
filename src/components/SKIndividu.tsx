import React, { useState } from 'react';
import { getKopSurat } from '../utils/settings';
import { FileText, Search, Plus, Filter, Printer, Trash2, X, Save, Edit, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { initialTableData } from './DataGuruStaff';

const DUMMY_DATA = [
  {
    id: 1,
    noSk: '421.2/001/SD.01/2024',
    tanggal: '2024-07-01',
    namaPegawai: 'Budi Santoso, S.Pd',
    jenisSk: 'SK Pembagian Tugas Mengajar',
    status: 'Aktif',
  },
  {
    id: 2,
    noSk: '421.2/002/SD.01/2024',
    tanggal: '2024-07-01',
    namaPegawai: 'Siti Aminah, M.Pd',
    jenisSk: 'SK Tugas Tambahan Khusus',
    status: 'Aktif',
  },
];

export default function SKIndividu() {
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

  const [isEditMode, setIsEditMode] = useState(false);

  const handleEditClick = (item: any) => {
    setFormData(item);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (isEditMode) {
      setData(data.map(d => d.id === formData.id ? { ...d, ...formData } : d));
    } else {
      const newItem = {
        ...formData,
        id: data.length > 0 ? Math.max(...data.map(d => d.id)) + 1 : 1,
        status: 'Aktif',
      };
      setData([...data, newItem]);
    }
    setIsModalOpen(false);
    setIsEditMode(false);
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

  const handlePreview = (item: any) => {
    setSelectedData(item);
    setIsPreviewOpen(true);
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
            SK Individu
          </h1>
          <p className="text-slate-400 text-sm mt-1">Kelola dan cetak Surat Keputusan Individu untuk Pegawai.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              setFormData({});
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
              placeholder="Cari nama pegawai atau no SK..." 
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
              <th className="px-6 py-4 font-medium">Nama Pegawai</th>
              <th className="px-6 py-4 font-medium">Jenis SK</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-center rounded-tr-2xl">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {data.filter(item => String(item.namaPegawai || "").toLowerCase().includes(String(searchQuery || "").toLowerCase()) || String(item.noSk || "").toLowerCase().includes(String(searchQuery || "").toLowerCase())).map((item) => (
              <tr key={item.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <span className="font-mono text-blue-400">{item.noSk}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-white">{item.tanggal}</div>
                </td>
                <td className="px-6 py-4 text-slate-300">
                  {item.namaPegawai}
                </td>
                <td className="px-6 py-4 text-slate-300">
                  {item.jenisSk}
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
                    <button className="p-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-lg transition-colors" title="Edit">
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
                    <FileText className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">{isEditMode ? 'Edit SK Individu' : 'Buat SK Individu Baru'}</h2>
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
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-sm font-medium text-slate-300">Pegawai (Nama/NIP)</label>
                    <select 
                      value={formData.namaPegawai || ''}
                      onChange={(e) => handleFormChange('namaPegawai', e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer"
                    >
                      <option value="" disabled className="bg-slate-800 text-slate-400">Pilih Pegawai...</option>
                      {staffList.map((staff, idx) => (
                        <option key={idx} value={staff.nama} className="bg-slate-800 text-white">
                          {staff.nama} - {staff.nip}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300">Nomor SK</label>
                    <input type="text" placeholder="Contoh: 421.2/001/SD.01/2024" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300">Tanggal SK</label>
                    <input type="date" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-all [color-scheme:dark]" />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-sm font-medium text-slate-300">Jenis SK / Hal</label>
                    <input type="text" placeholder="Contoh: Pengangkatan Guru Honorer" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all" />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-sm font-medium text-slate-300">Menimbang (Isi)</label>
                    <textarea rows={3} placeholder="Tuliskan poin-poin menimbang..." className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all"></textarea>
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-sm font-medium text-slate-300">Mengingat (Isi)</label>
                    <textarea rows={3} placeholder="Tuliskan poin-poin mengingat..." className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all"></textarea>
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
                <h2 className="text-base font-semibold text-white">Preview SK Individu</h2>
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

              <div className="p-8 bg-white flex justify-center overflow-y-auto max-h-[70vh] custom-scrollbar">
                <div id="sk-print-area" className="bg-white text-black p-10 font-serif mx-auto" style={{ width: '215.9mm', minHeight: '330.2mm', maxWidth: '100%', boxSizing: 'border-box' }}>
                  
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
                    <p className="font-bold mt-1">Nomor: {selectedData.noSk}</p>
                  </div>
                  
                  <div className="text-center mb-6">
                    <p className="font-bold mb-1">TENTANG</p>
                    <p className="font-bold uppercase leading-tight">
                      PENGANGKATAN GURU KELAS / TENAGA PENDIDIK<br/>
                      TAHUN PELAJARAN 2026/2027
                    </p>
                  </div>

                  <div className="text-center mb-6">
                    <p className="font-bold uppercase">KEPALA {kopSurat.kopBaris3},</p>
                  </div>

                  <div className="mb-4 text-justify">
                    <table className="w-full align-top">
                      <tbody>
                        <tr>
                          <td className="w-28 align-top pr-2">Menimbang</td>
                          <td className="w-4 align-top">:</td>
                          <td className="align-top">
                            <ol className="list-decimal pl-4 m-0 space-y-1">
                              <li>bahwa untuk kelancaran pelaksanaan proses belajar mengajar di {kopSurat.kopBaris3}, dipandang perlu menetapkan pembagian tugas dan pengangkatan Guru Kelas;</li>
                              <li>bahwa Saudara yang namanya tercantum dalam surat keputusan ini dinilai cakap, mampu, dan memenuhi kelayakan syarat untuk melaksanakan tugas tersebut.</li>
                            </ol>
                          </td>
                        </tr>
                        <tr><td colSpan={3} className="h-2"></td></tr>
                        <tr>
                          <td className="w-28 align-top pr-2">Mengingat</td>
                          <td className="w-4 align-top">:</td>
                          <td className="align-top">
                            <ol className="list-decimal pl-4 m-0 space-y-1">
                              <li>Undang-Undang Nomor 20 Tahun 2003 tentang Sistem Pendidikan Nasional;</li>
                              <li>Undang-Undang Nomor 14 Tahun 2005 tentang Guru dan Dosen;</li>
                              <li>Peraturan Pemerintah Nomor 19 Tahun 2005 tentang Standar Nasional Pendidikan sebagaimana telah diubah dengan PP Nomor 4 Tahun 2022.</li>
                            </ol>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="text-center font-bold mb-4">MEMUTUSKAN:</div>

                  <div className="mb-8 text-justify">
                    <table className="w-full align-top">
                      <tbody>
                        <tr>
                          <td className="w-28 align-top font-bold pr-2">Menetapkan</td>
                          <td className="w-4 align-top font-bold">:</td>
                          <td className="align-top"></td>
                        </tr>
                        <tr>
                          <td className="w-28 align-top font-bold pr-2">PERTAMA</td>
                          <td className="w-4 align-top font-bold">:</td>
                          <td className="align-top">
                            Mengangkat Saudara:
                            <table className="mt-2 mb-2 w-full">
                              <tbody>
                                <tr>
                                  <td className="w-40 py-1">Nama Lengkap</td>
                                  <td className="w-4 py-1">:</td>
                                  <td className="font-bold py-1">Ahmad Hidayat, S.Pd.</td>
                                </tr>
                                <tr>
                                  <td className="py-1">Tempat, Tgl Lahir</td>
                                  <td className="py-1">:</td>
                                  <td className="py-1">Cirebon, 15 Agustus 1995</td>
                                </tr>
                                <tr>
                                  <td className="py-1">Pendidikan Terakhir</td>
                                  <td className="py-1">:</td>
                                  <td className="py-1">S1 Pendidikan Guru Sekolah Dasar</td>
                                </tr>
                                <tr>
                                  <td className="py-1">Tugas Jabatan</td>
                                  <td className="py-1">:</td>
                                  <td className="py-1">Guru Kelas</td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        <tr><td colSpan={3} className="h-2"></td></tr>
                        <tr>
                          <td className="w-28 align-top font-bold pr-2">KEDUA</td>
                          <td className="w-4 align-top font-bold">:</td>
                          <td className="align-top">
                            Menugaskan yang bersangkutan untuk melaksanakan proses pembelajaran, pembimbingan, dan evaluasi peserta didik dengan penuh tanggung jawab sesuai kurikulum yang berlaku.
                          </td>
                        </tr>
                        <tr><td colSpan={3} className="h-2"></td></tr>
                        <tr>
                          <td className="w-28 align-top font-bold pr-2">KETIGA</td>
                          <td className="w-4 align-top font-bold">:</td>
                          <td className="align-top">
                            Segala biaya yang timbul akibat diterbitkannya keputusan ini dibebankan pada Rencana Kegiatan dan Anggaran Sekolah (RKAS) atau Dana Bantuan Operasional Sekolah (BOS) yang relevan.
                          </td>
                        </tr>
                        <tr><td colSpan={3} className="h-2"></td></tr>
                        <tr>
                          <td className="w-28 align-top font-bold pr-2">KEEMPAT</td>
                          <td className="w-4 align-top font-bold">:</td>
                          <td className="align-top">
                            Keputusan ini mulai berlaku sejak tanggal ditetapkan. Apabila di kemudian hari ternyata terdapat kekeliruan, akan diadakan perbaikan sebagaimana mestinya.
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="flex justify-end mt-8 pr-8">
                    <div className="w-64">
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
                            <td>{selectedData.tanggal ? new Date(selectedData.tanggal).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : '15 Juli 2026'}</td>
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
                <h3 className="text-xl font-semibold text-white text-center mb-2">Hapus SK Individu</h3>
                <p className="text-slate-400 text-center text-sm mb-6">
                  Apakah Anda yakin ingin menghapus SK Individu <span className="text-white font-medium">{itemToDelete?.noSk}</span>? Tindakan ini tidak dapat dibatalkan.
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
