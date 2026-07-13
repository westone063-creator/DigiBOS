import React from "react";
import { useState } from 'react';
import { getKopSurat, getPenandaTangan, getTitimangsa, getLogo } from '../utils/settings';
import { Plus, FileText, Eye, Printer, X, Calendar, Users, Trash2 } from 'lucide-react';

// Types
interface Employee {
  id: string;
  name: string;
  nip: string;
  jabatan: string;
}

interface PiketEntry {
  id: string;
  date: string;
  employeeId: string;
}

interface PiketDoc {
  id: string;
  createdAt: string;
  month: string;
  year: string;
  entries: PiketEntry[];
}

// Sample Data
const SAMPLE_EMPLOYEES: Employee[] = [
  { id: '1', name: 'Budi Santoso, S.Pd', nip: '198001012005011001', jabatan: 'Guru Kelas' },
  { id: '2', name: 'Siti Aminah, M.Pd', nip: '198202022006022002', jabatan: 'Guru Penjas' },
  { id: '3', name: 'Ahmad Yani, S.Kom', nip: '198503032010011003', jabatan: 'Operator Sekolah' },
  { id: '4', name: 'Dewi Lestari, S.Pd', nip: '199004042015022004', jabatan: 'Guru Agama' },
];

const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export default function DaftarHadirPiket() {
  const currentLogo = getLogo();

  const kopSurat = getKopSurat();
  const { namaKepsek: currentNamaKepsek, nipKepsek: currentNipKepsek, jabatanKepsek: currentJabatanKepsek } = getPenandaTangan();
  const currentTitimangsa = getTitimangsa();

          const [activeTab, setActiveTab] = useState<'riwayat' | 'form'>('riwayat');
  const [documents, setDocuments] = useState<PiketDoc[]>([
    {
      id: 'DOC-PKT-001',
      createdAt: '2023-10-01',
      month: 'Oktober',
      year: '2023',
      entries: [
        { id: 'e1', date: '2023-10-02', employeeId: '1' },
        { id: 'e2', date: '2023-10-03', employeeId: '2' },
      ]
    }
  ]);
  const [previewDoc, setPreviewDoc] = useState<PiketDoc | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    month: MONTHS[new Date().getMonth()],
    year: new Date().getFullYear().toString(),
    entries: [{ id: Date.now().toString(), date: '', employeeId: '' }]
  });

  const handleAddEntry = () => {
    setFormData(prev => ({
      ...prev,
      entries: [...prev.entries, { id: Date.now().toString(), date: '', employeeId: '' }]
    }));
  };

  const handleRemoveEntry = (id: string) => {
    setFormData(prev => ({
      ...prev,
      entries: prev.entries.filter(e => e.id !== id)
    }));
  };

  const handleEntryChange = (id: string, field: 'date' | 'employeeId', value: string) => {
    setFormData(prev => ({
      ...prev,
      entries: prev.entries.map(e => e.id === id ? { ...e, [field]: value } : e)
    }));
  };

  const handleSaveDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.month || !formData.year || formData.entries.length === 0) {
      alert("Harap lengkapi bulan, tahun, dan minimal 1 entri jadwal piket.");
      return;
    }
    
    // Validate entries
    const invalidEntries = formData.entries.filter(e => !e.date || !e.employeeId);
    if (invalidEntries.length > 0) {
      alert("Harap lengkapi tanggal dan petugas untuk semua baris jadwal.");
      return;
    }

    const newDoc: PiketDoc = {
      id: `DOC-PKT-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      createdAt: new Date().toISOString().split('T')[0],
      month: formData.month,
      year: formData.year,
      entries: [...formData.entries].sort((a, b) => a.date.localeCompare(b.date)) // Sort by date
    };
    setDocuments([newDoc, ...documents]);
    setActiveTab('riwayat');
    setFormData({ 
      month: MONTHS[new Date().getMonth()], 
      year: new Date().getFullYear().toString(), 
      entries: [{ id: Date.now().toString(), date: '', employeeId: '' }] 
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const getEmployee = (id: string) => SAMPLE_EMPLOYEES.find(e => e.id === id);

  return (
    <div className="w-full h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Jadwal & Daftar Hadir Piket</h1>
          <p className="text-slate-400 text-sm mt-1">Kelola dan cetak jadwal serta kehadiran petugas piket.</p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 w-max">
          <button
            onClick={() => setActiveTab('riwayat')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'riwayat' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            Riwayat Dokumen
          </button>
          <button
            onClick={() => setActiveTab('form')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'form' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            <Plus className="w-4 h-4" />
            Buat Dokumen
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm overflow-hidden flex flex-col">
        {activeTab === 'riwayat' && (
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="grid gap-4">
              {documents.length === 0 ? (
                <div className="text-center text-slate-500 py-10">Belum ada riwayat dokumen piket.</div>
              ) : (
                documents.map(doc => (
                  <div key={doc.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-blue-500/30 transition-colors gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-white font-medium text-lg">Piket Bulan {doc.month} {doc.year}</h3>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2">
                          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Dibuat: {doc.createdAt}</span>
                          <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {doc.entries.length} Jadwal</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setPreviewDoc(doc)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'form' && (
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
            <form onSubmit={handleSaveDoc} className="max-w-4xl mx-auto space-y-8">
              {/* Form Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white border-b border-white/10 pb-2">Periode Piket</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm text-slate-400">Bulan <span className="text-red-400">*</span></label>
                    <select required value={formData.month} onChange={e => setFormData({...formData, month: e.target.value})} className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors">
                      {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm text-slate-400">Tahun <span className="text-red-400">*</span></label>
                    <input type="number" required value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors" />
                  </div>
                </div>
              </div>

              {/* Jadwal & Petugas */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <h3 className="text-lg font-medium text-white">Jadwal & Petugas <span className="text-red-400">*</span></h3>
                  <button type="button" onClick={handleAddEntry} className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
                    <Plus className="w-4 h-4" /> Tambah Baris
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.entries.map((entry, idx) => (
                    <div key={entry.id} className="flex flex-col sm:flex-row items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                      <div className="w-full sm:w-1/3">
                        <label className="text-xs text-slate-500 mb-1 block sm:hidden">Tanggal</label>
                        <input type="date" required value={entry.date} onChange={e => handleEntryChange(entry.id, 'date', e.target.value)} className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors" />
                      </div>
                      <div className="w-full sm:flex-1">
                        <label className="text-xs text-slate-500 mb-1 block sm:hidden">Petugas Piket</label>
                        <select required value={entry.employeeId} onChange={e => handleEntryChange(entry.id, 'employeeId', e.target.value)} className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors">
                          <option value="">-- Pilih Petugas --</option>
                          {SAMPLE_EMPLOYEES.map(emp => (
                            <option key={emp.id} value={emp.id}>{emp.name}</option>
                          ))}
                        </select>
                      </div>
                      <button type="button" onClick={() => handleRemoveEntry(entry.id)} disabled={formData.entries.length === 1} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20">
                  <FileText className="w-4 h-4" />
                  Simpan & Buat Dokumen
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm print:bg-transparent print:p-0 print:backdrop-blur-none">
          <div className="bg-[#f8fafc] w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-900 print:shadow-none print:w-full print:max-w-none print:h-auto print:max-h-none print:rounded-none">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-white print:hidden">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-600" />
                Preview Dokumen
              </h2>
              <div className="flex items-center gap-2">
                <button onClick={() => handlePrint()} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
                  <Printer className="w-4 h-4" /> Cetak / PDF
                </button>
                <button onClick={() => setPreviewDoc(null)} className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Printable Area */}
            <div className="flex-1 overflow-y-auto bg-slate-100 p-4 sm:p-8 custom-scrollbar print:p-0 print:bg-white print:overflow-visible">
              <div className="bg-white mx-auto shadow-sm p-8 sm:p-12 print:shadow-none print:p-0" style={{ maxWidth: '210mm', minHeight: '297mm' }}>
                
                {/* Kop Surat */}
                <div className="flex items-center pb-4">
                  <div className="w-24 flex-shrink-0 flex items-center justify-center">
                     <img src={currentLogo} alt="Logo" className="w-20 h-20 object-contain grayscale" />
                  </div>
                  <div className="flex-1 text-center font-serif text-slate-900">
                    <h1 className="text-[16px] font-normal uppercase tracking-wider leading-snug">{kopSurat.kopBaris1}</h1>
                    <h2 className="text-[18px] font-bold uppercase tracking-wider leading-snug">{kopSurat.kopBaris2}</h2>
                    <h3 className="text-[22px] font-bold uppercase tracking-widest leading-snug">{kopSurat.kopBaris3}</h3>
                    <p className="text-[13px] mt-1.5 leading-tight">{kopSurat.kopBaris4}</p>
                  </div>
                  <div className="w-24 flex-shrink-0"></div>
                </div>
                {/* Garis Kop Surat */}
                <div className="border-b-[3px] border-slate-900 mb-[2px]"></div>
                <div className="border-b border-slate-900 mb-6"></div>

                {/* Judul Dokumen */}
                <div className="text-center mb-6 font-serif">
                  <h4 className="text-xl font-bold uppercase underline">Jadwal dan Daftar Hadir Piket</h4>
                  <p className="mt-1">Bulan: {previewDoc.month} {previewDoc.year}</p>
                </div>

                {/* Tabel Hadir */}
                <table className="w-full border-collapse border border-slate-900 text-sm mb-12 font-serif">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="border border-slate-900 py-3 px-2 w-12">No.</th>
                      <th className="border border-slate-900 py-3 px-4 w-40">Hari, Tanggal</th>
                      <th className="border border-slate-900 py-3 px-4">Nama Petugas / NIP</th>
                      <th className="border border-slate-900 py-3 px-4 w-32">Tanda Tangan Hadir</th>
                      <th className="border border-slate-900 py-3 px-4 w-32">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewDoc.entries.map((entry, idx) => {
                      const emp = getEmployee(entry.employeeId);
                      const entryDate = new Date(entry.date);
                      return (
                        <tr key={entry.id}>
                          <td className="border border-slate-900 py-4 px-2 text-center">{idx + 1}</td>
                          <td className="border border-slate-900 py-4 px-4">
                            {entryDate.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                          </td>
                          <td className="border border-slate-900 py-4 px-4">
                            <div className="font-bold">{emp?.name || '-'}</div>
                            <div>NIP. {emp?.nip || '-'}</div>
                          </td>
                          <td className="border border-slate-900 py-4 px-2 align-top text-center">
                            .................
                          </td>
                          <td className="border border-slate-900 py-4 px-2 align-top">
                            
                          </td>
                        </tr>
                      );
                    })}
                    {previewDoc.entries.length === 0 && (
                      <tr>
                        <td colSpan={5} className="border border-slate-900 py-4 text-center italic text-slate-500">Tidak ada data jadwal piket</td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* Tanda Tangan */}
                <div className="flex justify-end font-serif">
                  <div className="text-center w-64">
                    <p>{currentTitimangsa}, {new Date(previewDoc.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p className="mb-20">{currentJabatanKepsek},</p>
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
