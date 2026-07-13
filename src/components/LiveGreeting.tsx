import { useState, useEffect } from 'react';
import { Clock, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

export default function LiveGreeting() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hour = time.getHours();
  let greeting = 'Selamat Pagi';
  if (hour >= 12 && hour < 15) greeting = 'Selamat Siang';
  else if (hour >= 15 && hour < 18) greeting = 'Selamat Sore';
  else if (hour >= 18) greeting = 'Selamat Malam';

  const dateStr = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(time);

  const timeStr = new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(time).replace(/\./g, ':');

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
    >
      <div>
        <h1 className="text-2xl font-display font-bold text-white mb-1 tracking-wide">{greeting}, Admin! ✨</h1>
        <p className="text-slate-400 text-sm">Selamat bekerja dan mengelola dana BOSP hari ini.</p>
      </div>
      <div className="flex items-center gap-3">
         <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 shadow-inner">
           <Calendar className="w-4 h-4 text-blue-400" />
           <span className="text-sm font-medium text-slate-200">{dateStr}</span>
         </div>
         <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 shadow-inner">
           <Clock className="w-4 h-4 text-emerald-400" />
           <span className="text-sm font-medium text-slate-200 tabular-nums w-[65px] text-center">{timeStr}</span>
         </div>
      </div>
    </motion.div>
  );
}
