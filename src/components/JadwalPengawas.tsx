import React, { useState } from 'react';
import { Users, Plus, FileText, Search, Edit2, Trash2, X, Printer, Eye } from 'lucide-react';
import { getKopSurat, getPenandaTangan, getTitimangsa, getLogo } from '../utils/settings';

interface JadwalPengawasData {
  id: string;
  hariTanggal: string;
  ruang: string;
  sesi: string;
  waktu: string;
  namaPengawas: string;
  keterangan: string;
}

const SAMPLE_DATA: JadwalPengawasData[] = [
  {
    id: '1',
    hariTanggal: 'Senin, 15 Mei 2024',
    ruang: 'Ruang 1',
    sesi: 'Sesi 1',
    waktu: '08:00 - 09:30',
    namaPengawas: 'Budi Santoso, S.Pd',
    keterangan: 'Pengawas Utama',
  },
  {
    id: '2',
    hariTanggal: 'Senin, 15 Mei 2024',
    ruang: 'Ruang 2',
    sesi: 'Sesi 1',
    waktu: '08:00 - 09:30',
    namaPengawas: 'Siti Aminah, M.Pd',
    keterangan: 'Pengawas Utama',
  },
];

export default function JadwalPengawas() {
  const currentLogo = getLogo();

  const { namaKepsek: currentNamaKepsek, nipKepsek: currentNipKepsek, jabatanKepsek: currentJabatanKepsek } = getPenandaTangan();
  const currentTitimangsa = getTitimangsa();

  const kopSurat = getKopSurat();
          const [activeTab, setActiveTab] = useState<'jadwal' | 'form'>('jadwal');
  
  // Load initial state from localStorage if available
  const [jadwalList, setJadwalList] = useState<JadwalPengawasData[]>(() => {
    const saved = localStorage.getItem('jadwalPengawasList');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return SAMPLE_DATA;
      }
    }
    return SAMPLE_DATA;
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Omit<JadwalPengawasData, 'id'>>(() => {
    const savedDraft = localStorage.getItem('jadwalPengawasDraft');
    if (savedDraft) {
      try {
        return JSON.parse(savedDraft);
      } catch (e) {
        // Ignore error
      }
    }
    return {
      hariTanggal: '',
      ruang: '',
      sesi: '',
      waktu: '',
      namaPengawas: '',
      keterangan: '',
    };
  });

  // Auto save effects
  React.useEffect(() => {
    localStorage.setItem('jadwalPengawasList', JSON.stringify(jadwalList));
  }, [jadwalList]);

  React.useEffect(() => {
    localStorage.setItem('jadwalPengawasDraft', JSON.stringify(formData));
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newJadwal: JadwalPengawasData = {
      ...formData,
      id: Date.now().toString(),
    };
    setJadwalList([...jadwalList, newJadwal]);
    setFormData({ hariTanggal: '', ruang: '', sesi: '', waktu: '', namaPengawas: '', keterangan: '' });
    setActiveTab('jadwal');
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus jadwal ini?')) {
      setJadwalList(jadwalList.filter(item => item.id !== id));
    }
  };

  const filteredJadwal = jadwalList.filter(item => 
    String(item.namaPengawas || "").toLowerCase().includes(String(searchQuery || "").toLowerCase()) ||
    String(item.ruang || "").toLowerCase().includes(String(searchQuery || "").toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
            <Users className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-semibold text-white tracking-wide">Jadwal Pengawas</h1>
            <p className="text-slate-400 text-sm mt-1">Kelola jadwal pengawas ujian</p>
          </div>
        </div>
        
        {activeTab === 'jadwal' && (
          <div className="flex gap-3 w-full sm:w-auto">
            <button 
              onClick={() => setShowPreview(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-700/50 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border border-slate-600/50"
            >
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </button>
            <button 
              onClick={() => setActiveTab('form')}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-purple-900/20"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Pengawas</span>
            </button>
          </div>
        )}
      </div>

      {activeTab === 'jadwal' ? (
        <div className="bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm overflow-hidden flex flex-col">
          <div className="p-4 sm:p-6 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-lg font-medium text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-400" />
              Daftar Jadwal Pengawas
            </h2>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari pengawas, ruang..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700/50 text-white text-sm rounded-xl px-10 py-2.5 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-slate-500"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs uppercase bg-slate-800/50 text-slate-400">
                <tr>
                  <th scope="col" className="px-6 py-4 font-medium">Hari, Tanggal</th>
                  <th scope="col" className="px-6 py-4 font-medium text-center">Ruang / Sesi</th>
                  <th scope="col" className="px-6 py-4 font-medium">Waktu</th>
                  <th scope="col" className="px-6 py-4 font-medium">Nama Pengawas</th>
                  <th scope="col" className="px-6 py-4 font-medium">Keterangan</th>
                  <th scope="col" className="px-6 py-4 font-medium text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredJadwal.length > 0 ? (
                  filteredJadwal.map((item) => (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">{item.hariTanggal}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex flex-col items-center gap-1">
                          <span className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-medium border border-purple-500/20">
                            {item.ruang}
                          </span>
                          <span className="text-xs text-slate-400">{item.sesi}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.waktu}</td>
                      <td className="px-6 py-4 font-medium text-white">{item.namaPengawas}</td>
                      <td className="px-6 py-4">{item.keterangan}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button className="p-1.5 bg-slate-700/50 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors border border-slate-600/50" title="Edit">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors border border-red-500/20" 
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      Tidak ada jadwal pengawas yang ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm overflow-hidden flex flex-col max-w-3xl mx-auto">
          <div className="p-6 border-b border-white/10 flex justify-between items-center">
            <h2 className="text-lg font-medium text-white">Tambah Jadwal Pengawas</h2>
            <button 
              onClick={() => setActiveTab('jadwal')}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-slate-300">Hari, Tanggal</label>
                <input 
                  type="text" 
                  name="hariTanggal"
                  required
                  placeholder="Contoh: Senin, 15 Mei 2024"
                  value={formData.hariTanggal}
                  onChange={handleInputChange}
                  className="w-full bg-slate-800/50 border border-slate-700/50 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-slate-600"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Ruang</label>
                <input 
                  type="text" 
                  name="ruang"
                  required
                  placeholder="Contoh: Ruang 1"
                  value={formData.ruang}
                  onChange={handleInputChange}
                  className="w-full bg-slate-800/50 border border-slate-700/50 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-slate-600"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Sesi</label>
                <input 
                  type="text" 
                  name="sesi"
                  required
                  placeholder="Contoh: Sesi 1"
                  value={formData.sesi}
                  onChange={handleInputChange}
                  className="w-full bg-slate-800/50 border border-slate-700/50 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-slate-600"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Waktu</label>
                <input 
                  type="text" 
                  name="waktu"
                  required
                  placeholder="Contoh: 08:00 - 09:30"
                  value={formData.waktu}
                  onChange={handleInputChange}
                  className="w-full bg-slate-800/50 border border-slate-700/50 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-slate-600"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Keterangan</label>
                <input 
                  type="text" 
                  name="keterangan"
                  placeholder="Contoh: Pengawas Utama"
                  value={formData.keterangan}
                  onChange={handleInputChange}
                  className="w-full bg-slate-800/50 border border-slate-700/50 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-slate-600"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-slate-300">Nama Pengawas</label>
                <input 
                  type="text" 
                  name="namaPengawas"
                  required
                  placeholder="Nama Lengkap Pengawas"
                  value={formData.namaPengawas}
                  onChange={handleInputChange}
                  className="w-full bg-slate-800/50 border border-slate-700/50 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>
            
            <div className="pt-4 flex justify-end gap-3">
              <button 
                type="button"
                onClick={() => setActiveTab('jadwal')}
                className="px-5 py-2.5 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition-colors border border-slate-600/50"
              >
                Batal
              </button>
              <button 
                type="submit"
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-purple-900/20"
              >
                Simpan Jadwal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Preview Modal for Print */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden text-slate-900">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-semibold text-lg">Preview Jadwal Pengawas</h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                >
                  <Printer className="w-4 h-4" />
                  Cetak
                </button>
                <button 
                  onClick={() => setShowPreview(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 print:p-0">
              <div className="max-w-3xl mx-auto space-y-6">
                
                {/* Header Kop Surat */}
                <div className="flex items-center justify-between border-b-2 border-black pb-4 mb-6">
                  <div className="w-20 flex-shrink-0 flex items-center justify-center"><img src={currentLogo} alt="Logo" className="w-20 h-20 object-contain grayscale" /></div>
                  <div className="text-center flex-1">
                    <h1 className="font-bold text-[14pt] uppercase">{kopSurat.kopBaris1}</h1>
                    <h2 className="font-bold text-[14pt] uppercase">{kopSurat.kopBaris2}</h2>
                    <h3 className="font-bold text-[16pt] uppercase">{kopSurat.kopBaris3}</h3>
                    <p className="text-[10pt]">{kopSurat.kopBaris4}</p>
                  </div>
                  <div className="w-20"></div>
                </div>

                <div className="text-center space-y-1 mb-8">
                  <h1 className="text-xl font-bold uppercase underline">JADWAL PENGAWAS UJIAN SEKOLAH</h1>
                  <p className="text-md font-semibold">Tahun Pelajaran 2023/2024</p>
                </div>

                <table className="w-full border-collapse border border-slate-800 text-sm">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="border border-slate-800 p-2 w-12 text-center">No</th>
                      <th className="border border-slate-800 p-2 text-center">Hari, Tanggal</th>
                      <th className="border border-slate-800 p-2 text-center">Ruang</th>
                      <th className="border border-slate-800 p-2 text-center">Sesi</th>
                      <th className="border border-slate-800 p-2 text-center">Waktu</th>
                      <th className="border border-slate-800 p-2 text-center">Nama Pengawas</th>
                      <th className="border border-slate-800 p-2 text-center">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jadwalList.map((item, idx) => (
                      <tr key={item.id}>
                        <td className="border border-slate-800 p-2 text-center">{idx + 1}</td>
                        <td className="border border-slate-800 p-2 text-center">{item.hariTanggal}</td>
                        <td className="border border-slate-800 p-2 text-center">{item.ruang}</td>
                        <td className="border border-slate-800 p-2 text-center">{item.sesi}</td>
                        <td className="border border-slate-800 p-2 text-center">{item.waktu}</td>
                        <td className="border border-slate-800 p-2">{item.namaPengawas}</td>
                        <td className="border border-slate-800 p-2">{item.keterangan}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                <div className="flex justify-end mt-12 pt-8">
                  <div className="text-center w-64">
                    <p>Mengetahui,</p>
                    <p>{currentJabatanKepsek},</p>
                    <br /><br /><br /><br />
                    <p className="font-bold underline">{currentNamaKepsek}</p>
                    <p>NIP. {currentNipKepsek}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
