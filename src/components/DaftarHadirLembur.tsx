import React from "react";
import { useState } from 'react';
import { getKopSurat, getPenandaTangan, getTitimangsa, getLogo } from '../utils/settings';
import { Plus, FileText, Eye, Printer, X, Calendar, Clock, CheckSquare, Search, Users } from 'lucide-react';

// Types
interface Employee {
  id: string;
  name: string;
  nip: string;
  jabatan: string;
}

interface OvertimeDoc {
  id: string;
  createdAt: string;
  date: string;
  timeStart: string;
  timeEnd: string;
  task: string;
  employees: Employee[];
}

// Sample Data
const SAMPLE_EMPLOYEES: Employee[] = [
  { id: '1', name: 'Budi Santoso, S.Pd', nip: '198001012005011001', jabatan: 'Guru Kelas' },
  { id: '2', name: 'Siti Aminah, M.Pd', nip: '198202022006022002', jabatan: 'Guru Penjas' },
  { id: '3', name: 'Ahmad Yani, S.Kom', nip: '198503032010011003', jabatan: 'Operator Sekolah' },
  { id: '4', name: 'Dewi Lestari, S.Pd', nip: '199004042015022004', jabatan: 'Guru Agama' },
];

export default function DaftarHadirLembur() {
  const currentLogo = getLogo();

  const kopSurat = getKopSurat();
  const { namaKepsek: currentNamaKepsek, nipKepsek: currentNipKepsek, jabatanKepsek: currentJabatanKepsek } = getPenandaTangan();
  const currentTitimangsa = getTitimangsa();

          const [activeTab, setActiveTab] = useState<'riwayat' | 'form'>('riwayat');
  const [documents, setDocuments] = useState<OvertimeDoc[]>([
    {
      id: 'DOC-001',
      createdAt: '2023-10-25',
      date: '2023-10-25',
      timeStart: '15:00',
      timeEnd: '18:00',
      task: 'Penyusunan Laporan BOSP Triwulan 3',
      employees: [SAMPLE_EMPLOYEES[0], SAMPLE_EMPLOYEES[2]]
    }
  ]);
  const [previewDoc, setPreviewDoc] = useState<OvertimeDoc | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    date: '',
    timeStart: '',
    timeEnd: '',
    task: '',
    selectedEmployees: [] as string[]
  });

  const handleSaveDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.date || !formData.timeStart || !formData.timeEnd || formData.selectedEmployees.length === 0) {
      alert("Harap lengkapi form dan pilih minimal 1 pegawai.");
      return;
    }
    const newDoc: OvertimeDoc = {
      id: `DOC-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      createdAt: new Date().toISOString().split('T')[0],
      date: formData.date,
      timeStart: formData.timeStart,
      timeEnd: formData.timeEnd,
      task: formData.task,
      employees: SAMPLE_EMPLOYEES.filter(emp => formData.selectedEmployees.includes(emp.id))
    };
    setDocuments([newDoc, ...documents]);
    setActiveTab('riwayat');
    setFormData({ date: '', timeStart: '', timeEnd: '', task: '', selectedEmployees: [] });
  };

  const toggleEmployee = (empId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedEmployees: prev.selectedEmployees.includes(empId)
        ? prev.selectedEmployees.filter(id => id !== empId)
        : [...prev.selectedEmployees, empId]
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Daftar Hadir Lembur Pegawai</h1>
          <p className="text-slate-400 text-sm mt-1">Kelola dan cetak daftar hadir kegiatan lembur pegawai.</p>
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
                <div className="text-center text-slate-500 py-10">Belum ada riwayat dokumen lembur.</div>
              ) : (
                documents.map(doc => (
                  <div key={doc.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-blue-500/30 transition-colors gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-white font-medium text-lg">{doc.task || 'Kegiatan Lembur'}</h3>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2">
                          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {doc.date}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {doc.timeStart} - {doc.timeEnd}</span>
                          <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {doc.employees.length} Pegawai</span>
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
            <form onSubmit={handleSaveDoc} className="max-w-3xl mx-auto space-y-8">
              {/* Form Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white border-b border-white/10 pb-2">Informasi Lembur</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm text-slate-400">Tanggal Pelaksanaan <span className="text-red-400">*</span></label>
                    <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm text-slate-400">Waktu Mulai <span className="text-red-400">*</span></label>
                      <input type="time" required value={formData.timeStart} onChange={e => setFormData({...formData, timeStart: e.target.value})} className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm text-slate-400">Waktu Selesai <span className="text-red-400">*</span></label>
                      <input type="time" required value={formData.timeEnd} onChange={e => setFormData({...formData, timeEnd: e.target.value})} className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors" />
                    </div>
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-sm text-slate-400">Uraian Tugas Lembur</label>
                    <input type="text" placeholder="Misal: Penyusunan laporan BOS..." value={formData.task} onChange={e => setFormData({...formData, task: e.target.value})} className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors" />
                  </div>
                </div>
              </div>

              {/* Pegawai Selection */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <h3 className="text-lg font-medium text-white">Pilih Pegawai Lembur <span className="text-red-400">*</span></h3>
                  <span className="text-sm text-blue-400">{formData.selectedEmployees.length} Terpilih</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SAMPLE_EMPLOYEES.map(emp => (
                    <div 
                      key={emp.id}
                      onClick={() => toggleEmployee(emp.id)}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${formData.selectedEmployees.includes(emp.id) ? 'bg-blue-500/10 border-blue-500/50' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                    >
                      <div className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center shrink-0 border ${formData.selectedEmployees.includes(emp.id) ? 'bg-blue-600 border-blue-600' : 'border-slate-500'}`}>
                        {formData.selectedEmployees.includes(emp.id) && <CheckSquare className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <div>
                        <div className="font-medium text-white text-sm">{emp.name}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{emp.nip}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{emp.jabatan}</div>
                      </div>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm print:bg-transparent print:p-0 print:backdrop-blur-none">
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
                <div className="text-center mb-8 font-serif">
                  <h4 className="text-xl font-bold uppercase underline">Daftar Hadir Lembur Pegawai</h4>
                </div>

                {/* Detail Pelaksanaan */}
                <div className="mb-6 font-serif">
                  <table className="w-full sm:w-2/3">
                    <tbody>
                      <tr>
                        <td className="w-40 py-1">Hari, Tanggal</td>
                        <td className="w-4 py-1">:</td>
                        <td className="py-1 font-semibold">{new Date(previewDoc.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                      </tr>
                      <tr>
                        <td className="py-1">Waktu</td>
                        <td className="py-1">:</td>
                        <td className="py-1">{previewDoc.timeStart} s.d {previewDoc.timeEnd} WIB</td>
                      </tr>
                      <tr>
                        <td className="py-1 align-top">Uraian Tugas</td>
                        <td className="py-1 align-top">:</td>
                        <td className="py-1">{previewDoc.task || '-'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Tabel Hadir */}
                <table className="w-full border-collapse border border-slate-900 text-sm mb-12 font-serif">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="border border-slate-900 py-3 px-2 w-12">No.</th>
                      <th className="border border-slate-900 py-3 px-4">Nama / NIP</th>
                      <th className="border border-slate-900 py-3 px-4">Jabatan</th>
                      <th className="border border-slate-900 py-3 px-4" colSpan={2}>Tanda Tangan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewDoc.employees.map((emp, idx) => (
                      <tr key={emp.id}>
                        <td className="border border-slate-900 py-4 px-2 text-center">{idx + 1}</td>
                        <td className="border border-slate-900 py-4 px-4">
                          <div className="font-bold">{emp.name}</div>
                          <div>NIP. {emp.nip}</div>
                        </td>
                        <td className="border border-slate-900 py-4 px-4 text-center">{emp.jabatan}</td>
                        <td className="border border-slate-900 py-4 px-2 w-24 align-top">
                           {idx % 2 === 0 ? `${idx + 1}. ...................` : ''}
                        </td>
                        <td className="border border-slate-900 py-4 px-2 w-24 align-top">
                           {idx % 2 !== 0 ? `${idx + 1}. ...................` : ''}
                        </td>
                      </tr>
                    ))}
                    {previewDoc.employees.length === 0 && (
                      <tr>
                        <td colSpan={5} className="border border-slate-900 py-4 text-center italic text-slate-500">Tidak ada data pegawai</td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* Tanda Tangan */}
                <div className="flex justify-end font-serif">
                  <div className="text-center w-64">
                    <p>{currentTitimangsa}, {new Date(previewDoc.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
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
