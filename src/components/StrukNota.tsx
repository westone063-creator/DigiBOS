import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import { getKopSurat } from '../utils/settings';
import { ReceiptText, Search, Plus, Filter, Edit, Trash2, X, Save, Printer, FileText, AlertTriangle, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type NotaType = 'apotek' | 'atk' | 'kertas' | 'alat-rumah-tangga' | 'alat-kebersihan' | 'servis-laptop' | 'percetakan' | 'pln-prabayar' | 'pln-pascabayar' | 'internet' | 'pajak';

const kopSurat = getKopSurat();
const DUMMY_DATA = [
  {
    id: 1,
    type: 'apotek',
    tanggal: '2024-04-10 09:30',
    noNota: 'APT-20240410-001',
    pembeli: 'Bpk. Ahmad',
    dataTambahan: { pasien: 'Ahmad', dokter: 'dr. Budi' },
    total: 85000,
    items: [
      { id: 1, nama: 'Paracetamol 500mg', harga: 15000, qty: 2, subtotal: 30000 },
      { id: 2, nama: 'Vitamin C', harga: 55000, qty: 1, subtotal: 55000 }
    ]
  },
  {
    id: 2,
    type: 'atk',
    tanggal: '2024-04-11 10:15',
    noNota: 'ATK-20240411-002',
    pembeli: kopSurat.kopBaris3,
    total: 45000,
    items: [
      { id: 1, nama: 'Buku Tulis Sinar Dunia', harga: 5000, qty: 5, subtotal: 25000 },
      { id: 2, nama: 'Pensil 2B Faber Castell', harga: 4000, qty: 5, subtotal: 20000 }
    ]
  },
  {
    id: 3,
    type: 'kertas',
    tanggal: '2024-04-12 08:00',
    noNota: 'KRT-20240412-005',
    pembeli: 'Koperasi Sekolah',
    total: 250000,
    items: [
      { id: 1, nama: 'Kertas HVS A4 70gsm', harga: 50000, qty: 3, subtotal: 150000 },
      { id: 2, nama: 'Kertas HVS F4 70gsm', harga: 50000, qty: 2, subtotal: 100000 }
    ]
  },
  {
    id: 4,
    type: 'alat-rumah-tangga',
    tanggal: '2024-04-13 13:45',
    noNota: 'ART-20240413-012',
    pembeli: 'Ibu Dina (Dapur Sekolah)',
    total: 120000,
    items: [
      { id: 1, nama: 'Gelas Kaca Lusin', harga: 60000, qty: 1, subtotal: 60000 },
      { id: 2, nama: 'Piring Plastik Lusin', harga: 30000, qty: 2, subtotal: 60000 }
    ]
  },
  {
    id: 5,
    type: 'alat-kebersihan',
    tanggal: '2024-04-14 11:20',
    noNota: 'KBR-20240414-008',
    pembeli: 'Bpk. Jono (Penjaga Sekolah)',
    total: 85000,
    items: [
      { id: 1, nama: 'Sapu Ijuk', harga: 20000, qty: 2, subtotal: 40000 },
      { id: 2, nama: 'Pembersih Lantai 1L', harga: 15000, qty: 3, subtotal: 45000 }
    ]
  },
  {
    id: 6,
    type: 'servis-laptop',
    tanggal: '2024-04-15 15:30',
    noNota: 'SRV-20240415-001',
    pembeli: 'Guru TIK (Pak Rio)',
    dataTambahan: { perangkat: 'Asus VivoBook', keluhan: 'Mati Total' },
    total: 350000,
    items: [
      { id: 1, nama: 'Jasa Pengecekan & Servis', harga: 250000, qty: 1, subtotal: 250000 },
      { id: 2, nama: 'Thermal Paste', harga: 100000, qty: 1, subtotal: 100000 }
    ]
  },
  {
    id: 7,
    type: 'percetakan',
    tanggal: '2024-04-16 09:10',
    noNota: 'PRC-20240416-022',
    pembeli: 'Panitia Ujian Sekolah',
    total: 750000,
    items: [
      { id: 1, nama: 'Cetak Soal Ujian (Lbr)', harga: 500, qty: 1000, subtotal: 500000 },
      { id: 2, nama: 'Jilid Dokumen', harga: 5000, qty: 50, subtotal: 250000 }
    ]
  },
  {
    id: 8,
    type: 'pln-prabayar',
    tanggal: '2024-04-17 11:15',
    noNota: 'PLN-20240417-001',
    pembeli: 'Budi Santoso',
    idPelanggan: '12345678901',
    tarifDaya: 'R1/900VA',
    jumlahKwh: '65.2',
    token: '1234 5678 9012 3456 7890',
    nominal: 100000,
    admin: 2500,
    total: 102500
  },
  {
    id: 9,
    type: 'pln-pascabayar',
    tanggal: '2024-04-18 10:15',
    noNota: 'PLN-20240418-001',
    pembeli: 'Gedung Sekolah Utama',
    idPelanggan: '9876543210',
    tarifDaya: 'B2/6600VA',
    bulanTahun: 'APRIL 2024',
    standMeter: '12500-12850',
    tagihan: 850000,
    admin: 3000,
    total: 853000
  },
  {
    id: 10,
    type: 'internet',
    tanggal: '2024-04-19 14:20',
    noNota: 'INT-20240419-001',
    pembeli: 'Laboratorium Komputer',
    idPelanggan: '122333444',
    layanan: 'IndiHome 50Mbps',
    bulanTahun: 'APRIL 2024',
    tagihan: 550000,
    admin: 2500,
    total: 552500
  },
  {
    id: 11,
    type: 'pajak',
    tanggal: '2024-04-20 10:00',
    noNota: 'PJK-20240420-001',
    pembeli: kopSurat.kopBaris3,
    idBilling: '820240401123456',
    nop: '00.123.456.7-890.000',
    namaWp: kopSurat.kopBaris3,
    jenisPajak: 'PPN Dalam Negeri',
    masaPajak: 'Maret 2024',
    total: 1500000
  }
];

const NOTA_TYPES: {id: NotaType, label: string}[] = [
  { id: 'apotek', label: 'Apotek' },
  { id: 'atk', label: 'ATK' },
  { id: 'kertas', label: 'Kertas' },
  { id: 'alat-rumah-tangga', label: 'Rumah Tangga' },
  { id: 'alat-kebersihan', label: 'Kebersihan' },
  { id: 'servis-laptop', label: 'Servis Laptop' },
  { id: 'percetakan', label: 'Percetakan' },
  { id: 'pln-prabayar', label: 'PLN Prabayar' },
  { id: 'pln-pascabayar', label: 'PLN Pascabayar' },
  { id: 'internet', label: 'Internet' },
  { id: 'pajak', label: 'Billing Pajak' }
];

const GENERIC_TYPES = ['apotek', 'atk', 'kertas', 'alat-rumah-tangga', 'alat-kebersihan', 'servis-laptop', 'percetakan'];

const getStoreInfo = (type: string) => {
  switch (type) {
    case 'apotek': return { name: 'APOTEK SEHAT BERSAMA', address: 'Jl. Kesehatan No. 99, Kota Belajar' };
    case 'atk': return { name: 'TOKO ATK MAJU JAYA', address: 'Jl. Pendidikan No. 1, Kota Belajar' };
    case 'kertas': return { name: 'GROSIR KERTAS MULIA', address: 'Jl. Kertas Raya No. 45' };
    case 'alat-rumah-tangga': return { name: 'TOKO PERABOT SENTOSA', address: 'Jl. Rumah Tangga No. 88' };
    case 'alat-kebersihan': return { name: 'CLEAN MART', address: 'Jl. Bersih Indah No. 12' };
    case 'servis-laptop': return { name: 'TECHNO FIX KOMPUTER', address: 'Jl. Teknologi No. 404' };
    case 'percetakan': return { name: 'PERCETAKAN WARNA KILAT', address: 'Jl. Grafika No. 7' };
    case 'pln-prabayar': return { name: 'STRUK TOKEN LISTRIK', address: '' };
    case 'pln-pascabayar': return { name: 'STRUK PEMBAYARAN TAGIHAN LISTRIK', address: '' };
    case 'internet': return { name: 'CV. BERKAH SENTOSA PITALOKA', address: 'BANGODUA CIREBON/F [BGDA]\nBLOK SLADO RT.003 RW.002\nNPWP 63.754.561.7-455.000' };
    case 'pajak': return { name: 'BUKTI PENERIMAAN NEGARA', address: '' };
    default: return { name: 'TOKO SERBA ADA', address: 'Jl. Umum No. 1' };
  }
};

export default function StrukNota() {

  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('strukNotaData');
    if (saved) return JSON.parse(saved);
    return DUMMY_DATA;
  });
  React.useEffect(() => {
    localStorage.setItem('strukNotaData', JSON.stringify(data));
  }, [data]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [entries, setEntries] = useState(10);
  
  const [notaType, setNotaType] = useState<NotaType>('atk');
  const [formData, setFormData] = useState<any>({});
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);

  const filteredData = data.filter(item => {
    const matchesSearch = 
      item.noNota?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.pembeli?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.namaWp?.toLowerCase().includes(searchQuery.toLowerCase());
      
    let matchesMonth = true;
    if (selectedMonth) {
      // item.tanggal format is "YYYY-MM-DD HH:mm"
      matchesMonth = item.tanggal.startsWith(selectedMonth);
    }
    
    return matchesSearch && matchesMonth;
  });

  const handleDeleteClick = (item: any) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };


  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredData.map((item: any) => item.id));
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
      setData(data.filter(item => item.id !== itemToDelete.id));
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const [itemList, setItemList] = useState([
    { id: 1, nama: '', harga: '', qty: '', subtotal: 0, diskonLabel: '', diskonNominal: '' }
  ]);

  const handlePreview = (item: any) => {
    setSelectedData(item);
    setIsPreviewOpen(true);
  };

  const handleDuplicateClick = (item: any) => {
    const newItem = {
      ...item,
      id: Date.now(),
      noNota: `${item.noNota}-COPY`
    };
    setData([newItem, ...data]);
  };

  const addItemRow = () => {
    setItemList([...itemList, { id: Date.now(), nama: '', harga: '', qty: '', subtotal: 0, diskonLabel: '', diskonNominal: '' }]);
  };

  const removeItemRow = (id: number) => {
    if (itemList.length > 1) {
      setItemList(itemList.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: number, field: string, value: string) => {
    setItemList(itemList.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        const harga = parseFloat(updatedItem.harga as string) || 0;
        const qty = parseFloat(updatedItem.qty as string) || 0;
        const diskon = parseFloat(updatedItem.diskonNominal as string) || 0;
        updatedItem.subtotal = (harga * qty) - diskon;
        return updatedItem;
      }
      return item;
    }));
  };

  const calculateTotal = () => {
    return itemList.reduce((total, item) => total + item.subtotal, 0);
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const getFormTotal = () => {
    if (GENERIC_TYPES.includes(notaType)) {
      if (notaType === 'apotek') {
        const subtotal = calculateTotal();
        const ppnRate = formData.ppn !== undefined ? Number(formData.ppn) : 11;
        return subtotal + Math.round(subtotal * (ppnRate / 100));
      }
      return calculateTotal();
    }
    if (notaType === 'pajak') return parseFloat(formData.total || 0);
    
    const tagihan = parseFloat(formData.nominal || formData.tagihan || 0);
    const admin = parseFloat(formData.admin || 0);
    return tagihan + admin;
  };

  const printThermal = () => {
    const printContent = document.getElementById('thermal-receipt');
    if (printContent) {
      const originalContents = document.body.innerHTML;
      const printContainer = document.createElement('div');
      
      const style = document.createElement('style');
      style.innerHTML = `
        @media print {
          @page {
            margin: 0;
            size: 58mm auto;
          }
          body {
            margin: 0;
            padding: 0;
            background: white;
            color: black;
          }
        }
      `;
      
      printContainer.appendChild(style);
      printContainer.innerHTML += printContent.outerHTML;
      
      document.body.innerHTML = printContainer.innerHTML;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload(); 
    }
  };

  const handleSave = () => {
    let newItemData: any = {
      id: Date.now(),
      type: notaType,
      tanggal: formData.tanggal || new Date().toLocaleString('sv-SE').replace(' ', ' ').slice(0, 16),
      noNota: formData.noNota || `${notaType.toUpperCase()}-${Date.now().toString().slice(-6)}`,
      total: getFormTotal(),
      ...formData
    };

    if (GENERIC_TYPES.includes(notaType)) {
      newItemData.items = [...itemList];
      if (notaType === 'apotek') {
        newItemData.dataTambahan = {
          pasien: formData.pasien,
          dokter: formData.dokter,
        };
      }
      if (notaType === 'servis-laptop') {
        newItemData.dataTambahan = {
          perangkat: formData.perangkat,
          keluhan: formData.keluhan,
        };
      }
    }
    setData([newItemData, ...data]);
    setIsModalOpen(false);
  };

  return (
    <div className="w-full h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
            <ReceiptText className="w-6 h-6 text-blue-400" />
            Struk Nota
          </h1>
          <p className="text-slate-400 text-sm mt-1">Cetak struk thermal untuk berbagai keperluan belanja & tagihan.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              setNotaType('atk');
              setFormData({});
              setItemList([{ id: Date.now(), nama: '', harga: '', qty: '', subtotal: 0 }]);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" /> Buat Nota Baru
          </button>
        </div>
      </div>

      {/* Table Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-end gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
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
              placeholder="Cari nota..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>
          <div className="flex items-center bg-white/5 border border-white/10 rounded-lg px-3">
            <Filter className="w-4 h-4 text-slate-400 mr-2" />
            <input 
              type="month" 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent border-none text-sm text-white focus:outline-none py-2"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto bg-white/5 border border-white/10 rounded-2xl custom-scrollbar relative">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="text-xs text-slate-400 uppercase bg-black/20 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-4 font-medium w-12 text-center rounded-tl-2xl">
                <input 
                  type="checkbox" 
                  className="rounded border-slate-600 bg-slate-800" 
                  checked={filteredData.length > 0 && selectedIds.length === filteredData.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="px-6 py-4 font-medium rounded-tl-2xl">Tanggal</th>
              <th className="px-6 py-4 font-medium">No. Nota</th>
              <th className="px-6 py-4 font-medium">Jenis Struk</th>
              <th className="px-6 py-4 font-medium">Keterangan / Tujuan</th>
              <th className="px-6 py-4 font-medium text-right">Total (Rp)</th>
              <th className="px-6 py-4 font-medium text-center rounded-tr-2xl">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {filteredData.slice(0, entries).map((item) => (
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
                  <div className="font-medium text-white">{item.tanggal}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-mono text-blue-400">{item.noNota}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-white/10 text-slate-300 border border-white/10 uppercase">
                    {item.type.replace(/-/g, ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-300">
                  {item.pembeli || item.namaWp}
                </td>
                <td className="px-6 py-4 text-right font-medium text-emerald-400">
                  {item.total.toLocaleString('id-ID')}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => handlePreview(item)}
                      className="p-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors" 
                      title="Lihat / Cetak Thermal"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDuplicateClick(item)}
                      className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-colors" 
                      title="Salin Data"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteClick(item)} className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors" title="Hapus">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Form Create */}
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
              className="bg-[#0f172a] border border-white/10 w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col overflow-hidden relative z-10 max-h-[90vh]"
            >
              <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/10 shrink-0 bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Buat Struk Nota Baru</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Pilih jenis struk dan lengkapi data</p>
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
                <div className="space-y-6">
                  {/* Jenis Struk */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-blue-400 uppercase tracking-wider">Jenis Struk Nota</label>
                    <div className="flex flex-wrap gap-2">
                      {NOTA_TYPES.map(type => (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => {
                            setNotaType(type.id);
                            const storeInfo = getStoreInfo(type.id);
                            setFormData((prev: any) => ({
                              ...prev,
                              namaToko: storeInfo.name,
                              alamatToko: storeInfo.address,
                              ucapanFooter: 'Terima Kasih'
                            }));
                          }}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                            notaType === type.id 
                              ? 'bg-blue-600/20 border-blue-500/50 text-blue-400' 
                              : 'bg-black/20 border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-300'
                          }`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <hr className="border-white/10" />

                  {/* Formulir Dinamis */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-300">Tanggal & Waktu</label>
                      <input type="datetime-local" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-all [color-scheme:dark]" onChange={(e) => handleFormChange('tanggal', e.target.value.replace('T', ' '))} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-300">No. Bukti / Nota</label>
                      <input type="text" placeholder="Kosongkan untuk otomatis" onChange={(e) => handleFormChange('noNota', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-300">Nama Toko (Header)</label>
                      <input type="text" value={formData.namaToko || ''} placeholder="Kosongkan untuk bawaan" onChange={(e) => handleFormChange('namaToko', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-300">Alamat Toko (Header)</label>
                      <input type="text" value={formData.alamatToko || ''} placeholder="Kosongkan untuk bawaan" onChange={(e) => handleFormChange('alamatToko', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-300">Ucapan (Footer)</label>
                      <input type="text" value={formData.ucapanFooter || ''} placeholder="Terima Kasih..." onChange={(e) => handleFormChange('ucapanFooter', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all" />
                    </div>
                  </div>

                  {GENERIC_TYPES.includes(notaType) && (
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-300">Nama Pelanggan / Tujuan</label>
                        <input type="text" placeholder="Nama Pelanggan" onChange={(e) => handleFormChange('pembeli', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all" />
                      </div>
                      
                      {notaType === 'apotek' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-300">Nama Kasir</label>
                            <input type="text" placeholder="Dani" onChange={(e) => handleFormChange('kasir', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-300">Metode Pembayaran</label>
                            <input type="text" placeholder="QRIS" onChange={(e) => handleFormChange('metodeBayar', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-300">PPN (%)</label>
                            <input type="number" placeholder="11" onChange={(e) => handleFormChange('ppn', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-300">Poin Transaksi</label>
                            <input type="text" placeholder="+80 Poin" onChange={(e) => handleFormChange('poinTransaksi', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-300">Total Poin Anda</label>
                            <input type="text" placeholder="1.250 Poin" onChange={(e) => handleFormChange('totalPoin', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all" />
                          </div>
                        </div>
                      )}

                      {notaType === 'servis-laptop' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-300">Unit / Perangkat</label>
                            <input type="text" placeholder="Contoh: Laptop Asus VivoBook" onChange={(e) => handleFormChange('perangkat', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-300">Keluhan / Kerusakan</label>
                            <input type="text" placeholder="Contoh: Mati Total" onChange={(e) => handleFormChange('keluhan', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all" />
                          </div>
                        </div>
                      )}
                      
                      {/* Daftar Item Umum */}
                      <div className="space-y-4 pt-2 border-t border-white/5">
                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                          <h3 className="text-sm font-semibold text-blue-400">Daftar Item</h3>
                          <button type="button" onClick={addItemRow} className="text-xs bg-white/5 hover:bg-white/10 text-white px-3 py-1.5 rounded-lg border border-white/10 flex gap-1.5 transition-colors">
                            <Plus className="w-3.5 h-3.5" /> Tambah Item
                          </button>
                        </div>
                        <div className="space-y-3">
                          {itemList.map((item) => (
                            <div key={item.id} className="flex flex-col bg-white/5 p-3 rounded-lg border border-white/5 gap-3">
                              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                                <div className="w-full sm:w-[40%]">
                                  <input type="text" placeholder="Nama Barang/Jasa" value={item.nama} onChange={(e) => updateItem(item.id, 'nama', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none" />
                                </div>
                                <div className="w-full sm:w-[25%]">
                                  <input type="number" placeholder="Harga" value={item.harga} onChange={(e) => updateItem(item.id, 'harga', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none" />
                                </div>
                                <div className="w-full sm:w-[15%]">
                                  <input type="number" placeholder="Qty" value={item.qty} onChange={(e) => updateItem(item.id, 'qty', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none" />
                                </div>
                                <div className="w-full sm:w-[20%] flex gap-2 items-center">
                                  <div className="w-full bg-black/40 rounded-lg px-3 py-2 text-sm text-emerald-400 overflow-hidden text-ellipsis whitespace-nowrap">{item.subtotal.toLocaleString('id-ID')}</div>
                                  <button type="button" onClick={() => removeItemRow(item.id)} disabled={itemList.length === 1} className="p-2 text-slate-400 hover:text-red-400 disabled:opacity-50 shrink-0"><Trash2 className="w-4 h-4" /></button>
                                </div>
                              </div>
                              {notaType === 'apotek' && (
                                <div className="flex flex-col sm:flex-row gap-3 w-full pl-0 sm:pl-[40%]">
                                  <div className="w-full sm:w-[60%]">
                                    <input type="text" placeholder="Label Diskon (Opsional)" value={item.diskonLabel || ''} onChange={(e) => updateItem(item.id, 'diskonLabel', e.target.value)} className="w-full bg-black/20 border border-emerald-500/30 rounded-lg px-3 py-1.5 text-xs text-emerald-400 focus:border-emerald-500 focus:outline-none" />
                                  </div>
                                  <div className="w-full sm:w-[40%]">
                                    <input type="number" placeholder="Nominal Diskon (Rp)" value={item.diskonNominal || ''} onChange={(e) => updateItem(item.id, 'diskonNominal', e.target.value)} className="w-full bg-black/20 border border-emerald-500/30 rounded-lg px-3 py-1.5 text-xs text-emerald-400 focus:border-emerald-500 focus:outline-none" />
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {(notaType === 'pln-prabayar' || notaType === 'pln-pascabayar' || notaType === 'internet') && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-300">ID Pelanggan / No Meter</label>
                        <input type="text" onChange={(e) => handleFormChange('idPelanggan', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-300">Nama Pelanggan</label>
                        <input type="text" onChange={(e) => handleFormChange('pembeli', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white" />
                      </div>
                      
                      {(notaType === 'pln-prabayar' || notaType === 'pln-pascabayar') && (
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-slate-300">Tarif / Daya</label>
                          <input type="text" placeholder="Contoh: R1/900VA" onChange={(e) => handleFormChange('tarifDaya', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white" />
                        </div>
                      )}
                      
                      {notaType === 'pln-prabayar' && (
                        <>
                          <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-300">Jml KWH</label>
                            <input type="text" onChange={(e) => handleFormChange('jumlahKwh', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white" />
                          </div>
                          <div className="space-y-1.5 sm:col-span-2">
                            <label className="text-sm font-medium text-slate-300">TOKEN Listrik (Stroom)</label>
                            <input type="text" placeholder="XXXX XXXX XXXX XXXX XXXX" onChange={(e) => handleFormChange('token', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white font-mono font-bold tracking-widest text-lg" />
                          </div>
                        </>
                      )}

                      {notaType === 'pln-pascabayar' && (
                        <>
                          <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-300">Bulan Tagihan</label>
                            <input type="text" placeholder="Contoh: APRIL 2024" onChange={(e) => handleFormChange('bulanTahun', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-300">Stand Meter</label>
                            <input type="text" placeholder="Contoh: 10245-10355" onChange={(e) => handleFormChange('standMeter', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white" />
                          </div>
                        </>
                      )}

                      {notaType === 'internet' && (
                        <>
                          <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-300">Layanan</label>
                            <input type="text" placeholder="Contoh: MY REPUBLIC" onChange={(e) => handleFormChange('layanan', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-300">Bulan Tagihan / Periode Bayar</label>
                            <input type="text" placeholder="Contoh: 251207" onChange={(e) => handleFormChange('bulanTahun', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-300">Denda (Rp)</label>
                            <input type="number" onChange={(e) => handleFormChange('denda', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-300">Diskon (Rp)</label>
                            <input type="number" onChange={(e) => handleFormChange('diskon', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-300">No. Handphone</label>
                            <input type="text" onChange={(e) => handleFormChange('noHp', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-300">No. Referensi</label>
                            <input type="text" onChange={(e) => handleFormChange('noReff', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white" />
                          </div>
                        </>
                      )}

                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-300">Tagihan / Nominal (Rp)</label>
                        <input type="number" onChange={(e) => handleFormChange(notaType === 'pln-prabayar' ? 'nominal' : 'tagihan', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-300">Biaya Admin (Rp)</label>
                        <input type="number" onChange={(e) => handleFormChange('admin', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white" />
                      </div>
                    </div>
                  )}

                  {notaType === 'pajak' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-sm font-medium text-slate-300">ID Billing</label>
                        <input type="text" onChange={(e) => handleFormChange('idBilling', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white font-mono text-lg font-semibold tracking-wider" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-300">NOP / NPWP</label>
                        <input type="text" onChange={(e) => handleFormChange('nop', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-300">Nama Wajib Pajak</label>
                        <input type="text" onChange={(e) => handleFormChange('namaWp', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-300">Jenis Pajak</label>
                        <input type="text" placeholder="Contoh: PPN Dalam Negeri" onChange={(e) => handleFormChange('jenisPajak', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-300">Masa Pajak</label>
                        <input type="text" placeholder="Contoh: Maret 2024" onChange={(e) => handleFormChange('masaPajak', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white" />
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-sm font-medium text-slate-300">Jumlah Setor (Rp)</label>
                        <input type="number" onChange={(e) => handleFormChange('total', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white" />
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end pt-4 border-t border-white/10">
                    <div className="bg-black/20 border border-white/10 rounded-lg px-6 py-3 flex items-center gap-4">
                      <span className="text-sm text-slate-400">Total Keseluruhan:</span>
                      <span className="text-xl font-bold text-emerald-400">Rp {getFormTotal().toLocaleString('id-ID')}</span>
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
                  <Save className="w-4 h-4" /> Simpan Nota
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Preview & Print Modal */}
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
              className="bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl flex flex-col relative z-10 w-full max-w-sm"
            >
              <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
                <h2 className="text-base font-semibold text-white">Preview Struk Thermal</h2>
                <button 
                  onClick={() => setIsPreviewOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Thermal Receipt Preview Area */}
              <div className="p-6 bg-slate-900 flex justify-center overflow-y-auto max-h-[60vh] custom-scrollbar">
                <div id="thermal-receipt" className="bg-white text-black p-4 w-[58mm] h-fit min-h-[50mm] font-mono text-xs" style={{ width: '58mm' }}>
                  
                  {/* Header Umum/Generic */}
                  {GENERIC_TYPES.includes(selectedData.type) && selectedData.type !== 'apotek' && (
                    <>
                      {(() => {
                        const store = getStoreInfo(selectedData.type);
                        return (
                          <>
                            <div className="text-center font-bold text-sm mb-1">{selectedData.namaToko || store.name}</div>
                            <div className="text-center text-[10px] mb-3">{selectedData.alamatToko || store.address}</div>
                          </>
                        )
                      })()}
                      <div className="border-b border-dashed border-black mb-2"></div>
                      
                      <div className="flex justify-between text-[10px] mb-1">
                        <span>No: {selectedData.noNota}</span>
                      </div>
                      <div className="flex justify-between text-[10px] mb-1">
                        <span>Tgl: {selectedData.tanggal}</span>
                      </div>
                      <div className="flex justify-between text-[10px] mb-2">
                        <span>Plg: {selectedData.pembeli}</span>
                      </div>
                      
                      {selectedData.type === 'servis-laptop' && selectedData.dataTambahan && (
                        <>
                          {selectedData.dataTambahan.perangkat && (
                            <div className="flex justify-between text-[10px] mb-1">
                              <span>Unit: {selectedData.dataTambahan.perangkat}</span>
                            </div>
                          )}
                          {selectedData.dataTambahan.keluhan && (
                            <div className="flex justify-between text-[10px] mb-2">
                              <span>Keluhan: {selectedData.dataTambahan.keluhan}</span>
                            </div>
                          )}
                        </>
                      )}

                      <div className="border-b border-dashed border-black mb-2"></div>
                      
                      <div className="mb-2 space-y-2">
                        {selectedData.items.map((item: any, idx: number) => (
                          <div key={idx} className="text-[10px]">
                            <div>{item.nama}</div>
                            <div className="flex justify-between">
                              <span>{item.qty} x {item.harga.toLocaleString('id-ID')}</span>
                              <span>{item.subtotal.toLocaleString('id-ID')}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Header Apotek */}
                  {selectedData.type === 'apotek' && (
                    <>
                      <div className="text-center font-bold text-sm">{selectedData.namaToko || 'APOTEK MEDIKA+'}</div>
                      <div className="text-center text-[10px] mb-1">{selectedData.alamatToko || 'Layanan Farmasi Terpadu'}</div>
                      <div className="text-center font-mono text-[10px] mb-2">================================</div>
                      
                      <div className="flex text-[10px] mb-1">
                        <span className="w-[60px]">Nota</span>
                        <span>: {selectedData.noNota}</span>
                      </div>
                      <div className="flex text-[10px] mb-1">
                        <span className="w-[60px]">Waktu</span>
                        <span>: {selectedData.tanggal}</span>
                      </div>
                      <div className="flex text-[10px] mb-1">
                        <span className="w-[60px]">Kasir</span>
                        <span>: {selectedData.kasir || 'Dani'}</span>
                      </div>
                      <div className="flex text-[10px] mb-2">
                        <span className="w-[60px]">Pelg.</span>
                        <span>: {selectedData.pembeli}</span>
                      </div>
                      
                      <div className="border-b border-dashed border-black mb-2"></div>
                      
                      <div className="mb-2 space-y-1">
                        {selectedData.items.map((item: any, idx: number) => (
                          <div key={idx} className="text-[10px]">
                            <div>{item.nama}</div>
                            <div className="flex justify-between">
                              <span>  {item.qty} pcs x {item.harga.toLocaleString('id-ID')}</span>
                              <span>{(item.harga * item.qty).toLocaleString('id-ID')}</span>
                            </div>
                            {item.diskonNominal && (
                              <div className="flex justify-between text-xs">
                                <span>  {item.diskonLabel || 'Diskon'}</span>
                                <span>-{Number(item.diskonNominal).toLocaleString('id-ID')}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="border-b border-dashed border-black mb-2"></div>
                      
                      <div className="text-[10px] mb-2 space-y-1">
                        {(() => {
                          const subtotal = selectedData.items.reduce((acc: number, curr: any) => acc + (curr.harga * curr.qty) - (Number(curr.diskonNominal) || 0), 0);
                          const ppnRate = selectedData.ppn !== undefined ? Number(selectedData.ppn) : 11;
                          const ppn = Math.round(subtotal * (ppnRate / 100));
                          const totalNetto = subtotal + ppn;
                          return (
                            <>
                              <div className="flex justify-between">
                                <span className="w-1/2">Subtotal</span>
                                <span className="w-1/2 text-right">Rp {subtotal.toLocaleString('id-ID')}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="w-1/2">PPN ({ppnRate}%)</span>
                                <span className="w-1/2 text-right">Rp {ppn.toLocaleString('id-ID')}</span>
                              </div>
                              <div className="flex justify-between font-bold">
                                <span className="w-1/2">TOTAL NETTO</span>
                                <span className="w-1/2 text-right">Rp {totalNetto.toLocaleString('id-ID')}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="w-1/2">Bayar ({selectedData.metodeBayar || 'QRIS'})</span>
                                <span className="w-1/2 text-right">Rp {totalNetto.toLocaleString('id-ID')}</span>
                              </div>
                            </>
                          );
                        })()}
                      </div>

                      <div className="border-b border-dashed border-black mb-2"></div>
                      
                      {(selectedData.poinTransaksi || selectedData.totalPoin) && (
                        <>
                          <div className="text-[10px] mb-2 space-y-1">
                            <div className="flex justify-between">
                              <span>Poin Transaksi :</span>
                              <span>{selectedData.poinTransaksi}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Total Poin Anda:</span>
                              <span>{selectedData.totalPoin}</span>
                            </div>
                          </div>
                          <div className="border-b border-dashed border-black mb-2"></div>
                        </>
                      )}
                      
                      <div className="text-center text-[10px] mt-2 mb-2">
                        <div>[ Scan QR untuk E-Resep ]</div>
                        <div className="w-16 h-16 mx-auto my-1 flex items-center justify-center">
                          <QRCode value={selectedData.noNota || 'QR-CODE-NOT-FOUND'} size={64} level="L" />
                        </div>
                      </div>
                      
                      <div className="text-center text-[10px] mb-2">{selectedData.ucapanFooter || 'Kritik/Saran: 0811-999-888'}</div>
                      <div className="text-center font-mono text-[10px]">================================</div>
                    </>
                  )}

                  {/* Header Listrik Prabayar */}
                  {selectedData.type === 'pln-prabayar' && (
                    <>
                      <div className="text-center font-bold text-sm mb-1">{selectedData.namaToko || 'STRUK TOKEN LISTRIK'}</div>
                      {selectedData.alamatToko && <div className="text-center text-[10px] mb-1">{selectedData.alamatToko}</div>}
                      <div className="border-b border-dashed border-black mb-2 mt-2"></div>
                      
                      <div className="flex flex-col text-[10px] mb-2 space-y-1">
                        <div className="flex justify-between"><span>Tgl:</span> <span>{selectedData.tanggal}</span></div>
                        <div className="flex justify-between"><span>No. Meter:</span> <span>{selectedData.idPelanggan}</span></div>
                        <div className="flex justify-between"><span>Nama:</span> <span>{selectedData.pembeli}</span></div>
                        <div className="flex justify-between"><span>Tarif/Daya:</span> <span>{selectedData.tarifDaya}</span></div>
                        <div className="flex justify-between"><span>Nominal:</span> <span>{selectedData.nominal.toLocaleString('id-ID')}</span></div>
                        <div className="flex justify-between"><span>Jml KWH:</span> <span>{selectedData.jumlahKwh}</span></div>
                      </div>
                      
                      <div className="border-b border-dashed border-black mb-2"></div>
                      <div className="text-center font-bold text-xs mb-1">TOKEN LISTRIK:</div>
                      <div className="text-center font-bold text-base mb-2 tracking-widest leading-tight">
                        {selectedData.token}
                      </div>
                      <div className="border-b border-dashed border-black mb-2"></div>
                      
                      <div className="flex flex-col text-[10px] mb-2 space-y-1">
                        <div className="flex justify-between"><span>PPN/Admin:</span> <span>{selectedData.admin.toLocaleString('id-ID')}</span></div>
                      </div>
                    </>
                  )}

                  {/* Header Listrik Pascabayar */}
                  {selectedData.type === 'pln-pascabayar' && (
                    <>
                      <div className="text-center font-bold text-sm mb-1">{selectedData.namaToko || 'STRUK PEMBAYARAN TAGIHAN LISTRIK'}</div>
                      {selectedData.alamatToko && <div className="text-center text-[10px] mb-1">{selectedData.alamatToko}</div>}
                      <div className="border-b border-dashed border-black mb-2 mt-2"></div>
                      
                      <div className="flex flex-col text-[10px] mb-2 space-y-1">
                        <div className="flex justify-between"><span>Tgl:</span> <span>{selectedData.tanggal}</span></div>
                        <div className="flex justify-between"><span>ID Pel:</span> <span>{selectedData.idPelanggan}</span></div>
                        <div className="flex justify-between"><span>Nama:</span> <span>{selectedData.pembeli}</span></div>
                        <div className="flex justify-between"><span>Tarif/Daya:</span> <span>{selectedData.tarifDaya}</span></div>
                        <div className="flex justify-between"><span>BLN/THN:</span> <span>{selectedData.bulanTahun}</span></div>
                        <div className="flex justify-between"><span>Stand Meter:</span> <span>{selectedData.standMeter}</span></div>
                      </div>
                      
                      <div className="border-b border-dashed border-black mb-2"></div>
                      <div className="flex flex-col text-[10px] mb-2 space-y-1">
                        <div className="flex justify-between"><span>Tagihan:</span> <span>{selectedData.tagihan.toLocaleString('id-ID')}</span></div>
                        <div className="flex justify-between"><span>Admin:</span> <span>{selectedData.admin.toLocaleString('id-ID')}</span></div>
                      </div>
                    </>
                  )}

                  {/* Header Internet */}
                  {selectedData.type === 'internet' && (
                    <>
                      <div className="text-center font-mono text-[10px] mb-2 leading-snug whitespace-pre-wrap">
                        <div className="font-bold">{selectedData.namaToko || 'CV. BERKAH SENTOSA PITALOKA'}</div>
                        <div>{selectedData.alamatToko || 'BANGODUA CIREBON/F [BGDA]\nBLOK SLADO RT.003 RW.002\nNPWP 63.754.561.7-455.000'}</div>
                      </div>
                      
                      <div className="border-b border-dashed border-black mb-2"></div>
                      
                      <div className="text-center font-mono font-bold text-[10px] mb-2 uppercase">
                        .,: PEMBAYARAN E-{selectedData.layanan || 'MY REPUBLIC'} :,.
                      </div>

                      <table className="w-full text-[10px] font-mono mb-2">
                        <tbody>
                          <tr>
                            <td className="whitespace-nowrap align-top">TGL TRANS</td>
                            <td className="align-top px-1">:</td>
                            <td className="text-right break-all align-top">{selectedData.tanggal}</td>
                          </tr>
                          <tr>
                            <td className="whitespace-nowrap align-top">ID_TRANSAKSI</td>
                            <td className="align-top px-1">:</td>
                            <td className="text-right break-all align-top">{selectedData.noNota || Math.floor(Math.random() * 1000000000)}</td>
                          </tr>
                          <tr>
                            <td className="whitespace-nowrap align-top">NO REFF</td>
                            <td className="align-top px-1">:</td>
                            <td className="text-right break-all align-top">{selectedData.noReff || '1052980913'}</td>
                          </tr>
                          <tr>
                            <td className="whitespace-nowrap align-top">NO PELANGGAN</td>
                            <td className="align-top px-1">:</td>
                            <td className="text-right break-all align-top">{selectedData.idPelanggan}</td>
                          </tr>
                          <tr>
                            <td className="whitespace-nowrap align-top">NAMA KONSUMEN</td>
                            <td className="align-top px-1">:</td>
                            <td className="text-right break-all align-top">{selectedData.pembeli}</td>
                          </tr>
                          <tr>
                            <td className="whitespace-nowrap align-top">NO. HANDPHONE</td>
                            <td className="align-top px-1">:</td>
                            <td className="text-right break-all align-top">{selectedData.noHp || '-'}</td>
                          </tr>
                          <tr>
                            <td className="whitespace-nowrap align-top">PERIODE BAYAR</td>
                            <td className="align-top px-1">:</td>
                            <td className="text-right break-all align-top">{selectedData.bulanTahun}</td>
                          </tr>
                          <tr>
                            <td className="whitespace-nowrap align-top">TAGIHAN</td>
                            <td className="align-top px-1">:</td>
                            <td className="text-right break-all align-top">Rp.{(Number(selectedData.tagihan) || 0).toLocaleString('id-ID')},-</td>
                          </tr>
                          <tr>
                            <td className="whitespace-nowrap align-top">DENDA</td>
                            <td className="align-top px-1">:</td>
                            <td className="text-right break-all align-top">Rp.{(Number(selectedData.denda) || 0).toLocaleString('id-ID')},-</td>
                          </tr>
                          <tr>
                            <td className="whitespace-nowrap align-top">BIAYA ADMIN</td>
                            <td className="align-top px-1">:</td>
                            <td className="text-right break-all align-top">Rp.{(Number(selectedData.admin) || 0).toLocaleString('id-ID')},-</td>
                          </tr>
                          <tr>
                            <td className="whitespace-nowrap align-top font-bold pt-1 border-t border-dashed border-black/50 mt-1 block w-full" colSpan={3}></td>
                          </tr>
                          <tr>
                            <td className="whitespace-nowrap align-top font-bold">TOTAL BAYAR</td>
                            <td className="align-top px-1 font-bold">:</td>
                            <td className="text-right break-all align-top font-bold">Rp.{(Number(selectedData.total) || 0).toLocaleString('id-ID')},-</td>
                          </tr>
                        </tbody>
                      </table>

                      <div className="text-center font-mono text-[10px] mt-2 mb-1 border-y border-dashed border-black py-1">DETAIL BAYAR</div>
                      
                      <table className="w-full text-[10px] font-mono mb-2">
                        <tbody>
                          <tr>
                            <td className="whitespace-nowrap align-top">TOTAL TAGIHAN</td>
                            <td className="align-top px-1">:</td>
                            <td className="text-right break-all align-top">Rp.{(Number(selectedData.total) || 0).toLocaleString('id-ID')},-</td>
                          </tr>
                          <tr>
                            <td className="whitespace-nowrap align-top">TOTAL DISKON</td>
                            <td className="align-top px-1">:</td>
                            <td className="text-right break-all align-top">Rp.{(Number(selectedData.diskon) || 0).toLocaleString('id-ID')},-</td>
                          </tr>
                          <tr>
                            <td className="whitespace-nowrap align-top">SETELAH DISKON</td>
                            <td className="align-top px-1">:</td>
                            <td className="text-right break-all align-top">Rp.{(Number(selectedData.total) - Number(selectedData.diskon || 0)).toLocaleString('id-ID')},-</td>
                          </tr>
                        </tbody>
                      </table>

                      <div className="border-t border-dashed border-black mb-1"></div>

                      <table className="w-full text-[10px] font-mono mb-2">
                        <tbody>
                          <tr>
                            <td className="whitespace-nowrap align-top">TUNAI</td>
                            <td className="align-top px-1">:</td>
                            <td className="text-right break-all align-top">Rp.{(Number(selectedData.total) - Number(selectedData.diskon || 0)).toLocaleString('id-ID')},-</td>
                          </tr>
                          <tr>
                            <td className="whitespace-nowrap align-top">NON TUNAI/KARTU</td>
                            <td className="align-top px-1">:</td>
                            <td className="text-right break-all align-top">Rp.0,-</td>
                          </tr>
                          <tr>
                            <td className="whitespace-nowrap align-top">VOUCHER</td>
                            <td className="align-top px-1">:</td>
                            <td className="text-right break-all align-top">Rp.0,-</td>
                          </tr>
                        </tbody>
                      </table>

                      <div className="text-center font-mono text-[10px] mt-4 leading-snug">
                        <div>{(selectedData.layanan || 'MYREPUBLIC').toUpperCase()} INDONESIA</div>
                        <div>WWW.{(selectedData.layanan || 'MYREPUBLIC').replace(/\s+/g, '').toUpperCase()}.CO.ID</div>
                      </div>
                    </>
                  )}

                  {/* Header Pajak */}
                  {selectedData.type === 'pajak' && (
                    <>
                      <div className="text-center font-bold text-sm mb-1">{selectedData.namaToko || 'BUKTI PENERIMAAN NEGARA'}</div>
                      {selectedData.alamatToko && <div className="text-center text-[10px] mb-1">{selectedData.alamatToko}</div>}
                      <div className="text-center font-bold text-xs mb-2">BILLING PAJAK</div>
                      <div className="border-b border-dashed border-black mb-2"></div>
                      
                      <div className="flex flex-col text-[10px] mb-2 space-y-1">
                        <div className="flex justify-between"><span>Tgl:</span> <span>{selectedData.tanggal}</span></div>
                        <div className="flex justify-between"><span>ID Billing:</span> <span>{selectedData.idBilling}</span></div>
                        <div className="flex justify-between"><span>NOP/NPWP:</span> <span>{selectedData.nop}</span></div>
                        <div className="flex justify-between"><span>Nama WP:</span> <span>{selectedData.namaWp}</span></div>
                        <div className="flex justify-between"><span>Jenis:</span> <span>{selectedData.jenisPajak}</span></div>
                        <div className="flex justify-between"><span>Masa:</span> <span>{selectedData.masaPajak}</span></div>
                      </div>
                      <div className="border-b border-dashed border-black mb-2"></div>
                      <div className="flex flex-col text-[10px] mb-2 space-y-1">
                        <div className="flex justify-between"><span>Jumlah Setor:</span> <span>{selectedData.total.toLocaleString('id-ID')}</span></div>
                      </div>
                    </>
                  )}

                  {selectedData.type !== 'internet' && selectedData.type !== 'apotek' && (
                    <>
                      <div className="border-b border-dashed border-black mb-2 mt-2"></div>
                      
                      <div className="flex justify-between font-bold text-xs mb-1">
                        <span>TOTAL BAYAR</span>
                        <span>{selectedData.total.toLocaleString('id-ID')}</span>
                      </div>
                      
                      <div className="border-b border-dashed border-black mb-3"></div>
                      
                      <div className="text-center text-[10px]">
                        <p>{selectedData.ucapanFooter || 'Struk ini adalah bukti pembayaran yang sah.'}</p>
                        {!selectedData.ucapanFooter && <p>Terima Kasih</p>}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Print-specific styles that are applied only during print */}
              <style dangerouslySetInnerHTML={{__html: `
                @media print {
                  body * {
                    visibility: hidden;
                  }
                  #thermal-receipt, #thermal-receipt * {
                    visibility: visible;
                    color: black !important;
                    background: white !important;
                  }
                  #thermal-receipt {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 58mm;
                    margin: 0;
                    padding: 10px;
                  }
                  @page {
                    size: 58mm auto;
                    margin: 0;
                  }
                }
              `}} />

              <div className="p-4 border-t border-white/10 bg-white/5 flex gap-3">
                <button 
                  onClick={() => setIsPreviewOpen(false)}
                  className="flex-1 py-2 text-sm font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  Tutup
                </button>
                <button 
                  onClick={printThermal}
                  className="flex-1 flex justify-center items-center gap-2 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/20"
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
                  Apakah Anda yakin ingin menghapus struk nota <span className="text-white font-medium">{itemToDelete?.noNota}</span>? Tindakan ini tidak dapat dibatalkan.
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
