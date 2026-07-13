import React, { useState } from 'react';
import { getKopSurat } from '../utils/settings';
import { Users, Search, Plus, Filter, Download, Edit, Trash2, X, Save, Printer, FileText, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const terbilang = (angka: number): string => {
  const words = [
    '', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'
  ];
  let res = '';
  if (angka < 12) res = words[angka];
  else if (angka < 20) res = terbilang(angka - 10) + ' Belas';
  else if (angka < 100) res = terbilang(Math.floor(angka / 10)) + ' Puluh ' + terbilang(angka % 10);
  else if (angka < 200) res = 'Seratus ' + terbilang(angka - 100);
  else if (angka < 1000) res = terbilang(Math.floor(angka / 100)) + ' Ratus ' + terbilang(angka % 100);
  else if (angka < 2000) res = 'Seribu ' + terbilang(angka - 1000);
  else if (angka < 1000000) res = terbilang(Math.floor(angka / 1000)) + ' Ribu ' + terbilang(angka % 1000);
  else if (angka < 1000000000) res = terbilang(Math.floor(angka / 1000000)) + ' Juta ' + terbilang(angka % 1000000);
  
  return res.trim();
};

const DUMMY_DATA = [
  {
    id: 1,
    tanggal: '2026-07-05',
    noBukti: '900 / 042 / SMKN1 / VII / 2026',
    kodeRekening: '5.1.02.02.01.0013',
    noBku: '001/BKU/2026',
    mataAnggaran: 'Pembayaran Honorarium Pendidik dan Tenaga Kependidkan Non-ASN',
    kegiatan: 'Dana Bantuan Operasional Sekolah (BOS) Reguler Tahun Anggaran 2026',
    periode: 'Juli 2026',
    penerimaList: [
      { id: 1, nama: 'Ahmad Subarjo, S.Pd.', jabatan: 'Guru Honorar Utama', gross: 4000000, pph21: 200000, bersih: 3800000 },
      { id: 2, nama: 'Siti Aminah, S.Si.', jabatan: 'Guru Honorar Utama', gross: 4000000, pph21: 200000, bersih: 3800000 },
      { id: 3, nama: 'Budi Santoso', jabatan: 'Staf Tata Usaha', gross: 3200000, pph21: 160000, bersih: 3040000 },
      { id: 4, nama: 'Dian Lestari, S.Pd.', jabatan: 'Guru Ekstrakurikuler', gross: 2500000, pph21: 125000, bersih: 2375000 },
      { id: 5, nama: 'Eko Prasetyo', jabatan: 'Petugas Keamanan', gross: 3000000, pph21: 150000, bersih: 2850000 },
      { id: 6, nama: 'Rina Wijaya, A.Md.', jabatan: 'Pustakawan Sekolah', gross: 2800000, pph21: 140000, bersih: 2660000 }
    ],
    kepsek: {
      nama: 'Dr. H. Supriyadi, M.Pd.',
      pangkat: 'Pembina Tk. I, IV/b',
      nip: '197405121999031002'
    },
    bendahara: {
      nama: 'Sri Wahyuni, S.E.',
      pangkat: 'Penata, III/c',
      nip: '198208182009042001'
    }
  }
];

export default function TandaTerima() {
  const kopSurat = getKopSurat();
  const liveNamaKepsek = localStorage.getItem('namaKepsek');
  const liveNipKepsek = localStorage.getItem('nipKepsek');
  const livePangkatKepsek = localStorage.getItem('pangkatKepsek');
  const liveNamaBendahara = localStorage.getItem('namaBendahara');
  const liveNipBendahara = localStorage.getItem('nipBendahara');
  const livePangkatBendahara = localStorage.getItem('pangkatBendahara');

  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('tandaTerimaData');
    if (saved) return JSON.parse(saved);
    return DUMMY_DATA;
  });
  React.useEffect(() => {
    localStorage.setItem('tandaTerimaData', JSON.stringify(data));
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
    tanggal: '',
    noBukti: '',
    kodeRekening: '',
    noBku: '',
    mataAnggaran: '',
    kegiatan: 'Dana Bantuan Operasional Sekolah (BOS) Reguler Tahun Anggaran ' + new Date().getFullYear(),
    periode: '',
    kepsekNama: localStorage.getItem('namaKepsek') || 'Dr. H. Supriyadi, M.Pd.',
    kepsekPangkat: localStorage.getItem('pangkatKepsek') || 'Pembina Tk. I, IV/b',
    kepsekNip: localStorage.getItem('nipKepsek') || '197405121999031002',
    bendaharaNama: localStorage.getItem('namaBendahara') || 'Sri Wahyuni, S.E.',
    bendaharaPangkat: localStorage.getItem('pangkatBendahara') || 'Penata, III/c',
    bendaharaNip: localStorage.getItem('nipBendahara') || '198208182009042001'
  };

  const [formData, setFormData] = useState(initialFormState);

  const [sumberData, setSumberData] = useState('manual');
  const [sumberOptions, setSumberOptions] = useState<any[]>([]);
  const [selectedSumberIds, setSelectedSumberIds] = useState<string[]>([]);

  React.useEffect(() => {
    if (sumberData === 'manual') {
      setSumberOptions([]);
      setSelectedSumberIds([]);
      return;
    }

    let dataToLoad = [];
    try {
      if (sumberData === 'bku' || sumberData === 'bku_group') {
        const saved = localStorage.getItem('bkuData');
        if (saved) {
          const rawData = JSON.parse(saved);
          if (sumberData === 'bku_group') {
            const grouped = rawData.reduce((acc: any, curr: any) => {
              const key = curr.noBukti;
              if (!key) return acc;
              if (!acc[key]) {
                acc[key] = {
                   id: key,
                   tanggal: curr.tanggal,
                   noBukti: key,
                   kodeRekening: curr.kodeRekening,
                   belanja: curr.belanja,
                   uraian: curr.uraian,
                   jumlah: Number(curr.jumlah) || 0
                };
              } else {
                acc[key].jumlah += (Number(curr.jumlah) || 0);
                if (curr.uraian && !acc[key].uraian.includes(curr.uraian)) {
                  acc[key].uraian += ', ' + curr.uraian;
                }
              }
              return acc;
            }, {});
            dataToLoad = Object.values(grouped);
          } else {
            dataToLoad = rawData;
          }
        }
      } else if (sumberData === 'bph') {
        const saved = localStorage.getItem('bphData');
        if (saved) dataToLoad = JSON.parse(saved);
      } else if (sumberData === 'belanja') {
        const saved = localStorage.getItem('belanjaData');
        if (saved) dataToLoad = JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load data for', sumberData);
    }
    setSumberOptions(dataToLoad);
    setSelectedSumberIds([]);
  }, [sumberData]);


  const handleToggleSumber = (id: string, checked: boolean) => {
    let newSelected = [...selectedSumberIds];
    if (checked) {
      newSelected.push(String(id));
    } else {
      newSelected = newSelected.filter(s => s !== String(id));
    }
    setSelectedSumberIds(newSelected);

    if (newSelected.length === 0) {
      setFormData(prev => ({ ...prev, kodeRekening: '', noBku: '', mataAnggaran: '' }));
      return;
    }

    let kodeRekList: string[] = [];
    let noBkuList: string[] = [];
    let uraianList: string[] = [];
    let tanggal = '';

    newSelected.forEach(selId => {
      const item = sumberOptions.find((d: any) => String(d.id) === selId);
      if (item) {
        if (!tanggal) tanggal = item.tanggal;
        
        let kodeRek = '';
        let noBku = item.noBku || item.noBukti || '';
        let uraian = item.uraian || item.kegiatan || '';

        if (sumberData === 'bku' || sumberData === 'bku_group' || sumberData === 'bph') {
          kodeRek = item.kodeRekening || item.belanja || '';
        } else if (sumberData === 'belanja') {
          kodeRek = item.kodeRekening || item.belanja || '';
        }

        if (kodeRek && !kodeRekList.includes(kodeRek)) kodeRekList.push(kodeRek);
        if (noBku && !noBkuList.includes(noBku)) noBkuList.push(noBku);
        if (uraian && !uraianList.includes(uraian)) uraianList.push(uraian);
      }
    });

    setFormData(prev => ({
      ...prev,
      tanggal: tanggal || prev.tanggal,
      kodeRekening: kodeRekList.join(', '),
      noBku: noBkuList.join(', '),
      mataAnggaran: uraianList.join(', ')
    }));
  };

  const [penerimaList, setPenerimaList] = useState([
    { id: Date.now(), nama: '', jabatan: '', gross: '', pph21: '', bersih: 0 }
  ]);

  const handleOpenAdd = () => {
    setFormData({
      id: 0,
      tanggal: '',
      noBukti: '',
    kodeRekening: '',
    noBku: '',
      mataAnggaran: '',
      kegiatan: 'Dana Bantuan Operasional Sekolah (BOS) Reguler Tahun Anggaran ' + new Date().getFullYear(),
      periode: '',
      kepsekNama: localStorage.getItem('namaKepsek') || 'Dr. H. Supriyadi, M.Pd.',
      kepsekPangkat: localStorage.getItem('pangkatKepsek') || 'Pembina Tk. I, IV/b',
      kepsekNip: localStorage.getItem('nipKepsek') || '197405121999031002',
      bendaharaNama: localStorage.getItem('namaBendahara') || 'Sri Wahyuni, S.E.',
      bendaharaPangkat: localStorage.getItem('pangkatBendahara') || 'Penata, III/c',
      bendaharaNip: localStorage.getItem('nipBendahara') || '198208182009042001'
    });
    setPenerimaList([{ id: Date.now(), nama: '', jabatan: '', gross: '', pph21: '', bersih: 0 }]);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setFormData({
      id: item.id,
      tanggal: item.tanggal,
      noBukti: item.noBukti,
      mataAnggaran: item.mataAnggaran,
      kegiatan: item.kegiatan,
      periode: item.periode,
      kepsekNama: item.kepsek?.nama || '',
      kepsekPangkat: item.kepsek?.pangkat || '',
      kepsekNip: item.kepsek?.nip || '',
      kodeRekening: item.kodeRekening || '',
      noBku: item.noBku || '',
      bendaharaNama: item.bendahara?.nama || '',
      bendaharaPangkat: item.bendahara?.pangkat || '',
      bendaharaNip: item.bendahara?.nip || ''
    });
    setPenerimaList(item.penerimaList.map((p: any) => ({
      ...p,
      gross: p.gross.toString(),
      pph21: p.pph21.toString(),
      bersih: p.bersih
    })));
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const addPenerimaRow = () => {
    setPenerimaList([...penerimaList, { id: Date.now(), nama: '', jabatan: '', gross: '', pph21: '', bersih: 0 }]);
  };

  const removePenerimaRow = (id: number) => {
    if (penerimaList.length > 1) {
      setPenerimaList(penerimaList.filter(item => item.id !== id));
    }
  };

  const updatePenerimaRow = (id: number, field: string, value: string) => {
    setPenerimaList(penerimaList.map(item => {
      if (item.id === id) {
        const newItem = { ...item, [field]: value };
        if (field === 'gross' || field === 'pph21') {
          const grossNum = Number(newItem.gross) || 0;
          const pph21Num = Number(newItem.pph21) || 0;
          newItem.bersih = grossNum - pph21Num;
        }
        return newItem;
      }
      return item;
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem = {
      ...formData,
      id: isEditing ? formData.id : Date.now(),
      penerimaList: penerimaList.map(p => ({
        ...p,
        gross: Number(p.gross),
        pph21: Number(p.pph21)
      })),
      kepsek: {
        nama: formData.kepsekNama,
        pangkat: formData.kepsekPangkat,
        nip: formData.kepsekNip
      },
      bendahara: {
        nama: formData.bendaharaNama,
        pangkat: formData.bendaharaPangkat,
        nip: formData.bendaharaNip
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

  const calculateTotal = (list: any[], field: string) => {
    return list.reduce((sum, item) => sum + (Number(item[field]) || 0), 0);
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
            <Users className="w-6 h-6 text-blue-400" />
            Tanda Terima Kolektif
          </h1>
          <p className="text-slate-400 text-sm mt-1">Kelola dan cetak tanda terima honorarium kolektif.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" /> Buat Tanda Terima
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
              placeholder="Cari dokumen..." 
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
              <th className="px-6 py-4 font-medium rounded-tl-2xl">Tanggal</th>
              <th className="px-6 py-4 font-medium">No. Bukti</th>
              <th className="px-6 py-4 font-medium">Uraian / Sumber Dana</th>
              <th className="px-6 py-4 font-medium text-center">Penerima</th>
              <th className="px-6 py-4 font-medium text-right">Total (Rp)</th>
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
                <td className="px-6 py-4 text-slate-300">
                  <div className="max-w-md truncate" title={item.kegiatan}>{item.kegiatan}</div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-white/10 text-slate-300 border border-white/10">
                    {item.penerimaList.length} Orang
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-medium text-emerald-400">
                  {calculateTotal(item.penerimaList, 'bersih').toLocaleString('id-ID')}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => handlePreview(item)}
                      className="p-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors" title="Cetak/Lihat"
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
                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                  Belum ada data tanda terima kolektif.
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
              className="bg-[#0f172a] border border-white/10 w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col overflow-hidden relative z-10 max-h-[90vh]"
            >
              <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/10 shrink-0 bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">{isEditing ? 'Edit Tanda Terima Kolektif' : 'Buat Tanda Terima Kolektif'}</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Form input data uraian, sumber dana, dan daftar penerima honorarium</p>
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

                  <div className="bg-slate-800/50 border border-blue-500/30 rounded-xl p-4 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1 space-y-1.5">
                        <label className="text-sm font-medium text-slate-300">Ambil Data Dari</label>
                        <select 
                          value={sumberData} 
                          onChange={(e) => setSumberData(e.target.value)}
                          className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 appearance-none"
                        >
                          <option value="manual">Input Manual</option>
                          <option value="bku">BKU ARKAS</option>
                          <option value="bku_group">BKU ARKAS (Grup No. Bukti)</option>
                          <option value="bph">BPH (Persediaan)</option>
                          <option value="belanja">Belanja Modal</option>
                        </select>
                      </div>
                      
                      {sumberData !== 'manual' && (
                        <div className="flex-1 space-y-1.5">
                          <label className="text-sm font-medium text-slate-300">Pilih Transaksi (Bisa lebih dari satu)</label>
                          <div className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white max-h-48 overflow-y-auto space-y-2 custom-scrollbar">
                            {sumberOptions.length === 0 && <div className="text-slate-400 p-2 text-sm">Tidak ada data</div>}
                            {sumberOptions.map((opt: any) => {
                              const amount = (sumberData === 'bku' || sumberData === 'bku_group') 
                                ? opt.jumlah 
                                : ((Number(opt.jumlahBarang) || 0) * (Number(opt.hargaSatuan) || 0));
                              const isChecked = selectedSumberIds.includes(String(opt.id));
                              return (
                                <label key={opt.id} className="flex items-start gap-3 p-2 hover:bg-white/5 rounded-lg cursor-pointer border border-transparent hover:border-white/5 transition-all">
                                  <input 
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={(e) => handleToggleSumber(String(opt.id), e.target.checked)}
                                    className="mt-1 w-4 h-4 rounded border-slate-600 text-blue-600 focus:ring-blue-500 bg-black/50"
                                  />
                                  <div className="flex-1 min-w-0 text-sm">
                                    <div className="font-medium text-slate-200">
                                      {opt.tanggal} - {opt.uraian?.substring(0, 50) || 'Tanpa Uraian'}{opt.uraian?.length > 50 ? '...' : ''}
                                    </div>
                                    <div className="text-blue-400 font-medium">Rp {amount?.toLocaleString('id-ID')}</div>
                                    {opt.noBukti && <div className="text-slate-500 text-xs mt-0.5">No Bukti: {opt.noBukti}</div>}
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Informasi Dokumen */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider border-b border-white/10 pb-2">Informasi Dokumen</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-300">Tanggal Pencetakan</label>
                        <input type="date" required value={formData.tanggal} onChange={e => setFormData({...formData, tanggal: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-all [color-scheme:dark]" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-300">Nomor Bukti</label>
                        <input type="text" required placeholder="Contoh: 900 / 042 / SMKN1 / VII / 2026" value={formData.noBukti} onChange={e => setFormData({...formData, noBukti: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-300">Kode Rekening</label>
                        <input type="text" required placeholder="Contoh: 5.1.02.02.01.0013" value={formData.kodeRekening} onChange={e => setFormData({...formData, kodeRekening: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-300">No. BKU</label>
                        <input type="text" required placeholder="Contoh: 001/BKU/2026" value={formData.noBku} onChange={e => setFormData({...formData, noBku: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all" />
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-sm font-medium text-slate-300">Uraian</label>
                        <input type="text" required placeholder="Contoh: Pembayaran Honorarium..." value={formData.mataAnggaran} onChange={e => setFormData({...formData, mataAnggaran: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all" />
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-sm font-medium text-slate-300">Sumber Dana</label>
                        <input type="text" required placeholder="Contoh: Dana Bantuan Operasional Sekolah (BOS)..." value={formData.kegiatan} onChange={e => setFormData({...formData, kegiatan: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all" />
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-sm font-medium text-slate-300">Bulan / Periode</label>
                        <input type="text" required placeholder="Contoh: Juli 2026" value={formData.periode} onChange={e => setFormData({...formData, periode: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all" />
                      </div>
                    </div>
                  </div>



                  {/* Daftar Penerima */}
                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">Daftar Penerima</h3>
                      <button 
                        type="button" 
                        onClick={addPenerimaRow}
                        className="text-xs font-medium bg-white/5 hover:bg-white/10 text-white px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-1.5 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" /> Tambah Baris
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {penerimaList.map((item, index) => (
                        <div key={item.id} className="grid grid-cols-12 gap-2 items-center bg-white/5 p-3 rounded-lg border border-white/5 relative group">
                          <div className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-[10px] text-slate-400 z-10">
                            {index + 1}
                          </div>
                          <div className="col-span-12 sm:col-span-3 space-y-1">
                            <label className="text-[10px] text-slate-400 uppercase tracking-wider">Nama</label>
                            <input type="text" required value={item.nama} onChange={e => updatePenerimaRow(item.id, 'nama', e.target.value)} placeholder="Nama Penerima" className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all" />
                          </div>
                          <div className="col-span-12 sm:col-span-3 space-y-1">
                            <label className="text-[10px] text-slate-400 uppercase tracking-wider">Jabatan/Tugas</label>
                            <input type="text" required value={item.jabatan} onChange={e => updatePenerimaRow(item.id, 'jabatan', e.target.value)} placeholder="Jabatan" className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all" />
                          </div>
                          <div className="col-span-12 sm:col-span-2 space-y-1">
                            <label className="text-[10px] text-slate-400 uppercase tracking-wider">Honor Gross</label>
                            <input type="number" required value={item.gross} onChange={e => updatePenerimaRow(item.id, 'gross', e.target.value)} placeholder="Gross (Rp)" className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all" />
                          </div>
                          <div className="col-span-12 sm:col-span-2 space-y-1">
                            <label className="text-[10px] text-slate-400 uppercase tracking-wider">PPH 21</label>
                            <input type="number" value={item.pph21} onChange={e => updatePenerimaRow(item.id, 'pph21', e.target.value)} placeholder="PPH 21 (Rp)" className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all" />
                          </div>
                          <div className="col-span-10 sm:col-span-1 space-y-1">
                            <label className="text-[10px] text-slate-400 uppercase tracking-wider">Bersih</label>
                            <div className="px-1 py-1.5 text-sm font-medium text-emerald-400 truncate">
                              {item.bersih.toLocaleString('id-ID')}
                            </div>
                          </div>
                          <div className="col-span-2 sm:col-span-1 flex items-end justify-end pb-0.5">
                            <button 
                              type="button" 
                              onClick={() => removePenerimaRow(item.id)}
                              disabled={penerimaList.length === 1}
                              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end pt-2">
                      <div className="bg-black/20 border border-white/10 rounded-lg px-4 py-2 flex flex-col items-end gap-1">
                        <div className="flex items-center gap-4 text-xs text-slate-400">
                          <span>Total Gross: Rp {calculateTotal(penerimaList, 'gross').toLocaleString('id-ID')}</span>
                          <span>Total PPH 21: Rp {calculateTotal(penerimaList, 'pph21').toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-medium text-slate-300">Total Diterima Bersih:</span>
                          <span className="text-lg font-bold text-emerald-400">Rp {calculateTotal(penerimaList, 'bersih').toLocaleString('id-ID')}</span>
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
                    <h2 className="text-lg font-semibold text-white">Preview Cetak Tanda Terima</h2>
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
                  <div id="print-document" className="w-full p-[1.5cm] box-border text-[12pt] leading-relaxed bg-white text-black font-serif">
                    
                    {/* Header Kop Surat */}
                    <div className="text-center mb-1 space-y-0">
                      <h1 className="font-bold text-[14pt]">{kopSurat.kopBaris1}</h1>
                      <h2 className="font-bold text-[14pt]">{kopSurat.kopBaris2}</h2>
                      <h3 className="font-bold text-[14pt]">{kopSurat.kopBaris3}</h3>
                      <p className="italic text-[11pt]">{kopSurat.kopBaris4}</p>
                      </div>
                    
                    {/* Double border line */}
                    <div className="w-full border-b-[3px] border-black mt-2 mb-[1px]"></div>
                    <div className="w-full border-b-[1px] border-black mb-6"></div>

                    {/* Judul Surat */}
                    <div className="text-center mb-6">
                      <h3 className="font-bold underline uppercase tracking-wide text-[12pt]">TANDA TERIMA KOLEKTIF HONORARIUM</h3>
                      <p className="text-[12pt]">Nomor: {selectedData.noBukti}</p>
                    </div>

                    {/* Meta Info */}
                    <div className="mb-6 space-y-2">
                      <div className="flex">
                        <div className="w-40 shrink-0">Kode Rekening</div>
                        <div className="w-4">:</div>
                        <div className="flex-1">{selectedData.kodeRekening || '-'}</div>
                      </div>
                      <div className="flex">
                        <div className="w-40 shrink-0">No. BKU</div>
                        <div className="w-4">:</div>
                        <div className="flex-1">{selectedData.noBku || '-'}</div>
                      </div>
                      <div className="flex">
                        <div className="w-40 shrink-0">Uraian</div>
                        <div className="w-4">:</div>
                        <div className="flex-1">{selectedData.mataAnggaran}</div>
                      </div>
                      <div className="flex">
                        <div className="w-40 shrink-0">Sumber Dana</div>
                        <div className="w-4">:</div>
                        <div className="flex-1">{selectedData.kegiatan}</div>
                      </div>
                      <div className="flex">
                        <div className="w-40 shrink-0">Bulan / Periode</div>
                        <div className="w-4">:</div>
                        <div className="flex-1">{selectedData.periode}</div>
                      </div>
                    </div>

                    {/* Table */}
                    <table className="w-full border-collapse border border-black mb-6 text-[11pt]">
                      <thead>
                        <tr className="text-center font-bold">
                          <th className="border border-black py-2 px-2 w-10">NO</th>
                          <th className="border border-black py-2 px-2">NAMA PENERIMA</th>
                          <th className="border border-black py-2 px-2">JABATAN /<br/>TUGAS</th>
                          <th className="border border-black py-2 px-2">HONOR<br/>GROSS<br/>(RP)</th>
                          <th className="border border-black py-2 px-2">PPH 21<br/>(RP)</th>
                          <th className="border border-black py-2 px-2">DITERIMA<br/>BERSIH<br/>(RP)</th>
                          <th className="border border-black py-2 px-2 w-24">TANDA<br/>TANGAN</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedData.penerimaList.map((penerima: any, index: number) => (
                          <tr key={index}>
                            <td className="border border-black py-3 px-2 text-center">{index + 1}.</td>
                            <td className="border border-black py-3 px-2">{penerima.nama}</td>
                            <td className="border border-black py-3 px-2">{penerima.jabatan}</td>
                            <td className="border border-black py-3 px-2 text-right">{penerima.gross.toLocaleString('id-ID')}</td>
                            <td className="border border-black py-3 px-2 text-right">{penerima.pph21.toLocaleString('id-ID')}</td>
                            <td className="border border-black py-3 px-2 text-right">{penerima.bersih.toLocaleString('id-ID')}</td>
                            <td className="border border-black py-3 px-2 text-left relative text-sm">
                              <span className={`absolute top-2 ${index % 2 === 0 ? 'left-2' : 'right-4'}`}>
                                {index + 1}. ......
                              </span>
                            </td>
                          </tr>
                        ))}
                        <tr className="font-bold bg-gray-50/50">
                          <td className="border border-black py-3 px-2 text-center" colSpan={3}>JUMLAH TOTAL</td>
                          <td className="border border-black py-3 px-2 text-right">{calculateTotal(selectedData.penerimaList, 'gross').toLocaleString('id-ID')}</td>
                          <td className="border border-black py-3 px-2 text-right">{calculateTotal(selectedData.penerimaList, 'pph21').toLocaleString('id-ID')}</td>
                          <td className="border border-black py-3 px-2 text-right">{calculateTotal(selectedData.penerimaList, 'bersih').toLocaleString('id-ID')}</td>
                          <td className="border border-black py-3 px-2 bg-white"></td>
                        </tr>
                      </tbody>
                    </table>

                    <div className="mb-12">
                      <p>Terbilang: <span className="italic"># {terbilang(calculateTotal(selectedData.penerimaList, 'bersih'))} Rupiah #</span></p>
                    </div>

                    {/* Signatures */}
                    <div className="flex justify-between items-start mt-8">
                      <div className="text-center w-72">
                        <p>Mengetahui,</p>
                        <p>{localStorage.getItem('jabatanKepsek') || 'Kepala'} {kopSurat?.kopBaris3 || 'SMK Negeri 1 Jakarta'}</p>
                        <div className="h-24"></div>
                        <p className="font-bold underline">{liveNamaKepsek || selectedData.kepsek?.nama}</p>
                        <p>{livePangkatKepsek || selectedData.kepsek?.pangkat}</p>
                        <p>NIP. {liveNipKepsek || selectedData.kepsek?.nip}</p>
                      </div>
                      <div className="text-center w-72">
                        <p>{localStorage.getItem('titimangsa') || 'Jakarta'}, {formatDate(selectedData.tanggal)}</p>
                        <p>Setuju Dibayar,</p>
                        <p>Bendahara Pengeluaran / BOS</p>
                        <div className="h-20"></div>
                        <p className="font-bold underline">{liveNamaBendahara || selectedData.bendahara?.nama}</p>
                        <p>{livePangkatBendahara || selectedData.bendahara?.pangkat}</p>
                        <p>NIP. {liveNipBendahara || selectedData.bendahara?.nip}</p>
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
                <h3 className="text-xl font-semibold text-white text-center mb-2">Hapus Tanda Terima</h3>
                <p className="text-slate-400 text-center text-sm mb-6">
                  Apakah Anda yakin ingin menghapus tanda terima kolektif <span className="text-white font-medium">{itemToDelete?.noBukti}</span>? Tindakan ini tidak dapat dibatalkan.
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
