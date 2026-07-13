/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState, useEffect } from 'react';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from './firebase';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import DashboardContent from './components/DashboardContent';
import DataGuruStaff from './components/DataGuruStaff';
import PesertaDidik from './components/PesertaDidik';
import PDKeluar from './components/PDKeluar';
import BukuIndukPegawai from './components/BukuIndukPegawai';
import DaftarHadirLembur from './components/DaftarHadirLembur';
import DaftarHadirPiket from './components/DaftarHadirPiket';
import DaftarHadirEkskul from './components/DaftarHadirEkskul';
import SaldoAwal from './components/SaldoAwal';
import Pendapatan from './components/Pendapatan';
import Pergeseran from './components/Pergeseran';
import BkuArkas from './components/BkuArkas';
import BphPersediaan from './components/BphPersediaan';
import BelanjaModal from './components/BelanjaModal';
import PajakArkas from './components/PajakArkas';
import ProfilSaya from './components/ProfilSaya';
import Pengaturan from './components/Pengaturan';

import AsetInventaris from './components/AsetInventaris';
import Tanah from './components/Tanah';
import LaporanDaftarI from './components/LaporanDaftarI';

import Pinbuk from './components/Pinbuk';
import Kwitansi from './components/Kwitansi';
import TandaTerima from './components/TandaTerima';
import RekeningKoran from './components/RekeningKoran';
import StrukNota from './components/StrukNota';
import SKIndividu from './components/SKIndividu';
import SKPembagianTugas from './components/SKPembagianTugas';
import SuratTugas from './components/SuratTugas';
import SiswaAktif from './components/SiswaAktif';
import SiswaDiterima from './components/SiswaDiterima';
import SiswaMutasi from './components/SiswaMutasi';
import SuketWaliPip from './components/SuketWaliPip';
import ManajemenPIP from './components/ManajemenPIP';
import JadwalUjian from './components/JadwalUjian';
import JadwalPengawas from './components/JadwalPengawas';
import KartuUjian from './components/KartuUjian';
import DenahMeja from './components/DenahMeja';
import Rambu from './components/Rambu';

export default function App() {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => window.innerWidth >= 768);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login failed', error);
      alert('Login failed. Please try again.');
    }
  };

  if (isLoadingAuth) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-900">
        <div className="text-white">Memuat...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen w-full bg-slate-950 font-sans text-slate-100 overflow-hidden relative">
        {/* Background Decorative Elements */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-purple-600/10 blur-[100px] pointer-events-none" />
        
        {/* Abstract pattern overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] mix-blend-overlay"></div>

        <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 z-10 w-full lg:w-1/2 max-w-2xl mx-auto lg:mx-0">
          <div className="mx-auto w-full max-w-sm lg:w-[400px]">
            
            {/* Logo */}
            <div className="flex items-center gap-3 mb-10">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 border border-white/10 relative overflow-hidden group">
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <svg className="w-6 h-6 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold text-white tracking-tight">DigiBOS</h1>
                <p className="text-xs text-blue-400 font-medium tracking-wide uppercase">Workspace</p>
              </div>
            </div>

            <h2 className="text-3xl font-semibold tracking-tight text-white mb-2">Selamat Datang</h2>
            <p className="text-sm text-slate-400 mb-8 leading-relaxed">
              Platform manajemen dan administrasi BOSP terpadu. Masuk menggunakan akun Google Anda untuk melanjutkan.
            </p>

            <div className="space-y-6">
              <button 
                onClick={handleLogin}
                className="w-full relative group flex items-center justify-center gap-3 bg-white text-slate-900 font-medium py-3.5 px-4 rounded-xl hover:bg-slate-50 transition-all duration-200 shadow-[0_1px_2px_rgba(0,0,0,0.05)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 focus:ring-white overflow-hidden"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 24c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 21.53 7.7 24 12 24z" />
                  <path fill="#FBBC05" d="M5.84 15.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V8.06H2.18C1.43 9.55 1 11.22 1 13s.43 3.45 1.18 4.94l3.66-2.84z" />
                  <path fill="#EA4335" d="M12 4.69c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.43 14.97 0 12 0 7.7 0 3.99 2.47 2.18 6.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span className="relative z-10">Lanjutkan dengan Google</span>
              </button>
            </div>

            <div className="mt-8 pt-8 border-t border-white/10">
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-950 flex items-center justify-center text-[10px] font-bold text-slate-300">D</div>
                  <div className="w-8 h-8 rounded-full bg-blue-900 border-2 border-slate-950 flex items-center justify-center text-[10px] font-bold text-blue-200">B</div>
                  <div className="w-8 h-8 rounded-full bg-indigo-900 border-2 border-slate-950 flex items-center justify-center text-[10px] font-bold text-indigo-200">S</div>
                </div>
                <p>Digunakan oleh <span className="text-slate-300 font-medium">100+</span> Bendahara Sekolah</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right side decorative image area */}
        <div className="hidden lg:flex lg:flex-1 relative border-l border-white/5 bg-slate-900/50 backdrop-blur-3xl p-12">
          {/* Dashboard Preview Mockup */}
          <div className="w-full h-full relative flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 mix-blend-overlay"></div>
            
            {/* Main floating card */}
            <div className="relative z-10 w-full max-w-lg aspect-[4/3] rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-2xl p-6 flex flex-col gap-4 transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500 ease-out">
              {/* Fake header */}
              <div className="flex justify-between items-center pb-4 border-b border-white/5">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="w-24 h-4 rounded-full bg-white/5"></div>
              </div>
              
              {/* Fake stats */}
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-sm bg-blue-400"></div>
                  </div>
                  <div className="w-16 h-3 rounded bg-slate-700"></div>
                  <div className="w-24 h-5 rounded bg-slate-200"></div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-sm bg-emerald-400"></div>
                  </div>
                  <div className="w-16 h-3 rounded bg-slate-700"></div>
                  <div className="w-24 h-5 rounded bg-slate-200"></div>
                </div>
              </div>
              
              {/* Fake list */}
              <div className="flex-1 rounded-xl bg-white/5 border border-white/5 p-4 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <div className="w-32 h-4 rounded bg-slate-700"></div>
                  <div className="w-12 h-4 rounded bg-slate-700"></div>
                </div>
                <div className="w-full h-px bg-white/5 my-1"></div>
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800"></div>
                    <div className="flex-1 space-y-2">
                      <div className="w-1/2 h-3 rounded bg-slate-600"></div>
                      <div className="w-1/3 h-2 rounded bg-slate-700"></div>
                    </div>
                    <div className="w-16 h-3 rounded bg-emerald-500/50"></div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Floating decoration cards */}
            <div className="absolute top-[20%] right-[10%] z-20 w-48 p-4 rounded-xl bg-slate-800/90 backdrop-blur-md border border-white/10 shadow-xl transform rotate-[5deg] translate-x-10 animate-[bounce_4s_infinite]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-200">Data Tersinkron</div>
                  <div className="text-xs text-slate-400">Baru saja</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (

    <div className="flex h-screen w-full overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a] text-slate-100 font-sans print:h-auto print:overflow-visible print:bg-white print:text-black">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none print:hidden" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none print:hidden" />
      
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm print:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      <div className={`print:hidden h-full flex-shrink-0 fixed md:relative z-50 md:z-0 top-0 left-0 transition-transform duration-300 md:transition-none ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <Sidebar activeMenu={activeMenu} setActiveMenu={(menu: string) => { setActiveMenu(menu); if(window.innerWidth < 768) setIsSidebarOpen(false); }} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      </div>
      
      <div className="flex flex-col flex-1 w-full h-full relative z-10 overflow-hidden print:overflow-visible">
        <div className="print:hidden">
          <Topbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} setActiveMenu={setActiveMenu} />
        </div>
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 custom-scrollbar print:overflow-visible print:p-0 print:h-auto">
           {activeMenu === 'dashboard' ? (
             <DashboardContent />
           ) : activeMenu === 'data-guru' ? (
             <DataGuruStaff />
           ) : activeMenu === 'buku-induk' ? (
             <BukuIndukPegawai />
           ) : activeMenu === 'aset-inventaris' ? (
             <AsetInventaris />
           ) : activeMenu === 'tanah' ? (
             <Tanah />
           ) : activeMenu === 'laporan-buku-induk' ? (
             <LaporanDaftarI onBack={() => setActiveMenu('buku-induk')} />
           ) : activeMenu === 'data-peserta-didik' ? (
             <PesertaDidik />
           ) : activeMenu === 'pd-keluar' ? (
             <PDKeluar />
           ) : activeMenu === 'daftar-hadir-lembur' ? (
             <DaftarHadirLembur />
           ) : activeMenu === 'daftar-hadir-piket' ? (
             <DaftarHadirPiket />
           ) : activeMenu === 'daftar-hadir-ekskul' ? (
             <DaftarHadirEkskul />
           ) : activeMenu === 'saldo-awal' ? (
             <SaldoAwal />
           ) : activeMenu === 'pendapatan' ? (
             <Pendapatan />
           ) : activeMenu === 'pergeseran' ? (
             <Pergeseran />
           ) : activeMenu === 'bku-arkas' ? (
             <BkuArkas />
           ) : activeMenu === 'bph' ? (
             <BphPersediaan />
           ) : activeMenu === 'belanja-modal' ? (
             <BelanjaModal />
           ) : activeMenu === 'pajak-arkas' ? (
             <PajakArkas />
           ) : activeMenu === 'pinbuk' ? (
             <Pinbuk />
           ) : activeMenu === 'kwitansi' ? (
             <Kwitansi />
           ) : activeMenu === 'tanda-terima' ? (
             <TandaTerima />
           ) : activeMenu === 'rekening-koran' ? (
             <RekeningKoran />
           ) : activeMenu === 'struk-nota' ? (
             <StrukNota />
           ) : activeMenu === 'sk-individu' ? (
             <SKIndividu />
           ) : activeMenu === 'sk-pembagian' ? (
             <SKPembagianTugas />
           ) : activeMenu === 'surat-tugas' ? (
             <SuratTugas />
           ) : activeMenu === 'ket-aktif' ? (
             <SiswaAktif />
           ) : activeMenu === 'ket-diterima' ? (
             <SiswaDiterima />
           ) : activeMenu === 'ket-mutasi' ? (
             <SiswaMutasi />
           ) : activeMenu === 'ket-wali-pip' ? (
             <SuketWaliPip />
           ) : activeMenu === 'manajemen-pip' ? (
             <ManajemenPIP />
           ) : activeMenu === 'jadwal-ujian' ? (
             <JadwalUjian />
           ) : activeMenu === 'jadwal-pengawas' ? (
             <JadwalPengawas />
           ) : activeMenu === 'kartu-ujian' ? (
             <KartuUjian />
           ) : activeMenu === 'denah-meja' ? (
             <DenahMeja />
           ) : activeMenu === 'rambu' ? (
             <Rambu />
           ) : activeMenu === 'profil-saya' ? (
             <ProfilSaya />
           ) : activeMenu === 'pengaturan' || activeMenu === 'pengaturan-akun' ? (
             <Pengaturan />
           ) : (
             <div className="w-full h-full flex items-center justify-center backdrop-blur-md bg-white/5 rounded-2xl border border-white/10 p-8 shadow-2xl">
               <div className="text-center">
                 <h2 className="text-2xl font-display font-semibold text-white mb-2 tracking-wide">Modul Dalam Pengembangan</h2>
                 <p className="text-slate-400">Modul untuk menu terpilih sedang dalam tahap pengembangan struktur ARKAS BOSP.</p>
               </div>
             </div>
           )}
        </main>
      </div>
    </div>
  );
}
