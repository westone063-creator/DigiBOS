import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, Save, Image as ImageIcon } from 'lucide-react';

// Helper to convert DD/MM/YYYY to YYYY-MM-DD for date inputs
const convertToInputDate = (dateStr?: string) => {
  if (!dateStr || dateStr === '-') return '';
  if (dateStr.includes('-')) return dateStr;
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  return '';
};

// Helper to convert YYYY-MM-DD back to DD/MM/YYYY for the data table
const convertToDisplayDate = (dateStr?: string) => {
  if (!dateStr) return '-';
  if (dateStr.includes('-')) {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  }
  return dateStr;
};

export default function FormGuruStaff({ 
  isOpen, 
  onClose, 
  initialData, 
  onSave 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  initialData?: any; 
  onSave: (data: any) => void; 
}) {
  const [foto, setFoto] = useState<string | null>(null);

  // Form States
  const [nama, setNama] = useState('');
  const [nip, setNip] = useState('');
  const [tempatLahir, setTempatLahir] = useState('');
  const [tglLahir, setTglLahir] = useState('');
  const [jk, setJk] = useState('');
  const [agama, setAgama] = useState('');
  const [kawin, setKawin] = useState('');
  const [anak, setAnak] = useState(0);
  const [telp, setTelp] = useState('');
  const [status, setStatus] = useState('');
  const [jabatan, setJabatan] = useState('');
  const [gol, setGol] = useState('');
  const [mulaiKerja, setMulaiKerja] = useState('');
  const [tugas, setTugas] = useState('');
  const [gaji, setGaji] = useState('');
  const [statusAktif, setStatusAktif] = useState('Aktif');
  const [ijazah, setIjazah] = useState('');
  const [tglSk, setTglSk] = useState('');
  const [noSk, setNoSk] = useState('');
  const [jtm, setJtm] = useState(0);
  const [diklat, setDiklat] = useState('');
  
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setNama(initialData.nama || '');
        setNip(initialData.nip || '');
        setTempatLahir(initialData.tempatLahir || '');
        setTglLahir(convertToInputDate(initialData.tglLahir));
        setJk(initialData.jk || '');
        setAgama(initialData.agama || '');
        setKawin(initialData.kawin || '');
        setAnak(initialData.anak !== undefined ? Number(initialData.anak) : 0);
        setTelp(initialData.telp || '');
        setStatus(initialData.status || '');
        setJabatan(initialData.jabatan || '');
        setGol(initialData.gol || '');
        setMulaiKerja(initialData.mulaiKerja || '');
        setTugas(initialData.tugas || '');
        // Clean dots if any
        setGaji(initialData.gaji ? String(initialData.gaji).replace(/\./g, '') : '');
        setStatusAktif(initialData.statusAktif || 'Aktif');
        setIjazah(initialData.ijazah || '');
        setTglSk(convertToInputDate(initialData.tglSk));
        setNoSk(initialData.noSk || '');
        setJtm(initialData.jtm !== undefined ? Number(initialData.jtm) : 0);
        setDiklat(initialData.diklat || '');
        setFoto(initialData.foto || null);
      } else {
        // Reset form for a new entry
        setNama('');
        setNip('');
        setTempatLahir('');
        setTglLahir('');
        setJk('');
        setAgama('');
        setKawin('');
        setAnak(0);
        setTelp('');
        setStatus('');
        setJabatan('');
        setGol('');
        setMulaiKerja('');
        setTugas('');
        setGaji('');
        setStatusAktif('Aktif');
        setIjazah('');
        setTglSk('');
        setNoSk('');
        setJtm(0);
        setDiklat('');
        setFoto(null);
      }
    }
  }, [isOpen, initialData]);

  const handleFileChange = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        setFoto(event.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSaveClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) {
      alert('Nama lengkap wajib diisi.');
      return;
    }

    const formattedItem = {
      nama: nama.trim(),
      nip: nip.trim() || '-',
      tempatLahir: tempatLahir.trim() || '-',
      tglLahir: convertToDisplayDate(tglLahir),
      jk: jk || '-',
      agama: agama || '-',
      kawin: kawin || '-',
      anak: Number(anak) || 0,
      telp: telp.trim() || '-',
      status: status || 'HONORER',
      jabatan: jabatan.trim() || '-',
      gol: gol.trim() || '-',
      mulaiKerja: mulaiKerja || '-',
      tugas: tugas.trim() || '-',
      gaji: gaji ? Number(gaji).toLocaleString('id-ID') : '0',
      statusAktif: statusAktif || 'Aktif',
      ijazah: ijazah.trim() || '-',
      tglSk: convertToDisplayDate(tglSk),
      noSk: noSk.trim() || '-',
      jtm: Number(jtm) || 0,
      diklat: diklat.trim() || '-',
      foto: foto || undefined,
    };

    onSave(formattedItem);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 m-auto w-full max-w-4xl h-[90vh] bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-2xl z-50 flex flex-col rounded-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0 bg-white/5">
              <h2 className="text-xl font-display font-semibold text-white tracking-wide">
                {initialData ? 'Edit Data Pegawai' : 'Tambah Data Pegawai'}
              </h2>
              <button onClick={onClose} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <form onSubmit={handleSaveClick} className="space-y-6">
                
                {/* Upload Foto */}
                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/20 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors relative group w-40 h-40 mx-auto">
                  {foto ? (
                    <div className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-slate-700 shadow-xl">
                      <img src={foto} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Upload className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-slate-400">
                      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-2">
                        <ImageIcon className="w-6 h-6 opacity-60" />
                      </div>
                      <span className="text-xs font-medium">Upload Foto</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                </div>

                {/* Form Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4 col-span-1">
                    <h3 className="text-sm font-semibold text-blue-400 border-b border-white/10 pb-2">Data Personal</h3>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400 ml-1">Nama Lengkap (beserta gelar) *</label>
                      <input 
                        type="text" 
                        required
                        value={nama} 
                        onChange={(e) => setNama(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50" 
                        placeholder="Masukkan nama lengkap" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400 ml-1">NIP / NIGK</label>
                      <input 
                        type="text" 
                        value={nip} 
                        onChange={(e) => setNip(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50" 
                        placeholder="Masukkan NIP / NIGK" 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-400 ml-1">Tempat Lahir</label>
                        <input 
                          type="text" 
                          value={tempatLahir} 
                          onChange={(e) => setTempatLahir(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50" 
                          placeholder="Tempat" 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-400 ml-1">Tgl Lahir</label>
                        <input 
                          type="date" 
                          value={tglLahir} 
                          onChange={(e) => setTglLahir(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 [color-scheme:dark]" 
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400 ml-1">Jenis Kelamin</label>
                      <select 
                        value={jk} 
                        onChange={(e) => setJk(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      >
                        <option className="bg-slate-800" value="">Pilih</option>
                        <option className="bg-slate-800" value="L">Laki-Laki (L)</option>
                        <option className="bg-slate-800" value="P">Perempuan (P)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400 ml-1">Agama</label>
                      <select 
                        value={agama} 
                        onChange={(e) => setAgama(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      >
                        <option className="bg-slate-800" value="">Pilih</option>
                        <option className="bg-slate-800" value="Islam">Islam</option>
                        <option className="bg-slate-800" value="Kristen">Kristen</option>
                        <option className="bg-slate-800" value="Katolik">Katolik</option>
                        <option className="bg-slate-800" value="Hindu">Hindu</option>
                        <option className="bg-slate-800" value="Buddha">Buddha</option>
                        <option className="bg-slate-800" value="Konghucu">Konghucu</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-400 ml-1">Perkawinan</label>
                        <select 
                          value={kawin} 
                          onChange={(e) => setKawin(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        >
                          <option className="bg-slate-800" value="">Pilih</option>
                          <option className="bg-slate-800" value="K">K</option>
                          <option className="bg-slate-800" value="TK">TK</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-400 ml-1">Jml Anak</label>
                        <input 
                          type="number" 
                          min="0" 
                          value={anak} 
                          onChange={(e) => setAnak(Number(e.target.value))}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50" 
                          placeholder="0" 
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400 ml-1">Nomor Telepon</label>
                      <input 
                        type="tel" 
                        value={telp} 
                        onChange={(e) => setTelp(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50" 
                        placeholder="08xxx" 
                      />
                    </div>
                  </div>

                  <div className="space-y-4 col-span-1">
                    <h3 className="text-sm font-semibold text-emerald-400 border-b border-white/10 pb-2">Status & Jabatan</h3>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400 ml-1">Status Kepegawaian</label>
                      <select 
                        value={status} 
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      >
                        <option className="bg-slate-800" value="">Pilih</option>
                        <option className="bg-slate-800" value="PNS">PNS</option>
                        <option className="bg-slate-800" value="PPPK">PPPK</option>
                        <option className="bg-slate-800" value="PPPK PW">PPPK PW</option>
                        <option className="bg-slate-800" value="HONORER">HONORER</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400 ml-1">Jabatan</label>
                      <input 
                        type="text" 
                        value={jabatan} 
                        onChange={(e) => setJabatan(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50" 
                        placeholder="Masukkan jabatan" 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-400 ml-1">Golongan</label>
                        <input 
                          type="text" 
                          value={gol} 
                          onChange={(e) => setGol(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50" 
                          placeholder="Golongan" 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-400 ml-1">Mulai Kerja</label>
                        <input 
                          type="text" 
                          value={mulaiKerja} 
                          onChange={(e) => setMulaiKerja(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50" 
                          placeholder="YYYY" 
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400 ml-1">Tugas Utama/Tambahan</label>
                      <input 
                        type="text" 
                        value={tugas} 
                        onChange={(e) => setTugas(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50" 
                        placeholder="Tugas utama/tambahan" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400 ml-1">Gaji Pokok (Rp)</label>
                      <input 
                        type="text" 
                        value={gaji ? Number(gaji).toLocaleString('id-ID') : ''} 
                        onChange={(e) => {
                          const rawVal = e.target.value.replace(/\./g, '').replace(/\D/g, '');
                          setGaji(rawVal);
                        }}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50" 
                        placeholder="0" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400 ml-1">Status Aktivitas</label>
                      <select 
                        value={statusAktif} 
                        onChange={(e) => setStatusAktif(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      >
                        <option className="bg-slate-800" value="Aktif">Aktif</option>
                        <option className="bg-slate-800" value="Tidak Aktif">Tidak Aktif</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4 col-span-1">
                    <h3 className="text-sm font-semibold text-purple-400 border-b border-white/10 pb-2">Pendidikan & Lainnya</h3>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400 ml-1">Ijazah Terakhir</label>
                      <input 
                        type="text" 
                        value={ijazah} 
                        onChange={(e) => setIjazah(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50" 
                        placeholder="Cth: S1 Pendidikan" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400 ml-1">Tgl SK Terakhir</label>
                      <input 
                        type="date" 
                        value={tglSk} 
                        onChange={(e) => setTglSk(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 [color-scheme:dark]" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400 ml-1">No. SK Terakhir</label>
                      <input 
                        type="text" 
                        value={noSk} 
                        onChange={(e) => setNoSk(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50" 
                        placeholder="Nomor SK" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400 ml-1">Jumlah Jam Tatap Muka (JTM)</label>
                      <input 
                        type="number" 
                        value={jtm} 
                        onChange={(e) => setJtm(Number(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50" 
                        placeholder="0" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400 ml-1">Diklat Terakhir</label>
                      <input 
                        type="text" 
                        value={diklat} 
                        onChange={(e) => setDiklat(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50" 
                        placeholder="Nama diklat" 
                      />
                    </div>
                  </div>
                </div>

                {/* Submit button inside form element */}
                <button type="submit" id="submit-form-btn" className="hidden" />
              </form>
            </div>

            <div className="p-4 border-t border-white/10 flex justify-end gap-3 bg-white/5">
              <button 
                type="button"
                onClick={onClose} 
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium transition-colors"
              >
                Batal
              </button>
              <button 
                type="button"
                onClick={() => {
                  const btn = document.getElementById('submit-form-btn');
                  if (btn) btn.click();
                }}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 border border-blue-500/50 text-white text-sm font-medium shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all"
              >
                <Save className="w-4 h-4" /> Simpan Data
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
