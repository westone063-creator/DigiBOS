import { getProfilSekolah } from '../utils/settings';
import React, { useState, useRef } from 'react';
import { Search, Download, Upload, Settings, X, Edit2, Trash2 } from 'lucide-react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import VerABosTable from './VerABosTable';

export default function BphPersediaan() {
  const { kecamatan, namaSekolah } = getProfilSekolah();

  const [entries, setEntries] = useState(10);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [daftarRekening] = useState<any[]>(() => {
    const saved = localStorage.getItem('daftarRekening');
    return saved ? JSON.parse(saved) : [];
  });

  const [daftarSNP] = useState<any[]>(() => {
    const saved = localStorage.getItem('daftarSNP');
    return saved ? JSON.parse(saved) : [];
  });

  const handleImportClick = () => {
    setIsImportDataOpen(true);
  };

  const handleDownloadTemplate = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Template BPH Persediaan');

    const headers = ['TANGGAL', 'KODE KEGIATAN', 'KODE REKENING', 'NO. BUKTI', 'ID BARANG', 'URAIAN', 'JUMLAH BARANG', 'HARGA SATUAN'];
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
    saveAs(new Blob([buffer]), "template_bph_persediaan.xlsx");
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(await file.arrayBuffer());
        const worksheet = workbook.worksheets[0];
        
        const newData: any[] = [];
        let newId = bphData.length > 0 ? Math.max(...bphData.map(d => d.id)) + 1 : 1;
        
        // Helper to get string value from cell safely (handles rich text, formula, hyperlink, numbers)
        const getCellValue = (row: ExcelJS.Row, colIndex: number): string => {
          const cell = row.getCell(colIndex);
          if (!cell || cell.value === null || cell.value === undefined) return '';
          const val = cell.value;
          
          if (typeof val === 'string') return val.trim();
          if (typeof val === 'number' || typeof val === 'boolean') return val.toString();
          if (val instanceof Date) return val.toISOString().split('T')[0];
          
          if (typeof val === 'object') {
            if ('result' in val) {
              if (val.result === null || val.result === undefined) return '';
              return val.result.toString().trim();
            }
            if ('text' in val) {
              return (val.text || '').toString().trim();
            }
            if ('richText' in val && Array.isArray((val as any).richText)) {
              return (val as any).richText.map((rt: any) => rt.text || '').join('').trim();
            }
          }
          
          const txt = cell.text;
          if (txt !== undefined && txt !== null) {
            return txt.trim();
          }
          return '';
        };

        // Default column mapping if header isn't found
        let colMap = {
          tanggal: 1,
          kodeKegiatan: 2,
          kodeRekening: 3,
          noBukti: 4,
          idBarang: 5,
          uraian: 6,
          jumlahBarang: 7,
          hargaSatuan: 8,
        };

        // Try to scan first row for dynamic header mapping
        const firstRow = worksheet.getRow(1);
        if (firstRow) {
          firstRow.eachCell((cell, colNumber) => {
            const valStr = cell.value?.toString() || cell.text || '';
            const text = valStr.toLowerCase().trim().replace(/[\s_.-]+/g, '');
            if (text === 'tanggal' || text === 'tgl' || text === 'date') {
              colMap.tanggal = colNumber;
            } else if (text === 'kodekegiatan' || text === 'kegiatan' || text === 'activitycode') {
              colMap.kodeKegiatan = colNumber;
            } else if (text === 'koderekening' || text === 'rekening' || text === 'accountcode') {
              colMap.kodeRekening = colNumber;
            } else if (text === 'nobukti' || text === 'bukti' || text === 'refno' || text === 'invoice') {
              colMap.noBukti = colNumber;
            } else if (text === 'idbarang' || text === 'kodebarang' || text === 'kdbarang' || text === 'itemid' || text === 'id') {
              colMap.idBarang = colNumber;
            } else if (text === 'uraian' || text === 'namabarang' || text === 'keterangan' || text === 'description') {
              colMap.uraian = colNumber;
            } else if (text === 'jumlahbarang' || text === 'jumlah' || text === 'qty' || text === 'quantity') {
              colMap.jumlahBarang = colNumber;
            } else if (text === 'hargasatuan' || text === 'harga' || text === 'unitprice') {
              colMap.hargaSatuan = colNumber;
            }
          });
        }
        
        const savedRekening = localStorage.getItem('daftarRekening');
        const listRekening = savedRekening ? JSON.parse(savedRekening) : [];

        const savedSNP = localStorage.getItem('daftarSNP');
        const listSNP = savedSNP ? JSON.parse(savedSNP) : [];

        worksheet.eachRow((row, rowNumber) => {
          if (rowNumber > 1) { // Skip header
            let cellTanggal = row.getCell(colMap.tanggal);
            let tanggal = getCellValue(row, colMap.tanggal);
            if (cellTanggal && cellTanggal.type === ExcelJS.ValueType.Date) {
              const dateVal = cellTanggal.value;
              if (dateVal instanceof Date) {
                tanggal = dateVal.toISOString().split('T')[0];
              }
            }
            
            const kodeRekInput = getCellValue(row, colMap.kodeRekening);
            const normalizedRekInput = String(kodeRekInput || '').replace(/\./g, '').trim();
            const matchedRek = listRekening.find((r: any) => String(r.kodeSubKomponen || '').replace(/\./g, '').trim() === normalizedRekInput);
            
            let belanjaValue = 'BARANG PAKAI HABIS';
            if (matchedRek) {
              belanjaValue = `${matchedRek.kodeSubKomponen} - ${matchedRek.uraianSubKomponen}`;
            } else if (kodeRekInput) {
              belanjaValue = `${kodeRekInput} - (Tidak Ditemukan di Daftar Rekening)`;
            }

            const kodeKegInput = getCellValue(row, colMap.kodeKegiatan);
            const normalizedKegInput = String(kodeKegInput || '').replace(/\./g, '').trim();
            const matchedSNP = listSNP.find((snp: any) => String(snp.kodeRekening || '').replace(/\./g, '').trim() === normalizedKegInput);

            let kegiatanValue = kodeKegInput || '';
            if (matchedSNP) {
              kegiatanValue = `${matchedSNP.kodeRekening}, ${matchedSNP.uraian}`;
            } else if (kodeKegInput) {
              kegiatanValue = `${kodeKegInput}, (Tidak Ditemukan di Daftar SNP)`;
            }

            newData.push({
              id: newId++,
              tanggal: tanggal,
              kodeKegiatan: kodeKegInput,
              kodeRekening: kodeRekInput,
              noBukti: getCellValue(row, colMap.noBukti),
              idBarang: getCellValue(row, colMap.idBarang),
              uraian: getCellValue(row, colMap.uraian),
              jumlahBarang: Number(getCellValue(row, colMap.jumlahBarang)) || 0,
              hargaSatuan: Number(getCellValue(row, colMap.hargaSatuan)) || 0,
              satuan: 'unit',
              belanja: belanjaValue,
              kegiatan: kegiatanValue,
            });
          }
        });
        
        setBphData(prev => [...prev, ...newData]);
        alert(`Berhasil mengimpor ${newData.length} data dari file: ${file.name}`);
        setIsImportDataOpen(false);
      } catch (error) {
        console.error(error);
        alert("Gagal membaca file Excel. Pastikan format file sesuai.");
      }
      
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleExport = async (type: string) => {
    if (type === "BPH PERSEDIAAN (XLSX)") {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('BPH Persediaan');
      
      worksheet.columns = [
        { header: 'No', key: 'no', width: 5 },
        { header: 'Tanggal', key: 'tanggal', width: 15 },
        { header: 'No Bukti', key: 'noBukti', width: 20 },
        { header: 'Jenis Belanja', key: 'belanja', width: 30 },
        { header: 'Kegiatan', key: 'kegiatan', width: 30 },
        { header: 'Uraian/Nama Barang', key: 'uraian', width: 40 },
        { header: 'Volume', key: 'jumlahBarang', width: 15 },
        { header: 'Satuan', key: 'satuan', width: 15 },
        { header: 'Harga Satuan (Rp)', key: 'hargaSatuan', width: 20 },
        { header: 'Jumlah Harga (Rp)', key: 'jumlah', width: 20 },
      ];

      bphData.forEach((item, index) => {
        worksheet.addRow({
          no: index + 1,
          tanggal: item.tanggal,
          noBukti: item.noBukti,
          belanja: item.belanja,
          kegiatan: item.kegiatan,
          uraian: item.uraian,
          jumlahBarang: item.jumlahBarang,
          satuan: item.satuan,
          hargaSatuan: item.hargaSatuan,
          jumlah: (Number(item.jumlahBarang) || 0) * (Number(item.hargaSatuan) || 0),
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'bph_persediaan.xlsx');
    } else {
      alert(`Fitur export ${type} sedang dalam pengembangan.`);
    }
  };

  const [isTambahDataOpen, setIsTambahDataOpen] = useState(false);
  const [isImportDataOpen, setIsImportDataOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const [bphData, setBphData] = useState<any[]>(() => {
    const saved = localStorage.getItem('bphData');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((item: any) => ({ ...item, satuan: 'unit' }));
    }
    return [
    { id: 1, tanggal: '2024-02-15', noBukti: 'BKT-001', belanja: 'BARANG PAKAI HABIS', kegiatan: 'Operasional Sekolah', uraian: 'Pembelian Kertas HVS', jumlahBarang: 10, satuan: 'unit', hargaSatuan: 55000 }
  ];
  });
  React.useEffect(() => {
    localStorage.setItem('bphData', JSON.stringify(bphData));
  }, [bphData]);
  
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
      setSelectedIds(bphData.map(item => item.id));
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

  // Edit Form State
  const [formData, setFormData] = useState({
    tanggal: '',
    noBukti: '',
    belanja: 'BARANG PAKAI HABIS',
    kegiatan: '',
    uraian: '',
    jumlahBarang: '',
    satuan: 'unit',
    hargaSatuan: ''
  });

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      tanggal: item.tanggal,
      noBukti: item.noBukti,
      belanja: item.belanja,
      kegiatan: item.kegiatan,
      uraian: item.uraian,
      jumlahBarang: item.jumlahBarang.toString(),
      satuan: item.satuan,
      hargaSatuan: item.hargaSatuan.toString()
    });
    setIsTambahDataOpen(true);
  };

  const openTambahData = () => {
    setEditingItem(null);
    setFormData({
      tanggal: '',
      noBukti: '',
      belanja: 'BARANG PAKAI HABIS',
      kegiatan: '',
      uraian: '',
      jumlahBarang: '',
      satuan: 'unit',
      hargaSatuan: ''
    });
    setIsTambahDataOpen(true);
  };

  const handleSave = () => {
    if (editingItem) {
      setBphData(prev => prev.map(item => item.id === editingItem.id ? { ...item, ...formData, jumlahBarang: Number(formData.jumlahBarang), hargaSatuan: Number(formData.hargaSatuan) } : item));
    } else {
      const newId = bphData.length > 0 ? Math.max(...bphData.map(d => d.id)) + 1 : 1;
      setBphData(prev => [...prev, { id: newId, ...formData, jumlahBarang: Number(formData.jumlahBarang), hargaSatuan: Number(formData.hargaSatuan) }]);
    }
    setIsTambahDataOpen(false);
  };

  const handleDelete = (id: number) => {
    setConfirmState({
      isOpen: true,
      title: 'Konfirmasi Hapus',
      message: 'Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.',
      isAlertOnly: false,
      onConfirm: () => {
        setBphData(prev => prev.filter(item => item.id !== id));
      }
    });
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) {
      setConfirmState({
        isOpen: true,
        title: 'Pilih Data Terlebih Dahulu',
        message: 'Silakan pilih data yang ingin dihapus terlebih dahulu.',
        isAlertOnly: true,
        onConfirm: () => {}
      });
      return;
    }
    setConfirmState({
      isOpen: true,
      title: 'Konfirmasi Hapus Terpilih',
      message: `Apakah Anda yakin ingin menghapus ${selectedIds.length} data terpilih? Tindakan ini tidak dapat dibatalkan.`,
      isAlertOnly: false,
      onConfirm: () => {
        setBphData(prev => prev.filter(item => !selectedIds.includes(item.id)));
        setSelectedIds([]);
      }
    });
  };

  const [sumberDana, setSumberDana] = useState('BOSP Reguler');
  const [jenisKas, setJenisKas] = useState('Semua Kas');
  const [tanggalAwal, setTanggalAwal] = useState('');
  const [tanggalAkhir, setTanggalAkhir] = useState('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">BPH (Persediaan)</h1>
          <p className="text-slate-400 text-sm mt-1">Buku Pembantu Rincian Objek Belanja Persediaan</p>
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
        {/* KESELURUHAN TABLE */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm overflow-hidden">
          <h2 className="text-sm font-bold text-white mb-3">KESELURUHAN</h2>
          <VerABosTable dependencies={[bphData]} />
        </div>

        {/* PER TANGGAL TABLE */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm overflow-hidden">
          <h2 className="text-sm font-bold text-white mb-3">PER TANGGAL</h2>
          <VerABosTable tanggalAwal={tanggalAwal} tanggalAkhir={tanggalAkhir} dependencies={[bphData]} />
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
                className="absolute top-full left-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden"
              >
                <button 
                  onClick={() => {
                    openTambahData();
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
              <button onClick={() => handleExport("BPH PERSEDIAAN (XLSX)")} className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">BPH PERSEDIAAN (XLSX)</button>
              <button onClick={() => handleExport("CEK SELISIH (XLSX)")} className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">CEK SELISIH (XLSX)</button>
              <button onClick={() => handleExport("BPH GAGAL IMPORT (XLSX)")} className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">BPH GAGAL IMPORT (XLSX)</button>
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
                    checked={bphData.length > 0 && selectedIds.length === bphData.length}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-3 py-3 font-medium w-12">NO.</th>
                <th className="px-3 py-3 font-medium">TANGGAL</th>
                <th className="px-3 py-3 font-medium">NO. BUKTI</th>
                <th className="px-3 py-3 font-medium">BELANJA</th>
                <th className="px-3 py-3 font-medium">KEGIATAN</th>
                <th className="px-3 py-3 font-medium">URAIAN</th>
                <th className="px-3 py-3 font-medium text-right">JUMLAH BARANG</th>
                <th className="px-3 py-3 font-medium">SATUAN</th>
                <th className="px-3 py-3 font-medium text-right">HARGA SATUAN</th>
                <th className="px-3 py-3 font-medium text-right">JUMLAH HARGA</th>
                <th className="px-3 py-3 font-medium text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {bphData.length > 0 ? (
                bphData.map((item, index) => (
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
                    <td className="px-3 py-3 text-slate-300">{item.noBukti}</td>
                    <td className="px-3 py-3 text-slate-300">{item.belanja}</td>
                    <td className="px-3 py-3 text-slate-300">{item.kegiatan}</td>
                    <td className="px-3 py-3 text-slate-300">{item.uraian}</td>
                    <td className="px-3 py-3 text-right text-slate-300">{item.jumlahBarang}</td>
                    <td className="px-3 py-3 text-slate-300">{item.satuan}</td>
                    <td className="px-3 py-3 text-right text-slate-300">{formatCurrency(item.hargaSatuan)}</td>
                    <td className="px-3 py-3 text-right text-emerald-400 font-medium">{formatCurrency(item.jumlahBarang * item.hargaSatuan)}</td>
                    <td className="px-3 py-3 text-center">
                      <div className="flex justify-center">
                        <div className="relative group/action">
                          <button className="p-1.5 bg-slate-800 text-slate-300 hover:text-white rounded border border-white/10 transition-colors">
                            <Settings className="w-4 h-4" />
                          </button>
                          <div className="absolute right-0 top-full mt-1 w-32 bg-slate-800 border border-slate-700 rounded-lg shadow-xl opacity-0 invisible group-hover/action:opacity-100 group-hover/action:visible transition-all z-50 overflow-hidden flex flex-col text-left">
                            <button onClick={() => handleEdit(item)} className="px-3 py-2 text-xs text-slate-300 hover:bg-slate-700 hover:text-white transition-colors text-left flex items-center gap-2">
                              <Edit2 className="w-3.5 h-3.5" /> Edit
                            </button>
                            <button onClick={() => handleDelete(item.id)} className="px-3 py-2 text-xs text-red-400 hover:bg-slate-700 hover:text-red-300 transition-colors text-left flex items-center gap-2">
                              <Trash2 className="w-3.5 h-3.5" /> Hapus
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={12} className="px-4 py-8 text-center text-slate-500">
                    Belum ada data persediaan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 text-sm text-slate-400">
          <div>Showing {bphData.length > 0 ? 1 : 0} to {bphData.length} of {bphData.length} entries</div>
          <div className="flex items-center gap-1 mt-4 sm:mt-0">
            <button className="px-3 py-1 rounded border border-white/10 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
            <button className="px-3 py-1 rounded border border-white/10 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
          </div>
        </div>

      </div>

      {/* Tambah/Edit Data Modal */}
      {isTambahDataOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h2 className="text-lg font-semibold text-white">{editingItem ? 'Edit Data BPH' : 'Tambah Data BPH'}</h2>
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
                  value={formData.tanggal}
                  onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">No. Bukti</label>
                <input 
                  type="text" 
                  value={formData.noBukti}
                  onChange={(e) => setFormData({ ...formData, noBukti: e.target.value })}
                  placeholder="Masukkan Nomor Bukti"
                  className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Jenis Belanja</label>
                <select 
                  value={formData.belanja}
                  onChange={(e) => setFormData({ ...formData, belanja: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="NON BARANG PAKAI HABIS">NON BARANG PAKAI HABIS</option>
                  <option value="BARANG PAKAI HABIS">BARANG PAKAI HABIS</option>
                  <option value="BARANG MODAL PERALATAN DAN MESIN">BARANG MODAL PERALATAN DAN MESIN</option>
                  <option value="BARANG MODAL ASET TETAP LAINNYA">BARANG MODAL ASET TETAP LAINNYA</option>
                  {daftarRekening.map((rek, idx) => {
                    const val = `${rek.kodeSubKomponen} - ${rek.uraianSubKomponen}`;
                    return <option key={`rek-${idx}`} value={val}>{val}</option>;
                  })}
                  {formData.belanja && 
                   !["NON BARANG PAKAI HABIS", "BARANG PAKAI HABIS", "BARANG MODAL PERALATAN DAN MESIN", "BARANG MODAL ASET TETAP LAINNYA"].includes(formData.belanja) &&
                   !daftarRekening.some(rek => `${rek.kodeSubKomponen} - ${rek.uraianSubKomponen}` === formData.belanja) && (
                    <option value={formData.belanja}>{formData.belanja}</option>
                  )}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Kegiatan</label>
                <select 
                  value={formData.kegiatan}
                  onChange={(e) => setFormData({ ...formData, kegiatan: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="">Pilih Kegiatan</option>
                  {daftarSNP.map((snp, idx) => {
                    const val = `${snp.kodeRekening}, ${snp.uraian}`;
                    return <option key={`snp-${idx}`} value={val}>{val}</option>;
                  })}
                  {formData.kegiatan && 
                   !daftarSNP.some(snp => `${snp.kodeRekening}, ${snp.uraian}` === formData.kegiatan) && (
                    <option value={formData.kegiatan}>{formData.kegiatan}</option>
                  )}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Nama Barang / Uraian</label>
                <input 
                  type="text" 
                  value={formData.uraian}
                  onChange={(e) => setFormData({ ...formData, uraian: e.target.value })}
                  placeholder="Masukkan Nama Barang"
                  className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Volume / Jumlah Barang</label>
                <input 
                  type="number" 
                  value={formData.jumlahBarang}
                  onChange={(e) => setFormData({ ...formData, jumlahBarang: e.target.value })}
                  placeholder="0"
                  className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Satuan</label>
                <input 
                  type="text" 
                  value={formData.satuan}
                  onChange={(e) => setFormData({ ...formData, satuan: e.target.value })}
                  placeholder="misal: unit"
                  className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Harga Satuan</label>
                <input 
                  type="number" 
                  value={formData.hargaSatuan}
                  onChange={(e) => setFormData({ ...formData, hargaSatuan: e.target.value })}
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
                onClick={handleSave}
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
              <h2 className="text-lg font-semibold text-white">Import Data BPH Persediaan</h2>
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
                  <span className="text-xs text-blue-400 font-medium">(Kolom: TANGGAL, KODE KEGIATAN, KODE REKENING, NO. BUKTI, ID BARANG, URAIAN, JUMLAH BARANG, HARGA SATUAN)</span>
                </p>
                <button 
                  onClick={handleDownloadTemplate}
                  className="w-full py-2 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium text-blue-400 transition-colors flex items-center justify-center gap-2 mt-2"
                >
                  <Download className="w-4 h-4" />
                  Download Template BPH Persediaan
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
