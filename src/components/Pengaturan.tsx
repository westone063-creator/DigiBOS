import React, { useState, useEffect, useMemo } from 'react';
import { School, FileSignature, Settings, Server, Upload, Check, Building2, UserCircle, Briefcase, CalendarDays, Key, MapPin, Building, Hash, Eye, CreditCard, Plus, Trash2, Download, Search } from 'lucide-react';
import { getKopSurat, saveKopSurat, getLogo, saveLogo } from '../utils/settings';
import * as XLSX from 'xlsx';
import { initialTableData } from './DataGuruStaff';

const renderPaginationButtons = (
  currentPage: number,
  totalPages: number,
  setCurrentPage: (page: number) => void
) => {
  const pages: (number | string)[] = [];
  
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    if (currentPage <= 4) {
      pages.push(1, 2, 3, 4, 5, '...', totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
    }
  }

  return pages.map((page, index) => (
    <button
      key={index}
      onClick={() => typeof page === 'number' && setCurrentPage(page)}
      disabled={page === '...'}
      className={`px-3 py-1 rounded border ${
        page === '...' 
          ? 'border-transparent text-slate-500 cursor-default'
          : currentPage === page 
            ? 'bg-blue-600 border-blue-500 text-white' 
            : 'border-white/10 hover:bg-white/5'
      }`}
    >
      {page}
    </button>
  ));
};

export default function Pengaturan() {
  const [activeTab, setActiveTab] = useState('profil-sekolah');

  const handleTabChange = (tabId: string) => {
    if (activeTab === tabId) return;
    setActiveTab(tabId);
  };

  
  // Kop Surat State
  const [kopBaris1, setKopBaris1] = useState('PEMERINTAH PROVINSI JAWA BARAT');
  const [kopBaris2, setKopBaris2] = useState('DINAS PENDIDIKAN');
  const [kopBaris3, setKopBaris3] = useState('SMA NEGERI 1 CIREBON');
  const [kopBaris4, setKopBaris4] = useState('Jl. Dr. Wahidin Sudirohusodo No. 81, Cirebon, Jawa Barat 45122 | Telepon: (0231) 203301 | Email: info@sman1cirebon.sch.id | Website: www.sman1cirebon.sch.id');
  const [logoInstansi, setLogoInstansi] = useState(() => getLogo());

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setLogoInstansi(base64);
        saveLogo(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  // School Profile States
  const [tahunPendirian, setTahunPendirian] = useState(() => localStorage.getItem('tahunPendirian') || '1980');
  const [npsn, setNpsn] = useState(() => localStorage.getItem('npsn') || '20201234');
  const [nss, setNss] = useState(() => localStorage.getItem('nss') || '101020201234');
  const [jalanAlamat, setJalanAlamat] = useState(() => localStorage.getItem('jalanAlamat') || 'Jl. Dr. Wahidin Sudirohusodo No. 81');
  const [desa, setDesa] = useState(() => localStorage.getItem('desa') || 'Kejaksan');
  const [kecamatan, setKecamatan] = useState(() => localStorage.getItem('kecamatan') || 'Kejaksan');
  const [kabupaten, setKabupaten] = useState(() => localStorage.getItem('kabupaten') || 'Cirebon');
  const [provinsi, setProvinsi] = useState(() => localStorage.getItem('provinsi') || 'Jawa Barat');
  const [titimangsa, setTitimangsa] = useState(() => localStorage.getItem('titimangsa') || 'Cirebon');

  // Load Guru & Staff List
  const [staffList, setStaffList] = useState<any[]>(() => {
    const saved = localStorage.getItem('dataGuruStaff');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {}
    }
    return initialTableData;
  });

  // Filter candidates who have "kepala" in their jabatan or tugas
  const kepsekCandidates = useMemo(() => {
    return staffList.filter(staff => {
      const j = (staff.jabatan || '').toLowerCase();
      const t = (staff.tugas || '').toLowerCase();
      return j.includes('kepala') || j.includes('kepsek') || t.includes('kepala') || t.includes('kepsek');
    });
  }, [staffList]);

  // Filter candidates who have "bendahara" in their jabatan or tugas
  const bendaharaCandidates = useMemo(() => {
    return staffList.filter(staff => {
      const j = (staff.jabatan || '').toLowerCase();
      const t = (staff.tugas || '').toLowerCase();
      return j.includes('bendahara') || t.includes('bendahara');
    });
  }, [staffList]);

  // Signatures States
  const [namaKepsek, setNamaKepsek] = useState(() => localStorage.getItem('namaKepsek') || 'Drs. H. Ahmad Sudirman, M.Pd.');
  const [nipKepsek, setNipKepsek] = useState(() => localStorage.getItem('nipKepsek') || '19700512 199512 1 003');
  const [pangkatKepsek, setPangkatKepsek] = useState(() => localStorage.getItem('pangkatKepsek') || 'Pembina Utama Muda, IV/c');
  const [jabatanKepsek, setJabatanKepsek] = useState(() => localStorage.getItem('jabatanKepsek') || 'Kepala Sekolah');
  const [ktpKepsek, setKtpKepsek] = useState(() => localStorage.getItem('ktpKepsek') || '');
  const [alamatKepsek, setAlamatKepsek] = useState(() => localStorage.getItem('alamatKepsek') || '');
  
  const [namaBankSekolah, setNamaBankSekolah] = useState(() => localStorage.getItem('namaBankSekolah') || 'BANK JABAR BANTEN');
  const [noRekeningSekolah, setNoRekeningSekolah] = useState(() => localStorage.getItem('noRekeningSekolah') || '0123 4567 8901');
  
  const [atasNamaRekening, setAtasNamaRekening] = useState(() => localStorage.getItem('atasNamaRekening') || 'SDN 01 CONTOH');
  const [formatSuratPrefix, setFormatSuratPrefix] = useState(() => localStorage.getItem('formatSuratPrefix') || '421.2');
  const [formatSuratSuffix, setFormatSuratSuffix] = useState(() => localStorage.getItem('formatSuratSuffix') || 'SD.01');
  const [namaBendahara, setNamaBendahara] = useState(() => localStorage.getItem('namaBendahara') || 'Siti Aminah, S.E');
  const [nipBendahara, setNipBendahara] = useState(() => localStorage.getItem('nipBendahara') || '19850202 201001 2 002');
  const [ktpBendahara, setKtpBendahara] = useState(() => localStorage.getItem('ktpBendahara') || '');
  const [alamatBendahara, setAlamatBendahara] = useState(() => localStorage.getItem('alamatBendahara') || '');

  // Automatic synchronization from dataGuruStaff when loaded
  useEffect(() => {
    const matchedKepsek = staffList.find(staff => {
      const j = (staff.jabatan || '').toLowerCase();
      const t = (staff.tugas || '').toLowerCase();
      return j.includes('kepala') || j.includes('kepsek') || t.includes('kepala') || t.includes('kepsek');
    });
    if (matchedKepsek) {
      setNamaKepsek(matchedKepsek.nama);
      setNipKepsek(matchedKepsek.nip || '-');
      setPangkatKepsek(matchedKepsek.gol || '-');
      setJabatanKepsek(matchedKepsek.jabatan || 'Kepala Sekolah');
    }

    const matchedBendahara = staffList.find(staff => {
      const j = (staff.jabatan || '').toLowerCase();
      const t = (staff.tugas || '').toLowerCase();
      return j.includes('bendahara') || t.includes('bendahara');
    });
    if (matchedBendahara) {
      setNamaBendahara(matchedBendahara.nama);
      setNipBendahara(matchedBendahara.nip || '-');
    }
  }, [staffList]);

  // Auto-save Otorisasi Penanda Tangan to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('namaKepsek', namaKepsek);
    localStorage.setItem('nipKepsek', nipKepsek);
    localStorage.setItem('pangkatKepsek', pangkatKepsek);
    localStorage.setItem('jabatanKepsek', jabatanKepsek);
    localStorage.setItem('ktpKepsek', ktpKepsek);
    localStorage.setItem('alamatKepsek', alamatKepsek);
    localStorage.setItem('namaBendahara', namaBendahara);
    localStorage.setItem('nipBendahara', nipBendahara);
    localStorage.setItem('ktpBendahara', ktpBendahara);
    localStorage.setItem('alamatBendahara', alamatBendahara);
    localStorage.setItem('formatSuratPrefix', formatSuratPrefix);
    localStorage.setItem('formatSuratSuffix', formatSuratSuffix);
          localStorage.setItem('namaBankSekolah', namaBankSekolah);
          localStorage.setItem('noRekeningSekolah', noRekeningSekolah);
localStorage.setItem('atasNamaRekening', atasNamaRekening);
  }, [namaKepsek, nipKepsek, pangkatKepsek, jabatanKepsek, ktpKepsek, alamatKepsek, namaBendahara, nipBendahara, ktpBendahara, alamatBendahara]);

  useEffect(() => {
    const kop = getKopSurat();
    setKopBaris1(kop.kopBaris1);
    setKopBaris2(kop.kopBaris2);
    setKopBaris3(kop.kopBaris3);
    setKopBaris4(kop.kopBaris4);
  }, []);

  const handleSimpanProfil = () => {
    confirmAction(
      'Apakah Anda yakin ingin menyimpan perubahan pada profil sekolah?', 
      () => {
        saveKopSurat({
          kopBaris1,
          kopBaris2,
          kopBaris3,
          kopBaris4
        });
        localStorage.setItem('tahunPendirian', tahunPendirian);
        localStorage.setItem('npsn', npsn);
        localStorage.setItem('nss', nss);
        localStorage.setItem('jalanAlamat', jalanAlamat);
        localStorage.setItem('desa', desa);
        localStorage.setItem('kecamatan', kecamatan);
        localStorage.setItem('kabupaten', kabupaten);
        localStorage.setItem('provinsi', provinsi);
        localStorage.setItem('titimangsa', titimangsa);
        alert('Profil Sekolah & Kop Surat berhasil disimpan');
      },
      'Simpan Perubahan',
      'Simpan',
      'bg-blue-600 hover:bg-blue-700'
    );
  };

  const handleSimpanAdministrasi = () => {
    confirmAction(
      'Apakah Anda yakin ingin menyimpan perubahan administrasi surat?', 
      () => {
        localStorage.setItem('namaKepsek', namaKepsek);
        localStorage.setItem('nipKepsek', nipKepsek);
        localStorage.setItem('pangkatKepsek', pangkatKepsek);
        localStorage.setItem('jabatanKepsek', jabatanKepsek);
        localStorage.setItem('ktpKepsek', ktpKepsek);
        localStorage.setItem('alamatKepsek', alamatKepsek);
        localStorage.setItem('namaBendahara', namaBendahara);
        localStorage.setItem('nipBendahara', nipBendahara);
        localStorage.setItem('ktpBendahara', ktpBendahara);
        localStorage.setItem('alamatBendahara', alamatBendahara);
        localStorage.setItem('formatSuratPrefix', formatSuratPrefix);
        localStorage.setItem('formatSuratSuffix', formatSuratSuffix);
        localStorage.setItem('namaBankSekolah', namaBankSekolah);
        localStorage.setItem('noRekeningSekolah', noRekeningSekolah);
        localStorage.setItem('atasNamaRekening', atasNamaRekening);
        alert('Konfigurasi Administrasi Surat & Otorisasi Penanda Tangan berhasil disimpan');
      },
      'Simpan Perubahan',
      'Simpan',
      'bg-blue-600 hover:bg-blue-700'
    );
  };

  // Konfigurasi State
  const [tahunAnggaran, setTahunAnggaran] = useState(() => localStorage.getItem('tahunAnggaran') || new Date().getFullYear().toString());
  const [tahunAjaran, setTahunAjaran] = useState(() => localStorage.getItem('tahunAjaran') || '2025/2026');
  const [semester, setSemester] = useState(() => localStorage.getItem('semester') || 'ganjil');

  // Daftar Rekening State
  const [daftarRekening, setDaftarRekening] = useState<any[]>(() => {
    const saved = localStorage.getItem('daftarRekening');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedRekening, setSelectedRekening] = useState<number[]>([]);
  const [searchQueryRekening, setSearchQueryRekening] = useState('');

  // Daftar SNP State
  const [daftarSNP, setDaftarSNP] = useState<any[]>(() => {
    const saved = localStorage.getItem('daftarSNP');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedSNP, setSelectedSNP] = useState<number[]>([]);
  const [searchQuerySNP, setSearchQuerySNP] = useState('');

  // Pagination State
  const [entriesPerPageRekening, setEntriesPerPageRekening] = useState<number>(10);
  const [currentPageRekening, setCurrentPageRekening] = useState<number>(1);
  const [entriesPerPageSNP, setEntriesPerPageSNP] = useState<number>(10);
  const [currentPageSNP, setCurrentPageSNP] = useState<number>(1);


  // Confirm Modal State
  const [confirmState, setConfirmState] = useState({ 
    isOpen: false, 
    title: 'Konfirmasi',
    message: '', 
    action: () => {},
    confirmText: 'Ya',
    confirmColor: 'bg-blue-600 hover:bg-blue-700'
  });

  const confirmAction = (message: string, action: () => void, title = 'Konfirmasi Hapus', confirmText = 'Hapus', confirmColor = 'bg-red-600 hover:bg-red-700') => {
    setConfirmState({ isOpen: true, title, message, action, confirmText, confirmColor });
  };

  const handleSimpanKonfigurasi = () => {
    confirmAction(
      'Apakah Anda yakin ingin menyimpan perubahan konfigurasi?', 
      () => {
        localStorage.setItem('tahunAnggaran', tahunAnggaran);
        localStorage.setItem('tahunAjaran', tahunAjaran);
        localStorage.setItem('semester', semester);
        alert('Konfigurasi berhasil disimpan');
      },
      'Simpan Perubahan',
      'Simpan',
      'bg-blue-600 hover:bg-blue-700'
    );
  };

  const handleAddRekening = () => {
    setDaftarRekening([...daftarRekening, { 
      kodeAkun: '', 
      uraianAkun: '', 
      kodeSubAkun: '', 
      uraianSubAkun: '', 
      kodeKomponen: '', 
      uraianKomponen: '', 
      kodeSubKomponen: '', 
      uraianSubKomponen: '', 
      namaBarangJasa: '', 
      hargaSatuan: '' 
    }]);
  };

  const handleUpdateRekening = (index: number, field: string, value: string) => {
    const newData = [...daftarRekening];
    newData[index][field] = value;
    setDaftarRekening(newData);
  };

  const handleRemoveRekening = (index: number) => {
    confirmAction('Yakin ingin menghapus data ini?', () => {
      const newData = daftarRekening.filter((_, i) => i !== index);
      setDaftarRekening(newData);
      setSelectedRekening([]);
      localStorage.setItem('daftarRekening', JSON.stringify(newData));
    });
  };

  const handleSelectRekening = (index: number) => {
    setSelectedRekening(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]);
  };

  const handleSelectAllRekening = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRekening(filteredRekeningWithIndex.map(item => item.originalIndex));
    } else {
      setSelectedRekening([]);
    }
  };

  const handleBulkDeleteRekening = () => {
    confirmAction(`Yakin ingin menghapus ${selectedRekening.length} data terpilih?`, () => {
      const newData = daftarRekening.filter((_, i) => !selectedRekening.includes(i));
      setDaftarRekening(newData);
      setSelectedRekening([]);
      localStorage.setItem('daftarRekening', JSON.stringify(newData));
    });
  };

  const handleSimpanRekening = () => {
    if (!window.confirm('Apakah Anda yakin ingin menyimpan perubahan?')) return;
    localStorage.setItem('daftarRekening', JSON.stringify(daftarRekening));
    alert('Daftar Rekening berhasil disimpan');
  };

  const handleImportRekening = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const json = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
          
          if (Array.isArray(json)) {
            const formattedData = json.map((item: any) => ({
              kodeAkun: item['Kode Akun'] || item.kodeAkun || '',
              uraianAkun: item['Uraian Akun'] || item.uraianAkun || '',
              kodeSubAkun: item['Kode Sub Akun'] || item.kodeSubAkun || '',
              uraianSubAkun: item['Uraian Sub Akun'] || item.uraianSubAkun || '',
              kodeKomponen: item['Kode Komponen'] || item.kodeKomponen || '',
              uraianKomponen: item['Uraian Komponen'] || item.uraianKomponen || '',
              kodeSubKomponen: item['Kode Sub Komponen'] || item.kodeSubKomponen || '',
              uraianSubKomponen: item['Uraian Sub Komponen'] || item.uraianSubKomponen || '',
              namaBarangJasa: item['Nama Barang/Jasa'] || item['Nama Barang / Jasa'] || item['Nama Barang'] || item.namaBarangJasa || item.namaBarang || '',
              hargaSatuan: item['Harga Satuan'] || item.hargaSatuan || ''
            }));
            
            setDaftarRekening(formattedData);
            localStorage.setItem('daftarRekening', JSON.stringify(formattedData));
            alert('Import Excel berhasil');
          }
        } catch (error) {
          alert('Format file tidak valid. Pastikan format Excel (.xlsx atau .xls).');
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleExportRekening = () => {
    const dataToExport = daftarRekening.map(item => ({
      'Kode Akun': item.kodeAkun,
      'Uraian Akun': item.uraianAkun,
      'Kode Sub Akun': item.kodeSubAkun,
      'Uraian Sub Akun': item.uraianSubAkun,
      'Kode Komponen': item.kodeKomponen,
      'Uraian Komponen': item.uraianKomponen,
      'Kode Sub Komponen': item.kodeSubKomponen,
      'Uraian Sub Komponen': item.uraianSubKomponen,
      'Nama Barang/Jasa': item.namaBarangJasa,
      'Harga Satuan': item.hargaSatuan
    }));
    
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Daftar Rekening");
    XLSX.writeFile(workbook, "daftar_rekening.xlsx");
  };

  const handleAddSNP = () => {
    setDaftarSNP([...daftarSNP, { program: '', subProgram: '', kegiatan: '', subKegiatan: '', kodeRekening: '', uraian: '' }]);
  };

  const handleUpdateSNP = (index: number, field: string, value: string) => {
    const newData = [...daftarSNP];
    newData[index][field] = value;
    setDaftarSNP(newData);
  };

  const handleRemoveSNP = (index: number) => {
    confirmAction('Yakin ingin menghapus data ini?', () => {
      const newData = daftarSNP.filter((_, i) => i !== index);
      setDaftarSNP(newData);
      setSelectedSNP([]);
      localStorage.setItem('daftarSNP', JSON.stringify(newData));
    });
  };

  const handleSelectSNP = (index: number) => {
    setSelectedSNP(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]);
  };

  const handleSelectAllSNP = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedSNP(filteredSNPWithIndex.map(item => item.originalIndex));
    } else {
      setSelectedSNP([]);
    }
  };

  const handleBulkDeleteSNP = () => {
    confirmAction(`Yakin ingin menghapus ${selectedSNP.length} data terpilih?`, () => {
      const newData = daftarSNP.filter((_, i) => !selectedSNP.includes(i));
      setDaftarSNP(newData);
      setSelectedSNP([]);
      localStorage.setItem('daftarSNP', JSON.stringify(newData));
    });
  };

  const handleSimpanSNP = () => {
    if (!window.confirm('Apakah Anda yakin ingin menyimpan perubahan?')) return;
    localStorage.setItem('daftarSNP', JSON.stringify(daftarSNP));
    alert('Daftar SNP berhasil disimpan');
  };

  const handleImportSNP = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const json = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
          
          if (Array.isArray(json)) {
            const formattedData = json.map((item: any) => ({
              program: item['Program'] || item.program || '',
              subProgram: item['Sub Program'] || item.subProgram || '',
              kegiatan: item['Kegiatan'] || item.kegiatan || '',
              subKegiatan: item['Sub Kegiatan'] || item.subKegiatan || '',
              kodeRekening: item['Kode Rekening'] || item.kodeRekening || '',
              uraian: item['Uraian'] || item.uraian || ''
            }));
            
            setDaftarSNP(formattedData);
            localStorage.setItem('daftarSNP', JSON.stringify(formattedData));
            alert('Import Excel berhasil');
          }
        } catch (error) {
          alert('Format file tidak valid. Pastikan format Excel (.xlsx atau .xls).');
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleExportSNP = () => {
    const dataToExport = daftarSNP.map(item => ({
      'Program': item.program,
      'Sub Program': item.subProgram,
      'Kegiatan': item.kegiatan,
      'Sub Kegiatan': item.subKegiatan,
      'Kode Rekening': item.kodeRekening,
      'Uraian': item.uraian
    }));
    
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Daftar SNP");
    XLSX.writeFile(workbook, "daftar_snp.xlsx");
  };

  // Filter and map indices for Daftar Rekening
  const filteredRekeningWithIndex = useMemo(() => {
    const mapped = daftarRekening.map((item, index) => ({ ...item, originalIndex: index }));
    if (!searchQueryRekening) return mapped;
    const query = searchQueryRekening.toLowerCase();
    return mapped.filter(item => 
      String(item.kodeAkun || '').toLowerCase().includes(query) ||
      String(item.uraianAkun || '').toLowerCase().includes(query) ||
      String(item.kodeSubAkun || '').toLowerCase().includes(query) ||
      String(item.uraianSubAkun || '').toLowerCase().includes(query) ||
      String(item.kodeKomponen || '').toLowerCase().includes(query) ||
      String(item.uraianKomponen || '').toLowerCase().includes(query) ||
      String(item.kodeSubKomponen || '').toLowerCase().includes(query) ||
      String(item.uraianSubKomponen || '').toLowerCase().includes(query) ||
      String(item.namaBarangJasa || '').toLowerCase().includes(query) ||
      String(item.hargaSatuan || '').toLowerCase().includes(query)
    );
  }, [daftarRekening, searchQueryRekening]);

  const startIndexRekening = (currentPageRekening - 1) * entriesPerPageRekening;
  const displayedRekening = filteredRekeningWithIndex.slice(startIndexRekening, startIndexRekening + entriesPerPageRekening);
  const totalPagesRekening = Math.ceil(filteredRekeningWithIndex.length / entriesPerPageRekening);

  // Filter and map indices for Daftar SNP
  const filteredSNPWithIndex = useMemo(() => {
    const mapped = daftarSNP.map((item, index) => ({ ...item, originalIndex: index }));
    if (!searchQuerySNP) return mapped;
    const query = searchQuerySNP.toLowerCase();
    return mapped.filter(item => 
      String(item.program || '').toLowerCase().includes(query) ||
      String(item.subProgram || '').toLowerCase().includes(query) ||
      String(item.kegiatan || '').toLowerCase().includes(query) ||
      String(item.subKegiatan || '').toLowerCase().includes(query) ||
      String(item.kodeRekening || '').toLowerCase().includes(query) ||
      String(item.uraian || '').toLowerCase().includes(query)
    );
  }, [daftarSNP, searchQuerySNP]);

  const startIndexSNP = (currentPageSNP - 1) * entriesPerPageSNP;
  const displayedSNP = filteredSNPWithIndex.slice(startIndexSNP, startIndexSNP + entriesPerPageSNP);
  const totalPagesSNP = Math.ceil(filteredSNPWithIndex.length / entriesPerPageSNP);

  return (
    <>
      {confirmState.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-2xl max-w-md w-full mx-4 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-semibold text-white mb-2">{confirmState.title}</h3>
            <p className="text-slate-300 mb-6">{confirmState.message}</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmState({ ...confirmState, isOpen: false })} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">Batal</button>
              <button onClick={() => { confirmState.action(); setConfirmState({ ...confirmState, isOpen: false }); }} className={`px-4 py-2 text-white rounded-lg transition-colors ${confirmState.confirmColor}`}>{confirmState.confirmText}</button>
            </div>
          </div>
        </div>
      )}
      <div className="w-full space-y-6 relative">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Pengaturan Sistem</h1>
          <p className="text-slate-400 text-sm mt-1">Kelola konfigurasi dan profil sekolah Anda</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Top Nav */}
        <div className="flex flex-wrap gap-2 p-1 bg-white/5 rounded-xl border border-white/10 w-fit">
          <button 
            onClick={() => handleTabChange('profil-sekolah')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors ${activeTab === 'profil-sekolah' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <School className="w-5 h-5" />
            <span className="font-medium text-sm">Profil Sekolah</span>
          </button>
          
          <button 
            onClick={() => handleTabChange('administrasi-surat')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors ${activeTab === 'administrasi-surat' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <FileSignature className="w-5 h-5" />
            <span className="font-medium text-sm">Administrasi Surat</span>
          </button>
          
          <button 
            onClick={() => handleTabChange('konfigurasi')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors ${activeTab === 'konfigurasi' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium text-sm">Konfigurasi</span>
          </button>

          <button 
            onClick={() => handleTabChange('daftar-rekening')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors ${activeTab === 'daftar-rekening' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <Hash className="w-5 h-5" />
            <span className="font-medium text-sm">Daftar Rekening</span>
          </button>

          <button 
            onClick={() => handleTabChange('daftar-snp')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors ${activeTab === 'daftar-snp' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <Building className="w-5 h-5" />
            <span className="font-medium text-sm">Daftar SNP</span>
          </button>
          
          <button 
            onClick={() => handleTabChange('sistem')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors ${activeTab === 'sistem' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <Server className="w-5 h-5" />
            <span className="font-medium text-sm">Sistem</span>
          </button>
        </div>
        
        {/* Content Settings */}
        <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm min-h-[500px]">
          
          {/* TAB: PROFIL SEKOLAH */}
          {activeTab === 'profil-sekolah' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-4">Identitas Sekolah</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Nama Sekolah</label>
                    <input type="text" value={kopBaris3} onChange={(e) => setKopBaris3(e.target.value)} className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Tahun Pendirian</label>
                    <input type="text" value={tahunPendirian} onChange={(e) => setTahunPendirian(e.target.value)} className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">NPSN</label>
                    <input type="text" value={npsn} onChange={(e) => setNpsn(e.target.value)} className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">NSS</label>
                    <input type="text" value={nss} onChange={(e) => setNss(e.target.value)} className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-4">Alamat Lengkap</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-slate-300">Jalan / Detail Alamat</label>
                    <input type="text" value={jalanAlamat} onChange={(e) => setJalanAlamat(e.target.value)} className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Desa / Kelurahan</label>
                    <input type="text" value={desa} onChange={(e) => setDesa(e.target.value)} className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Kecamatan</label>
                    <input type="text" value={kecamatan} onChange={(e) => setKecamatan(e.target.value)} className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Kabupaten / Kota</label>
                    <input type="text" value={kabupaten} onChange={(e) => setKabupaten(e.target.value)} className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Provinsi</label>
                    <input type="text" value={provinsi} onChange={(e) => setProvinsi(e.target.value)} className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-slate-300">Tempat Titimangsa (Lokasi Surat)</label>
                    <input type="text" value={titimangsa} onChange={(e) => setTitimangsa(e.target.value)} className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-4">Desain Kop Surat</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Teks Baris 1 (Dinas/Instansi Khusus)</label>
                      <input type="text" value={kopBaris1} onChange={(e) => setKopBaris1(e.target.value)} className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Teks Baris 2 (Sub Dinas)</label>
                      <input type="text" value={kopBaris2} onChange={(e) => setKopBaris2(e.target.value)} className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Teks Baris 3 (Nama Sekolah)</label>
                      <input type="text" value={kopBaris3} onChange={(e) => setKopBaris3(e.target.value)} className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Teks Baris 4 (Kontak/Alamat)</label>
                      <input type="text" value={kopBaris4} onChange={(e) => setKopBaris4(e.target.value)} className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Upload Logo Instansi</label>
                      <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:bg-white/5 transition-colors cursor-pointer relative">
                        <input type="file" accept="image/*" onChange={handleLogoUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                        <p className="text-sm font-medium text-slate-300">Pilih File Logo</p>
                        <p className="text-xs text-slate-500">PNG, JPG up to 2MB</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 flex items-center gap-2"><Eye className="w-4 h-4"/> Live Preview Kop Surat</label>
                    <div className="w-full bg-white rounded-xl p-6 flex flex-col border border-slate-200">
                      <div className="flex items-center pb-4">
                        <div className="w-16 flex-shrink-0 flex items-center justify-center">
                          <div className="w-12 h-16 bg-slate-100 flex items-center justify-center rounded border border-slate-200">
                            <img src={logoInstansi} alt="Logo" className="w-full h-full object-contain grayscale" />
                          </div>
                        </div>
                        <div className="flex-1 text-center font-serif text-slate-900">
                          <h1 className="text-[12px] font-normal uppercase tracking-wider leading-snug">{kopBaris1}</h1>
                          <h2 className="text-[14px] font-bold uppercase tracking-wider leading-snug">{kopBaris2}</h2>
                          <h3 className="text-[18px] font-bold uppercase tracking-widest leading-snug">{kopBaris3}</h3>
                          <p className="text-[10px] mt-1 leading-tight text-slate-600">{kopBaris4}</p>
                        </div>
                        <div className="w-16 flex-shrink-0"></div>
                      </div>
                      <div className="border-b-[3px] border-slate-900 mb-[2px]"></div>
                      <div className="border-b border-slate-900"></div>
                    </div>
                  </div>

                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end">
                <button onClick={handleSimpanProfil} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2">
                  <Check className="w-4 h-4" /> Simpan Perubahan
                </button>
              </div>
            </div>
          )}

          {/* TAB: ADMINISTRASI SURAT */}
          {activeTab === 'administrasi-surat' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              <div>
                <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-4">Data Rekening BOSP</h3>
                <div className="mt-6 flex flex-col md:flex-row gap-8 items-center md:items-start">
                  
                  {/* Desain Kartu ATM */}
                  <div className="w-full max-w-sm h-48 rounded-2xl bg-gradient-to-tr from-blue-900 via-blue-700 to-indigo-500 p-6 shadow-xl relative overflow-hidden flex flex-col justify-between group border border-white/20">
                    <div className="absolute -right-16 -top-16 w-48 h-48 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors"></div>
                    <div className="flex justify-between items-start z-10">
                      <div className="text-white font-bold text-lg tracking-wider">{namaBankSekolah}</div>
                      <CreditCard className="w-8 h-8 text-white/80" />
                    </div>
                    <div className="z-10">
                      <div className="text-white/60 text-xs mb-1 uppercase tracking-wider">Nomor Rekening</div>
                      <div className="text-white font-mono text-2xl tracking-[0.15em] font-medium">{noRekeningSekolah}</div>
                    </div>
                    <div className="z-10 flex justify-between items-end">
                      <div>
                        <div className="text-white/60 text-xs uppercase tracking-wider">Atas Nama</div>
                        <div className="text-white font-medium uppercase tracking-widest">{atasNamaRekening}</div>
                      </div>
                      <div className="text-white font-bold italic">BOSP</div>
                    </div>
                  </div>

                  <div className="flex-1 w-full space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Nama Bank</label>
                      <input type="text" value={namaBankSekolah} onChange={(e) => setNamaBankSekolah(e.target.value)} className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 uppercase" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Nomor Rekening</label>
                      <input type="text" value={noRekeningSekolah} onChange={(e) => setNoRekeningSekolah(e.target.value)} className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 font-mono tracking-widest" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Atas Nama Rekening</label>
                      <input type="text" value={atasNamaRekening} onChange={(e) => setAtasNamaRekening(e.target.value)} className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 uppercase" />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-4">Penomoran Surat</h3>
                <div className="mt-6 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Format Nomor Surat Otomatis</label>
                    <div className="flex items-center gap-2">
                      <input type="text" value={formatSuratPrefix} onChange={(e) => setFormatSuratPrefix(e.target.value)} className="w-24 bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 text-center" />
                      <span className="text-slate-400">/</span>
                      <input type="text" defaultValue="{NOMOR}" className="w-28 bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-slate-400 focus:outline-none text-center cursor-not-allowed" readOnly />
                      <span className="text-slate-400">/</span>
                      <input type="text" value={formatSuratSuffix} onChange={(e) => setFormatSuratSuffix(e.target.value)} className="w-24 bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 text-center" />
                      <span className="text-slate-400">/</span>
                      <input type="text" defaultValue="{TAHUN}" className="w-28 bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-slate-400 focus:outline-none text-center cursor-not-allowed" readOnly />
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Contoh Output: {formatSuratPrefix}/001/{formatSuratSuffix}/{new Date().getFullYear()}</p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h3 className="text-lg font-semibold text-white">Otorisasi Penanda Tangan</h3>
                  <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Tersimpan Otomatis
                  </span>
                </div>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4 p-5 rounded-xl border border-white/10 bg-slate-900/30">
                    <h4 className="font-medium text-white flex items-center gap-2 justify-between">
                      <span className="flex items-center gap-2"><UserCircle className="w-5 h-5 text-blue-400"/> Kepala Sekolah</span>
                      <span className="text-[10px] text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded font-medium border border-blue-500/20">Sinkron Guru & Staff</span>
                    </h4>
                    <div className="space-y-2">
                      <label className="text-xs text-slate-400 font-medium">Pilih dari Data Guru & Staff</label>
                      <select
                        value={staffList.some(s => s.nama === namaKepsek) ? namaKepsek : ""}
                        onChange={(e) => {
                          const selectedNama = e.target.value;
                          if (!selectedNama) return;
                          const selectedStaff = staffList.find(s => s.nama === selectedNama);
                          if (selectedStaff) {
                            setNamaKepsek(selectedStaff.nama);
                            setNipKepsek(selectedStaff.nip || '-');
                            setPangkatKepsek(selectedStaff.gol || '-');
                            setJabatanKepsek(selectedStaff.jabatan || 'Kepala Sekolah');
                          }
                        }}
                        className="w-full bg-slate-900 border border-blue-500/30 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-blue-500 text-xs"
                      >
                        <option value="">-- Hubungkan Personel --</option>
                        {kepsekCandidates.length > 0 && (
                          <optgroup label="Rekomendasi (Jabatan Kepala Sekolah)">
                            {kepsekCandidates.map((staff, idx) => (
                              <option key={`rec-kepsek-${idx}`} value={staff.nama}>
                                {staff.nama} ({staff.jabatan || staff.tugas || 'Kepala Sekolah'})
                              </option>
                            ))}
                          </optgroup>
                        )}
                        <optgroup label="Semua Guru & Staff">
                          {staffList.map((staff, idx) => (
                            <option key={`all-staff-kep-${idx}`} value={staff.nama}>
                              {staff.nama} - {staff.jabatan || staff.tugas || 'Guru/Staff'}
                            </option>
                          ))}
                        </optgroup>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-slate-400">Nama Kepala Sekolah</label>
                      <input type="text" value={namaKepsek} onChange={(e) => setNamaKepsek(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-slate-400">NIP</label>
                      <input type="text" value={nipKepsek} onChange={(e) => setNipKepsek(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-slate-400">Pangkat / Golongan</label>
                      <input type="text" value={pangkatKepsek} onChange={(e) => setPangkatKepsek(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-slate-400">Jabatan</label>
                      <input type="text" value={jabatanKepsek} onChange={(e) => setJabatanKepsek(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-slate-400">No. Identitas (KTP)</label>
                      <input type="text" value={ktpKepsek} onChange={(e) => setKtpKepsek(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-slate-400">Alamat (Sesuai KTP)</label>
                      <input type="text" value={alamatKepsek} onChange={(e) => setAlamatKepsek(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500" />
                    </div>
                    <div className="space-y-2 pt-2">
                      <label className="text-xs text-slate-400">Upload Tanda Tangan</label>
                      <div className="border border-dashed border-white/20 rounded-lg p-4 text-center hover:bg-white/5 cursor-pointer">
                        <Upload className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                        <p className="text-xs text-slate-400">Pilih file TTD</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 p-5 rounded-xl border border-white/10 bg-slate-900/30">
                    <h4 className="font-medium text-white flex items-center gap-2 justify-between">
                      <span className="flex items-center gap-2"><Briefcase className="w-5 h-5 text-emerald-400"/> Bendahara</span>
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded font-medium border border-emerald-500/20">Sinkron Guru & Staff</span>
                    </h4>
                    <div className="space-y-2">
                      <label className="text-xs text-slate-400 font-medium">Pilih dari Data Guru & Staff</label>
                      <select
                        value={staffList.some(s => s.nama === namaBendahara) ? namaBendahara : ""}
                        onChange={(e) => {
                          const selectedNama = e.target.value;
                          if (!selectedNama) return;
                          const selectedStaff = staffList.find(s => s.nama === selectedNama);
                          if (selectedStaff) {
                            setNamaBendahara(selectedStaff.nama);
                            setNipBendahara(selectedStaff.nip || '-');
                          }
                        }}
                        className="w-full bg-slate-900 border border-blue-500/30 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-blue-500 text-xs"
                      >
                        <option value="">-- Hubungkan Personel --</option>
                        {bendaharaCandidates.length > 0 && (
                          <optgroup label="Rekomendasi (Jabatan Bendahara)">
                            {bendaharaCandidates.map((staff, idx) => (
                              <option key={`rec-bendahara-${idx}`} value={staff.nama}>
                                {staff.nama} ({staff.jabatan || staff.tugas || 'Bendahara'})
                              </option>
                            ))}
                          </optgroup>
                        )}
                        <optgroup label="Semua Guru & Staff">
                          {staffList.map((staff, idx) => (
                            <option key={`all-staff-bend-${idx}`} value={staff.nama}>
                              {staff.nama} - {staff.jabatan || staff.tugas || 'Guru/Staff'}
                            </option>
                          ))}
                        </optgroup>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-slate-400">Nama Bendahara</label>
                      <input type="text" value={namaBendahara} onChange={(e) => setNamaBendahara(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-slate-400">NIP</label>
                      <input type="text" value={nipBendahara} onChange={(e) => setNipBendahara(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-slate-400">No. Identitas (KTP)</label>
                      <input type="text" value={ktpBendahara} onChange={(e) => setKtpBendahara(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-slate-400">Alamat (Sesuai KTP)</label>
                      <input type="text" value={alamatBendahara} onChange={(e) => setAlamatBendahara(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500" />
                    </div>
                    <div className="space-y-2 pt-2">
                      <label className="text-xs text-slate-400">Upload Stempel Sekolah</label>
                      <div className="border border-dashed border-white/20 rounded-lg p-4 text-center hover:bg-white/5 cursor-pointer">
                        <Upload className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                        <p className="text-xs text-slate-400">Pilih file Stempel</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end">
                <button onClick={handleSimpanAdministrasi} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2">
                  <Check className="w-4 h-4" /> Simpan Perubahan
                </button>
              </div>
            </div>
          )}

          {/* TAB: KONFIGURASI */}
          {activeTab === 'konfigurasi' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-4">Konfigurasi Tahun Ajaran</h3>
              
              <div className="space-y-6 mt-6 max-w-xl">
                <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                      <CalendarDays className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Tahun Anggaran</p>
                      <p className="text-xs text-slate-400 mt-0.5">Tahun anggaran untuk pencatatan keuangan BOSP</p>
                    </div>
                  </div>
                  <select value={tahunAnggaran} onChange={(e) => setTahunAnggaran(e.target.value)} className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm font-medium focus:outline-none focus:border-blue-500">
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                      <CalendarDays className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Tahun Ajaran Aktif</p>
                      <p className="text-xs text-slate-400 mt-0.5">Tahun ajaran akademik yang sedang berjalan</p>
                    </div>
                  </div>
                  <select value={tahunAjaran} onChange={(e) => setTahunAjaran(e.target.value)} className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm font-medium focus:outline-none focus:border-blue-500">
                    <option value="2022/2023">2022/2023</option>
                    <option value="2023/2024">2023/2024</option>
                    <option value="2024/2025">2024/2025</option>
                    <option value="2025/2026">2025/2026</option>
                    <option value="2026/2027">2026/2027</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                      <CalendarDays className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Semester Aktif</p>
                      <p className="text-xs text-slate-400 mt-0.5">Semester akademik yang sedang berjalan</p>
                    </div>
                  </div>
                  <select value={semester} onChange={(e) => setSemester(e.target.value)} className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm font-medium focus:outline-none focus:border-blue-500">
                    <option value="ganjil">Ganjil</option>
                    <option value="genap">Genap</option>
                  </select>
                </div>
              </div>
              
              <div className="pt-4 border-t border-white/10 flex justify-end">
                <button onClick={handleSimpanKonfigurasi} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2">
                  <Check className="w-4 h-4" /> Simpan Perubahan
                </button>
              </div>
            </div>
          )}

          {/* TAB: DAFTAR REKENING */}
          {activeTab === 'daftar-rekening' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b border-white/10 pb-4 gap-4">
                <div className="flex flex-wrap items-center gap-4">
                  <h3 className="text-lg font-semibold text-white">Daftar Rekening</h3>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <span>Tampilkan</span>
                    <select
                      className="bg-slate-900 border border-white/10 rounded px-2 py-1 text-white focus:outline-none focus:border-blue-500"
                      value={entriesPerPageRekening}
                      onChange={(e) => {
                        setEntriesPerPageRekening(Number(e.target.value));
                        setCurrentPageRekening(1);
                      }}
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                    <span>entri</span>
                  </div>

                  {/* Pencarian Rekening */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Cari Data Rekening..."
                      value={searchQueryRekening}
                      onChange={(e) => {
                        setSearchQueryRekening(e.target.value);
                        setCurrentPageRekening(1);
                      }}
                      className="pl-9 pr-3 py-1.5 bg-slate-900/50 border border-white/10 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 w-64"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {selectedRekening.length > 0 && (
                    <button onClick={handleBulkDeleteRekening} className="px-4 py-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 text-sm font-medium rounded-lg transition-colors border border-red-500/30 flex items-center gap-2">
                      <Trash2 className="w-4 h-4" /> Hapus Terpilih ({selectedRekening.length})
                    </button>
                  )}
                  <label className="cursor-pointer px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors border border-slate-600 flex items-center gap-2">
                    <Upload className="w-4 h-4" /> Import Excel
                    <input type="file" accept=".xlsx, .xls" className="hidden" onChange={handleImportRekening} />
                  </label>
                  <button onClick={handleExportRekening} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors border border-slate-600 flex items-center gap-2">
                    <Download className="w-4 h-4" /> Export Excel
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 text-sm">
                      <th className="p-3 font-medium w-12 text-center">
                        <input 
                          type="checkbox" 
                          className="rounded border-white/20 bg-slate-800 checked:bg-blue-500 focus:ring-blue-500"
                          onChange={handleSelectAllRekening}
                          checked={filteredRekeningWithIndex.length > 0 && filteredRekeningWithIndex.every(item => selectedRekening.includes(item.originalIndex))}
                        />
                      </th>
                      <th className="p-3 font-medium min-w-[120px]">Kode Akun</th>
                      <th className="p-3 font-medium min-w-[150px]">Uraian Akun</th>
                      <th className="p-3 font-medium min-w-[140px]">Kode Sub Akun</th>
                      <th className="p-3 font-medium min-w-[160px]">Uraian Sub Akun</th>
                      <th className="p-3 font-medium min-w-[140px]">Kode Komponen</th>
                      <th className="p-3 font-medium min-w-[160px]">Uraian Komponen</th>
                      <th className="p-3 font-medium min-w-[160px]">Kode Sub Komponen</th>
                      <th className="p-3 font-medium min-w-[180px]">Uraian Sub Komponen</th>
                      <th className="p-3 font-medium min-w-[160px]">Nama Barang/Jasa</th>
                      <th className="p-3 font-medium min-w-[120px]">Harga Satuan</th>
                      <th className="p-3 font-medium text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedRekening.map((item, localIndex) => {
                      const globalIndex = item.originalIndex;
                      return (
                      <tr key={globalIndex} className="border-b border-white/5">
                        <td className="p-2 text-center">
                          <input 
                            type="checkbox" 
                            className="rounded border-white/20 bg-slate-800 checked:bg-blue-500 focus:ring-blue-500"
                            checked={selectedRekening.includes(globalIndex)}
                            onChange={() => handleSelectRekening(globalIndex)}
                          />
                        </td>
                        <td className="p-2">
                          <input type="text" value={item.kodeAkun} onChange={(e) => handleUpdateRekening(globalIndex, 'kodeAkun', e.target.value)} className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-blue-500" placeholder="Kode Akun" />
                        </td>
                        <td className="p-2">
                          <input type="text" value={item.uraianAkun} onChange={(e) => handleUpdateRekening(globalIndex, 'uraianAkun', e.target.value)} className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-blue-500" placeholder="Uraian Akun" />
                        </td>
                        <td className="p-2">
                          <input type="text" value={item.kodeSubAkun} onChange={(e) => handleUpdateRekening(globalIndex, 'kodeSubAkun', e.target.value)} className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-blue-500" placeholder="Kode Sub Akun" />
                        </td>
                        <td className="p-2">
                          <input type="text" value={item.uraianSubAkun} onChange={(e) => handleUpdateRekening(globalIndex, 'uraianSubAkun', e.target.value)} className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-blue-500" placeholder="Uraian Sub Akun" />
                        </td>
                        <td className="p-2">
                          <input type="text" value={item.kodeKomponen} onChange={(e) => handleUpdateRekening(globalIndex, 'kodeKomponen', e.target.value)} className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-blue-500" placeholder="Kode Komponen" />
                        </td>
                        <td className="p-2">
                          <input type="text" value={item.uraianKomponen} onChange={(e) => handleUpdateRekening(globalIndex, 'uraianKomponen', e.target.value)} className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-blue-500" placeholder="Uraian Komponen" />
                        </td>
                        <td className="p-2">
                          <input type="text" value={item.kodeSubKomponen} onChange={(e) => handleUpdateRekening(globalIndex, 'kodeSubKomponen', e.target.value)} className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-blue-500" placeholder="Kode Sub Komponen" />
                        </td>
                        <td className="p-2">
                          <input type="text" value={item.uraianSubKomponen} onChange={(e) => handleUpdateRekening(globalIndex, 'uraianSubKomponen', e.target.value)} className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-blue-500" placeholder="Uraian Sub Komponen" />
                        </td>
                        <td className="p-2">
                          <input type="text" value={item.namaBarangJasa} onChange={(e) => handleUpdateRekening(globalIndex, 'namaBarangJasa', e.target.value)} className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-blue-500" placeholder="Nama Barang/Jasa" />
                        </td>
                        <td className="p-2">
                          <input type="text" value={item.hargaSatuan} onChange={(e) => handleUpdateRekening(globalIndex, 'hargaSatuan', e.target.value)} className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-blue-500" placeholder="Harga Satuan" />
                        </td>
                        <td className="p-2 text-center">
                          <button onClick={() => handleRemoveRekening(globalIndex)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    )})}
                    {filteredRekeningWithIndex.length === 0 && (
                      <tr>
                        <td colSpan={12} className="p-8 text-center text-slate-500">
                          {daftarRekening.length === 0 
                            ? 'Belum ada data rekening. Klik "Tambah Baris" atau "Import Excel".' 
                            : 'Tidak ada data rekening yang cocok dengan pencarian Anda.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {totalPagesRekening > 1 && (
                <div className="flex justify-between items-center text-sm text-slate-400 mt-4 flex-wrap gap-2">
                  <div>
                    Menampilkan {startIndexRekening + 1}-{Math.min(startIndexRekening + entriesPerPageRekening, filteredRekeningWithIndex.length)} dari {new Intl.NumberFormat('id-ID').format(filteredRekeningWithIndex.length)} entri {searchQueryRekening && `(disaring dari ${new Intl.NumberFormat('id-ID').format(daftarRekening.length)})`}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPageRekening(Math.max(1, currentPageRekening - 1))}
                      disabled={currentPageRekening === 1}
                      className="px-3 py-1 rounded border border-white/10 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Sebelumnya
                    </button>
                    {renderPaginationButtons(currentPageRekening, totalPagesRekening, setCurrentPageRekening)}
                    <button
                      onClick={() => setCurrentPageRekening(Math.min(totalPagesRekening, currentPageRekening + 1))}
                      disabled={currentPageRekening === totalPagesRekening}
                      className="px-3 py-1 rounded border border-white/10 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Selanjutnya
                    </button>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 mt-4 border-t border-white/10">
                <button onClick={handleAddRekening} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors border border-slate-600 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Tambah Baris
                </button>
                <button onClick={handleSimpanRekening} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2">
                  <Check className="w-4 h-4" /> Simpan Perubahan
                </button>
              </div>
            </div>
          )}

          {/* TAB: DAFTAR SNP */}
          {activeTab === 'daftar-snp' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b border-white/10 pb-4 gap-4">
                <div className="flex flex-wrap items-center gap-4">
                  <h3 className="text-lg font-semibold text-white">Daftar SNP</h3>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <span>Tampilkan</span>
                    <select
                      className="bg-slate-900 border border-white/10 rounded px-2 py-1 text-white focus:outline-none focus:border-blue-500"
                      value={entriesPerPageSNP}
                      onChange={(e) => {
                        setEntriesPerPageSNP(Number(e.target.value));
                        setCurrentPageSNP(1);
                      }}
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                    <span>entri</span>
                  </div>

                  {/* Pencarian SNP */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Cari program, kegiatan, kode atau uraian..."
                      value={searchQuerySNP}
                      onChange={(e) => {
                        setSearchQuerySNP(e.target.value);
                        setCurrentPageSNP(1);
                      }}
                      className="pl-9 pr-3 py-1.5 bg-slate-900/50 border border-white/10 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 w-64"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {selectedSNP.length > 0 && (
                    <button onClick={handleBulkDeleteSNP} className="px-4 py-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 text-sm font-medium rounded-lg transition-colors border border-red-500/30 flex items-center gap-2">
                      <Trash2 className="w-4 h-4" /> Hapus Terpilih ({selectedSNP.length})
                    </button>
                  )}
                  <label className="cursor-pointer px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors border border-slate-600 flex items-center gap-2">
                    <Upload className="w-4 h-4" /> Import Excel
                    <input type="file" accept=".xlsx, .xls" className="hidden" onChange={handleImportSNP} />
                  </label>
                  <button onClick={handleExportSNP} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors border border-slate-600 flex items-center gap-2">
                    <Download className="w-4 h-4" /> Export Excel
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 text-sm">
                      <th className="p-3 font-medium w-12 text-center">
                        <input 
                          type="checkbox" 
                          className="rounded border-white/20 bg-slate-800 checked:bg-blue-500 focus:ring-blue-500"
                          onChange={handleSelectAllSNP}
                          checked={filteredSNPWithIndex.length > 0 && filteredSNPWithIndex.every(item => selectedSNP.includes(item.originalIndex))}
                        />
                      </th>
                      <th className="p-3 font-medium">Program</th>
                      <th className="p-3 font-medium">Sub Program</th>
                      <th className="p-3 font-medium">Kegiatan</th>
                      <th className="p-3 font-medium">Sub Kegiatan</th>
                      <th className="p-3 font-medium">Kode Rekening</th>
                      <th className="p-3 font-medium">Uraian</th>
                      <th className="p-3 font-medium text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedSNP.map((item, localIndex) => {
                      const globalIndex = item.originalIndex;
                      const isSameProgram = globalIndex > 0 && item.program === daftarSNP[globalIndex-1].program && item.program !== '';
                      const isSameSubProgram = isSameProgram && item.subProgram === daftarSNP[globalIndex-1].subProgram && item.subProgram !== '';
                      const isSameKegiatan = isSameSubProgram && item.kegiatan === daftarSNP[globalIndex-1].kegiatan && item.kegiatan !== '';

                      return (
                        <tr key={globalIndex} className="border-b border-white/5">
                          <td className="p-2 text-center align-top">
                            <div className="pt-2">
                              <input 
                                type="checkbox" 
                                className="rounded border-white/20 bg-slate-800 checked:bg-blue-500 focus:ring-blue-500"
                                checked={selectedSNP.includes(globalIndex)}
                                onChange={() => handleSelectSNP(globalIndex)}
                              />
                            </div>
                          </td>
                          <td className="p-2 align-top relative">
                            <input type="text" value={item.program} onChange={(e) => handleUpdateSNP(globalIndex, 'program', e.target.value)} 
                              className={`w-full min-w-[120px] bg-slate-900/50 border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-blue-500 transition-all ${isSameProgram ? 'border-transparent text-slate-600/30 hover:text-slate-300 hover:border-white/10' : 'border-white/10 text-white font-medium'}`} 
                              placeholder="Program" />
                          </td>
                          <td className="p-2 align-top relative">
                            <div className="flex items-start gap-1">
                              {globalIndex > 0 && isSameProgram && !isSameSubProgram && (
                                <div className="w-3 h-3 border-l-2 border-b-2 border-slate-600 rounded-bl shrink-0 opacity-50 mt-1.5 mr-1"></div>
                              )}
                              <input type="text" value={item.subProgram} onChange={(e) => handleUpdateSNP(globalIndex, 'subProgram', e.target.value)} 
                                className={`w-full min-w-[120px] bg-slate-900/50 border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-blue-500 transition-all ${isSameSubProgram ? 'border-transparent text-slate-600/30 hover:text-slate-300 hover:border-white/10' : 'border-white/10 text-slate-200'}`} 
                                placeholder="Sub Program" />
                            </div>
                          </td>
                          <td className="p-2 align-top relative">
                            <div className="flex items-start gap-1">
                              {globalIndex > 0 && isSameSubProgram && !isSameKegiatan && (
                                <div className="w-3 h-3 border-l-2 border-b-2 border-slate-600 rounded-bl shrink-0 opacity-50 mt-1.5 mr-1"></div>
                              )}
                              <input type="text" value={item.kegiatan} onChange={(e) => handleUpdateSNP(globalIndex, 'kegiatan', e.target.value)} 
                                className={`w-full min-w-[120px] bg-slate-900/50 border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-blue-500 transition-all ${isSameKegiatan ? 'border-transparent text-slate-600/30 hover:text-slate-300 hover:border-white/10' : 'border-white/10 text-slate-300'}`} 
                                placeholder="Kegiatan" />
                            </div>
                          </td>
                          <td className="p-2 align-top relative">
                            <div className="flex items-start gap-1">
                              {globalIndex > 0 && isSameKegiatan && (
                                <div className="w-3 h-3 border-l-2 border-b-2 border-slate-600 rounded-bl shrink-0 opacity-50 mt-1.5 mr-1"></div>
                              )}
                              <input type="text" value={item.subKegiatan} onChange={(e) => handleUpdateSNP(globalIndex, 'subKegiatan', e.target.value)} 
                                className={`w-full min-w-[120px] bg-slate-900/50 border border-white/10 rounded-lg px-2 py-1.5 text-slate-400 text-sm focus:outline-none focus:border-blue-500`} 
                                placeholder="Sub Kegiatan" />
                            </div>
                          </td>
                          <td className="p-2 align-top">
                            <input type="text" value={item.kodeRekening} onChange={(e) => handleUpdateSNP(globalIndex, 'kodeRekening', e.target.value)} className="w-full min-w-[100px] bg-slate-900/50 border border-white/10 rounded-lg px-2 py-1.5 text-white text-sm focus:outline-none focus:border-blue-500" placeholder="Kode Rekening" />
                          </td>
                          <td className="p-2 align-top">
                            <input type="text" value={item.uraian} onChange={(e) => handleUpdateSNP(globalIndex, 'uraian', e.target.value)} className="w-full min-w-[150px] bg-slate-900/50 border border-white/10 rounded-lg px-2 py-1.5 text-white text-sm focus:outline-none focus:border-blue-500" placeholder="Uraian" />
                          </td>
                          <td className="p-2 text-center align-top">
                            <button onClick={() => handleRemoveSNP(globalIndex)} className="p-1.5 mt-0.5 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredSNPWithIndex.length === 0 && (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-slate-500">
                          {daftarSNP.length === 0 
                            ? 'Belum ada data SNP. Klik "Tambah Baris" atau "Import Excel".' 
                            : 'Tidak ada data SNP yang cocok dengan pencarian Anda.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {totalPagesSNP > 1 && (
                <div className="flex justify-between items-center text-sm text-slate-400 mt-4 flex-wrap gap-2">
                  <div>
                    Menampilkan {startIndexSNP + 1}-{Math.min(startIndexSNP + entriesPerPageSNP, filteredSNPWithIndex.length)} dari {new Intl.NumberFormat('id-ID').format(filteredSNPWithIndex.length)} entri {searchQuerySNP && `(disaring dari ${new Intl.NumberFormat('id-ID').format(daftarSNP.length)})`}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPageSNP(Math.max(1, currentPageSNP - 1))}
                      disabled={currentPageSNP === 1}
                      className="px-3 py-1 rounded border border-white/10 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Sebelumnya
                    </button>
                    {renderPaginationButtons(currentPageSNP, totalPagesSNP, setCurrentPageSNP)}
                    <button
                      onClick={() => setCurrentPageSNP(Math.min(totalPagesSNP, currentPageSNP + 1))}
                      disabled={currentPageSNP === totalPagesSNP}
                      className="px-3 py-1 rounded border border-white/10 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Selanjutnya
                    </button>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 mt-4 border-t border-white/10">
                <button onClick={handleAddSNP} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors border border-slate-600 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Tambah Baris
                </button>
                <button onClick={handleSimpanSNP} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2">
                  <Check className="w-4 h-4" /> Simpan Perubahan
                </button>
              </div>
            </div>
          )}

          {/* TAB: SISTEM */}
          {activeTab === 'sistem' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-4">Pemeliharaan Sistem</h3>
              
              <div className="space-y-4 max-w-2xl mt-6">
                <div className="p-5 bg-slate-900/50 border border-white/10 rounded-xl">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0 mt-1">
                      <Server className="w-5 h-5 text-amber-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium text-base">Manajemen Database</h4>
                      <p className="text-sm text-slate-400 mt-1">Backup seluruh data (Profil, Data Guru, Siswa, BKU, dll) atau restore dari file backup lokal.</p>
                      <div className="flex gap-3 mt-4">
                        <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors border border-slate-600">
                          Backup Database (.json)
                        </button>
                        <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors border border-slate-600">
                          Restore Database
                        </button>
                        <button className="px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 text-sm font-medium rounded-lg transition-colors border border-red-900/50 ml-auto">
                          Reset Data
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-slate-900/50 border border-white/10 rounded-xl">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 mt-1">
                      <Upload className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-white font-medium text-base">Fungsi Sambungan Cloud</h4>
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 text-xs font-medium border border-slate-700">Offline Mode</span>
                      </div>
                      <p className="text-sm text-slate-400 mt-1">Sinkronisasi data ke cloud server untuk akses multi-device dan backup otomatis.</p>
                      <div className="flex gap-3 mt-4">
                        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-900/20">
                          Hubungkan ke Cloud
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}
          
        </div>
      </div>
    </div>
    </>
  );
}
