const fs = require('fs');
const file = 'src/components/BkuArkas.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetMatchRegex = /\/\/ Find a matching item in the SNP list[\s\S]*?NON BARANG PAKAI HABIS';\s*\n\s*}\s*\n\s*}/m;

const replacementMatch = `// Find a matching item in the SNP list for KODE KEGIATAN
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

if (targetMatchRegex.test(content)) {
    content = content.replace(targetMatchRegex, replacementMatch);
    fs.writeFileSync(file, content);
    console.log("Successfully replaced target block.");
} else {
    console.error("Could not find the target block to replace.");
}

