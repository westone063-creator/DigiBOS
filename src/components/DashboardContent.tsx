import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingDown, Activity, Landmark, Receipt } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import LiveGreeting from './LiveGreeting';

const StatCard = ({ title, amount, trend, trendUp, icon: Icon, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="relative p-6 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 overflow-hidden group hover:bg-white/10 transition-colors shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
  >
    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
    <div className="flex items-start justify-between mb-4">
      <div className="p-3 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 shadow-inner">
        <Icon className="w-6 h-6 text-blue-400" />
      </div>
      <div className={`flex items-center gap-1 text-sm font-medium px-2.5 py-1 rounded-full bg-white/5 border border-white/10 ${trendUp ? 'text-emerald-400' : 'text-rose-400'}`}>
        {trend}
        {trendUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
      </div>
    </div>
    <div className="relative z-10">
      <div className="text-sm font-medium text-slate-400 mb-1">{title}</div>
      <div className="text-2xl font-display font-bold text-white tracking-tight">{amount}</div>
    </div>
  </motion.div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="backdrop-blur-xl bg-slate-900/80 border border-white/20 p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.3)]">
        <p className="text-slate-400 text-xs mb-1.5 font-medium uppercase tracking-wider">{label}</p>
        <p className="text-white font-display font-bold tracking-wide text-lg">
          Rp {payload[0].value.toLocaleString('id-ID')}
        </p>
      </div>
    );
  }
  return null;
};

export default function DashboardContent() {
  const [metrics, setMetrics] = useState({
    pengeluaranBulanIni: 0,
    sisaAnggaran: 0,
    volumeTransaksi: 0,
    totalPaguDana: 0,
  });

  const [chartData, setChartData] = useState<any[]>([]);
  const [pieData, setPieData] = useState<any[]>([]);
  const [totalPengeluaranAll, setTotalPengeluaranAll] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [tahunAnggaran, setTahunAnggaran] = useState(() => new Date().getFullYear().toString());
  const [semester, setSemester] = useState('Ganjil');

  useEffect(() => {
    const savedTahunAnggaran = localStorage.getItem('tahunAnggaran') || new Date().getFullYear().toString();
    const savedSemester = localStorage.getItem('semester') || 'ganjil';
    setTahunAnggaran(savedTahunAnggaran);
    setSemester(savedSemester.charAt(0).toUpperCase() + savedSemester.slice(1));

    const bkuData = JSON.parse(localStorage.getItem('bkuData') || '[]');
    const pendapatanData = JSON.parse(localStorage.getItem('pendapatanData') || '[]');
    const pergeseranData = JSON.parse(localStorage.getItem('pergeseranData') || '[]');

    const totalPaguDana = pendapatanData.reduce((acc: number, curr: any) => acc + (Number(curr.jumlah) || 0), 0);
    const totalPengeluaran = bkuData.reduce((acc: number, curr: any) => acc + (Number(curr.jumlah) || 0), 0);
    const sisaAnggaran = totalPaguDana - totalPengeluaran;

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const pengeluaranBulanIni = bkuData.reduce((acc: number, curr: any) => {
      if (!curr.tanggal) return acc;
      const date = new Date(curr.tanggal);
      if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
        return acc + (Number(curr.jumlah) || 0);
      }
      return acc;
    }, 0);

    const volumeTransaksi = bkuData.length + pendapatanData.length + pergeseranData.length;

    setMetrics({
      pengeluaranBulanIni,
      sisaAnggaran,
      volumeTransaksi,
      totalPaguDana
    });

    // Compute Chart Data (Last 6 Months of realisasi)
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];
    
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
      let m = currentMonth - i;
      let y = currentYear;
      if (m < 0) {
        m += 12;
        y -= 1;
      }
      last6Months.push({ monthIndex: m, year: y, month: monthNames[m], realisasi: 0 });
    }

    bkuData.forEach((item: any) => {
      if (!item.tanggal) return;
      const date = new Date(item.tanggal);
      const m = date.getMonth();
      const y = date.getFullYear();
      
      const monthObj = last6Months.find(lm => lm.monthIndex === m && lm.year === y);
      if (monthObj) {
        monthObj.realisasi += (Number(item.jumlah) || 0);
      }
    });

    setChartData(last6Months);

    // Compute Pie Data (Breakdown BOSP by belanja category)
    const pieGroups: { [key: string]: number } = {};
    bkuData.forEach((item: any) => {
      const category = item.belanja || 'Lainnya';
      pieGroups[category] = (pieGroups[category] || 0) + (Number(item.jumlah) || 0);
    });

    const colors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4', '#84cc16', '#f43f5e'];
    let colorIndex = 0;
    const newPieData = Object.keys(pieGroups).map(key => {
      const obj = { name: key, value: pieGroups[key], color: colors[colorIndex % colors.length] };
      colorIndex++;
      return obj;
    });

    if (newPieData.length === 0) {
      newPieData.push({ name: 'Belum Ada Pengeluaran', value: 1, color: '#475569' });
    } else {
      // sort by value desc
      newPieData.sort((a, b) => b.value - a.value);
    }

    setPieData(newPieData);
    setTotalPengeluaranAll(totalPengeluaran);

    // Compute Recent Transactions (Mix of BKU and Pendapatan)
    const allTransactions = [
      ...bkuData.map((item: any) => ({
        date: item.tanggal,
        ref: item.noBukti,
        desc: item.uraian,
        type: item.belanja || 'Pengeluaran',
        amount: Number(item.jumlah) || 0,
        isPengeluaran: true
      })),
      ...pendapatanData.map((item: any) => ({
        date: item.tanggal,
        ref: item.noBukti || '-',
        desc: item.uraian,
        type: 'Pendapatan',
        amount: Number(item.jumlah) || 0,
        isPengeluaran: false
      }))
    ];

    allTransactions.sort((a, b) => {
      if (!a.date || !b.date) return 0;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    setRecentTransactions(allTransactions.slice(0, 5));

  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };


  return (
    <div className="space-y-6">
      <LiveGreeting />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-white mb-1 tracking-wide">Ringkasan Dana BOSP</h2>
          <p className="text-slate-400 text-sm">Tahun Anggaran {tahunAnggaran} &bull; Periode {semester}</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 transition-colors">
            Unduh Laporan
          </button>
          <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 border border-blue-500/50 text-white text-sm font-medium shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all">
            Sinkronisasi ARKAS
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard delay={0.1} title="Pengeluaran Bulan Ini" amount={formatCurrency(metrics.pengeluaranBulanIni)} trend="Auto" trendUp={true} icon={TrendingDown} />
        <StatCard delay={0.2} title="Sisa Anggaran" amount={formatCurrency(metrics.sisaAnggaran)} trend="Auto" trendUp={true} icon={Wallet} />
        <StatCard delay={0.3} title="Volume Transaksi" amount={`${metrics.volumeTransaksi} Trx`} trend="Auto" trendUp={true} icon={Activity} />
        <StatCard delay={0.4} title="Total Pagu Dana" amount={formatCurrency(metrics.totalPaguDana)} trend="Auto" trendUp={true} icon={Landmark} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-display font-semibold text-white">Alur Realisasi BOSP</h3>
              <p className="text-sm text-slate-400">Tren pengeluaran 6 bulan terakhir</p>
            </div>
            <select className="bg-white/5 border border-white/10 text-sm text-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50">
              <option className="bg-slate-900 text-slate-300">6 Bulan Terakhir</option>
              <option className="bg-slate-900 text-slate-300">Tahun Ini</option>
            </select>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRealisasi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="month" 
                  stroke="#94a3b8" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  dy={10}
                />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(value) => `Rp ${value / 1000000}M`}
                />
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Area 
                  type="monotone" 
                  dataKey="realisasi" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRealisasi)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex flex-col"
        >
          <h3 className="text-lg font-display font-semibold mb-6">Breakdown BOSP</h3>
          
          <div className="flex-1 flex flex-col items-center justify-center relative min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`, 'Total']}
                />
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <div className="text-xs text-slate-400">Total</div>
              <div className="text-sm font-bold text-white">{totalPengeluaranAll >= 1000000 ? `${(totalPengeluaranAll / 1000000).toFixed(2)}M` : totalPengeluaranAll.toLocaleString('id-ID')}</div>
            </div>
          </div>
          
          <div className="mt-4 flex flex-col gap-3">
            {pieData.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: item.color }}></span>
                  <span className="text-slate-300">{item.name}</span>
                </div>
                <span className="text-white font-medium">{Math.round((item.value / (totalPengeluaranAll || 1)) * 100)}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="w-full rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
      >
        <h3 className="text-lg font-display font-semibold mb-6">Aktivitas Transaksi Terbaru</h3>
        
        <div className="w-full overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Tanggal</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">No. Bukti</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Uraian</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Jenis</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Nominal (Rp)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentTransactions.map((row, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 text-sm text-slate-300 whitespace-nowrap">{new Date(row.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                  <td className="py-3 px-4 text-sm font-medium text-blue-400 whitespace-nowrap">{row.ref}</td>
                  <td className="py-3 px-4 text-sm text-slate-200 truncate max-w-[200px]" title={row.desc}>{row.desc}</td>
                  <td className="py-3 px-4 text-sm whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-md text-xs border ${row.isPengeluaran ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>{row.type}</span>
                  </td>
                  <td className={`py-3 px-4 text-sm font-medium text-right whitespace-nowrap ${row.isPengeluaran ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {row.isPengeluaran ? '-' : '+'} {formatCurrency(row.amount)}
                  </td>
                </tr>
              ))}
              {recentTransactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 text-sm">Belum ada transaksi bulan ini</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
