const fs = require('fs');
const file = 'src/components/BkuArkas.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetLoad = `        // Load SNP list from localStorage for matching/alignment
        const savedSnp = localStorage.getItem('daftarSNP');
        const snpList: any[] = savedSnp ? JSON.parse(savedSnp) : [];

        // Pre-normalize SNP codes and descriptions for quick & robust comparison
        const normalizedSnpList = snpList.map(item => {
          const rawCode = item.kodeRekening || '';
          const rawUraian = item.uraian || '';
          return {
            original: item,
            cleanCode: rawCode.toLowerCase().trim().replace(/[\\s_.-]+/g, ''),
            cleanUraian: rawUraian.toLowerCase().trim().replace(/[\\s_.-]+/g, '')
          };
        });`;

const replacementLoad = `        // Load SNP list from localStorage for matching/alignment
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
            cleanCode: rawCode.toLowerCase().trim().replace(/[\\s_.-]+/g, ''),
            cleanUraian: rawUraian.toLowerCase().trim().replace(/[\\s_.-]+/g, '')
          };
        });

        // Pre-normalize Rekening codes
        const normalizedRekeningList = rekeningList.map(item => {
          // Use kodeSubKomponen or other available codes for matching
          const rawCode = item.kodeSubKomponen || item.kodeKomponen || item.kodeSubAkun || item.kodeAkun || '';
          const rawUraian = item.uraianSubKomponen || item.uraianKomponen || item.namaBarangJasa || '';
          return {
            original: item,
            cleanCode: rawCode.toLowerCase().trim().replace(/[\\s_.-]+/g, ''),
            cleanUraian: rawUraian.toLowerCase().trim().replace(/[\\s_.-]+/g, '')
          };
        });`;

content = content.replace(targetLoad, replacementLoad);

const targetMatch = `            // Find a matching item in the SNP list
            let matchedSnp = normalizedSnpList.find(snp => {
              if (cleanImportedCode && snp.cleanCode === cleanImportedCode) return true;
              
              // Match KODE KEGIATAN as well against Daftar SNP (Kode Rekening)
              const cleanImportedKegiatan = importedKegiatan.toLowerCase().trim().replace(/[\\s_.-]+/g, '');
              if (cleanImportedKegiatan && snp.cleanCode === cleanImportedKegiatan) return true;
              
              return false;
            });

            if (!matchedSnp && cleanImportedUraian) {
              matchedSnp = normalizedSnpList.find(snp => snp.cleanUraian === cleanImportedUraian);
            }

            if (!matchedSnp && cleanImportedUraian) {
              matchedSnp = normalizedSnpList.find(snp => {
                return snp.cleanUraian.includes(cleanImportedUraian) || cleanImportedUraian.includes(snp.cleanUraian);
              });
            }

            // Align properties based on SNP if match found
            let finalCode = importedCode;
            let finalKegiatan = importedKegiatan;
            let finalBelanja = 'BARANG PAKAI HABIS';

            if (matchedSnp) {
              finalCode = matchedSnp.original.kodeRekening || finalCode;
              
              // Menampilkan Kode Rekening, Uraian yang diambil dari Daftar SNP
              const matchedCode = matchedSnp.original.kodeRekening || '';
              const matchedUraian = matchedSnp.original.uraian || '';
              if (matchedCode || matchedUraian) {
                finalKegiatan = [matchedCode, matchedUraian].filter(Boolean).join(', ');
              } else {
                finalKegiatan = matchedSnp.original.subKegiatan || matchedSnp.original.kegiatan || finalKegiatan;
              }

              // Determine best belanja category based on description and code
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
            }`;

const replacementMatch = `            // Find a matching item in the SNP list for KODE KEGIATAN
            let matchedSnp = undefined;
            const cleanImportedKegiatan = importedKegiatan.toLowerCase().trim().replace(/[\\s_.-]+/g, '');
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
            }`;

if (content.includes('// Pre-normalize SNP codes and descriptions')) {
    content = content.replace(targetLoad, replacementLoad);
} else {
    console.error("targetLoad not found");
}

if (content.includes('// Find a matching item in the SNP list')) {
    content = content.replace(targetMatch, replacementMatch);
} else {
    console.error("targetMatch not found");
}

fs.writeFileSync(file, content);
console.log('Patched rekening matching');
