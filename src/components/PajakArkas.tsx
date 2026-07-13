import { getProfilSekolah } from '../utils/settings';
import React, { useState, useRef } from 'react';
import { Search, Download, Upload, Settings, X } from 'lucide-react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export default function PajakArkas() {
  const { kecamatan, namaSekolah } = getProfilSekolah();

  const [entries, setEntries] = useState(10);
  const [isTambahDataOpen, setIsTambahDataOpen] = useState(false);
  const [isImportDataOpen, setIsImportDataOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [daftarRekening] = useState<any[]>(() => {
    const saved = localStorage.getItem('daftarRekening');
    return saved ? JSON.parse(saved) : [];
  });

  const [pajakData, setPajakData] = useState<any[]>(() => {
    const saved = localStorage.getItem('pajakData');
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, tanggal: '2024-02-15', kodeKegiatan: '-', belanja: '-', kodeRekening: '-', noBukti: 'BKT-001', uraian: 'Uraian Contoh', pengeluaran1: 15000, pengeluaran2: 15000 }
    ];
  });
  
  React.useEffect(() => {
    localStorage.setItem('pajakData', JSON.stringify(pajakData));
  }, [pajakData]);
  
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isAksiOpen, setIsAksiOpen] = useState(false);

  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    isAlertOnly?: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    isAlertOnly: false,
    onConfirm: () => {}
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(pajakData.map(item => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelect = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) {
      setConfirmState({
        isOpen: true,
        title: 'Pilih Data Terlebih Dahulu',
        message: 'Silakan pilih data yang ingin dihapus terlebih dahulu dengan mencentang kotak pilihan di sebelah kiri tabel.',
        isAlertOnly: true,
        onConfirm: () => {}
      });
      return;
    }
    setConfirmState({
      isOpen: true,
      title: 'Konfirmasi Hapus Terpilih',
      message: `Apakah Anda yakin ingin menghapus ${selectedIds.length} data Pajak yang dipilih? Tindakan ini tidak dapat dibatalkan.`,
      isAlertOnly: false,
      onConfirm: () => {
        setPajakData(prev => prev.filter(item => !selectedIds.includes(item.id)));
        setSelectedIds([]);
      }
    });
  };

  const handleImportClick = () => {
    setIsImportDataOpen(true);
  };

  const handleDownloadTemplate = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Template Pajak Arkas');

    const headers = ['Tanggal', 'Kode Kegiatan', 'Kode Rekening', 'No Bukti', 'Uraian', 'Pengeluaran', 'Pengeluaran'];
    worksheet.addRow(headers);

    worksheet.getRow(1).eachCell((cell) => {
      let fgColor = 'FF2563EB'; // Tailwind blue-600
      if (cell.value && cell.value.toString().toUpperCase() === 'PENGELUARAN') {
        fgColor = 'FFDC2626'; // Tailwind red-600
      }
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: fgColor }
      };
      cell.font = {
        color: { argb: 'FFFFFFFF' },
        bold: true
      };
      // Auto-width adjustment approximation
      const col = worksheet.getColumn(cell.col);
      col.width = Math.max(15, cell.value.toString().length + 5);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "template_pajak_arkas.xlsx");
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(await file.arrayBuffer());
        const worksheet = workbook.worksheets[0];
        
        const newData: any[] = [];
        let newId = pajakData.length > 0 ? Math.max(...pajakData.map(d => d.id)) + 1 : 1;
        
        const savedRekening = localStorage.getItem('daftarRekening');
        const listRekening = savedRekening ? JSON.parse(savedRekening) : [];

        const savedSNP = localStorage.getItem('daftarSNP');
        const listSNP = savedSNP ? JSON.parse(savedSNP) : [];

        worksheet.eachRow((row, rowNumber) => {
          if (rowNumber > 1) { // Skip header
            let tanggal = row.getCell(1).value?.toString() || '';
            if (row.getCell(1).type === ExcelJS.ValueType.Date) {
              tanggal = (row.getCell(1).value as Date).toISOString().split('T')[0];
            }
            
            const kodeRekInput = row.getCell(3).value?.toString() || '';
            const normalizedRekInput = String(kodeRekInput || '').replace(/\./g, '').trim();
            const matchedRek = listRekening.find((r: any) => String(r.kodeSubKomponen || '').replace(/\./g, '').trim() === normalizedRekInput);
            
            let belanjaValue = kodeRekInput || '';
            if (matchedRek) {
              belanjaValue = `${matchedRek.kodeSubKomponen} - ${matchedRek.uraianSubKomponen}`;
            } else if (kodeRekInput) {
              belanjaValue = `${kodeRekInput} - (Tidak Ditemukan di Daftar Rekening)`;
            }

            const kodeKegiatanInput = row.getCell(2).value?.toString() || '';
            const normalizedKegiatanInput = String(kodeKegiatanInput || '').replace(/\./g, '').trim();
            const matchedSNP = listSNP.find((r: any) => String(r.kodeRekening || '').replace(/\./g, '').trim() === normalizedKegiatanInput);
            
            let kegiatanValue = kodeKegiatanInput;
            if (matchedSNP) {
              kegiatanValue = `${matchedSNP.kodeRekening}, ${matchedSNP.uraian}`;
            }

            newData.push({
              id: newId++,
              tanggal: tanggal,
              kodeKegiatan: kegiatanValue,
              kodeRekening: kodeRekInput,
              belanja: belanjaValue,
              noBukti: row.getCell(4).value?.toString() || '',
              uraian: row.getCell(5).value?.toString() || '',
              pengeluaran1: Number(row.getCell(6).value) || 0,
              pengeluaran2: Number(row.getCell(7).value) || 0,
            });
          }
        });
        
        setPajakData(prev => [...prev, ...newData]);
        alert(`Berhasil mengimpor ${newData.length} data dari file: ${file.name}`);
        setIsImportDataOpen(false);
      } catch (error) {
        alert("Gagal membaca file Excel. Pastikan format file sesuai.");
      }
      
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleExport = async (type: string) => {
    if (type === "PAJAK ARKAS (XLSX)") {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Pajak Arkas');
      
      worksheet.columns = [
        { header: 'No', key: 'no', width: 5 },
        { header: 'Tanggal', key: 'tanggal', width: 15 },
        { header: 'Kode Kegiatan', key: 'kodeKegiatan', width: 20 },
        { header: 'Kode Rekening', key: 'kodeRekening', width: 20 },
        { header: 'No Bukti', key: 'noBukti', width: 20 },
        { header: 'Uraian', key: 'uraian', width: 40 },
        { header: 'Pengeluaran 1', key: 'pengeluaran1', width: 20 },
        { header: 'Pengeluaran 2', key: 'pengeluaran2', width: 20 },
      ];

      pajakData.forEach((item, index) => {
        worksheet.addRow({
          no: index + 1,
          tanggal: item.tanggal,
          kodeKegiatan: item.kodeKegiatan,
          kodeRekening: item.kodeRekening,
          noBukti: item.noBukti,
          uraian: item.uraian,
          pengeluaran1: item.pengeluaran1,
          pengeluaran2: item.pengeluaran2,
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'pajak_arkas.xlsx');
    } else {
      alert(`Fitur export ${type} sedang dalam pengembangan.`);
    }
  };

  const [sumberDana, setSumberDana] = useState('BOSP Reguler');
  const [jenisKas, setJenisKas] = useState('Semua Kas');
  const [tanggalAwal, setTanggalAwal] = useState('');
  const [tanggalAkhir, setTanggalAkhir] = useState('');
  const [isSetorModalOpen, setIsSetorModalOpen] = useState(false);

  // Sample data states
  const overallBank = 0;
  const overallTunai = 0;
  const perTanggalBank = 0;
  const perTanggalTunai = 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="w-full space-y-6 relative">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Pajak ARKAS</h1>
          <p className="text-slate-400 text-sm mt-1">Buku Pembantu Pajak ARKAS</p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm mb-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-400">Sumber Dana</label>
            <select value={sumberDana} onChange={e => setSumberDana(e.target.value)} className="w-full bg-slate-900/50 border border-white/10 rounded px-2.5 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors">
              <option value="BOSP Reguler">BOSP Reguler</option>
              <option value="BOSP Kinerja">BOSP Kinerja</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-400">Jenis Kas</label>
            <select value={jenisKas} onChange={e => setJenisKas(e.target.value)} className="w-full bg-slate-900/50 border border-white/10 rounded px-2.5 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors">
              <option value="Semua Kas">Semua Kas</option>
              <option value="Tunai">Tunai</option>
              <option value="Bank">Bank</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-400">Tanggal Awal</label>
            <input type="date" value={tanggalAwal} onChange={e => setTanggalAwal(e.target.value)} className="w-full bg-slate-900/50 border border-white/10 rounded px-2.5 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-400">Tanggal Akhir</label>
            <input type="date" value={tanggalAkhir} onChange={e => setTanggalAkhir(e.target.value)} className="w-full bg-slate-900/50 border border-white/10 rounded px-2.5 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-400">Kecamatan</label>
            <input type="text" value={kecamatan} disabled className="w-full bg-slate-900/30 border border-white/5 rounded px-2.5 py-1.5 text-sm text-slate-500 cursor-not-allowed" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-400">Sekolah</label>
            <input type="text" value={namaSekolah} disabled className="w-full bg-slate-900/30 border border-white/5 rounded px-2.5 py-1.5 text-sm text-slate-500 cursor-not-allowed" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* KESELURUHAN */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm overflow-hidden">
          <h2 className="text-sm font-bold text-white mb-3">KESELURUHAN</h2>
          
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-slate-900/50 p-2 rounded border border-white/5 text-center">
              <div className="text-[10px] text-slate-400 mb-0.5">KAS DI BANK</div>
              <div className="text-sm font-semibold text-emerald-400">{formatCurrency(overallBank)}</div>
            </div>
            <div className="bg-slate-900/50 p-2 rounded border border-white/5 text-center">
              <div className="text-[10px] text-slate-400 mb-0.5">KAS TUNAI</div>
              <div className="text-sm font-semibold text-emerald-400">{formatCurrency(overallTunai)}</div>
            </div>
            <div className="bg-slate-900/50 p-2 rounded border border-white/5 text-center">
              <div className="text-[10px] text-slate-400 mb-0.5">JUMLAH</div>
              <div className="text-sm font-semibold text-blue-400">{formatCurrency(overallBank - overallTunai)}</div>
            </div>
          </div>
        </div>

        {/* PER TANGGAL */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm overflow-hidden">
          <h2 className="text-sm font-bold text-white mb-3">PER TANGGAL</h2>
          
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-slate-900/50 p-2 rounded border border-white/5 text-center">
              <div className="text-[10px] text-slate-400 mb-0.5">KAS DI BANK</div>
              <div className="text-sm font-semibold text-emerald-400">{formatCurrency(perTanggalBank)}</div>
            </div>
            <div className="bg-slate-900/50 p-2 rounded border border-white/5 text-center">
              <div className="text-[10px] text-slate-400 mb-0.5">KAS TUNAI</div>
              <div className="text-sm font-semibold text-emerald-400">{formatCurrency(perTanggalTunai)}</div>
            </div>
            <div className="bg-slate-900/50 p-2 rounded border border-white/5 text-center">
              <div className="text-[10px] text-slate-400 mb-0.5">JUMLAH</div>
              <div className="text-sm font-semibold text-blue-400">{formatCurrency(perTanggalBank - perTanggalTunai)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        
        {/* Actions Menu */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="relative">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsAksiOpen(!isAksiOpen);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center gap-1.5"
            >
              <Settings className="w-3.5 h-3.5" />
              Pilih Aksi
            </button>
            {isAksiOpen && (
              <div 
                onClick={(e) => e.stopPropagation()}
                className="absolute top-full left-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden flex flex-col"
              >
                <button 
                  onClick={() => {
                    setIsTambahDataOpen(true);
                    setIsAksiOpen(false);
                  }} 
                  className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  Tambah Data
                </button>
                <button 
                  onClick={() => {
                    handleBulkDelete();
                    setIsAksiOpen(false);
                  }} 
                  className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  Hapus Terpilih
                </button>
              </div>
            )}
          </div>

          <div className="relative group">
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5" />
              Import Data
            </button>
            <div className="absolute top-full left-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
              <button onClick={handleImportClick} className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">Import dari Excel</button>
              <button onClick={handleImportClick} className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">Import dari CSV</button>
            </div>
          </div>

          <div className="relative group">
            <button className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center gap-1.5 border border-slate-600">
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
            <div className="absolute top-full left-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
              <button onClick={() => handleExport("PAJAK ARKAS (XLSX)")} className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">PAJAK ARKAS (XLSX)</button>
              <button onClick={() => handleExport("CEK SELISIH (XLSX)")} className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">CEK SELISIH (XLSX)</button>
              <button onClick={() => handleExport("PAJAK GAGAL IMPORT (XLSX)")} className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">PAJAK GAGAL IMPORT (XLSX)</button>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-end mb-6 gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">Show</span>
            <select 
              value={entries} 
              onChange={(e) => setEntries(Number(e.target.value))}
              className="bg-slate-900/50 border border-white/10 rounded-md px-3 py-1.5 text-white focus:outline-none focus:border-blue-500 text-sm"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={250}>250</option>
              <option value={500}>500</option>
              <option value={1000}>1000</option>
              <option value={5000}>Semua</option>
            </select>
            <span className="text-sm text-slate-400">entries</span>
          </div>
          
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari data..." 
              className="w-full bg-slate-900/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] text-slate-400 uppercase bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-3 py-3 font-medium w-10 text-center">
                  <input 
                    type="checkbox" 
                    className="rounded border-slate-600 bg-slate-800"
                    checked={pajakData.length > 0 && selectedIds.length === pajakData.length}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-3 py-3 font-medium w-12">NO.</th>
                <th className="px-3 py-3 font-medium">TANGGAL</th>
                <th className="px-3 py-3 font-medium">KODE KEGIATAN</th>
                <th className="px-3 py-3 font-medium">BELANJA</th>
                <th className="px-3 py-3 font-medium">NO BUKTI</th>
                <th className="px-3 py-3 font-medium">URAIAN</th>
                <th className="px-3 py-3 font-medium text-right">PENGELUARAN</th>
                <th className="px-3 py-3 font-medium text-right">PENGELUARAN</th>
                <th className="px-3 py-3 font-medium text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {pajakData.length > 0 ? (
                pajakData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-3 py-3 text-center">
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-600 bg-slate-800"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => handleSelect(item.id)}
                      />
                    </td>
                    <td className="px-3 py-3 text-slate-300">{index + 1}</td>
                    <td className="px-3 py-3 text-slate-300">{item.tanggal}</td>
                    <td className="px-3 py-3 text-slate-300">{item.kodeKegiatan}</td>
                    <td className="px-3 py-3 text-slate-300">{item.belanja || item.kodeRekening}</td>
                    <td className="px-3 py-3 text-slate-300">{item.noBukti}</td>
                    <td className="px-3 py-3 text-slate-300">{item.uraian}</td>
                    <td className="px-3 py-3 text-right text-slate-300 font-medium">{formatCurrency(item.pengeluaran1)}</td>
                    <td className="px-3 py-3 text-right text-slate-300 font-medium">{formatCurrency(item.pengeluaran2)}</td>
                    <td className="px-3 py-3 text-center">
                      <button 
                        onClick={() => setIsSetorModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                      >
                        Setor
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-slate-500">
                    Belum ada data pajak
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 text-sm text-slate-400">
          <div>Showing {pajakData.length > 0 ? 1 : 0} to {pajakData.length} of {pajakData.length} entries</div>
          <div className="flex items-center gap-1 mt-4 sm:mt-0">
            <button className="px-3 py-1 rounded border border-white/10 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
            <button className="px-3 py-1 rounded border border-white/10 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
          </div>
        </div>

      </div>

      {/* Setor Modal */}
      {isSetorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h2 className="text-lg font-semibold text-white">Form Setor Pajak</h2>
              <button 
                onClick={() => setIsSetorModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Tanggal Setor</label>
                <input 
                  type="date" 
                  className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">NTPN</label>
                <input 
                  type="text" 
                  placeholder="Masukkan Nomor Transaksi Penerimaan Negara"
                  className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
            <div className="p-4 border-t border-white/10 flex justify-end gap-3 bg-white/5">
              <button 
                onClick={() => setIsSetorModalOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={() => setIsSetorModalOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    
      {/* Tambah Data Modal */}
      {isTambahDataOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h2 className="text-lg font-semibold text-white">Tambah Data Pajak</h2>
              <button 
                onClick={() => setIsTambahDataOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto scrollbar-hide">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Tanggal</label>
                <input 
                  type="date" 
                  className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Kode Kegiatan</label>
                <input 
                  type="text" 
                  placeholder="Masukkan Kode Kegiatan"
                  className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Kode Rekening</label>
                <input 
                  type="text" 
                  placeholder="Masukkan Kode Rekening"
                  className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">No Bukti</label>
                <input 
                  type="text" 
                  placeholder="Masukkan No Bukti"
                  className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Uraian</label>
                <input 
                  type="text" 
                  placeholder="Masukkan Uraian"
                  className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Pengeluaran 1 (Rp)</label>
                <input 
                  type="number" 
                  placeholder="0"
                  className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Pengeluaran 2 (Rp)</label>
                <input 
                  type="number" 
                  placeholder="0"
                  className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
            <div className="p-4 border-t border-white/10 flex justify-end gap-3 bg-white/5">
              <button 
                onClick={() => setIsTambahDataOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={() => setIsTambahDataOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Simpan Data
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Import Data Modal */}
      {isImportDataOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h2 className="text-lg font-semibold text-white">Import Data Pajak ARKAS</h2>
              <button 
                onClick={() => setIsImportDataOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <p className="text-sm text-slate-300">
                  Untuk mengimpor data, pastikan format file sesuai dengan template yang disediakan.
                  <br/>
                  <span className="text-xs text-blue-400 font-medium">(Kolom: Tanggal, Kode Kegiatan, Kode Rekening, No Bukti, Uraian, Pengeluaran, Pengeluaran)</span>
                </p>
                <button 
                  onClick={handleDownloadTemplate}
                  className="w-full py-2 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium text-blue-400 transition-colors flex items-center justify-center gap-2 mt-2"
                >
                  <Download className="w-4 h-4" />
                  Download Template Pajak ARKAS
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Pilih File (.xlsx, .csv)</label>
                <div 
                  className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                  <p className="text-sm font-medium text-slate-300">Klik untuk memilih file</p>
                  <p className="text-xs text-slate-500 mt-1">atau seret file ke area ini</p>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={(e) => {
                    handleFileChange(e);
                  }} 
                  className="hidden" 
                  accept=".xlsx,.xls,.csv" 
                />
              </div>
            </div>
            <div className="p-4 border-t border-white/10 flex justify-end gap-3 bg-white/5">
              <button 
                onClick={() => setIsImportDataOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Confirm Modal */}
      {confirmState.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h2 className="text-md font-semibold text-white flex items-center gap-2">
                <span className={confirmState.isAlertOnly ? "text-yellow-500 font-bold" : "text-red-500 font-bold"}>⚠️</span> {confirmState.title}
              </h2>
              <button 
                onClick={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-300 leading-relaxed">
                {confirmState.message}
              </p>
            </div>
            <div className="p-4 border-t border-white/10 flex justify-end gap-3 bg-white/5">
              {confirmState.isAlertOnly ? (
                <button 
                  onClick={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
                  className="px-5 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  Dimengerti
                </button>
              ) : (
                <>
                  <button 
                    onClick={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    Batal
                  </button>
                  <button 
                    onClick={() => {
                      confirmState.onConfirm();
                      setConfirmState(prev => ({ ...prev, isOpen: false }));
                    }}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
                  >
                    Ya, Hapus
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
