import React, { useState, useRef, useEffect } from 'react';
import { getKopSurat, getFormatSurat } from '../utils/settings';
import { FileText, Search, Plus, Filter, Printer, Trash2, X, Save, Edit, Upload, Download, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as XLSX from 'xlsx';

const DUMMY_DATA = [
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
  },
];

export default function ManajemenPIP() {
  const kopSurat = getKopSurat();
  const formatSurat = getFormatSurat();
  const currentNamaKepsek = localStorage.getItem('namaKepsek') || 'Drs. H. Ahmad Sudirman, M.Pd.';
  const currentNipKepsek = localStorage.getItem('nipKepsek') || '19700512 199512 1 003';
  const currentJabatanKepsek = localStorage.getItem('jabatanKepsek') || 'Kepala Sekolah';
  const currentTitimangsa = localStorage.getItem('titimangsa') || 'Cirebon';
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('manajemen_pip_data');
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
    localStorage.setItem('manajemen_pip_data', JSON.stringify(data));
  }, [data]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState<any>({});
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

  const handleDeleteClick = (item: any) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setData(data.filter((item: any) => item.id !== itemToDelete.id));
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
      setSelectedIds(selectedIds.filter(id => id !== itemToDelete.id));
    }
  };

  const handleExportXLSX = () => {
    const ws = XLSX.utils.json_to_sheet(data.map((item: any) => ({
      kelas: item.kelas || '',
      rombel: item.rombel || '',
      nama_pd: item.namaSiswa || '',
      nama_ibu_kandung: item.namaIbuKandung || '',
      nama_ayah: item.namaAyah || '',
      tanggal_lahir: item.tanggalLahir || '',
      tempat_lahir: item.tempatLahir || '',
      nisn: item.nisn || '',
      nik: item.nik || '',
      jenis_kelamin: item.jenisKelamin || '',
      nominal: item.nominal || '',
      no_rekening: item.noRekening || '',
      tahap_id: item.tahap || '',
      nomor_sk: item.nomorSk || '',
      tanggal_sk: item.tanggalSk || '',
      nama_rekening: item.namaRekening || '',
      tanggal_cair: item.tanggalCair || '',
      status_cair: item.status || '',
      no_KIP: item.noKip || '',
      no_KKS: item.noKks || '',
      no_KPS: item.noKps || '',
      virtual_acc: item.virtualAcc || '',
      nama_kartu: item.namaKartu || '',
      semester_id: item.semesterId || '',
      layak_pip: item.layakPip || '',
      keterangan_pencairan: item.keteranganPencairan || '',
      confirmation_text: item.confirmationText || '',
      tahap_keterangan: item.tahapKeterangan || '',
      nama_pengusul: item.namaPengusul || ''
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data PIP");
    XLSX.writeFile(wb, "Data_PIP.xlsx");
  };

  const handleImportXLSX = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      if (bstr) {
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const importedData = XLSX.utils.sheet_to_json(ws);
        
        const mappedData = importedData.map((item: any, index: number) => ({
          id: data.length + index + 1,
          kelas: item.kelas || item.Kelas || item['NISN / Kelas']?.split('/')[1]?.trim() || '',
          rombel: item.rombel || '',
          namaSiswa: item.nama_pd || item.namaSiswa || item['Nama Siswa'] || '',
          namaIbuKandung: item.nama_ibu_kandung || '',
          namaAyah: item.nama_ayah || '',
          tanggalLahir: item.tanggal_lahir || '',
          tempatLahir: item.tempat_lahir || '',
          nisn: item.nisn || item.NISN || item['NISN / Kelas']?.split('/')[0]?.trim() || '',
          nik: item.nik || '',
          jenisKelamin: item.jenis_kelamin || '',
          nominal: item.nominal || item.Nominal ? (typeof (item.nominal || item.Nominal) === 'number' ? `Rp ${(item.nominal || item.Nominal).toLocaleString('id-ID')}` : (item.nominal || item.Nominal)) : '',
          noRekening: item.no_rekening || item.Rekening || item['No Rekening'] || '',
          bank: item.bank || item.Bank || 'BRI',
          tahap: item.tahap_id || item.Tahap || item['Status / Tahap']?.split('/')[1]?.trim() ? ((item.tahap_id || item.Tahap || item['Status / Tahap']?.split('/')[1]?.trim()).toString().toLowerCase().includes('tahap') ? (item.tahap_id || item.Tahap || item['Status / Tahap']?.split('/')[1]?.trim()) : `Tahap ${item.tahap_id || item.Tahap || item['Status / Tahap']?.split('/')[1]?.trim()}`) : '',
          nomorSk: item.nomor_sk || '',
          tanggalSk: item.tanggal_sk || '',
          namaRekening: item.nama_rekening || '',
          tanggalCair: item.tanggal_cair || '',
          status: item.status_cair || item.Status || item['Status / Tahap']?.split('/')[0]?.trim() || (item.tanggal_cair ? 'Sudah Cair' : 'Belum Cair'),
          noKip: item.no_KIP || '',
          noKks: item.no_KKS || '',
          noKps: item.no_KPS || '',
          virtualAcc: item.virtual_acc || '',
          namaKartu: item.nama_kartu || '',
          semesterId: item.semester_id || '',
          layakPip: item.layak_pip || '',
          keteranganPencairan: item.keterangan_pencairan || '',
          confirmationText: item.confirmation_text || '',
          tahapKeterangan: item.tahap_keterangan || '',
          namaPengusul: item.nama_pengusul || ''
        }));
        
        setData([...data, ...mappedData]);
      }
    };
    reader.readAsBinaryString(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(data.map((item: any) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelect = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleDeleteSelected = () => {
    setIsBulkDeleteModalOpen(true);
  };

  const confirmBulkDelete = () => {
    setData((prevData: any) => prevData.filter((item: any) => !selectedIds.includes(item.id)));
    setSelectedIds([]);
    setIsBulkDeleteModalOpen(false);
  };

  const [isEditMode, setIsEditMode] = useState(false);

  const handleEditClick = (item: any) => {
    setFormData(item);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleSaveData = () => {
    if (!formData.namaSiswa) return;
    
    if (isEditMode) {
      setData(data.map((item: any) => item.id === formData.id ? { ...formData } : item));
    } else {
      setData([...data, { ...formData, id: Date.now() }]);
    }
    
    setIsModalOpen(false);
    setIsEditMode(false);
    setFormData({});
  };

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
            Manajemen PIP
          </h1>
          <p className="text-slate-400 text-sm mt-1">Kelola data pencairan dan penerima Program Indonesia Pintar (PIP).</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="file"
            accept=".xlsx, .xls"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImportXLSX}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-emerald-500/20"
          >
            <Upload className="w-4 h-4" /> Import Excel
          </button>
          <button 
            onClick={handleExportXLSX}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
          >
            <Download className="w-4 h-4" /> Export Excel
          </button>
          <button 
            onClick={() => {
              setFormData({});
              setIsEditMode(false);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" /> Tambah Data PIP
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-end gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <button 
              onClick={handleDeleteSelected}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-sm font-medium transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Hapus Terpilih ({selectedIds.length})
            </button>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto ml-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari nama atau NISN..." 
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
              <th className="px-6 py-4 font-medium rounded-tl-2xl w-10">
                <input 
                  type="checkbox" 
                  className="rounded border-white/20 bg-black/20 focus:ring-blue-500"
                  checked={selectedIds.length === data.length && data.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="px-6 py-4 font-medium">Nama Siswa</th>
              <th className="px-6 py-4 font-medium">NISN / Kelas</th>
              <th className="px-6 py-4 font-medium">Rekening</th>
              <th className="px-6 py-4 font-medium">Nominal</th>
              <th className="px-6 py-4 font-medium">Status / Tahap</th>
              <th className="px-6 py-4 font-medium text-center rounded-tr-2xl">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {data.filter(item => String(item.namaSiswa || "").toLowerCase().includes(String(searchQuery || "").toLowerCase()) || String(item.nisn || "").toLowerCase().includes(String(searchQuery || "").toLowerCase())).map((item) => (
              <tr key={item.id} className={`hover:bg-white/5 transition-colors ${selectedIds.includes(item.id) ? 'bg-blue-500/10' : ''}`}>
                <td className="px-6 py-4">
                  <input 
                    type="checkbox" 
                    className="rounded border-white/20 bg-black/20 focus:ring-blue-500"
                    checked={selectedIds.includes(item.id)}
                    onChange={() => handleSelect(item.id)}
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-white">{item.namaSiswa}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-slate-300">{item.nisn}</div>
                  <div className="text-xs text-slate-500 mt-0.5">Kelas {item.kelas}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-mono text-blue-400 text-xs">{item.noRekening}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{item.bank}</div>
                </td>
                <td className="px-6 py-4 font-medium text-slate-300">
                  {item.nominal}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1.5 items-start">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${item.status === 'Sudah Cair' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                      {item.status}
                    </span>
                    <span className="text-xs text-slate-400">{item.tahap}</span>
                  </div>
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
                    <button 
                      onClick={() => handleDeleteClick(item)}
                      className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors" title="Hapus">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-slate-400">Belum ada data surat keterangan.</td>
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
                    <h2 className="text-lg font-semibold text-white">{isEditMode ? 'Edit Data PIP' : 'Tambah Data PIP Baru'}</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Lengkapi data untuk surat keterangan penerima PIP</p>
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
                    <label className="text-sm font-medium text-slate-300">Nama Siswa</label>
                    <input type="text" placeholder="Masukkan nama siswa" value={formData.namaSiswa || ''} onChange={(e) => handleFormChange('namaSiswa', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300">NISN</label>
                    <input type="text" placeholder="Masukkan NISN" value={formData.nisn || ''} onChange={(e) => handleFormChange('nisn', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300">Kelas</label>
                    <input type="text" placeholder="Contoh: V" value={formData.kelas || ''} onChange={(e) => handleFormChange('kelas', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all" />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2 pt-2 border-t border-white/10 mt-2">
                    <h3 className="text-sm font-medium text-white mb-3">Data Pencairan</h3>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300">Nomor Rekening</label>
                    <input type="text" placeholder="Masukkan no rekening PIP" value={formData.noRekening || ''} onChange={(e) => handleFormChange('noRekening', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300">Bank Penyalur</label>
                    <select value={formData.bank || 'BRI'} onChange={(e) => handleFormChange('bank', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-all [color-scheme:dark]">
                      <option value="BRI">BRI</option>
                      <option value="BNI">BNI</option>
                      <option value="Mandiri">Mandiri</option>
                      <option value="BSI">BSI</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300">Nominal Pencairan</label>
                    <input type="text" placeholder="Contoh: Rp 450.000" value={formData.nominal || ''} onChange={(e) => handleFormChange('nominal', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300">Tahap Pencairan</label>
                    <select value={formData.tahap || 'Tahap 1'} onChange={(e) => handleFormChange('tahap', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-all [color-scheme:dark]">
                      <option value="Tahap 1">Tahap 1</option>
                      <option value="Tahap 2">Tahap 2</option>
                      <option value="Tahap 3">Tahap 3</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300">Status Pencairan</label>
                    <select value={formData.status || 'Belum Cair'} onChange={(e) => handleFormChange('status', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-all [color-scheme:dark]">
                      <option value="Belum Cair">Belum Cair</option>
                      <option value="Sudah Cair">Sudah Cair</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300">Tanggal Pencairan (Jika sudah cair)</label>
                    <input type="date" value={formData.tanggalCair || ''} onChange={(e) => handleFormChange('tanggalCair', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-all [color-scheme:dark]" />
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
                <button onClick={handleSaveData} className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/20">
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
                    <h3 className="font-bold text-xl underline leading-tight">SURAT KETERANGAN AKTIVASI / PENCAIRAN PIP</h3>
                    <p className="mt-1">Nomor: {formatSurat.prefix}/{selectedData ? String(selectedData.id).padStart(3, "0") : "001"}/{formatSurat.suffix}/{new Date().getFullYear()}</p>
                  </div>

                  <div className="mb-8 text-justify text-[16px] leading-relaxed">
                    <p className="mb-4">
                      Yang bertanda tangan di bawah ini:
                    </p>
                    
                    <table className="w-full ml-8 mb-6">
                      <tbody>
                        <tr>
                          <td className="w-48 py-1">Nama</td>
                          <td className="w-4 py-1">:</td>
                          <td className="py-1 font-bold">{currentNamaKepsek}</td>
                        </tr>
                        <tr>
                          <td className="py-1">NIP</td>
                          <td className="py-1">:</td>
                          <td className="py-1">{currentNipKepsek}</td>
                        </tr>
                        <tr>
                          <td className="py-1">Jabatan</td>
                          <td className="py-1">:</td>
                          <td className="py-1">{currentJabatanKepsek}</td>
                        </tr>
                        <tr>
                          <td className="py-1">Unit Kerja</td>
                          <td className="py-1">:</td>
                          <td className="py-1">{kopSurat.kopBaris3}</td>
                        </tr>
                      </tbody>
                    </table>

                    <p className="mb-4">
                      Dengan ini menerangkan dengan sesungguhnya bahwa:
                    </p>
                    
                    <table className="w-full ml-8 mb-6">
                      <tbody>
                        <tr>
                          <td className="w-56 py-1">Nama Siswa</td>
                          <td className="w-4 py-1">:</td>
                          <td className="font-bold py-1">{selectedData.namaSiswa}</td>
                        </tr>
                        <tr>
                          <td className="py-1">NISN</td>
                          <td className="py-1">:</td>
                          <td className="py-1">{selectedData.nisn}</td>
                        </tr>
                        <tr>
                          <td className="py-1">Kelas</td>
                          <td className="py-1">:</td>
                          <td className="py-1">{selectedData.kelas}</td>
                        </tr>
                        <tr>
                          <td className="py-1">Nama Orang Tua / Wali</td>
                          <td className="py-1">:</td>
                          <td className="py-1">{selectedData.namaIbuKandung || selectedData.namaAyah || '[Nama Orang Tua / Wali]'}</td>
                        </tr>
                        <tr>
                          <td className="py-1">Nomor Rekening PIP / VA</td>
                          <td className="py-1">:</td>
                          <td className="py-1 font-mono">{selectedData.noRekening || '[Nomor Rekening / Virtual Account PIP Siswa]'}</td>
                        </tr>
                      </tbody>
                    </table>

                    <p className="mb-4">
                      Nama tersebut di atas adalah benar-benar siswa aktif di sekolah kami dan tercatat sebagai salah satu <strong>Siswa Penerima Program Indonesia Pintar (PIP) Tahun Anggaran {new Date().getFullYear()}</strong>.
                    </p>

                    <p className="mb-4">
                      Surat keterangan ini diterbitkan secara resmi berdasarkan ketentuan negara untuk dipergunakan sebagai salah satu syarat administratif dalam <strong>Aktivasi Rekening / Pencairan Dana PIP</strong> di bank penyalur resmi yang ditunjuk.
                    </p>

                    <p className="mb-4">
                      Demikian surat keterangan ini kami buat dengan sebenarnya agar dapat dipergunakan sebagaimana mestinya.
                    </p>
                  </div>

                  <div className="flex justify-end mt-16 pr-8">
                    <div className="w-72 text-[16px]">
                      <p className="mb-20">{currentTitimangsa}, {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}<br/>{currentJabatanKepsek},</p>
                      
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

      {/* Modal Hapus Individu */}
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
                <h3 className="text-xl font-semibold text-white text-center mb-2">Hapus Data PIP</h3>
                <p className="text-slate-400 text-center text-sm mb-6">
                  Apakah Anda yakin ingin menghapus data PIP <span className="text-white font-medium">{itemToDelete?.namaSiswa}</span>? Tindakan ini tidak dapat dibatalkan.
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

      {/* Modal Hapus Massal */}
      <AnimatePresence>
        {isBulkDeleteModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBulkDeleteModalOpen(false)}
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
                <h3 className="text-xl font-semibold text-white text-center mb-2">Hapus Terpilih ({selectedIds.length})</h3>
                <p className="text-slate-400 text-center text-sm mb-6">
                  Apakah Anda yakin ingin menghapus {selectedIds.length} data yang dipilih? Tindakan ini tidak dapat dibatalkan.
                </p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setIsBulkDeleteModalOpen(false)}
                    className="flex-1 py-2.5 text-sm font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                  >
                    Batal
                  </button>
                  <button 
                    onClick={confirmBulkDelete}
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
