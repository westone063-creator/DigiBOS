import { getProfilSekolah } from '../utils/settings';
import React, { useState, useRef } from 'react';
import { Search, Download, Upload, Settings, X, Edit2, Trash2 } from 'lucide-react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import VerABosTable from './VerABosTable';

export default function BkuArkas() {
  const { kecamatan, namaSekolah } = getProfilSekolah();

  const [entries, setEntries] = useState(10);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    setIsImportDataOpen(true);
  };

  const handleDownloadTemplate = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Template BKU Arkas');

    const headers = ['TANGGAL', 'KODE KEGIATAN', 'KODE REKENING', 'NO BUKTI', 'URAIAN', 'PENGELUARAN'];
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
    saveAs(new Blob([buffer]), "template_bku_arkas.xlsx");
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(await file.arrayBuffer());
        const worksheet = workbook.worksheets[0];
        
        const newData: any[] = [];
        let newId = bkuData.length > 0 ? Math.max(...bkuData.map(d => d.id)) + 1 : 1;
        
        // Load SNP list from localStorage for matching/alignment
        const savedSnp = localStorage.getItem('daftarSNP');
        const snpList: any[] = savedSnp ? JSON.parse(savedSnp) : [];

        // Load Rekening list from localStorage
        const savedRekening = localStorage.getItem('daftarRekening');
        const rekeningList: any[] = savedRekening ? JSON.parse(savedRekening) : [];

        // Pre-normalize SNP codes and descriptions for quick & robust comparison
        const normalizedSnpList = snpList.map(item => {
          const rawCode = item.kodeRekening || '';
          const rawUraian = item.uraian || '';
          return {
            original: item,
            cleanCode: rawCode.toLowerCase().trim().replace(/[\s_.-]+/g, ''),
            cleanUraian: rawUraian.toLowerCase().trim().replace(/[\s_.-]+/g, '')
          };
        });

        // Pre-normalize Rekening codes
        const normalizedRekeningList = rekeningList.map(item => {
          // Use kodeSubKomponen or other available codes for matching
          const rawCode = item.kodeSubKomponen || item.kodeKomponen || item.kodeSubAkun || item.kodeAkun || '';
          const rawUraian = item.uraianSubKomponen || item.uraianKomponen || item.namaBarangJasa || '';
          return {
            original: item,
            cleanCode: rawCode.toLowerCase().trim().replace(/[\s_.-]+/g, ''),
            cleanUraian: rawUraian.toLowerCase().trim().replace(/[\s_.-]+/g, '')
          };
        });

        // Helper to get string value from cell safely
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
          uraian: 5,
          pengeluaran: 6,
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
            } else if (text === 'uraian' || text === 'namabarang' || text === 'keterangan' || text === 'description') {
              colMap.uraian = colNumber;
            } else if (text === 'pengeluaran' || text === 'jumlah' || text === 'debet' || text === 'kredit' || text === 'amount') {
              colMap.pengeluaran = colNumber;
            }
          });
        }
        
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

            let importedCode = getCellValue(row, colMap.kodeRekening);
            let importedUraian = getCellValue(row, colMap.uraian);
            let importedKegiatan = getCellValue(row, colMap.kodeKegiatan);

            const cleanImportedCode = importedCode.toLowerCase().trim().replace(/[\s_.-]+/g, '');
            const cleanImportedUraian = importedUraian.toLowerCase().trim().replace(/[\s_.-]+/g, '');

            // Find a matching item in the SNP list for KODE KEGIATAN
            let matchedSnp = undefined;
            const cleanImportedKegiatan = importedKegiatan.toLowerCase().trim().replace(/[\s_.-]+/g, '');
            if (cleanImportedKegiatan) {
              matchedSnp = normalizedSnpList.find(snp => snp.cleanCode === cleanImportedKegiatan);
            }
            if (!matchedSnp && cleanImportedUraian) {
               matchedSnp = normalizedSnpList.find(snp => snp.cleanUraian === cleanImportedUraian || snp.cleanUraian.includes(cleanImportedUraian) || cleanImportedUraian.includes(snp.cleanUraian));
            }

            // Find a matching item in the Rekening list for KODE REKENING
            let matchedRekening = undefined;
            if (cleanImportedCode) {
              // Exact match first
              matchedRekening = normalizedRekeningList.find(rek => rek.cleanCode === cleanImportedCode);
              
              if (!matchedRekening) {
                 // Try partial match or matching uraian
                 matchedRekening = normalizedRekeningList.find(rek => {
                    return (rek.cleanCode && cleanImportedCode.includes(rek.cleanCode)) ||
                           (rek.cleanUraian && rek.cleanUraian === cleanImportedUraian);
                 });
              }
            }

            // Align properties
            let finalCode = importedCode;
            let finalKegiatan = importedKegiatan;
            let finalBelanja = 'BARANG PAKAI HABIS';

            if (matchedSnp) {
              // Menampilkan Kode Rekening, Uraian yang diambil dari Daftar SNP
              const matchedCode = matchedSnp.original.kodeRekening || '';
              const matchedUraian = matchedSnp.original.uraian || '';
              if (matchedCode || matchedUraian) {
                finalKegiatan = [matchedCode, matchedUraian].filter(Boolean).join(', ');
              } else {
                finalKegiatan = matchedSnp.original.subKegiatan || matchedSnp.original.kegiatan || finalKegiatan;
              }
            }

            if (matchedRekening) {
              finalCode = matchedRekening.original.kodeSubKomponen || matchedRekening.original.kodeKomponen || finalCode;
              
              // Menampilkan Kode Sub Komponen, Uraian Sub Komponen yang diambil dari Daftar Rekening
              const matchedSubKomponen = matchedRekening.original.kodeSubKomponen || '';
              const matchedUraianSub = matchedRekening.original.uraianSubKomponen || '';
              if (matchedSubKomponen || matchedUraianSub) {
                finalBelanja = [matchedSubKomponen, matchedUraianSub].filter(Boolean).join(', ');
              } else {
                 finalBelanja = matchedRekening.original.namaBarangJasa || finalBelanja;
              }
            } else if (matchedSnp) {
              // Fallback to old behavior if no rekening matched but snp matched
              const prog = (matchedSnp.original.program || '').toLowerCase();
              const subProg = (matchedSnp.original.subProgram || '').toLowerCase();
              const ur = (matchedSnp.original.uraian || '').toLowerCase();

              if (ur.includes('modal') || prog.includes('modal') || subProg.includes('modal')) {
                if (ur.includes('peralatan') || ur.includes('mesin')) {
                  finalBelanja = 'BARANG MODAL PERALATAN DAN MESIN';
                } else {
                  finalBelanja = 'BARANG MODAL ASET TETAP LAINNYA';
                }
              } else if (ur.includes('pegawai') || ur.includes('gaji') || ur.includes('honor')) {
                finalBelanja = 'NON BARANG PAKAI HABIS';
              }
            }
            
            newData.push({
              id: newId++,
              jenisKas: 'KAS DI BANK', // default
              tanggal: tanggal,
              kodeKegiatan: finalKegiatan,
              kodeRekening: finalCode,
              noBukti: getCellValue(row, colMap.noBukti),
              uraian: importedUraian,
              jumlah: Number(getCellValue(row, colMap.pengeluaran)) || 0,
              belanja: finalBelanja,
              kegiatan: finalKegiatan,
            });
          }
        });
        
        setBkuData(prev => [...prev, ...newData]);
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
    if (type === "BKU ARKAS (XLSX)") {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('BKU Arkas');
      
      worksheet.columns = [
        { header: 'No', key: 'no', width: 5 },
        { header: 'Jenis Kas', key: 'jenisKas', width: 15 },
        { header: 'Tanggal', key: 'tanggal', width: 15 },
        { header: 'No Bukti', key: 'noBukti', width: 20 },
        { header: 'Kode Rekening', key: 'kodeRekening', width: 20 },
        { header: 'Jenis Belanja', key: 'belanja', width: 30 },
        { header: 'Kegiatan', key: 'kegiatan', width: 30 },
        { header: 'Uraian', key: 'uraian', width: 40 },
        { header: 'Jumlah (Rp)', key: 'jumlah', width: 20 },
      ];

      displayedBkuData.forEach((item, index) => {
        worksheet.addRow({
          no: index + 1,
          jenisKas: item.jenisKas,
          tanggal: item.tanggal,
          noBukti: item.noBukti,
          kodeRekening: item.kodeRekening,
          belanja: item.belanja,
          kegiatan: item.kegiatan,
          uraian: item.uraian,
          jumlah: item.jumlah,
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'bku_arkas.xlsx');
    } else {
      alert(`Fitur export ${type} sedang dalam pengembangan.`);
    }
  };

   const [isTambahDataOpen, setIsTambahDataOpen] = useState(false);
  const [isImportDataOpen, setIsImportDataOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  const [isAksiOpen, setIsAksiOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

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

  React.useEffect(() => {
    const handleOutsideClick = () => {
      setIsAksiOpen(false);
      setIsImportOpen(false);
      setIsExportOpen(false);
    };
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);
  
  const [bkuData, setBkuData] = useState<any[]>(() => {
    const saved = localStorage.getItem('bkuData');
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, jenisKas: 'KAS DI BANK', tanggal: '2024-02-15', noBukti: 'BKT-001', belanja: 'BARANG PAKAI HABIS', kegiatan: 'Operasional Sekolah', uraian: 'Pembelian Kertas HVS', jumlah: 150000 }
    ];
  });

  React.useEffect(() => {
    localStorage.setItem('bkuData', JSON.stringify(bkuData));
  }, [bkuData]);
  
  const displayedBkuData = React.useMemo(() => {
    return bkuData.filter(item => item.noBukti && String(item.noBukti).trim() !== '');
  }, [bkuData]);

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(displayedBkuData.map(item => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelect = (id: any) => {
    const isAlreadySelected = selectedIds.some(selectedId => String(selectedId) === String(id));
    if (isAlreadySelected) {
      setSelectedIds(selectedIds.filter(selectedId => String(selectedId) !== String(id)));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };
  
  // Edit Form State
  const [formData, setFormData] = useState({
    tanggal: '',
    jenisKas: 'KAS DI BANK',
    noBukti: '',
    belanja: 'BARANG PAKAI HABIS',
    kegiatan: '',
    uraian: '',
    jumlah: ''
  });

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      tanggal: item.tanggal,
      jenisKas: item.jenisKas,
      noBukti: item.noBukti,
      belanja: item.belanja,
      kegiatan: item.kegiatan,
      uraian: item.uraian,
      jumlah: item.jumlah.toString()
    });
    setIsTambahDataOpen(true);
  };

  const openTambahData = () => {
    setEditingItem(null);
    setFormData({
      tanggal: '',
      jenisKas: 'KAS DI BANK',
      noBukti: '',
      belanja: 'BARANG PAKAI HABIS',
      kegiatan: '',
      uraian: '',
      jumlah: ''
    });
    setIsTambahDataOpen(true);
  };

  const handleSave = () => {
    if (editingItem) {
      setBkuData(prev => prev.map(item => item.id === editingItem.id ? { ...item, ...formData, jumlah: Number(formData.jumlah) } : item));
    } else {
      const newId = bkuData.length > 0 ? Math.max(...bkuData.map(d => d.id)) + 1 : 1;
      setBkuData(prev => [...prev, { id: newId, ...formData, jumlah: Number(formData.jumlah) }]);
    }
    setIsTambahDataOpen(false);
  };

  const handleDelete = (id: number) => {
    setConfirmState({
      isOpen: true,
      title: 'Konfirmasi Hapus Data',
      message: 'Apakah Anda yakin ingin menghapus data BKU ini? Tindakan ini tidak dapat dibatalkan.',
      isAlertOnly: false,
      onConfirm: () => {
        setBkuData(prev => prev.filter(item => item.id !== id));
        setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
      }
    });
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
      message: `Apakah Anda yakin ingin menghapus ${selectedIds.length} data yang dipilih? Tindakan ini tidak dapat dibatalkan.`,
      isAlertOnly: false,
      onConfirm: () => {
        setBkuData(prev => prev.filter(item => !selectedIds.some(selectedId => String(selectedId) === String(item.id))));
        setSelectedIds([]);
      }
    });
  };

  const [sumberDana, setSumberDana] = useState('BOSP Reguler');
  const [jenisKas, setJenisKas] = useState('Semua Kas');
  const [tanggalAwal, setTanggalAwal] = useState('');
  const [tanggalAkhir, setTanggalAkhir] = useState('');

  const overallBank = bkuData.filter(item => item.jenisKas === 'KAS DI BANK').reduce((acc, curr) => acc + (Number(curr.jumlah) || 0), 0);
  const overallTunai = bkuData.filter(item => item.jenisKas === 'KAS TUNAI').reduce((acc, curr) => acc + (Number(curr.jumlah) || 0), 0);

  const filteredBkuData = bkuData.filter(item => {
    if (!tanggalAwal && !tanggalAkhir) return true;
    const itemDate = new Date(item.tanggal);
    if (tanggalAwal && new Date(tanggalAwal) > itemDate) return false;
    if (tanggalAkhir && new Date(tanggalAkhir) < itemDate) return false;
    return true;
  });

  const perTanggalBank = filteredBkuData.filter(item => item.jenisKas === 'KAS DI BANK').reduce((acc, curr) => acc + (Number(curr.jumlah) || 0), 0);
  const perTanggalTunai = filteredBkuData.filter(item => item.jenisKas === 'KAS TUNAI').reduce((acc, curr) => acc + (Number(curr.jumlah) || 0), 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">BKU ARKAS</h1>
          <p className="text-slate-400 text-sm mt-1">Buku Kas Umum ARKAS BOSP</p>
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
          
          <div className="grid grid-cols-3 gap-2 mb-3">
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

          <VerABosTable dependencies={[bkuData]} />
        </div>

        {/* PER TANGGAL TABLE */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm overflow-hidden">
          <h2 className="text-sm font-bold text-white mb-3">PER TANGGAL</h2>
          
          <div className="grid grid-cols-3 gap-2 mb-3">
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

          <VerABosTable tanggalAwal={tanggalAwal} tanggalAkhir={tanggalAkhir} dependencies={[bkuData]} />
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
                setIsImportOpen(false);
                setIsExportOpen(false);
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

          <div className="relative">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsImportOpen(!isImportOpen);
                setIsAksiOpen(false);
                setIsExportOpen(false);
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              Import Data
            </button>
            {isImportOpen && (
              <div 
                onClick={(e) => e.stopPropagation()}
                className="absolute top-full left-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden flex flex-col"
              >
                <button 
                  onClick={() => {
                    handleImportClick();
                    setIsImportOpen(false);
                  }} 
                  className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  Import dari Excel
                </button>
                <button 
                  onClick={() => {
                    handleImportClick();
                    setIsImportOpen(false);
                  }} 
                  className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  Import dari CSV
                </button>
              </div>
            )}
          </div>

          <div className="relative">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsExportOpen(!isExportOpen);
                setIsAksiOpen(false);
                setIsImportOpen(false);
              }}
              className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center gap-1.5 border border-slate-600"
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
            {isExportOpen && (
              <div 
                onClick={(e) => e.stopPropagation()}
                className="absolute top-full left-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden flex flex-col"
              >
                <button 
                  onClick={() => {
                    handleExport("BKU ARKAS (XLSX)");
                    setIsExportOpen(false);
                  }} 
                  className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  BKU ARKAS (XLSX)
                </button>
                <button 
                  onClick={() => {
                    handleExport("CEK SELISIH (XLSX)");
                    setIsExportOpen(false);
                  }} 
                  className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  CEK SELISIH (XLSX)
                </button>
                <button 
                  onClick={() => {
                    handleExport("BKU ARKAS GAGAL IMPORT (XLSX)");
                    setIsExportOpen(false);
                  }} 
                  className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  BKU ARKAS GAGAL IMPORT (XLSX)
                </button>
              </div>
            )}
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
            <thead className="text-xs text-slate-400 uppercase bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-4 py-4 font-medium w-12 text-center">
                  <input 
                    type="checkbox" 
                    className="rounded border-slate-600 bg-slate-800"
                    checked={displayedBkuData.length > 0 && selectedIds.length === displayedBkuData.length}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-4 py-4 font-medium w-16">NO.</th>
                <th className="px-4 py-4 font-medium">JENIS KAS</th>
                <th className="px-4 py-4 font-medium">TANGGAL</th>
                <th className="px-4 py-4 font-medium">NO. BUKTI</th>
                <th className="px-4 py-4 font-medium">BELANJA</th>
                <th className="px-4 py-4 font-medium">KEGIATAN</th>
                <th className="px-4 py-4 font-medium">URAIAN</th>
                <th className="px-4 py-4 font-medium text-right">JUMLAH</th>
                <th className="px-4 py-4 font-medium text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {displayedBkuData.length > 0 ? (
                displayedBkuData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-4 text-center">
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-600 bg-slate-800" 
                        checked={selectedIds.includes(item.id)}
                        onChange={() => handleSelect(item.id)}
                      />
                    </td>
                    <td className="px-4 py-4 text-slate-300">{index + 1}</td>
                    <td className="px-4 py-4 text-slate-300">{item.jenisKas}</td>
                    <td className="px-4 py-4 text-slate-300">{item.tanggal}</td>
                    <td className="px-4 py-4 text-slate-300">{item.noBukti}</td>
                    <td className="px-4 py-4 text-slate-300">{item.belanja}</td>
                    <td className="px-4 py-4 text-slate-300">{item.kegiatan}</td>
                    <td className="px-4 py-4 text-slate-300">{item.uraian}</td>
                    <td className="px-4 py-4 text-right text-emerald-400 font-medium">{formatCurrency(item.jumlah)}</td>
                    <td className="px-4 py-4 text-center">
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
                  <td colSpan={10} className="px-4 py-8 text-center text-slate-500">
                    Belum ada data transaksi
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 text-sm text-slate-400">
          <div>Showing {displayedBkuData.length > 0 ? 1 : 0} to {displayedBkuData.length} of {displayedBkuData.length} entries</div>
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
              <h2 className="text-lg font-semibold text-white">{editingItem ? 'Edit Data BKU' : 'Tambah Data BKU'}</h2>
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
                <label className="text-sm font-medium text-slate-300">Jenis Kas</label>
                <select 
                  value={formData.jenisKas}
                  onChange={(e) => setFormData({ ...formData, jenisKas: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="KAS DI BANK">KAS DI BANK</option>
                  <option value="KAS TUNAI">KAS TUNAI</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">No. Bukti</label>
                <input 
                  type="text" 
                  placeholder="Masukkan Nomor Bukti"
                  value={formData.noBukti}
                  onChange={(e) => setFormData({ ...formData, noBukti: e.target.value })}
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
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Kegiatan</label>
                <input 
                  type="text" 
                  placeholder="Nama Kegiatan"
                  value={formData.kegiatan}
                  onChange={(e) => setFormData({ ...formData, kegiatan: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Uraian</label>
                <textarea 
                  placeholder="Uraian transaksi"
                  rows={3}
                  value={formData.uraian}
                  onChange={(e) => setFormData({ ...formData, uraian: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Jumlah (Rp)</label>
                <input 
                  type="number" 
                  placeholder="0"
                  value={formData.jumlah}
                  onChange={(e) => setFormData({ ...formData, jumlah: e.target.value })}
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
              <h2 className="text-lg font-semibold text-white">Import Data BKU ARKAS</h2>
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
                  <span className="text-xs text-blue-400 font-medium">(Kolom: TANGGAL, KODE KEGIATAN, KODE REKENING, NO BUKTI, URAIAN, PENGELUARAN)</span>
                </p>
                <button 
                  onClick={handleDownloadTemplate}
                  className="w-full py-2 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium text-blue-400 transition-colors flex items-center justify-center gap-2 mt-2"
                >
                  <Download className="w-4 h-4" />
                  Download Template BKU ARKAS
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
