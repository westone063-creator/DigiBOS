import React, { useState } from 'react';
import { Package, Save, Printer, Upload, X, Plus, Search, Filter, Eye, Edit, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import LabelInventaris from './LabelInventaris';

const DUMMY_DATA = [
  {
    id: 1,
    kodeSKPD: 'FEA',
    kodeBarang: 'AST-001',
    namaBarang: 'Laptop Lenovo ThinkPad',
    merk: 'Lenovo',
    kategori: 'Elektronik',
    sumberDana: 'BOSP Reguler - TA. 2026',
    tahun: 2024,
    kondisi: 'Baik',
    jumlah: 5,
    lokasi: 'Ruang Guru',
    harga: 12500000
  },
  {
    id: 2,
    kodeSKPD: 'FEA',
    kodeBarang: 'AST-002',
    namaBarang: 'Meja Kerja Guru',
    merk: 'IKEA',
    kategori: 'Furnitur',
    sumberDana: 'BOSP Reguler - TA. 2026',
    tahun: 2023,
    kondisi: 'Baik',
    jumlah: 10,
    lokasi: 'Ruang Guru',
    harga: 1500000
  },
  {
    id: 3,
    kodeSKPD: 'FEB',
    kodeBarang: 'AST-003',
    namaBarang: 'Proyektor Epson',
    merk: 'Epson',
    kategori: 'Elektronik',
    sumberDana: 'APBD - TA. 2025',
    tahun: 2022,
    kondisi: 'Sedang',
    jumlah: 2,
    lokasi: 'Ruang Kelas 7A',
    harga: 6500000
  }
];

export default function AsetInventaris() {
  const [items, setItems] = useState<any[]>(DUMMY_DATA);
  const [photo, setPhoto] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLabelModalOpen, setIsLabelModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'create' | 'edit' | 'preview'>('create');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [isSaveEditModalOpen, setIsSaveEditModalOpen] = useState(false);

  const formRef = React.useRef<HTMLFormElement>(null);

  const openModal = (mode: 'create' | 'edit' | 'preview', item?: any) => {
    setViewMode(mode);
    setSelectedItem(item || null);
    setIsModalOpen(true);
  };

  const openDeleteModal = (item: any) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleSaveClick = () => {
    if (viewMode === 'edit') {
      setIsSaveEditModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  };

  const handleSaveConfirm = () => {
    if (formRef.current) {
      const formData = new FormData(formRef.current);
      const updatedItem = {
        ...selectedItem,
        kodeSKPD: formData.get('kodeSKPD'),
        kodeBarang: formData.get('kodeBarang'),
        namaBarang: formData.get('namaBarang'),
        merk: formData.get('merk'),
        kategori: formData.get('kategori'),
        tahun: formData.get('tahun'),
        sumberDana: formData.get('sumberDana'),
        harga: formData.get('harga'),
        kondisi: formData.get('kondisi'),
        jumlah: formData.get('jumlah'),
        satuan: formData.get('satuan'),
        noRegister: formData.get('noRegister'),
        noSeri: formData.get('noSeri'),
        bahan: formData.get('bahan'),
        lokasi: formData.get('lokasi'),
      };

      if (viewMode === 'edit') {
        setItems(items.map(item => item.id === selectedItem.id ? updatedItem : item));
      } else if (viewMode === 'create') {
        setItems([...items, { ...updatedItem, id: Date.now() }]);
      }
    }
    setIsSaveEditModalOpen(false);
    setIsModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      setItems(items.filter(item => item.id !== itemToDelete.id));
    }
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="w-full h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-400" />
            Data Aset & Inventaris
          </h1>
          <p className="text-slate-400 text-sm mt-1">Kelola data aset, inventaris, serta Kartu Inventaris Ruangan (KIR).</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => openModal('create')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" /> Tambah Aset
          </button>
          <button 
            onClick={() => setIsLabelModalOpen(true)} 
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Printer className="w-4 h-4" /> Cetak KIR
          </button>
        </div>
      </div>

      {/* Table Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Cari kode, nama barang, atau lokasi..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto justify-center">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto bg-white/5 border border-white/10 rounded-2xl custom-scrollbar relative">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="text-xs text-slate-400 uppercase bg-black/20 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-4 font-medium rounded-tl-2xl">Kode SKPD / Barang</th>
              <th className="px-6 py-4 font-medium">Nama Barang</th>
              <th className="px-6 py-4 font-medium">Kategori</th>
              <th className="px-6 py-4 font-medium">Lokasi</th>
              <th className="px-6 py-4 font-medium">Kondisi</th>
              <th className="px-6 py-4 font-medium text-right">Jumlah</th>
              <th className="px-6 py-4 font-medium text-center rounded-tr-2xl">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {items.filter(item => String(item.namaBarang || '').toLowerCase().includes(String(searchQuery || '').toLowerCase()) || String(item.kodeBarang || '').toLowerCase().includes(String(searchQuery || '').toLowerCase())).map((item) => (
              <tr key={item.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-mono text-blue-400">{item.kodeBarang}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{item.kodeSKPD || 'FEA'}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-white">{item.namaBarang}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{item.merk} • Tahun {item.tahun}</div>
                </td>
                <td className="px-6 py-4 text-slate-300">{item.kategori}</td>
                <td className="px-6 py-4 text-slate-300">{item.lokasi}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                    item.kondisi === 'Baik' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                    item.kondisi === 'Sedang' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                    'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}>
                    {item.kondisi}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-medium text-slate-200">{item.jumlah}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => openModal('preview', item)} className="p-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors" title="Lihat Detail">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => openModal('edit', item)} className="p-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-lg transition-colors" title="Edit">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => openDeleteModal(item)} className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors" title="Hapus">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
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
              className="bg-[#0f172a] border border-white/10 w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden relative z-10"
            >
              <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/10 shrink-0 bg-white/5">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${viewMode === 'preview' ? 'bg-indigo-500/20' : viewMode === 'edit' ? 'bg-amber-500/20' : 'bg-blue-500/20'}`}>
                    {viewMode === 'preview' ? <Eye className="w-5 h-5 text-indigo-400" /> : viewMode === 'edit' ? <Edit className="w-5 h-5 text-amber-400" /> : <Package className="w-5 h-5 text-blue-400" />}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      {viewMode === 'preview' ? 'Detail Aset & Inventaris' : viewMode === 'edit' ? 'Edit Data Aset' : 'Form Aset & Inventaris'}
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {viewMode === 'preview' ? 'Informasi lengkap aset' : viewMode === 'edit' ? 'Ubah informasi aset' : 'Tambah data aset baru'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6">
                <form ref={formRef} className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    
                    {/* Informasi Utama */}
                    <div className="space-y-4 xl:col-span-2">
                      <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">Informasi Utama</h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-slate-300">Kode SKPD</label>
                          <input name="kodeSKPD" type="text" defaultValue={selectedItem?.kodeSKPD || 'FEA'} readOnly={viewMode === 'preview'} className={`w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all ${viewMode === 'preview' ? 'opacity-70 cursor-not-allowed' : ''}`} />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-slate-300">Kode Barang / Aset</label>
                          <input name="kodeBarang" type="text" placeholder="Contoh: AST-004" defaultValue={selectedItem?.kodeBarang || ''} readOnly={viewMode === 'preview'} className={`w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all ${viewMode === 'preview' ? 'opacity-70 cursor-not-allowed' : ''}`} />
                        </div>
                        <div className="space-y-1.5 sm:col-span-2">
                          <label className="text-sm font-medium text-slate-300">Nama Barang</label>
                          <input name="namaBarang" type="text" placeholder="Contoh: Laptop Lenovo ThinkPad" defaultValue={selectedItem?.namaBarang || ''} readOnly={viewMode === 'preview'} className={`w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all ${viewMode === 'preview' ? 'opacity-70 cursor-not-allowed' : ''}`} />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-slate-300">Merk / Type</label>
                          <input name="merk" type="text" placeholder="Contoh: Lenovo" defaultValue={selectedItem?.merk || ''} readOnly={viewMode === 'preview'} className={`w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all ${viewMode === 'preview' ? 'opacity-70 cursor-not-allowed' : ''}`} />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-slate-300">Kategori</label>
                          <select name="kategori" disabled={viewMode === 'preview'} defaultValue={selectedItem?.kategori ? String(selectedItem.kategori).toLowerCase() : ''} className={`w-full bg-[#1e293b] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none ${viewMode === 'preview' ? 'opacity-70 cursor-not-allowed' : ''}`}>
                            <option value="">Pilih Kategori</option>
                            <option value="elektronik">Elektronik</option>
                            <option value="furnitur">Furnitur</option>
                            <option value="kendaraan">Kendaraan</option>
                            <option value="buku">Buku / Perpustakaan</option>
                            <option value="lainnya">Lainnya</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Foto Barang */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">Foto Aset</h3>
                      <div className={`w-full aspect-square sm:aspect-video xl:aspect-square rounded-xl border-2 border-dashed border-white/20 bg-black/20 flex flex-col items-center justify-center relative overflow-hidden group hover:border-blue-500/50 transition-colors ${viewMode === 'preview' ? 'cursor-default' : 'cursor-pointer'}`}>
                        {photo ? (
                          <>
                            <img src={photo} alt="Preview" className="w-full h-full object-cover" />
                            {viewMode !== 'preview' && (
                              <button type="button" onClick={(e) => { e.stopPropagation(); setPhoto(null); }} className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-red-500 text-white rounded-lg backdrop-blur-md transition-colors opacity-0 group-hover:opacity-100">
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </>
                        ) : (
                          <div className="text-center p-4">
                            <div className={`w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3 ${viewMode !== 'preview' ? 'group-hover:bg-blue-500/20 transition-colors' : ''}`}>
                              <Upload className={`w-6 h-6 text-slate-400 ${viewMode !== 'preview' ? 'group-hover:text-blue-400 transition-colors' : ''}`} />
                            </div>
                            <p className="text-sm font-medium text-slate-300">{viewMode === 'preview' ? 'Tidak ada foto' : 'Klik untuk upload foto'}</p>
                            {viewMode !== 'preview' && <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 5MB</p>}
                          </div>
                        )}
                        {viewMode !== 'preview' && (
                          <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              const reader = new FileReader();
                              reader.onload = (e) => setPhoto(e.target?.result as string);
                              reader.readAsDataURL(e.target.files[0]);
                            }
                          }} />
                        )}
                      </div>
                    </div>

                    {/* Detail Spesifikasi & Perolehan */}
                    <div className="space-y-4 xl:col-span-3 border-t border-white/10 pt-6">
                      <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">Spesifikasi & Perolehan</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-slate-300">Tahun Perolehan</label>
                          <input name="tahun" type="number" placeholder="Contoh: 2026" defaultValue={selectedItem?.tahun || ''} readOnly={viewMode === 'preview'} className={`w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all ${viewMode === 'preview' ? 'opacity-70 cursor-not-allowed' : ''}`} />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-slate-300">Sumber Dana</label>
                          <input name="sumberDana" type="text" placeholder="Contoh: BOSP Reguler - TA. 2026" defaultValue={selectedItem?.sumberDana || ''} readOnly={viewMode === 'preview'} className={`w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all ${viewMode === 'preview' ? 'opacity-70 cursor-not-allowed' : ''}`} />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-slate-300">Harga Perolehan (Rp)</label>
                          <input name="harga" type="text" placeholder="Contoh: 12.500.000" defaultValue={selectedItem?.harga || ''} readOnly={viewMode === 'preview'} className={`w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all ${viewMode === 'preview' ? 'opacity-70 cursor-not-allowed' : ''}`} />
                        </div>
                        
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-slate-300">Kondisi</label>
                          <select name="kondisi" disabled={viewMode === 'preview'} defaultValue={selectedItem?.kondisi ? String(selectedItem.kondisi).toLowerCase().replace(' ', '-') : ''} className={`w-full bg-[#1e293b] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none ${viewMode === 'preview' ? 'opacity-70 cursor-not-allowed' : ''}`}>
                            <option value="">Pilih Kondisi</option>
                            <option value="baik">Baik</option>
                            <option value="sedang">Sedang</option>
                            <option value="kurang-baik">Kurang Baik</option>
                            <option value="rusak-berat">Rusak Berat</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-slate-300">Jumlah</label>
                          <input name="jumlah" type="number" defaultValue={selectedItem?.jumlah || 1} readOnly={viewMode === 'preview'} className={`w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all ${viewMode === 'preview' ? 'opacity-70 cursor-not-allowed' : ''}`} />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-slate-300">Satuan</label>
                          <input type="text" defaultValue="Unit" readOnly={viewMode === 'preview'} className={`w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all ${viewMode === 'preview' ? 'opacity-70 cursor-not-allowed' : ''}`} />
                        </div>
                        
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-slate-300">No. Register / Urut</label>
                          <input type="text" placeholder="Contoh: 0001" readOnly={viewMode === 'preview'} className={`w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all ${viewMode === 'preview' ? 'opacity-70 cursor-not-allowed' : ''}`} />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-slate-300">No. Seri Pabrik</label>
                          <input type="text" placeholder="Contoh: SN-8291A" readOnly={viewMode === 'preview'} className={`w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all ${viewMode === 'preview' ? 'opacity-70 cursor-not-allowed' : ''}`} />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-slate-300">Bahan / Material</label>
                          <input type="text" placeholder="Contoh: Plastik/Aluminium" readOnly={viewMode === 'preview'} className={`w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all ${viewMode === 'preview' ? 'opacity-70 cursor-not-allowed' : ''}`} />
                        </div>
                      </div>
                    </div>

                    {/* Lokasi & Penanggung Jawab */}
                    <div className="space-y-4 xl:col-span-3 border-t border-white/10 pt-6">
                      <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">Lokasi & Penanggung Jawab</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-slate-300">Lokasi Ruangan</label>
                          <input name="lokasi" type="text" placeholder="Contoh: Ruang Guru" defaultValue={selectedItem?.lokasi || ''} readOnly={viewMode === 'preview'} className={`w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all ${viewMode === 'preview' ? 'opacity-70 cursor-not-allowed' : ''}`} />
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 h-full pt-6">
                            <label className={`flex items-center gap-3 group ${viewMode === 'preview' ? 'cursor-default' : 'cursor-pointer'}`}>
                              <div className="relative">
                                <input type="checkbox" className="sr-only" disabled={viewMode === 'preview'} />
                                <div className="w-10 h-5 bg-white/10 rounded-full border border-white/20 transition-colors group-hover:border-blue-500/50"></div>
                                <div className="w-3 h-3 bg-slate-400 rounded-full absolute top-1 left-1 transition-transform"></div>
                              </div>
                              <span className="text-sm font-medium text-slate-300">Masuk Kartu Inventaris Ruangan (KIR)</span>
                            </label>
                          </div>
                        </div>
                        
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-slate-300">Nama Pengurus Barang</label>
                          <input type="text" placeholder="Nama pengurus barang" readOnly={viewMode === 'preview'} className={`w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all ${viewMode === 'preview' ? 'opacity-70 cursor-not-allowed' : ''}`} />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-slate-300">NIP Pengurus</label>
                          <input type="text" placeholder="NIP Pengurus" readOnly={viewMode === 'preview'} className={`w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all ${viewMode === 'preview' ? 'opacity-70 cursor-not-allowed' : ''}`} />
                        </div>
                      </div>
                    </div>

                    {/* Keterangan Tambahan */}
                    <div className="space-y-4 xl:col-span-3 border-t border-white/10 pt-6">
                      <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">Keterangan Tambahan</h3>
                      
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-slate-300">Kelengkapan</label>
                          <input type="text" placeholder="Contoh: Adaptor, Buku Manual, Tas" readOnly={viewMode === 'preview'} className={`w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all ${viewMode === 'preview' ? 'opacity-70 cursor-not-allowed' : ''}`} />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-slate-300">Keterangan Aset</label>
                          <textarea rows={3} placeholder="Keterangan tambahan..." readOnly={viewMode === 'preview'} className={`w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none ${viewMode === 'preview' ? 'opacity-70 cursor-not-allowed' : ''}`}></textarea>
                        </div>
                      </div>
                    </div>

                  </div>
                </form>
              </div>

              <div className="p-4 md:p-6 border-t border-white/10 bg-white/5 shrink-0 flex items-center justify-end gap-3">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {viewMode === 'preview' ? 'Tutup' : 'Batal'}
                </button>
                {viewMode !== 'preview' && (
                  <button 
                    onClick={handleSaveClick}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/20"
                  >
                    <Save className="w-4 h-4" /> Simpan Data
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0f172a] border border-red-500/20 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative z-10"
            >
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mb-4 mx-auto">
                  <Trash2 className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-white text-center mb-2">Hapus Data Aset?</h3>
                <p className="text-slate-400 text-center text-sm mb-6">
                  Apakah Anda yakin ingin menghapus aset <span className="text-white font-medium">"{itemToDelete?.namaBarang}"</span>? Data yang dihapus tidak dapat dikembalikan.
                </p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                  >
                    Batal
                  </button>
                  <button 
                    onClick={handleDeleteConfirm}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-lg shadow-red-500/20"
                  >
                    Ya, Hapus Data
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Save Edit Confirmation Modal */}
      <AnimatePresence>
        {isSaveEditModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSaveEditModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0f172a] border border-amber-500/20 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative z-[60]"
            >
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center mb-4 mx-auto">
                  <Edit className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="text-xl font-semibold text-white text-center mb-2">Simpan Perubahan?</h3>
                <p className="text-slate-400 text-center text-sm mb-6">
                  Apakah Anda yakin ingin menyimpan perubahan pada aset <span className="text-white font-medium">"{selectedItem?.namaBarang}"</span>?
                </p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setIsSaveEditModalOpen(false)}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                  >
                    Batal
                  </button>
                  <button 
                    onClick={handleSaveConfirm}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-colors shadow-lg shadow-amber-500/20"
                  >
                    Ya, Simpan
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {isLabelModalOpen && (
        <LabelInventaris 
          items={items} 
          onClose={() => setIsLabelModalOpen(false)} 
        />
      )}
    </div>
  );
}
