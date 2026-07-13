import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Printer, User, Briefcase, GraduationCap, Users } from 'lucide-react';

interface DetailBukuIndukProps {
  employee: any;
  onBack: () => void;
}

export default function DetailBukuInduk({ employee, onBack }: DetailBukuIndukProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Kembali ke Daftar</span>
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={handlePrint}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl backdrop-blur-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium hover:bg-indigo-500/20 transition-all shadow-sm"
          >
            <Printer className="w-4 h-4" /> <span className="hidden sm:inline">Cetak Dokumen</span>
          </button>
        </div>
      </div>

      {/* Printable Area */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden p-6 md:p-10 shadow-2xl relative print:bg-transparent print:border-none print:shadow-none print:p-0">
        {/* Printable content wrapper */}
        <div className="print:text-black print:bg-white max-w-4xl mx-auto text-slate-200 space-y-10">
          
          {/* Document Header */}
          <div className="text-center space-y-2 border-b border-white/10 print:border-black/20 pb-8 relative">
            <h1 className="text-2xl print:text-3xl font-display font-bold text-white print:text-black uppercase tracking-widest">
              Lembar Buku Induk Pegawai
            </h1>
            <p className="text-sm print:text-base text-slate-400 print:text-slate-600">
              Dokumen Catatan Induk Pendidik dan Tenaga Kependidikan
            </p>
            <div className="absolute right-0 top-0 w-24 h-32 border border-white/20 print:border-black/20 flex flex-col items-center justify-center rounded bg-white/5 print:bg-transparent">
              <span className="text-xs text-slate-500 print:text-slate-400">Pas Foto 3x4</span>
            </div>
          </div>

          {/* Section 1: Identitas Pribadi */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-indigo-400 print:text-black pb-2 border-b border-white/10 print:border-black/10">
              <User className="w-5 h-5 print:hidden" />
              <h2 className="text-lg font-bold font-display uppercase tracking-wide">A. Identitas Pribadi</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm print:text-sm">
              <div className="grid grid-cols-[140px_10px_1fr] print:grid-cols-[160px_10px_1fr] items-start">
                <span className="text-slate-400 print:text-slate-700">Nama Lengkap</span>
                <span>:</span>
                <span className="font-semibold text-white print:text-black">{employee.nama}</span>
              </div>
              <div className="grid grid-cols-[140px_10px_1fr] print:grid-cols-[160px_10px_1fr] items-start">
                <span className="text-slate-400 print:text-slate-700">NIP / NIGK</span>
                <span>:</span>
                <span className="font-mono text-white print:text-black">{employee.nip}</span>
              </div>
              <div className="grid grid-cols-[140px_10px_1fr] print:grid-cols-[160px_10px_1fr] items-start">
                <span className="text-slate-400 print:text-slate-700">Tempat, Tanggal Lahir</span>
                <span>:</span>
                <span className="text-white print:text-black">{employee.tempatLahir}, {employee.tglLahir}</span>
              </div>
              <div className="grid grid-cols-[140px_10px_1fr] print:grid-cols-[160px_10px_1fr] items-start">
                <span className="text-slate-400 print:text-slate-700">Jenis Kelamin</span>
                <span>:</span>
                <span className="text-white print:text-black">{employee.jk === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
              </div>
              <div className="grid grid-cols-[140px_10px_1fr] print:grid-cols-[160px_10px_1fr] items-start">
                <span className="text-slate-400 print:text-slate-700">Agama</span>
                <span>:</span>
                <span className="text-white print:text-black">{employee.agama}</span>
              </div>
              <div className="grid grid-cols-[140px_10px_1fr] print:grid-cols-[160px_10px_1fr] items-start">
                <span className="text-slate-400 print:text-slate-700">NUPTK</span>
                <span>:</span>
                <span className="font-mono text-white print:text-black">{employee.nuptk || '-'}</span>
              </div>
              <div className="grid grid-cols-[140px_10px_1fr] print:grid-cols-[160px_10px_1fr] items-start md:col-span-2">
                <span className="text-slate-400 print:text-slate-700">Alamat Lengkap</span>
                <span>:</span>
                <span className="text-white print:text-black">{employee.alamat || '-'}</span>
              </div>
              <div className="grid grid-cols-[140px_10px_1fr] print:grid-cols-[160px_10px_1fr] items-start">
                <span className="text-slate-400 print:text-slate-700">Nomor Telepon/HP</span>
                <span>:</span>
                <span className="text-white print:text-black">{employee.telp}</span>
              </div>
              <div className="grid grid-cols-[140px_10px_1fr] print:grid-cols-[160px_10px_1fr] items-start">
                <span className="text-slate-400 print:text-slate-700">Email</span>
                <span>:</span>
                <span className="text-white print:text-black">{employee.email || '-'}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Kedudukan / Jabatan */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-indigo-400 print:text-black pb-2 border-b border-white/10 print:border-black/10">
              <Briefcase className="w-5 h-5 print:hidden" />
              <h2 className="text-lg font-bold font-display uppercase tracking-wide">B. Status Kepegawaian & Jabatan</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm print:text-sm">
              <div className="grid grid-cols-[140px_10px_1fr] print:grid-cols-[160px_10px_1fr] items-start">
                <span className="text-slate-400 print:text-slate-700">Status Kepegawaian</span>
                <span>:</span>
                <span className="font-semibold text-white print:text-black">{employee.status}</span>
              </div>
              <div className="grid grid-cols-[140px_10px_1fr] print:grid-cols-[160px_10px_1fr] items-start">
                <span className="text-slate-400 print:text-slate-700">Pangkat / Golongan</span>
                <span>:</span>
                <span className="text-white print:text-black">{employee.gol}</span>
              </div>
              <div className="grid grid-cols-[140px_10px_1fr] print:grid-cols-[160px_10px_1fr] items-start">
                <span className="text-slate-400 print:text-slate-700">Jabatan</span>
                <span>:</span>
                <span className="text-white print:text-black">{employee.jabatan}</span>
              </div>
              <div className="grid grid-cols-[140px_10px_1fr] print:grid-cols-[160px_10px_1fr] items-start">
                <span className="text-slate-400 print:text-slate-700">Tugas Tambahan</span>
                <span>:</span>
                <span className="text-white print:text-black">{employee.tugas || '-'}</span>
              </div>
            </div>
          </div>

          {/* Section 3: Riwayat Pendidikan */}
          {employee.pendidikan && employee.pendidikan.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-indigo-400 print:text-black pb-2 border-b border-white/10 print:border-black/10">
                <GraduationCap className="w-5 h-5 print:hidden" />
                <h2 className="text-lg font-bold font-display uppercase tracking-wide">C. Riwayat Pendidikan</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm print:text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 print:border-black/20 text-slate-400 print:text-slate-700">
                      <th className="pb-2 font-medium">Tingkat</th>
                      <th className="pb-2 font-medium">Instansi Pendidikan</th>
                      <th className="pb-2 font-medium">Jurusan</th>
                      <th className="pb-2 font-medium text-center">Tahun Lulus</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 print:divide-black/10">
                    {employee.pendidikan.map((pend: any, idx: number) => (
                      <tr key={idx}>
                        <td className="py-2 text-white print:text-black">{pend.tingkat}</td>
                        <td className="py-2 text-white print:text-black">{pend.instansi}</td>
                        <td className="py-2 text-white print:text-black">{pend.jurusan}</td>
                        <td className="py-2 text-white print:text-black text-center">{pend.tahun}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Section 4: Data Keluarga */}
          {employee.keluarga && employee.keluarga.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-indigo-400 print:text-black pb-2 border-b border-white/10 print:border-black/10">
                <Users className="w-5 h-5 print:hidden" />
                <h2 className="text-lg font-bold font-display uppercase tracking-wide">D. Susunan Keluarga</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm print:text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 print:border-black/20 text-slate-400 print:text-slate-700">
                      <th className="pb-2 font-medium">Nama Anggota Keluarga</th>
                      <th className="pb-2 font-medium">Hubungan</th>
                      <th className="pb-2 font-medium text-center">L/P</th>
                      <th className="pb-2 font-medium">Pekerjaan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 print:divide-black/10">
                    {employee.keluarga.map((kel: any, idx: number) => (
                      <tr key={idx}>
                        <td className="py-2 text-white print:text-black">{kel.nama}</td>
                        <td className="py-2 text-white print:text-black">{kel.hubungan}</td>
                        <td className="py-2 text-white print:text-black text-center">{kel.jk}</td>
                        <td className="py-2 text-white print:text-black">{kel.pekerjaan}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Additional space for printing structure */}
          <div className="pt-16 print:pt-32 pb-8">
            <div className="grid grid-cols-2 gap-8 text-sm print:text-sm">
              <div className="text-center space-y-16">
                <p>Mengetahui,</p>
                <p>Kepala Sekolah</p>
                <div>
                  <p className="font-bold underline text-white print:text-black">NAMA KEPALA SEKOLAH</p>
                  <p className="text-slate-400 print:text-slate-700">NIP. .........................</p>
                </div>
              </div>
              <div className="text-center space-y-16">
                <p>Tempat, ........................ 20...</p>
                <p>Pegawai yang bersangkutan</p>
                <div>
                  <p className="font-bold underline text-white print:text-black">{employee.nama}</p>
                  <p className="text-slate-400 print:text-slate-700">NIP. {employee.nip || '.........................'}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
