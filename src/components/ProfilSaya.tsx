import { getKopSurat } from "../utils/settings";
import { User, Mail, Phone, MapPin, Briefcase, Camera } from 'lucide-react';

export default function ProfilSaya() {
  const kopSurat = getKopSurat();
  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Profil Saya</h1>
          <p className="text-slate-400 text-sm mt-1">Kelola informasi profil akun Anda</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-blue-600/20 to-indigo-600/20"></div>
            
            <div className="relative inline-block mt-4 mb-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center border-4 border-slate-900 shadow-xl mx-auto">
                <User className="w-10 h-10 text-white" />
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center border-2 border-slate-900 hover:bg-blue-500 transition-colors">
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>
            
            <h2 className="text-xl font-bold text-white mb-1">Admin SDN 1</h2>
            <p className="text-sm text-blue-400 font-medium mb-4">Administrator Sekolah</p>
            
            <div className="flex flex-col gap-3 text-left border-t border-white/10 pt-4 mt-4">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">Email</p>
                  <p className="text-sm text-slate-200">admin@sdn1contoh.sch.id</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">Telepon</p>
                  <p className="text-sm text-slate-200">+62 812-3456-7890</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">Lokasi</p>
                  <p className="text-sm text-slate-200">Kecamatan Contoh, Kota Demo</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Briefcase className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">Instansi</p>
                  <p className="text-sm text-slate-200">{kopSurat.kopBaris3}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-4">Informasi Akun</h3>
            
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Nama Lengkap</label>
                  <input type="text" defaultValue="Admin SDN 1" className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Username</label>
                  <input type="text" defaultValue="admin_sdn1" className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Email</label>
                  <input type="email" defaultValue="admin@sdn1contoh.sch.id" className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Nomor Telepon</label>
                  <input type="tel" defaultValue="+62 812-3456-7890" className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Bio Ringkas</label>
                <textarea rows={3} defaultValue="Administrator sistem informasi BOS sekolah {kopSurat.kopBaris3}." className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"></textarea>
              </div>

              <div className="flex justify-end pt-4">
                <button type="button" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-4">Ubah Kata Sandi</h3>
            
            <form className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Kata Sandi Saat Ini</label>
                <input type="password" placeholder="••••••••" className="w-full sm:w-1/2 bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Kata Sandi Baru</label>
                <input type="password" placeholder="••••••••" className="w-full sm:w-1/2 bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Konfirmasi Kata Sandi Baru</label>
                <input type="password" placeholder="••••••••" className="w-full sm:w-1/2 bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors" />
              </div>

              <div className="pt-2">
                <button type="button" className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                  Perbarui Kata Sandi
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
