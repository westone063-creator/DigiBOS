import React, { useState } from 'react';
import { getKopSurat } from '../utils/settings';
import { FileText, Search, Plus, Edit, Trash2, X, Save, Printer, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const DUMMY_DATA = [
  {
    id: 1,
    tanggalSurat: '2026-07-05',
    noSurat: '421/015/SMKN1/2026',
    lampiran: '-',
    perihal: 'Permohonan Cetak Rekening Koran',
    bankTujuan: 'PT. Bank Pembangunan Daerah DKI Jakarta Cabang Utama',
    noRekening: localStorage.getItem('noRekeningSekolah') || '123-456-789-0',
    namaRekening: localStorage.getItem('atasNamaRekening') || 'SMK Negeri 1 Jakarta',
    periodeAwal: '2026-01-01',
    periodeAkhir: '2026-06-30',
    keperluan: 'Lampiran Laporan Pertanggungjawaban (LPJ) Dana BOS Tahap I Tahun 2026',
    kepsek: {
      nama: 'Dr. H. Supriyadi, M.Pd.',
      nip: '197405121999031002'
    }
  }
];

export default function RekeningKoran() {
  const kopSurat = getKopSurat();
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('rekeningKoranData');
    if (saved) return JSON.parse(saved);
    return DUMMY_DATA;
  });
  React.useEffect(() => {
    localStorage.setItem('rekeningKoranData', JSON.stringify(data));
  }, [data]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedData, setSelectedData] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [entries, setEntries] = useState(10);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);

  const handleDeleteClick = (item: any) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };


  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(data.map((item: any) => item.id));
    } else {
      setSelectedIds([]);
    }
  };
  const handleSelect = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };
  const handleBulkDelete = () => {
    if (selectedIds.length > 0) {
      if (window.confirm(`Apakah Anda yakin ingin menghapus ${selectedIds.length} data terpilih?`)) {
        setData(data.filter((item: any) => !selectedIds.includes(item.id)));
        setSelectedIds([]);
      }
    }
  };
  const confirmDelete = () => {
    if (itemToDelete) {
      setData(data.filter(d => d.id !== itemToDelete.id));
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const initialFormState = {
    id: 0,
    tanggalSurat: '',
    noSurat: '',
    lampiran: '-',
    perihal: 'Permohonan Cetak Rekening Koran',
    bankTujuan: '',
    noRekening: localStorage.getItem('noRekeningSekolah') || '',
    namaRekening: localStorage.getItem('atasNamaRekening') || 'SMK Negeri 1 Jakarta',
    periodeAwal: '',
    periodeAkhir: '',
    keperluan: '',
    kepsekNama: 'Dr. H. Supriyadi, M.Pd.',
    kepsekNip: '197405121999031002'
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleOpenAdd = () => {
    setFormData(initialFormState);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setFormData({
      id: item.id,
      tanggalSurat: item.tanggalSurat,
      noSurat: item.noSurat,
      lampiran: item.lampiran,
      perihal: item.perihal,
      bankTujuan: item.bankTujuan,
      noRekening: item.noRekening,
      namaRekening: item.namaRekening,
      periodeAwal: item.periodeAwal,
      periodeAkhir: item.periodeAkhir,
      keperluan: item.keperluan,
      kepsekNama: item.kepsek?.nama || '',
      kepsekNip: item.kepsek?.nip || ''
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem = {
      ...formData,
      id: isEditing ? formData.id : Date.now(),
      kepsek: {
        nama: formData.kepsekNama,
        nip: formData.kepsekNip
      }
    };

    if (isEditing) {
      setData(data.map(d => d.id === formData.id ? newItem : d));
    } else {
      setData([newItem, ...data]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    setData(data.filter(d => d.id !== id));
  };

  const handlePreview = (item: any) => {
    setSelectedData(item);
    setIsPreviewOpen(true);
  };

  const printDocument = () => {
    window.print();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const d = new Date(dateString);
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  return (
    <div className="w-full h-full flex flex-col space-y-6 relative">
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #print-document, #print-document * {
            visibility: visible;
            color: black !important;
          }
          #print-document {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
            background: white !important;
          }
          @page {
            size: A4 portrait;
            margin: 1.5cm;
          }
          ::-webkit-scrollbar {
            display: none;
          }
        }
      `}} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-400" />
            Surat Permohonan Rekening Koran
          </h1>
          <p className="text-slate-400 text-sm mt-1">Kelola dan cetak surat permohonan rekening koran ke bank.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" /> Buat Surat Baru
          </button>

            {selectedIds.length > 0 && (
              <button 
                onClick={handleBulkDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-sm font-medium rounded-xl transition-all"
              >
                <Trash2 className="w-4 h-4" />
                Hapus Terpilih
              </button>
            )}
            
        </div>
      </div>

      {/* Table Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-end gap-4 bg-white/5 p-4 rounded-xl border border-white/10 print:hidden">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">Show</span>
          <select 
            value={entries} 
            onChange={(e) => setEntries(Number(e.target.value))}
            className="bg-black/20 border border-white/10 rounded-md px-3 py-1.5 text-white focus:outline-none focus:border-blue-500 text-sm"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span className="text-sm text-slate-400">entries</span>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari surat..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto bg-white/5 border border-white/10 rounded-2xl custom-scrollbar relative print:hidden">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="text-xs text-slate-400 uppercase bg-black/20 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-4 font-medium w-12 text-center rounded-tl-2xl">
                <input 
                  type="checkbox" 
                  className="rounded border-slate-600 bg-slate-800" 
                  checked={data.length > 0 && selectedIds.length === data.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="px-6 py-4 font-medium rounded-tl-2xl">Tanggal Surat</th>
              <th className="px-6 py-4 font-medium">No. Surat</th>
              <th className="px-6 py-4 font-medium">Bank Tujuan</th>
              <th className="px-6 py-4 font-medium">No. Rekening</th>
              <th className="px-6 py-4 font-medium text-center rounded-tr-2xl">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-center">
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-600 bg-slate-800" 
                        checked={selectedIds.includes(item.id)}
                        onChange={() => handleSelect(item.id)}
                      />
                    </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-white">{formatDate(item.tanggalSurat)}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-mono text-blue-400">{item.noSurat}</span>
                </td>
                <td className="px-6 py-4 text-slate-300">
                  {item.bankTujuan}
                </td>
                <td className="px-6 py-4 text-slate-300 font-mono">
                  {item.noRekening}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => handlePreview(item)}
                      className="p-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors" title="Cetak Surat"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleEdit(item)}
                      className="p-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-lg transition-colors" title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(item)}
                      className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors" title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                  Belum ada data permohonan rekening koran.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 print:hidden">
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
                    <FileText className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">{isEditing ? 'Edit Surat Permohonan' : 'Buat Surat Permohonan'}</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Surat permohonan ke bank</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 md:p-6 custom-scrollbar overflow-y-auto">
                <form className="space-y-6" onSubmit={handleSave}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-300">Tanggal Surat</label>
                      <input type="date" required value={formData.tanggalSurat} onChange={e => setFormData({...formData, tanggalSurat: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 [color-scheme:dark]" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-300">No. Surat</label>
                      <input type="text" required placeholder="Contoh: 421/015/SD.01/2026" value={formData.noSurat} onChange={e => setFormData({...formData, noSurat: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500" />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300">Bank Tujuan</label>
                    <input type="text" required placeholder="Contoh: PT. Bank Pembangunan Daerah..." value={formData.bankTujuan} onChange={e => setFormData({...formData, bankTujuan: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500" />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-300">No. Rekening Sekolah</label>
                      <input type="text" required placeholder="Masukkan nomor rekening" value={localStorage.getItem("noRekeningSekolah") || formData.noRekening} readOnly className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-2.5 text-slate-300 placeholder:text-slate-500 focus:outline-none cursor-not-allowed font-mono" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-300">Atas Nama Rekening</label>
                      <input type="text" required placeholder="Contoh: SMK Negeri 1 Jakarta" value={localStorage.getItem("atasNamaRekening") || formData.namaRekening} readOnly className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-2.5 text-slate-300 placeholder:text-slate-500 focus:outline-none cursor-not-allowed" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider border-b border-white/10 pb-2">Rentang Tanggal Cetak Rekening Koran</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-300">Periode Awal</label>
                        <input type="date" required value={formData.periodeAwal} onChange={e => setFormData({...formData, periodeAwal: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 [color-scheme:dark]" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-300">Periode Akhir</label>
                        <input type="date" required value={formData.periodeAkhir} onChange={e => setFormData({...formData, periodeAkhir: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 [color-scheme:dark]" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300">Keperluan</label>
                    <textarea rows={2} required placeholder="Contoh: Lampiran Laporan Pertanggungjawaban..." value={formData.keperluan} onChange={e => setFormData({...formData, keperluan: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 resize-none"></textarea>
                  </div>
                  

                </form>
              </div>

              <div className="p-4 md:p-6 border-t border-white/10 bg-white/5 shrink-0 flex items-center justify-end gap-3">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/20">
                  <Save className="w-4 h-4" /> Simpan Data
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Print Preview */}
      <AnimatePresence>
        {isPreviewOpen && selectedData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 print:hidden">
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
              className="bg-[#0f172a] border border-white/10 w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col relative z-10 max-h-[90vh]"
            >
              <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/10 bg-white/5 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <Printer className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Preview Surat Permohonan</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Dokumen siap cetak (A4)</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsPreviewOpen(false)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Preview Area (Scrollable) */}
              <div className="flex-1 overflow-y-auto bg-slate-800 p-8 flex justify-center custom-scrollbar">
                
                {/* A4 Paper Container for View Only (Not Print) */}
                <div className="bg-white text-black font-serif shadow-2xl" style={{ width: '210mm', minHeight: '297mm' }}>
                  
                  {/* --- DOCUMENT CONTENT --- */}
                  <div id="print-document" className="w-full p-[2cm] box-border text-[12pt] leading-relaxed bg-white text-black font-serif">
                    
                    {/* Header Kop Surat */}
                    <div className="text-center mb-1 space-y-0">
                      <h1 className="font-bold text-[14pt]">{kopSurat.kopBaris1}</h1>
                      <h2 className="font-bold text-[14pt]">{kopSurat.kopBaris2}</h2>
                      <h3 className="font-bold text-[14pt]">{kopSurat.kopBaris3}</h3>
                      <p className="text-[11pt]">{kopSurat.kopBaris4}</p>
                      </div>
                    
                    {/* Double border line */}
                    <div className="w-full border-b-[3px] border-black mt-2 mb-[1px]"></div>
                    <div className="w-full border-b-[1px] border-black mb-8"></div>

                    {/* Date and details */}
                    <div className="flex justify-between mb-8">
                      <div className="space-y-1">
                        <div className="flex">
                          <span className="w-24">Nomor</span>
                          <span>: {selectedData.noSurat}</span>
                        </div>
                        <div className="flex">
                          <span className="w-24">Lampiran</span>
                          <span>: {selectedData.lampiran}</span>
                        </div>
                        <div className="flex">
                          <span className="w-24">Perihal</span>
                          <span className="font-bold">: {selectedData.perihal}</span>
                        </div>
                      </div>
                      <div>
                        <span>Jakarta, {formatDate(selectedData.tanggalSurat)}</span>
                      </div>
                    </div>

                    {/* Addressee */}
                    <div className="mb-8">
                      <p>Kepada Yth,</p>
                      <p className="font-bold">Pimpinan {selectedData.bankTujuan}</p>
                      <p>Di -</p>
                      <p className="pl-6">Tempat</p>
                    </div>

                    {/* Body */}
                    <div className="space-y-4 mb-10 text-justify">
                      <p>Dengan hormat,</p>
                      <p>
                        Sehubungan dengan keperluan kelengkapan administrasi dan {String(selectedData.keperluan || "").toLowerCase()}, bersama surat ini kami bermaksud mengajukan permohonan cetak Rekening Koran untuk rekening sekolah kami dengan rincian sebagai berikut:
                      </p>
                      
                      <div className="ml-8 space-y-2 py-2">
                        <div className="flex">
                          <span className="w-48">Nomor Rekening</span>
                          <span>: <span className="font-bold">{localStorage.getItem("noRekeningSekolah") || selectedData.noRekening}</span></span>
                        </div>
                        <div className="flex">
                          <span className="w-48">Atas Nama Rekening</span>
                          <span>: {localStorage.getItem("atasNamaRekening") || selectedData.namaRekening}</span>
                        </div>
                        <div className="flex">
                          <span className="w-48">Periode Cetak</span>
                          <span>: {formatDate(selectedData.periodeAwal)} s.d {formatDate(selectedData.periodeAkhir)}</span>
                        </div>
                      </div>

                      <p>
                        Demikian surat permohonan ini kami sampaikan. Besar harapan kami agar permohonan cetak rekening koran ini dapat segera diproses. Atas perhatian dan kerjasama yang baik, kami ucapkan terima kasih.
                      </p>
                    </div>

                    {/* Signatures */}
                    <div className="flex justify-end items-start mt-12">
                      <div className="text-center w-72">
                        <p>Kepala Sekolah,</p>
                        <div className="h-24"></div>
                        <p className="font-bold underline">{localStorage.getItem("namaKepsek") || selectedData.kepsek?.nama}</p>
                        <p>NIP. {localStorage.getItem("nipKepsek") || selectedData.kepsek?.nip}</p>
                      </div>
                    </div>

                  </div>
                  {/* --- END DOCUMENT CONTENT --- */}

                </div>
              </div>

              <div className="p-4 md:p-6 border-t border-white/10 bg-white/5 shrink-0 flex items-center justify-end gap-3">
                <button 
                  onClick={() => setIsPreviewOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  Tutup
                </button>
                <button 
                  onClick={printDocument}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/20"
                >
                  <Printer className="w-4 h-4" /> Cetak (Print)
                </button>
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
                <h3 className="text-xl font-semibold text-white text-center mb-2">Hapus Surat Permohonan</h3>
                <p className="text-slate-400 text-center text-sm mb-6">
                  Apakah Anda yakin ingin menghapus surat permohonan rekening koran <span className="text-white font-medium">{itemToDelete?.noSurat}</span>? Tindakan ini tidak dapat dibatalkan.
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
