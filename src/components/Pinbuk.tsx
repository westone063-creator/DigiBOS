import React, { useState } from 'react';
import { getKopSurat } from '../utils/settings';
import { ArrowRightLeft, Search, Plus, Filter, Download, Edit, Trash2, X, Save, Printer, FileText, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const terbilang = (angka: number): string => {
  const words = [
    '', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh', 'sebelas'
  ];
  let res = '';
  if (angka < 12) res = words[angka];
  else if (angka < 20) res = terbilang(angka - 10) + ' belas';
  else if (angka < 100) res = terbilang(Math.floor(angka / 10)) + ' puluh ' + terbilang(angka % 10);
  else if (angka < 200) res = 'seratus ' + terbilang(angka - 100);
  else if (angka < 1000) res = terbilang(Math.floor(angka / 100)) + ' ratus ' + terbilang(angka % 100);
  else if (angka < 2000) res = 'seribu ' + terbilang(angka - 1000);
  else if (angka < 1000000) res = terbilang(Math.floor(angka / 1000)) + ' ribu ' + terbilang(angka % 1000);
  else if (angka < 1000000000) res = terbilang(Math.floor(angka / 1000000)) + ' juta ' + terbilang(angka % 1000000);
  
  // Capitalize first letter of each word
  return res.trim().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const kopSurat = getKopSurat();
const DUMMY_DATA = [
  {
    id: 1,
    tanggal: '2026-05-04',
    noBukti: '115',
    kodeSurat: '421.2',
    tahunSurat: '2026',
    dariKas: 'Bank',
    keKas: 'Tunai',
    jumlah: 7903800,
    uraian: 'Pembayaran SIPlah dan Asesmen',
    kepsek: {
      nama: 'NUSDIN, S.Pd',
      nip: '196808062007011021',
      nik: '3209230608680001',
      alamat: 'Jln. Ki Bandang Samaran No. 54 Desa Slangit',
      hp: '+62 877-2788-2655'
    },
    bendahara: {
      nama: 'CUNARA,S,Pd.I',
      nip: '198801052019031002',
      nik: '3213240501880009',
      alamat: 'Jln. Ki Bandang Samaran No. 54 Desa Slangit',
      hp: '+62 821-2173-9530'
    },
    rekeningSumber: {
      nomor: localStorage.getItem('noRekeningSekolah') || '0120042602100',
      nama: localStorage.getItem('atasNamaRekening') || kopSurat.kopBaris3
    },
    lampiran: [
      { id: 1, penerima: 'SIPlah eureka CV. CAMAR MAS BERDIKARI', rekening: '1768260503942396', bank: 'VA BJB', jumlah: 1265000, keterangan: 'Pengadaan buku erlangga' },
      { id: 2, penerima: 'CV. FAMILI MILENIAL MEGU', rekening: '0100236771100', bank: 'BJB', jumlah: 616000, keterangan: 'ASESMEN SUMATIF AKHIR FASE (ASAF) KELAS 6' },
      { id: 3, penerima: 'CV. FAMILI MILENIAL MEGU', rekening: '0100236771100', bank: 'BJB', jumlah: 1980000, keterangan: 'ASESMEN SUMATIF AKHIR JENJANG (ASAJ)' },
      { id: 4, penerima: 'ASYA STORE. MOHAMMAD NUR BACHTIAR', rekening: '0151246818100', bank: 'BJB', jumlah: 4042800, keterangan: 'ATK SIPlah bulan Mei' }
    ]
  },
  {
    id: 2,
    tanggal: '2024-03-15',
    noBukti: 'PB-002',
    kodeSurat: '421.2',
    tahunSurat: '2024',
    dariKas: 'Tunai',
    keKas: 'Bank',
    jumlah: 2500000,
    uraian: 'Setor sisa kas tunai kegiatan',
    kepsek: {
      nama: 'NUSDIN, S.Pd',
      nip: '196808062007011021',
      nik: '3209230608680001',
      alamat: 'Jln. Ki Bandang Samaran No. 54 Desa Slangit',
      hp: '+62 877-2788-2655'
    },
    bendahara: {
      nama: 'CUNARA,S,Pd.I',
      nip: '198801052019031002',
      nik: '3213240501880009',
      alamat: 'Jln. Ki Bandang Samaran No. 54 Desa Slangit',
      hp: '+62 821-2173-9530'
    },
    rekeningSumber: {
      nomor: localStorage.getItem('noRekeningSekolah') || '0120042602100',
      nama: localStorage.getItem('atasNamaRekening') || kopSurat.kopBaris3
    },
    lampiran: []
  }
];

export default function Pinbuk() {

  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('pinbukData');
    if (saved) return JSON.parse(saved);
    return DUMMY_DATA;
  });
  React.useEffect(() => {
    localStorage.setItem('pinbukData', JSON.stringify(data));
  }, [data]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [entries, setEntries] = useState(10);
  
  const initialFormState = {
    id: 0,
    tanggal: '',
    noBukti: '',
    kodeSurat: '421.2',
    tahunSurat: new Date().getFullYear().toString(),
    dariKas: '',
    keKas: '',
    jumlah: '',
    uraian: ''
  };
  const [formData, setFormData] = useState(initialFormState);

  const [lampiranList, setLampiranList] = useState([
    { id: 1, penerima: '', rekening: '', bank: '', jumlah: '', keterangan: '' }
  ]);

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

  const handleOpenAdd = () => {
    setFormData(initialFormState);
    setLampiranList([{ id: Date.now(), penerima: '', rekening: '', bank: '', jumlah: '', keterangan: '' }]);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setFormData({
      id: item.id,
      tanggal: item.tanggal,
      noBukti: item.noBukti,
      kodeSurat: item.kodeSurat || '421.2',
      tahunSurat: item.tahunSurat || new Date().getFullYear().toString(),
      dariKas: item.dariKas,
      keKas: item.keKas,
      jumlah: item.jumlah.toString(),
      uraian: item.uraian
    });
    setLampiranList(item.lampiran && item.lampiran.length > 0 ? item.lampiran.map((l:any) => ({...l, jumlah: l.jumlah.toString()})) : []);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const existingItem = isEditing ? data.find(d => d.id === formData.id) : null;
    const newItem = {
      ...formData,
      id: isEditing ? formData.id : Date.now(),
      jumlah: Number(formData.jumlah),
      lampiran: lampiranList.map(l => ({ ...l, jumlah: Number(l.jumlah) })),
      kepsek: existingItem ? existingItem.kepsek : DUMMY_DATA[0].kepsek,
      bendahara: existingItem ? existingItem.bendahara : DUMMY_DATA[0].bendahara,
      rekeningSumber: existingItem ? existingItem.rekeningSumber : DUMMY_DATA[0].rekeningSumber
    };

    if (isEditing) {
      setData(data.map(d => d.id === formData.id ? newItem : d));
    } else {
      setData([newItem, ...data]);
    }
    setIsModalOpen(false);
  };

  const addLampiran = () => {
    setLampiranList([...lampiranList, { id: Date.now(), penerima: '', rekening: '', bank: '', jumlah: '', keterangan: '' }]);
  };

  const removeLampiran = (id: number) => {
    setLampiranList(lampiranList.filter(l => l.id !== id));
  };

  const updateLampiran = (id: number, field: string, value: string) => {
    setLampiranList(lampiranList.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const handlePreview = (item: any) => {
    setSelectedData(item);
    setIsPreviewOpen(true);
  };

  const printDocument = () => {
    window.print();
  };

  const formatDate = (dateString: string) => {
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const d = new Date(dateString);
    return `${d.getDate().toString().padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  return (
    <div className="w-full h-full flex flex-col space-y-6 relative">
      {/* Print Styles */}
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
          .page-break {
            page-break-before: always;
          }
          @page {
            size: A4;
            margin: 1.5cm;
          }
          /* Hide scrollbar in print */
          ::-webkit-scrollbar {
            display: none;
          }
        }
      `}} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
            <ArrowRightLeft className="w-6 h-6 text-blue-400" />
            Pemindahbukuan (Pinbuk)
          </h1>
          <p className="text-slate-400 text-sm mt-1">Kelola dan cetak Standing Instruction pemindahbukuan Bank.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" /> Tambah Transaksi
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
              placeholder="Cari transaksi..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
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
              <th className="px-6 py-4 font-medium rounded-tl-2xl">Tanggal</th>
              <th className="px-6 py-4 font-medium">No. Bukti</th>
              <th className="px-6 py-4 font-medium">Dari Kas</th>
              <th className="px-6 py-4 font-medium">Ke Kas</th>
              <th className="px-6 py-4 font-medium">Uraian</th>
              <th className="px-6 py-4 font-medium text-right">Jumlah (Rp)</th>
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
                  <div className="font-medium text-white">{new Date(item.tanggal).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-mono text-blue-400">{item.noBukti}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${item.dariKas === 'Bank' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                    {item.dariKas}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${item.keKas === 'Bank' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                    {item.keKas}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-300">
                  <div className="max-w-xs truncate" title={item.uraian}>{item.uraian}</div>
                </td>
                <td className="px-6 py-4 text-right font-medium text-emerald-400">
                  {item.jumlah.toLocaleString('id-ID')}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => handlePreview(item)}
                      className="p-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors" 
                      title="Cetak Standing Instruction"
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
                <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                  Belum ada data pemindahbukuan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form Tambah */}
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
              className="bg-[#0f172a] border border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col overflow-hidden relative z-10"
            >
              <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/10 shrink-0 bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <ArrowRightLeft className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">{isEditing ? 'Edit Transaksi Pinbuk' : 'Tambah Transaksi Pinbuk'}</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Pemindahbukuan Bank ↔ Tunai</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 md:p-6 custom-scrollbar overflow-y-auto max-h-[70vh]">
                <form className="space-y-6" onSubmit={handleSave}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-300">Tanggal</label>
                      <input 
                        type="date" 
                        required
                        value={formData.tanggal}
                        onChange={(e) => setFormData({...formData, tanggal: e.target.value})}
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all [color-scheme:dark]" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-300">No. Bukti / Surat</label>
                      <input 
                        type="text" 
                        required
                        value={formData.noBukti}
                        onChange={(e) => setFormData({...formData, noBukti: e.target.value})}
                        placeholder="Contoh: 115" 
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" 
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-300">Dari Kas</label>
                      <select 
                        required
                        value={formData.dariKas}
                        onChange={(e) => setFormData({...formData, dariKas: e.target.value})}
                        className="w-full bg-[#1e293b] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none"
                      >
                        <option value="">Pilih Sumber Dana...</option>
                        <option value="Bank">Bank</option>
                        <option value="Tunai">Tunai</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-300">Ke Kas</label>
                      <select 
                        required
                        value={formData.keKas}
                        onChange={(e) => setFormData({...formData, keKas: e.target.value})}
                        className="w-full bg-[#1e293b] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none"
                      >
                        <option value="">Pilih Tujuan Dana...</option>
                        <option value="Tunai">Tunai</option>
                        <option value="Bank">Bank</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300">Jumlah Total (Rp)</label>
                    <input 
                      type="number" 
                      required
                      value={formData.jumlah}
                      onChange={(e) => setFormData({...formData, jumlah: e.target.value})}
                      placeholder="Contoh: 7903800" 
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300">Uraian / Keterangan</label>
                    <textarea 
                      rows={3} 
                      required
                      value={formData.uraian}
                      onChange={(e) => setFormData({...formData, uraian: e.target.value})}
                      placeholder="Penjelasan transaksi pemindahbukuan..." 
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                    ></textarea>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-white">Daftar Penerima (Lampiran)</h3>
                      <button
                        type="button"
                        onClick={addLampiran}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-medium text-white transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" /> Tambah Penerima
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {lampiranList.map((lamp, index) => (
                        <div key={lamp.id} className="p-4 bg-black/20 border border-white/10 rounded-xl relative group">
                          <div className="absolute -top-2.5 -left-2.5 w-6 h-6 bg-slate-800 border border-white/10 rounded-full flex items-center justify-center text-xs font-medium text-slate-400">
                            {index + 1}
                          </div>
                          {lampiranList.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeLampiran(lamp.id)}
                              className="absolute top-2 right-2 p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                            <div className="space-y-1.5">
                              <label className="text-xs font-medium text-slate-400">Nama Penerima</label>
                              <input 
                                type="text" 
                                value={lamp.penerima}
                                onChange={(e) => updateLampiran(lamp.id, 'penerima', e.target.value)}
                                placeholder="Nama CV/Toko/Orang" 
                                className="w-full bg-slate-900/50 border border-white/10 rounded-md px-3 py-2 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition-all" 
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-medium text-slate-400">Nomor Rekening</label>
                              <input 
                                type="text" 
                                value={lamp.rekening}
                                onChange={(e) => updateLampiran(lamp.id, 'rekening', e.target.value)}
                                placeholder="Contoh: 0100236771100" 
                                className="w-full bg-slate-900/50 border border-white/10 rounded-md px-3 py-2 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition-all" 
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-medium text-slate-400">Bank</label>
                              <input 
                                type="text" 
                                value={lamp.bank}
                                onChange={(e) => updateLampiran(lamp.id, 'bank', e.target.value)}
                                placeholder="Contoh: BJB" 
                                className="w-full bg-slate-900/50 border border-white/10 rounded-md px-3 py-2 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition-all" 
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-medium text-slate-400">Jumlah Dana (Rp)</label>
                              <input 
                                type="number" 
                                value={lamp.jumlah}
                                onChange={(e) => updateLampiran(lamp.id, 'jumlah', e.target.value)}
                                placeholder="Contoh: 1500000" 
                                className="w-full bg-slate-900/50 border border-white/10 rounded-md px-3 py-2 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition-all" 
                              />
                            </div>
                            <div className="space-y-1.5 sm:col-span-2">
                              <label className="text-xs font-medium text-slate-400">Keterangan</label>
                              <input 
                                type="text" 
                                value={lamp.keterangan}
                                onChange={(e) => updateLampiran(lamp.id, 'keterangan', e.target.value)}
                                placeholder="Tujuan pembayaran..." 
                                className="w-full bg-slate-900/50 border border-white/10 rounded-md px-3 py-2 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition-all" 
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
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

      {/* Modal Cetak Document Preview */}
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
                    <h2 className="text-lg font-semibold text-white">Preview Standing Instruction</h2>
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
                <div className="bg-white text-black font-sans shadow-2xl" style={{ width: '210mm', minHeight: '297mm' }}>
                  
                  {/* --- DOCUMENT CONTENT (This same content will be rendered for printing below) --- */}
                  <div id="print-document" className="bg-white text-black text-[13px] leading-snug font-sans">
                    
                    {/* PAGE 1 */}
                    <div className="p-[2cm] min-h-[297mm] box-border relative">
                      
                      {/* Kop Surat */}
                      <div className="flex items-center border-b-[3px] border-black pb-4 mb-1">
                        <div className="w-20 shrink-0">
                          {/* Placeholder Logo */}
                          <div className="w-16 h-20 border-2 border-black flex items-center justify-center text-[10px] text-center font-bold">
                            LOGO DAERAH
                          </div>
                        </div>
                        <div className="flex-1 text-center pr-20">
                          <h2 className="text-[15px] font-normal tracking-wide">{kopSurat.kopBaris1}</h2>
                          <h2 className="text-[15px] font-normal tracking-wide mb-1">{kopSurat.kopBaris2}</h2>
                          <h1 className="text-[20px] font-bold tracking-widest mb-1">{kopSurat.kopBaris3}</h1>
                          <p className="text-[11px] font-normal">Alamat : Jl.Ki Bandang Samaran No. 54 Desa Slangit Kecamatan Klangenan - Cirebon</p>
                          <p className="text-[11px] font-normal">Email : sdnegeri1slangit@gmail.com - 45156</p>
                        </div>
                      </div>
                      <div className="border-b-[1px] border-black mb-6"></div>

                      {/* Judul Surat */}
                      <div className="text-center mb-6">
                        <h3 className="font-bold underline text-[14px]">STANDING INSTRUCTION</h3>
                        <p className="text-[12px]">{selectedData.kodeSurat} / <span className="font-bold">{selectedData.noBukti}</span> SD.1.SLGT/ V / {selectedData.tahunSurat}</p>
                      </div>

                      {/* Kepada Yth */}
                      <div className="mb-6">
                        <p>Kepada Yth.</p>
                        <p>PT Bank Pembangunan Daerah Jawa Barat & Banten, Tbk</p>
                        <p>Kantor Cabang KCP</p>
                      </div>

                      {/* Pembuka */}
                      <div className="mb-4">
                        <p>Yang bertanda tangan dibawah ini :</p>
                      </div>

                      {/* Data Pembuat */}
                      <div className="mb-4 ml-4">
                        <div className="flex mb-1">
                          <div className="w-5">1.</div>
                          <div className="w-36">Nama lengkap</div>
                          <div className="w-4">:</div>
                          <div className="flex-1 font-bold">{localStorage.getItem("namaKepsek") || selectedData.kepsek.nama}</div>
                        </div>
                        <div className="flex mb-1 ml-5">
                          <div className="w-36">No. Identitas (KTP)</div>
                          <div className="w-4">:</div>
                          <div className="flex-1">{selectedData.kepsek.nik}</div>
                        </div>
                        <div className="flex mb-1 ml-5">
                          <div className="w-36">Alamat (Sesuai KTP)</div>
                          <div className="w-4">:</div>
                          <div className="flex-1">{selectedData.kepsek.alamat}</div>
                        </div>
                        <div className="flex mb-1 ml-5">
                          <div className="w-36">No. Handphone</div>
                          <div className="w-4">:</div>
                          <div className="flex-1">{selectedData.kepsek.hp}</div>
                        </div>
                        <div className="flex mb-4 ml-5">
                          <div className="w-36">Jabatan</div>
                          <div className="w-4">:</div>
                          <div className="flex-1">Kepala Sekolah</div>
                        </div>

                        <div className="flex mb-1">
                          <div className="w-5">2.</div>
                          <div className="w-36">Nama lengkap</div>
                          <div className="w-4">:</div>
                          <div className="flex-1 font-bold">{localStorage.getItem("namaBendahara") || selectedData.bendahara.nama}</div>
                        </div>
                        <div className="flex mb-1 ml-5">
                          <div className="w-36">No. ldentitas (KTP)</div>
                          <div className="w-4">:</div>
                          <div className="flex-1">{selectedData.bendahara.nik}</div>
                        </div>
                        <div className="flex mb-1 ml-5">
                          <div className="w-36">Alamat (Sesuai KTP)</div>
                          <div className="w-4">:</div>
                          <div className="flex-1">{selectedData.bendahara.alamat}</div>
                        </div>
                        <div className="flex mb-1 ml-5">
                          <div className="w-36">No. Handphone</div>
                          <div className="w-4">:</div>
                          <div className="flex-1">{selectedData.bendahara.hp}</div>
                        </div>
                        <div className="flex mb-4 ml-5">
                          <div className="w-36">Jabatan</div>
                          <div className="w-4">:</div>
                          <div className="flex-1">Bendahara</div>
                        </div>
                      </div>

                      {/* Isi Rekening Asal */}
                      <div className="mb-2">
                        <p>Mohon agar dilakukan pemindahbukuan transfer dana dari rekening tersebut di bawah ini sebagai berikut :</p>
                      </div>
                      <div className="mb-4 ml-5">
                        <div className="flex mb-1">
                          <div className="w-36">Nomor Rekening</div>
                          <div className="w-4">:</div>
                          <div className="flex-1">{localStorage.getItem("noRekeningSekolah") || selectedData.rekeningSumber.nomor}</div>
                        </div>
                        <div className="flex mb-1">
                          <div className="w-36">Nama Rekening</div>
                          <div className="w-4">:</div>
                          <div className="flex-1">{localStorage.getItem("atasNamaRekening") || selectedData.rekeningSumber.nama}</div>
                        </div>
                        <div className="flex mb-1">
                          <div className="w-36">Jumlah Dana</div>
                          <div className="w-4">:</div>
                          <div className="flex-1 font-bold">Rp.{selectedData.jumlah.toLocaleString('id-ID')},-</div>
                        </div>
                        <div className="flex mb-1">
                          <div className="w-36">Terbilang</div>
                          <div className="w-4">:</div>
                          <div className="flex-1 italic">{terbilang(selectedData.jumlah)} rupiah</div>
                        </div>
                      </div>

                      {/* Isi Rekening Tujuan */}
                      <div className="mb-2">
                        <p>Mohon agar dilakukan pemindahbukuan/transfer dana dari rekening kami tersebut diatas sebagai berikut :</p>
                      </div>
                      <div className="mb-4 ml-5">
                        <div className="flex mb-1">
                          <div className="w-36">Jumlah Dana</div>
                          <div className="w-4">:</div>
                          <div className="flex-1 font-bold">Rp.{selectedData.jumlah.toLocaleString('id-ID')},-</div>
                        </div>
                        <div className="flex mb-1">
                          <div className="w-36">Terbilang</div>
                          <div className="w-4">:</div>
                          <div className="flex-1 italic">{terbilang(selectedData.jumlah)} rupiah</div>
                        </div>
                        <div className="flex mb-1">
                          <div className="w-36">Rekening Penerima</div>
                          <div className="w-4">:</div>
                          <div className="flex-1 italic">Terlampir</div>
                        </div>
                        <div className="flex mb-1">
                          <div className="w-36">Atas Nama</div>
                          <div className="w-4">:</div>
                          <div className="flex-1 italic">Terlampir</div>
                        </div>
                      </div>

                      {/* Ketentuan */}
                      <div className="mb-2">
                        <p>Atas transaksi pada standing Instruction ini, maka :</p>
                      </div>
                      <div className="mb-4 ml-4">
                        <div className="flex mb-1">
                          <div className="w-5">1.</div>
                          <div className="flex-1 text-justify">Pihak bank, dalam hal ini bank bjb dibebaskan dari segala akibat yang mungikn timbul dari pelaksanaan pemindahbukuan sebagaimana tercantum dalam standing instruction dan atau lampiran standing Instructlon.</div>
                        </div>
                        <div className="flex mb-1">
                          <div className="w-5">2.</div>
                          <div className="flex-1 text-justify">Kami meyakini atas kebenaran data dan informasi pada standing instruction ini berserta dengan lampirannya.</div>
                        </div>
                      </div>

                      <div className="mb-8">
                        <p>Demikian surat keterangan ini di buat,agar dapat digunakan sebagai mana mestinya</p>
                      </div>

                      {/* TTD */}
                      <div className="flex justify-between items-start pt-2">
                        <div className="text-center w-64">
                          <p>Mengetahui :</p>
                          <p>Kepala {kopSurat.kopBaris3}</p>
                          <div className="h-24 flex items-center justify-center text-[10px] text-gray-400 italic">
                            Materai
                          </div>
                          <p className="font-bold underline">{localStorage.getItem("namaKepsek") || selectedData.kepsek.nama}</p>
                          <p>NIP. {localStorage.getItem("nipKepsek") || selectedData.kepsek.nip}</p>
                        </div>
                        <div className="text-center w-64">
                          <p>CIREBON, &nbsp;&nbsp;&nbsp; {formatDate(selectedData.tanggal)}</p>
                          <p>Bendahara</p>
                          <div className="h-24"></div>
                          <p className="font-bold underline">{localStorage.getItem("namaBendahara") || selectedData.bendahara.nama}</p>
                          <p>NIP. {localStorage.getItem("nipBendahara") || selectedData.bendahara.nip}</p>
                        </div>
                      </div>

                    </div>

                    {/* PAGE 2 (Lampiran) */}
                    {selectedData.lampiran && selectedData.lampiran.length > 0 && (
                      <div className="p-[2cm] min-h-[297mm] box-border relative page-break">
                        <div className="mb-4 font-bold text-[14px]">Lampiran 1</div>
                        
                        <div className="mb-6 ml-4">
                          <div className="flex mb-1">
                            <div className="w-24">Nomor</div>
                            <div className="w-4">:</div>
                            <div className="flex-1">{selectedData.kodeSurat} / <span className="font-bold">{selectedData.noBukti}</span> / SD.1.SLGT/ V / {selectedData.tahunSurat}</div>
                          </div>
                          <div className="flex mb-1">
                            <div className="w-24">Sifat</div>
                            <div className="w-4">:</div>
                            <div className="flex-1">Penting</div>
                          </div>
                          <div className="flex mb-1">
                            <div className="w-24">Perihal</div>
                            <div className="w-4">:</div>
                            <div className="flex-1 font-bold">STANDING INSTRUCTION</div>
                          </div>
                        </div>

                        {/* Tabel Lampiran */}
                        <table className="w-full border-collapse border border-black mb-1 text-[12px]">
                          <thead>
                            <tr className="bg-gray-200 text-center">
                              <th className="border border-black py-2 px-1 w-8">No.</th>
                              <th className="border border-black py-2 px-2">Nama Penerima</th>
                              <th className="border border-black py-2 px-2 w-32">Nomor Rekening</th>
                              <th className="border border-black py-2 px-2 w-20">Bank</th>
                              <th className="border border-black py-2 px-2 w-32">Jumlah Dana</th>
                              <th className="border border-black py-2 px-2">keterangan</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedData.lampiran.map((lamp: any, index: number) => (
                              <tr key={lamp.id}>
                                <td className="border border-black py-2 px-1 text-center">{index + 1}</td>
                                <td className="border border-black py-2 px-2">{lamp.penerima}</td>
                                <td className="border border-black py-2 px-2 text-center">{lamp.rekening}</td>
                                <td className="border border-black py-2 px-2 text-center">{lamp.bank}</td>
                                <td className="border border-black py-2 px-2 text-right">{lamp.jumlah.toLocaleString('id-ID')},-</td>
                                <td className="border border-black py-2 px-2">{lamp.keterangan}</td>
                              </tr>
                            ))}
                            {/* Empty Rows just for formatting matching the original */}
                            <tr>
                              <td className="border border-black py-2 px-1 text-center">{selectedData.lampiran.length + 1}</td>
                              <td className="border border-black py-2 px-2 text-center">-</td>
                              <td className="border border-black py-2 px-2 text-center">-</td>
                              <td className="border border-black py-2 px-2 text-center">0</td>
                              <td className="border border-black py-2 px-2 text-right">0,-</td>
                              <td className="border border-black py-2 px-2">0,-</td>
                            </tr>
                            <tr>
                              <td className="border border-black py-1 px-1 text-left" colSpan={6}>dst.</td>
                            </tr>
                            {/* Total Row */}
                            <tr className="font-bold bg-gray-200">
                              <td className="border border-black py-2 px-2 text-center" colSpan={4}>Jumlah</td>
                              <td className="border border-black py-2 px-2 text-right">{selectedData.jumlah.toLocaleString('id-ID')},-</td>
                              <td className="border border-black bg-white" colSpan={1}></td>
                            </tr>
                            <tr className="italic">
                              <td className="border border-black py-1 px-2 text-left" colSpan={6}>
                                {terbilang(selectedData.jumlah)} rupiah
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        {/* TTD on Lampiran */}
                        <div className="flex justify-between items-start mt-12">
                          <div className="text-center w-64">
                            <p>Mengetahui :</p>
                            <p>Kepala {kopSurat.kopBaris3}</p>
                            <div className="h-20"></div>
                            <p className="font-bold underline">{localStorage.getItem("namaKepsek") || selectedData.kepsek.nama}</p>
                            <p>NIP. {localStorage.getItem("nipKepsek") || selectedData.kepsek.nip}</p>
                          </div>
                          <div className="text-center w-64">
                            <p>CIREBON, &nbsp;&nbsp;&nbsp; {formatDate(selectedData.tanggal)}</p>
                            <p>Bendahara</p>
                            <div className="h-20"></div>
                            <p className="font-bold underline">{localStorage.getItem("namaBendahara") || selectedData.bendahara.nama}</p>
                            <p>NIP. {localStorage.getItem("nipBendahara") || selectedData.bendahara.nip}</p>
                          </div>
                        </div>

                      </div>
                    )}

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
                <h3 className="text-xl font-semibold text-white text-center mb-2">Hapus Transaksi</h3>
                <p className="text-slate-400 text-center text-sm mb-6">
                  Apakah Anda yakin ingin menghapus pemindahbukuan <span className="text-white font-medium">{itemToDelete?.noBukti}</span>? Tindakan ini tidak dapat dibatalkan.
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
