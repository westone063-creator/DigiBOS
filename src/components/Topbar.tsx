import { Cloud, Search, Bell, User, Settings, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

export default function Topbar({ isSidebarOpen, setIsSidebarOpen, setActiveMenu }: any) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);

  const handleMarkAllAsRead = () => {
    setUnreadCount(0);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error', error);
    }
  };

  return (
    <header className="h-20 w-full flex items-center justify-between px-6 backdrop-blur-xl bg-white/5 border-b border-white/10 shadow-lg relative z-20 shrink-0">
       <div className="flex items-center gap-4">
         <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
            <Menu className="w-5 h-5 text-slate-300" />
         </button>
         <div className="relative hidden md:block">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
           <input type="text" placeholder="Cari modul atau data..." className="w-64 bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" />
         </div>
       </div>

       <div className="flex items-center gap-4">
         <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
           <Cloud className="w-3.5 h-3.5" />
           <span className="hidden sm:inline">Cloud Terkoneksi</span>
         </div>
         
         <div className="relative">
           <button onClick={() => setIsNotificationOpen(!isNotificationOpen)} className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
             <Bell className="w-5 h-5 text-slate-300" />
             {unreadCount > 0 && (
               <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 border border-slate-900"></span>
             )}
           </button>

           <AnimatePresence>
             {isNotificationOpen && (
               <motion.div 
                 initial={{ opacity: 0, y: 10, scale: 0.95 }}
                 animate={{ opacity: 1, y: 0, scale: 1 }}
                 exit={{ opacity: 0, y: 10, scale: 0.95 }}
                 className="absolute right-0 mt-3 w-80 py-2 rounded-2xl backdrop-blur-2xl bg-slate-900/90 border border-white/10 shadow-xl"
               >
                 <div className="px-4 py-2 border-b border-white/10 flex justify-between items-center">
                   <h3 className="text-sm font-semibold text-white">Notifikasi</h3>
                   {unreadCount > 0 && (
                     <span className="text-xs bg-rose-500 text-white px-2 py-0.5 rounded-full">{unreadCount} Baru</span>
                   )}
                 </div>
                 <div className="max-h-80 overflow-y-auto">
                   <div className={`px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 cursor-pointer ${unreadCount > 0 ? '' : 'opacity-60'}`}>
                     <p className="text-sm text-slate-200 font-medium mb-1">Gagal Sinkronisasi BKU</p>
                     <p className="text-xs text-slate-400">Terdapat selisih pada bulan Februari. Harap cek kembali rincian belanja.</p>
                     <p className="text-[10px] text-slate-500 mt-2">5 menit yang lalu</p>
                   </div>
                   <div className={`px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 cursor-pointer ${unreadCount > 0 ? '' : 'opacity-60'}`}>
                     <p className="text-sm text-slate-200 font-medium mb-1">Update Modul ARKAS</p>
                     <p className="text-xs text-slate-400">Modul ARKAS v4.2 telah tersedia. Silakan update untuk fitur terbaru.</p>
                     <p className="text-[10px] text-slate-500 mt-2">1 jam yang lalu</p>
                   </div>
                   <div className="px-4 py-3 hover:bg-white/5 transition-colors cursor-pointer opacity-60">
                     <p className="text-sm text-slate-300 font-medium mb-1">Laporan Disetujui</p>
                     <p className="text-xs text-slate-400">Laporan BKU bulan Januari telah disetujui oleh Dinas Pendidikan.</p>
                     <p className="text-[10px] text-slate-500 mt-2">Kemarin</p>
                   </div>
                 </div>
                 <div className="px-4 py-2 border-t border-white/10 text-center">
                   <button 
                     onClick={handleMarkAllAsRead}
                     className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                   >
                     Tandai semua dibaca
                   </button>
                 </div>
               </motion.div>
             )}
           </AnimatePresence>
         </div>

         <div className="relative">
           <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-2 p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
             <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center">
               <User className="w-4 h-4 text-white" />
             </div>
             <span className="text-sm font-medium text-slate-200 hidden sm:block px-1">Admin SDN 1</span>
           </button>
           
           <AnimatePresence>
             {isProfileOpen && (
               <motion.div 
                 initial={{ opacity: 0, y: 10, scale: 0.95 }}
                 animate={{ opacity: 1, y: 0, scale: 1 }}
                 exit={{ opacity: 0, y: 10, scale: 0.95 }}
                 className="absolute right-0 mt-3 w-48 py-2 rounded-2xl backdrop-blur-2xl bg-slate-900/80 border border-white/10 shadow-xl"
               >
                 <button onClick={() => { if(setActiveMenu) setActiveMenu("profil-saya"); setIsProfileOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                   <User className="w-4 h-4" /> Profil Saya
                 </button>
                 <button onClick={() => { if(setActiveMenu) setActiveMenu("pengaturan-akun"); setIsProfileOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                   <Settings className="w-4 h-4" /> Pengaturan Akun
                 </button>
                 <div className="h-px w-full bg-white/10 my-2"></div>
                 <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors">
                   <LogOut className="w-4 h-4" /> Logout
                 </button>
               </motion.div>
             )}
           </AnimatePresence>
         </div>
       </div>
    </header>
  );
}
