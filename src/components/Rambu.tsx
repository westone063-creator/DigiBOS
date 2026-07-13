import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Printer, Edit2, Plus, Trash2, Eye } from 'lucide-react';

interface Sign {
  id: string;
  title: string;
  text: string;
  type: 'danger' | 'warning' | 'info';
}

const defaultSigns: Sign[] = [
  {
    id: '1',
    title: 'Peringatan',
    text: 'HARAP TENANG\nADA UJIAN',
    type: 'danger'
  },
  {
    id: '2',
    title: 'Informasi',
    text: 'RUANG 01',
    type: 'info'
  },
  {
    id: '3',
    title: 'Larangan',
    text: 'DILARANG MASUK\nSELAIN PENGAWAS DAN PANITIA',
    type: 'danger'
  },
  {
    id: '4',
    title: 'Larangan',
    text: 'KAWASAN BEBAS\nASAP ROKOK',
    type: 'warning'
  }
];

export default function Rambu() {
  const [signs, setSigns] = useState<Sign[]>(() => {
    const saved = localStorage.getItem('rambuSigns');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultSigns;
      }
    }
    return defaultSigns;
  });
  
  const [showPreview, setShowPreview] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  React.useEffect(() => {
    localStorage.setItem('rambuSigns', JSON.stringify(signs));
  }, [signs]);

  const addSign = () => {
    const newSign: Sign = {
      id: Date.now().toString(),
      title: 'Teks Baru',
      text: 'TEKS RAMBU',
      type: 'info'
    };
    setSigns([...signs, newSign]);
    setEditingId(newSign.id);
  };

  const updateSign = (id: string, field: keyof Sign, value: string) => {
    setSigns(signs.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const deleteSign = (id: string) => {
    setSigns(signs.filter(s => s.id !== id));
  };

  const getTypeClasses = (type: Sign['type'], isPrint: boolean = false) => {
    if (isPrint) {
      switch (type) {
        case 'danger': return 'border-red-600 text-red-600';
        case 'warning': return 'border-yellow-600 text-yellow-600';
        case 'info': return 'border-blue-600 text-blue-600';
      }
    } else {
      switch (type) {
        case 'danger': return 'bg-red-500/10 border-red-500/30 text-red-400';
        case 'warning': return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
        case 'info': return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center border border-rose-500/30">
            <Edit2 className="w-6 h-6 text-rose-400" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-semibold text-white tracking-wide">Rambu Ujian</h1>
            <p className="text-slate-400 text-sm mt-1">Kelola dan cetak tanda / rambu untuk keperluan ujian</p>
          </div>
        </div>
        
        <div className="flex gap-3 w-full sm:w-auto">
          <button 
            onClick={addSign}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border border-white/10"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah</span>
          </button>
          <button 
            onClick={() => setShowPreview(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border border-indigo-500/30"
          >
            <Eye className="w-4 h-4" />
            <span>Pratinjau Cetak</span>
          </button>
        </div>
      </div>

      {/* Editor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {signs.map(sign => (
          <motion.div 
            key={sign.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`relative rounded-2xl border p-6 flex flex-col justify-center items-center min-h-[250px] transition-colors ${getTypeClasses(sign.type)}`}
          >
            {editingId === sign.id ? (
              <div className="w-full space-y-4">
                <input 
                  type="text" 
                  value={sign.text}
                  onChange={(e) => updateSign(sign.id, 'text', e.target.value)}
                  className="w-full bg-slate-900/50 border border-white/20 rounded-lg px-3 py-2 text-white text-center font-bold font-display"
                />
                <select 
                  value={sign.type}
                  onChange={(e) => updateSign(sign.id, 'type', e.target.value as any)}
                  className="w-full bg-slate-900/50 border border-white/20 rounded-lg px-3 py-2 text-white"
                >
                  <option value="danger">Merah (Bahaya/Tegas)</option>
                  <option value="warning">Kuning (Peringatan)</option>
                  <option value="info">Biru (Informasi)</option>
                </select>
                <button 
                  onClick={() => setEditingId(null)}
                  className="w-full py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors font-medium text-sm"
                >
                  Selesai
                </button>
              </div>
            ) : (
              <>
                <div className="absolute top-3 right-3 flex gap-2">
                  <button 
                    onClick={() => setEditingId(sign.id)}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-current"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => deleteSign(sign.id)}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-current"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-center w-full">
                  <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-widest whitespace-pre-wrap">{sign.text}</h3>
                </div>
              </>
            )}
          </motion.div>
        ))}
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden text-slate-900 shadow-2xl">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-semibold text-lg">Cetak Rambu</h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak (A4)</span>
                </button>
                <button 
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
                >
                  Tutup
                </button>
              </div>
            </div>
            
            <div className="overflow-y-auto p-8 bg-slate-100 print:p-0 print:bg-white flex-1">
              <div className="print:hidden mb-4 text-center text-sm text-slate-500">
                Gunakan pengaturan kertas A4, margin "None", dan aktifkan "Background graphics" saat mencetak.
              </div>
              
              <div className="space-y-8 print:space-y-0 print:block">
                {signs.map((sign, index) => (
                  <div 
                    key={sign.id} 
                    className={`bg-white w-[210mm] h-[297mm] mx-auto p-12 border shadow-lg print:shadow-none print:border-none print:m-0 flex flex-col justify-center items-center page-break-after-always`}
                  >
                    <div className={`w-full h-full border-[16px] flex flex-col justify-center items-center p-12 ${getTypeClasses(sign.type, true)}`}>
                      <h1 className="text-[100px] leading-[1.2] font-black uppercase tracking-widest text-center whitespace-pre-wrap">
                        {sign.text}
                      </h1>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
