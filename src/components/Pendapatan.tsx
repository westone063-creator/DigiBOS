import { getProfilSekolah } from '../utils/settings';
import React from "react";
import { useState, useEffect } from 'react';
import { Search, ChevronDown, Filter, FileText, Upload, Edit, Trash2, Plus } from 'lucide-react';
import { PERGESERAN_SAMPLE_ENTRIES } from './Pergeseran';

interface PendapatanEntry {
  id: string;
  no: number;
  uraian: string;
  kas: string;
  tanggal: string;
  noBku: string;
  noBukti: string;
  jumlah: number;
}

export const PENDAPATAN_SAMPLE_ENTRIES: PendapatanEntry[] = [
  {
    id: '1',
    no: 1,
    uraian: 'Terima Dana BOSP Tahap 1',
    kas: 'Kas di Bank',
    tanggal: '2023-03-15',
    noBku: '005/BKU/2023',
    noBukti: 'BKT-005',
    jumlah: 150000000
  },
  {
    id: '2',
    no: 2,
    uraian: 'Tarik Tunai Dana BOSP',
    kas: 'Kas Tunai',
    tanggal: '2023-03-16',
    noBku: '006/BKU/2023',
    noBukti: 'BKT-006',
    jumlah: 25000000
  }
];

export default function Pendapatan() {
  const { kecamatan, namaSekolah } = getProfilSekolah();

  const [entries, setEntries] = useState(10);
  const [pergeseranData, setPergeseranData] = useState<any[]>(() => {
    const saved = localStorage.getItem('pergeseranData');
    if (saved) return JSON.parse(saved);
    return PERGESERAN_SAMPLE_ENTRIES;
  });
  const [data, setData] = useState<PendapatanEntry[]>(() => {
    const saved = localStorage.getItem('pendapatanData');
    if (saved) return JSON.parse(saved);
    return PENDAPATAN_SAMPLE_ENTRIES;
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('pendapatanData', JSON.stringify(data));
  }, [data]);
  
  const [tanggalAwal, setTanggalAwal] = useState('');
  const [tanggalAkhir, setTanggalAkhir] = useState('');

  // Edit State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<PendapatanEntry | null>(null);

  // Add State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEntry, setNewEntry] = useState<Partial<PendapatanEntry>>({
    uraian: '',
    kas: 'Kas di Bank',
    tanggal: '',
    noBku: '',
    noBukti: '',
    jumlah: 0
  });

  // Delete State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);
  
  // Notification State
  const [notification, setNotification] = useState<{show: boolean, message: string}>({show: false, message: ''});

  const showNotification = (message: string) => {
    setNotification({ show: true, message });
    setTimeout(() => {
      setNotification({ show: false, message: '' });
    }, 3000);
  };

  const handleDeleteClick = (id: string) => {
    setEntryToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (entryToDelete) {
      setData(data.filter(item => item.id !== entryToDelete));
      setIsDeleteModalOpen(false);
      setEntryToDelete(null);
      showNotification('Data berhasil dihapus');
    }
  };

  const handleEditClick = (item: PendapatanEntry) => {
    setEditingEntry({ ...item });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEntry) {
      setData(data.map(item => item.id === editingEntry.id ? editingEntry : item));
      setIsEditModalOpen(false);
      setEditingEntry(null);
    }
  };

  const handleAddClick = () => {
    setNewEntry({
      uraian: '',
      kas: 'Kas di Bank',
      tanggal: '',
      noBku: '',
      noBukti: '',
      jumlah: 0
    });
    setIsAddModalOpen(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = Math.random().toString(36).substr(2, 9);
    const entry: PendapatanEntry = {
      id: newId,
      no: data.length + 1,
      uraian: newEntry.uraian || '',
      kas: newEntry.kas || 'Kas di Bank',
      tanggal: newEntry.tanggal || '',
      noBku: newEntry.noBku || '',
      noBukti: newEntry.noBukti || '',
      jumlah: newEntry.jumlah || 0
    };
    setData([...data, entry]);
    setIsAddModalOpen(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  const filteredData = data.filter(item => {
    if (!tanggalAwal && !tanggalAkhir) return true;
    const itemDate = new Date(item.tanggal);
    if (tanggalAwal && new Date(tanggalAwal) > itemDate) return false;
    if (tanggalAkhir && new Date(tanggalAkhir) < itemDate) return false;
    return true;
  });

  const filteredPergeseranData = pergeseranData.filter(item => {
    if (!tanggalAwal && !tanggalAkhir) return true;
    const itemDate = new Date(item.tanggal);
    if (tanggalAwal && new Date(tanggalAwal) > itemDate) return false;
    if (tanggalAkhir && new Date(tanggalAkhir) < itemDate) return false;
    return true;
  });

  const overallBank = data.reduce((acc, curr) => acc + curr.jumlah, 0);
  const overallTunai = pergeseranData.reduce((acc, curr) => acc + curr.jumlah, 0);
  
  const perTanggalBank = filteredData.reduce((acc, curr) => acc + curr.jumlah, 0);
  const perTanggalTunai = filteredPergeseranData.reduce((acc, curr) => acc + curr.jumlah, 0);

  return (
    <div className="w-full space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-white">Pendapatan</h1>
        <p className="text-slate-400 text-sm mt-1">Kelola data pendapatan BOSP reguler</p>
      </div>

      {/* Filter Section */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300">Sumber Dana</label>
            <select className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors">
              <option>BOSP Reguler</option>
              <option>BOSP Kinerja</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300">Jenis Kas</label>
            <select className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors">
              <option>Semua Jenis Kas</option>
              <option>Kas di Bank</option>
              <option>Kas Tunai</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300">Tanggal Awal</label>
            <input type="date" value={tanggalAwal} onChange={(e) => setTanggalAwal(e.target.value)} className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300">Tanggal Akhir</label>
            <input type="date" value={tanggalAkhir} onChange={(e) => setTanggalAkhir(e.target.value)} className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300">Kecamatan</label>
            <input type="text" value={kecamatan} disabled className="w-full bg-slate-900/30 border border-white/5 rounded-lg px-4 py-2.5 text-slate-400 cursor-not-allowed" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300">Sekolah</label>
            <input type="text" value={namaSekolah} disabled className="w-full bg-slate-900/30 border border-white/5 rounded-lg px-4 py-2.5 text-slate-400 cursor-not-allowed" />
          </div>
        </div>
      </div>

      {/* Summary Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Keseluruhan */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-white mb-4 border-b border-white/10 pb-2">KESELURUHAN</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white/5 text-slate-300 border-b border-white/10">
                  <th className="py-3 px-4 text-left font-medium">KAS DI BANK</th>
                  <th className="py-3 px-4 text-left font-medium">KAS TUNAI</th>
                  <th className="py-3 px-4 text-right font-medium">JUMLAH</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-white font-medium">
                  <td className="py-4 px-4">{formatCurrency(overallBank)}</td>
                  <td className="py-4 px-4">{formatCurrency(overallTunai)}</td>
                  <td className="py-4 px-4 text-right text-blue-400">{formatCurrency(overallBank - overallTunai)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Per Tanggal */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-white mb-4 border-b border-white/10 pb-2">PER TANGGAL</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white/5 text-slate-300 border-b border-white/10">
                  <th className="py-3 px-4 text-left font-medium">KAS DI BANK</th>
                  <th className="py-3 px-4 text-left font-medium">KAS TUNAI</th>
                  <th className="py-3 px-4 text-right font-medium">JUMLAH</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-white font-medium">
                  <td className="py-4 px-4">{formatCurrency(perTanggalBank)}</td>
                  <td className="py-4 px-4">{formatCurrency(perTanggalTunai)}</td>
                  <td className="py-4 px-4 text-right text-indigo-400">{formatCurrency(perTanggalBank - perTanggalTunai)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Main Table Section */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row justify-between items-end mb-6 gap-4">
          <div className="flex flex-col gap-3">
            <button onClick={handleAddClick} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 text-xs shadow-sm w-max">
              <Plus className="w-3.5 h-3.5" />
              Tambah
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">Show</span>
              <select 
                value={entries} 
                onChange={(e) => setEntries(Number(e.target.value))}
                className="bg-slate-900/50 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-blue-500"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              <option value={250}>250</option>
              <option value={500}>500</option>
              <option value={1000}>1000</option>
              <option value={5000}>Semua</option>
              </select>
              <span className="text-sm text-slate-400">entries</span>
            </div>
          </div>
          <div className="flex relative w-full sm:w-64">
             <input 
               type="text" 
               placeholder="Cari data..." 
               className="w-full bg-slate-900/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
             />
             <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-400 uppercase bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-4 py-4 w-12 text-center">
                  <input type="checkbox" className="rounded border-slate-600 bg-slate-900 text-blue-500 focus:ring-blue-500" />
                </th>
                <th className="px-4 py-4 font-medium">No.</th>
                <th className="px-4 py-4 font-medium min-w-[200px]">Uraian Pendapatan</th>
                <th className="px-4 py-4 font-medium">Jenis Kas</th>
                <th className="px-4 py-4 font-medium">Tanggal</th>
                <th className="px-4 py-4 font-medium">No. BKU</th>
                <th className="px-4 py-4 font-medium">No. Bukti</th>
                <th className="px-4 py-4 font-medium text-right">Jumlah Pendapatan</th>
                <th className="px-4 py-4 font-medium text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {data.map((item, index) => (
                <tr key={item.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 text-center">
                    <input type="checkbox" className="rounded border-slate-600 bg-slate-900 text-blue-500 focus:ring-blue-500" />
                  </td>
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 font-medium text-white">{item.uraian}</td>
                  <td className="px-4 py-3">{item.kas}</td>
                  <td className="px-4 py-3">{item.tanggal}</td>
                  <td className="px-4 py-3">{item.noBku}</td>
                  <td className="px-4 py-3">{item.noBukti}</td>
                  <td className="px-4 py-3 text-right font-medium text-blue-400">{formatCurrency(item.jumlah)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => handleEditClick(item)} className="p-1.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-md transition-colors" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteClick(item.id)} className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-md transition-colors" title="Hapus">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-slate-500">
                    Tidak ada data pendapatan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 text-sm text-slate-400">
          <div>Showing 1 to {Math.min(entries, data.length)} of {data.length} entries</div>
          <div className="flex items-center gap-1 mt-4 sm:mt-0">
            <button className="px-3 py-1 rounded border border-white/10 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
            <button className="px-3 py-1 rounded bg-blue-600 text-white font-medium">1</button>
            <button className="px-3 py-1 rounded border border-white/10 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && editingEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
              <h2 className="font-semibold text-lg text-white">Edit Pendapatan</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <span className="sr-only">Close</span>
                &times;
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm text-slate-300">Uraian Pendapatan</label>
                <input type="text" required value={editingEntry.uraian} onChange={e => setEditingEntry({...editingEntry, uraian: e.target.value})} className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm text-slate-300">Jenis Kas</label>
                  <select required value={editingEntry.kas} onChange={e => setEditingEntry({...editingEntry, kas: e.target.value})} className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500">
                    <option>Kas di Bank</option>
                    <option>Kas Tunai</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm text-slate-300">Tanggal</label>
                  <input type="date" required value={editingEntry.tanggal} onChange={e => setEditingEntry({...editingEntry, tanggal: e.target.value})} className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm text-slate-300">No. BKU</label>
                  <input type="text" required value={editingEntry.noBku} onChange={e => setEditingEntry({...editingEntry, noBku: e.target.value})} className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm text-slate-300">No. Bukti</label>
                  <input type="text" required value={editingEntry.noBukti} onChange={e => setEditingEntry({...editingEntry, noBukti: e.target.value})} className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div className="space-y-1.5 col-span-2">
                  <label className="text-sm text-slate-300">Jumlah Pendapatan</label>
                  <input type="number" required value={editingEntry.jumlah} onChange={e => setEditingEntry({...editingEntry, jumlah: Number(e.target.value)})} className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 text-slate-300 hover:text-white transition-colors">Batal</button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">Simpan Perubahan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
              <h2 className="font-semibold text-lg text-white">Tambah Pendapatan</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <span className="sr-only">Close</span>
                &times;
              </button>
            </div>
            <form onSubmit={handleSaveAdd} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm text-slate-300">Uraian Pendapatan</label>
                <input type="text" required value={newEntry.uraian} onChange={e => setNewEntry({...newEntry, uraian: e.target.value})} className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm text-slate-300">Jenis Kas</label>
                  <select required value={newEntry.kas} onChange={e => setNewEntry({...newEntry, kas: e.target.value})} className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500">
                    <option>Kas di Bank</option>
                    <option>Kas Tunai</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm text-slate-300">Tanggal</label>
                  <input type="date" required value={newEntry.tanggal} onChange={e => setNewEntry({...newEntry, tanggal: e.target.value})} className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm text-slate-300">No. BKU</label>
                  <input type="text" required value={newEntry.noBku} onChange={e => setNewEntry({...newEntry, noBku: e.target.value})} className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm text-slate-300">No. Bukti</label>
                  <input type="text" required value={newEntry.noBukti} onChange={e => setNewEntry({...newEntry, noBukti: e.target.value})} className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div className="space-y-1.5 col-span-2">
                  <label className="text-sm text-slate-300">Jumlah Pendapatan</label>
                  <input type="number" required value={newEntry.jumlah} onChange={e => setNewEntry({...newEntry, jumlah: Number(e.target.value)})} className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-slate-300 hover:text-white transition-colors">Batal</button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">Simpan Data</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-xl font-bold text-white">Hapus Data?</h2>
              <p className="text-slate-400 text-sm">Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.</p>
              <div className="flex justify-center gap-3 pt-4">
                <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 text-slate-300 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-lg font-medium">Batal</button>
                <button onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">Ya, Hapus</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification.show && (
        <div className="fixed bottom-4 right-4 z-50 bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="font-medium">{notification.message}</span>
        </div>
      )}
    </div>
  );
}
