import { 
  LayoutDashboard, Users, GraduationCap, BookMarked, CalendarDays, 
  Wallet, Calculator, ArrowRightLeft, FileText, CheckSquare, Settings, ChevronDown, Circle
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const menuData = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'data-guru', label: 'Data Guru & Staff', icon: Users },
  {
    id: 'peserta-didik', label: 'Peserta Didik', icon: GraduationCap,
    sub: [
      { id: 'data-peserta-didik', label: 'Peserta Didik' },
      { id: 'pd-keluar', label: 'PD Keluar' },
    ]
  },
  {
    id: 'buku-induk-menu', label: 'Buku Induk', icon: BookMarked,
    sub: [
      { id: 'buku-induk', label: 'Pegawai' },
      { id: 'aset-inventaris', label: 'Aset & Inventaris' },
      { id: 'tanah', label: 'Tanah' },
      { id: 'laporan-buku-induk', label: 'Laporan' }
    ]
  },
  {
    id: 'daftar-hadir', label: 'Daftar Hadir & Jadwal', icon: CalendarDays,
    sub: [
      { id: 'daftar-hadir-lembur', label: 'Lembur Pegawai' },
      { id: 'daftar-hadir-piket', label: 'Jadwal Piket' },
      { id: 'daftar-hadir-ekskul', label: 'Jadwal Ekskul' }
    ]
  },
  {
    id: 'penatausahaan', label: 'Penatausahaan', icon: Wallet,
    sub: [
      { id: 'saldo-awal', label: 'Saldo Awal' },
      { id: 'pendapatan', label: 'Pendapatan' },
      { id: 'pergeseran', label: 'Pergeseran Kas' },
    ]
  },
  {
    id: 'vera-bos', label: 'VerA BOS', icon: Calculator,
    sub: [
      { id: 'bku-arkas', label: 'BKU ARKAS' },
      { id: 'bph', label: 'BPH (Persediaan)' },
      { id: 'belanja-modal', label: 'Belanja Modal' },
      { id: 'pajak-arkas', label: 'Pajak ARKAS' },
    ]
  },
  {
    id: 'transaksi', label: 'Transaksi', icon: ArrowRightLeft,
    sub: [
      { id: 'pinbuk', label: 'Pinbuk' },
      { id: 'kwitansi', label: 'Kwitansi' },
      { id: 'tanda-terima', label: 'Tanda Terima Kolektif' },
      { id: 'rekening-koran', label: 'Rekening Koran' },
      { id: 'struk-nota', label: 'Struk Nota' },
    ]
  },
  {
    id: 'surat-sk', label: 'Surat & SK', icon: FileText,
    sub: [
      { id: 'sk-individu', label: 'SK Individu' },
      { id: 'sk-pembagian', label: 'SK Pembagian Tugas' },
      { id: 'surat-tugas', label: 'Surat Tugas (SPPD)' },
      { 
        id: 'surat-ket', label: 'Surat Keterangan', 
        sub: [
          { id: 'ket-aktif', label: 'Siswa Aktif' },
          { id: 'ket-diterima', label: 'Diterima' },
          { id: 'ket-mutasi', label: 'Mutasi' },
          { id: 'ket-wali-pip', label: 'Suket Wali PIP' },
        ]
      },
      { id: 'manajemen-pip', label: 'Manajemen PIP' },
    ]
  },
  {
    id: 'dokumen-ujian', label: 'Dokumen Ujian', icon: CheckSquare,
    sub: [
      { id: 'jadwal-ujian', label: 'Jadwal Ujian' },
      { id: 'jadwal-pengawas', label: 'Jadwal Pengawas' },
      { id: 'kartu-ujian', label: 'Kartu Ujian' },
      { id: 'denah-meja', label: 'Denah Meja Peserta' },
      { id: 'rambu', label: 'Rambu' },
    ]
  },
  { id: 'pengaturan', label: 'Pengaturan', icon: Settings },
];

function SubMenu({ item, activeMenu, setActiveMenu, level = 1 }: any) {
  const [isOpen, setIsOpen] = useState(false);
  
  const hasSub = item.sub && item.sub.length > 0;
  const isActive = activeMenu === item.id || (hasSub && item.sub.some((s:any) => s.id === activeMenu || (s.sub && s.sub.some((ss:any) => ss.id === activeMenu))));

  return (
    <div className="w-full">
      <button 
        onClick={() => {
          if (hasSub) {
            setIsOpen(!isOpen);
          } else {
            setActiveMenu(item.id);
          }
        }}
        className={`w-full flex items-center justify-between py-2.5 px-3 rounded-xl transition-all duration-200 ${isActive && !hasSub ? 'bg-blue-500/20 text-blue-400 font-medium' : 'text-slate-300 hover:bg-white/5 hover:text-white'} ${level > 1 ? 'pl-8' : ''}`}
      >
        <div className="flex items-center gap-3">
          {item.icon ? <item.icon className="w-5 h-5 opacity-80" /> : <Circle className="w-1.5 h-1.5 opacity-50" />}
          <span className="text-sm tracking-wide">{item.label}</span>
        </div>
        {hasSub && (
          <ChevronDown className={`w-4 h-4 opacity-50 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        )}
      </button>

      <AnimatePresence>
        {hasSub && isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-1 pb-1">
              {item.sub.map((subItem: any) => (
                <SubMenu key={subItem.id} item={subItem} activeMenu={activeMenu} setActiveMenu={setActiveMenu} level={level + 1} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Sidebar({ activeMenu, setActiveMenu, isOpen }: any) {
  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 280 : 0, opacity: isOpen ? 1 : 0 }}
      className="h-full flex-shrink-0 backdrop-blur-2xl bg-white/5 border-r border-white/10 z-30 flex flex-col overflow-hidden"
    >
      <div className="h-20 w-full flex items-center px-6 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            <Wallet className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">DigiBOS</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-1">
        <div className="text-xs font-semibold text-slate-500 mb-3 px-3 uppercase tracking-wider">Menu Utama</div>
        {menuData.map(item => (
          <SubMenu key={item.id} item={item} activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
        ))}
      </div>
    </motion.aside>
  );
}
