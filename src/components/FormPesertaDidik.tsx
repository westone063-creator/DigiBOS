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

export default function FormPesertaDidik({ 
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
  const [nipd, setNipd] = useState('');
  const [nisn, setNisn] = useState('');
  const [nik, setNik] = useState('');
  const [jk, setJk] = useState('');
  const [agama, setAgama] = useState('');
  const [tempatLahir, setTempatLahir] = useState('');
  const [tglLahir, setTglLahir] = useState('');
  const [rombel, setRombel] = useState('');
  const [status, setStatus] = useState('');
  
  const [alamat, setAlamat] = useState('');
  const [rt, setRt] = useState('');
  const [rw, setRw] = useState('');
  const [dusun, setDusun] = useState('');
  const [kelurahan, setKelurahan] = useState('');
  const [kecamatan, setKecamatan] = useState('');
  const [kodePos, setKodePos] = useState('');
  
  const [namaAyah, setNamaAyah] = useState('');
  const [nikAyah, setNikAyah] = useState('');
  const [tahunLahirAyah, setTahunLahirAyah] = useState('');
  const [pekerjaanAyah, setPekerjaanAyah] = useState('');
  
  const [namaIbu, setNamaIbu] = useState('');
  const [nikIbu, setNikIbu] = useState('');
  const [tahunLahirIbu, setTahunLahirIbu] = useState('');
  const [pekerjaanIbu, setPekerjaanIbu] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setNama(initialData.nama || '');
        setNipd(initialData.nipd || '');
        setNisn(initialData.nisn || '');
        setNik(initialData.nik || '');
        setJk(initialData.jk || '');
        setAgama(initialData.agama || '');
        setTempatLahir(initialData.tempatLahir || '');
        setTglLahir(convertToInputDate(initialData.tglLahir));
        setRombel(initialData.rombel || '');
        setStatus(initialData.status || '');
        
        setAlamat(initialData.alamat || '');
        setRt(initialData.rt || '');
        setRw(initialData.rw || '');
        setDusun(initialData.dusun || '');
        setKelurahan(initialData.kelurahan || '');
        setKecamatan(initialData.kecamatan || '');
        setKodePos(initialData.kodePos || '');
        
        setNamaAyah(initialData.namaAyah || '');
        setNikAyah(initialData.nikAyah || '');
        setTahunLahirAyah(initialData.tahunLahirAyah || '');
        setPekerjaanAyah(initialData.pekerjaanAyah || '');
        
        setNamaIbu(initialData.namaIbu || '');
        setNikIbu(initialData.nikIbu || '');
        setTahunLahirIbu(initialData.tahunLahirIbu || '');
        setPekerjaanIbu(initialData.pekerjaanIbu || '');
        setFoto(initialData.foto || null);
      } else {
        // Reset form for a new entry
        setNama('');
        setNipd('');
        setNisn('');
        setNik('');
        setJk('');
        setAgama('');
        setTempatLahir('');
        setTglLahir('');
        setRombel('');
        setStatus('');
        
        setAlamat('');
        setRt('');
        setRw('');
        setDusun('');
        setKelurahan('');
        setKecamatan('');
        setKodePos('');
        
        setNamaAyah('');
        setNikAyah('');
        setTahunLahirAyah('');
        setPekerjaanAyah('');
        
        setNamaIbu('');
        setNikIbu('');
        setTahunLahirIbu('');
        setPekerjaanIbu('');
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
      nipd: nipd.trim() || '-',
      nisn: nisn.trim() || '-',
      nik: nik.trim() || '-',
      jk: jk || '-',
      agama: agama || '-',
      tempatLahir: tempatLahir.trim() || '-',
      tglLahir: convertToDisplayDate(tglLahir),
      rombel: rombel || 'Kelas 1',
      status: status || 'Naik Kelas',
      
      alamat: alamat.trim() || '-',
      rt: rt.trim() || '-',
      rw: rw.trim() || '-',
      dusun: dusun.trim() || '-',
      kelurahan: kelurahan.trim() || '-',
      kecamatan: kecamatan.trim() || '-',
      kodePos: kodePos.trim() || '-',
      
      namaAyah: namaAyah.trim() || '-',
      nikAyah: nikAyah.trim() || '-',
      tahunLahirAyah: tahunLahirAyah || '-',
      pekerjaanAyah: pekerjaanAyah.trim() || '-',
      
      namaIbu: namaIbu.trim() || '-',
      nikIbu: nikIbu.trim() || '-',
      tahunLahirIbu: tahunLahirIbu || '-',
      pekerjaanIbu: pekerjaanIbu.trim() || '-',
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
            className="fixed inset-0 m-auto w-full max-w-5xl h-[95vh] bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-2xl z-50 flex flex-col rounded-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0 bg-white/5">
              <h2 className="text-xl font-display font-semibold text-white tracking-wide">
                {initialData ? 'Edit Detail Peserta Didik' : 'Tambah Data Peserta Didik'}
              </h2>
              <button onClick={onClose} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <form onSubmit={handleSaveClick} className="space-y-8">
                
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  
                  {/* Bagian 1: Data Utama */}
                  <div className="space-y-4 col-span-1 md:col-span-1">
                    <h3 className="text-sm font-semibold text-emerald-400 border-b border-white/10 pb-2">Data Utama</h3>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400 ml-1">Nama Lengkap *</label>
                      <input 
                        type="text" 
                        required
                        value={nama} 
                        onChange={(e) => setNama(e.target.value)} 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50" 
                        placeholder="Masukkan nama" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400 ml-1">NIPD</label>
                      <input 
                        type="text" 
                        value={nipd} 
                        onChange={(e) => setNipd(e.target.value)} 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50" 
                        placeholder="NIPD" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400 ml-1">NISN</label>
                      <input 
                        type="text" 
                        value={nisn} 
                        onChange={(e) => setNisn(e.target.value)} 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50" 
                        placeholder="NISN" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400 ml-1">NIK</label>
                      <input 
                        type="text" 
                        value={nik} 
                        onChange={(e) => setNik(e.target.value)} 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50" 
                        placeholder="NIK" 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-400 ml-1">Jenis Kelamin</label>
                        <select 
                          value={jk} 
                          onChange={(e) => setJk(e.target.value)} 
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                        >
                          <option className="bg-slate-800" value="">Pilih</option>
                          <option className="bg-slate-800" value="L">L</option>
                          <option className="bg-slate-800" value="P">P</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-400 ml-1">Agama</label>
                        <select 
                          value={agama} 
                          onChange={(e) => setAgama(e.target.value)} 
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
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
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400 ml-1">Tempat Lahir</label>
                      <input 
                        type="text" 
                        value={tempatLahir} 
                        onChange={(e) => setTempatLahir(e.target.value)} 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50" 
                        placeholder="Tempat" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400 ml-1">Tanggal Lahir</label>
                      <input 
                        type="date" 
                        value={tglLahir} 
                        onChange={(e) => setTglLahir(e.target.value)} 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 [color-scheme:dark]" 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-400 ml-1">Rombel Saat Ini</label>
                        <select 
                          value={rombel} 
                          onChange={(e) => setRombel(e.target.value)} 
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                        >
                          <option className="bg-slate-800" value="">Pilih</option>
                          <option className="bg-slate-800" value="Kelas 1">Kelas 1</option>
                          <option className="bg-slate-800" value="Kelas 2">Kelas 2</option>
                          <option className="bg-slate-800" value="Kelas 3">Kelas 3</option>
                          <option className="bg-slate-800" value="Kelas 4">Kelas 4</option>
                          <option className="bg-slate-800" value="Kelas 5">Kelas 5</option>
                          <option className="bg-slate-800" value="Kelas 6">Kelas 6</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-400 ml-1">Status</label>
                        <select 
                          value={status} 
                          onChange={(e) => setStatus(e.target.value)} 
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                        >
                          <option className="bg-slate-800" value="">Pilih Status</option>
                          <option className="bg-slate-800" value="Naik Kelas">Naik Kelas</option>
                          <option className="bg-slate-800" value="Set Lulus">Set Lulus</option>
                          <option className="bg-slate-800" value="Set Pindah">Set Pindah</option>
                          <option className="bg-slate-800" value="Set Keluar">Set Keluar</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Bagian 2: Alamat */}
                  <div className="space-y-4 col-span-1 md:col-span-1">
                    <h3 className="text-sm font-semibold text-blue-400 border-b border-white/10 pb-2">Data Alamat</h3>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400 ml-1">Alamat Jalan</label>
                      <textarea 
                        rows={2} 
                        value={alamat} 
                        onChange={(e) => setAlamat(e.target.value)} 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50" 
                        placeholder="Alamat jalan..."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-400 ml-1">RT</label>
                        <input 
                          type="text" 
                          value={rt} 
                          onChange={(e) => setRt(e.target.value)} 
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50" 
                          placeholder="RT" 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-400 ml-1">RW</label>
                        <input 
                          type="text" 
                          value={rw} 
                          onChange={(e) => setRw(e.target.value)} 
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50" 
                          placeholder="RW" 
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400 ml-1">Dusun</label>
                      <input 
                        type="text" 
                        value={dusun} 
                        onChange={(e) => setDusun(e.target.value)} 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50" 
                        placeholder="Dusun" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400 ml-1">Kelurahan / Desa</label>
                      <input 
                        type="text" 
                        value={kelurahan} 
                        onChange={(e) => setKelurahan(e.target.value)} 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50" 
                        placeholder="Kelurahan/Desa" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400 ml-1">Kecamatan</label>
                      <input 
                        type="text" 
                        value={kecamatan} 
                        onChange={(e) => setKecamatan(e.target.value)} 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50" 
                        placeholder="Kecamatan" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400 ml-1">Kode Pos</label>
                      <input 
                        type="text" 
                        value={kodePos} 
                        onChange={(e) => setKodePos(e.target.value)} 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50" 
                        placeholder="Kode Pos" 
                      />
                    </div>
                  </div>

                  {/* Bagian 3: Data Ayah */}
                  <div className="space-y-4 col-span-1 md:col-span-1">
                    <h3 className="text-sm font-semibold text-purple-400 border-b border-white/10 pb-2">Data Ayah</h3>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400 ml-1">Nama Ayah</label>
                      <input 
                        type="text" 
                        value={namaAyah} 
                        onChange={(e) => setNamaAyah(e.target.value)} 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50" 
                        placeholder="Nama ayah kandung" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400 ml-1">NIK Ayah</label>
                      <input 
                        type="text" 
                        value={nikAyah} 
                        onChange={(e) => setNikAyah(e.target.value)} 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50" 
                        placeholder="NIK ayah" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400 ml-1">Tahun Lahir Ayah</label>
                      <input 
                        type="number" 
                        value={tahunLahirAyah} 
                        onChange={(e) => setTahunLahirAyah(e.target.value)} 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50" 
                        placeholder="YYYY" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400 ml-1">Pekerjaan Ayah</label>
                      <input 
                        type="text" 
                        value={pekerjaanAyah} 
                        onChange={(e) => setPekerjaanAyah(e.target.value)} 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50" 
                        placeholder="Pekerjaan" 
                      />
                    </div>
                  </div>

                  {/* Bagian 4: Data Ibu */}
                  <div className="space-y-4 col-span-1 md:col-span-1">
                    <h3 className="text-sm font-semibold text-pink-400 border-b border-white/10 pb-2">Data Ibu</h3>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400 ml-1">Nama Ibu</label>
                      <input 
                        type="text" 
                        value={namaIbu} 
                        onChange={(e) => setNamaIbu(e.target.value)} 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50" 
                        placeholder="Nama ibu kandung" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400 ml-1">NIK Ibu</label>
                      <input 
                        type="text" 
                        value={nikIbu} 
                        onChange={(e) => setNikIbu(e.target.value)} 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50" 
                        placeholder="NIK ibu" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400 ml-1">Tahun Lahir Ibu</label>
                      <input 
                        type="number" 
                        value={tahunLahirIbu} 
                        onChange={(e) => setTahunLahirIbu(e.target.value)} 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50" 
                        placeholder="YYYY" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400 ml-1">Pekerjaan Ibu</label>
                      <input 
                        type="text" 
                        value={pekerjaanIbu} 
                        onChange={(e) => setPekerjaanIbu(e.target.value)} 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50" 
                        placeholder="Pekerjaan" 
                      />
                    </div>
                  </div>

                </div>

                {/* hidden submit button */}
                <button type="submit" id="submit-pd-form-btn" className="hidden" />
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
                  const btn = document.getElementById('submit-pd-form-btn');
                  if (btn) btn.click();
                }}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 border border-emerald-500/50 text-white text-sm font-medium shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all"
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
