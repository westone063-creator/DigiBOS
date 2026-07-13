const fs = require('fs');
const file = 'src/components/BkuArkas.tsx';
let content = fs.readFileSync(file, 'utf8');

const target1 = `// Find a matching item in the SNP list
            let matchedSnp = normalizedSnpList.find(snp => {
              if (cleanImportedCode && snp.cleanCode === cleanImportedCode) {
                return true;
              }
              return false;
            });`;

const replacement1 = `// Find a matching item in the SNP list
            let matchedSnp = normalizedSnpList.find(snp => {
              if (cleanImportedCode && snp.cleanCode === cleanImportedCode) return true;
              
              // Match KODE KEGIATAN as well against Daftar SNP (Kode Rekening)
              const cleanImportedKegiatan = importedKegiatan.toLowerCase().trim().replace(/[\\s_.-]+/g, '');
              if (cleanImportedKegiatan && snp.cleanCode === cleanImportedKegiatan) return true;
              
              return false;
            });`;

const target2 = `            if (matchedSnp) {
              finalCode = matchedSnp.original.kodeRekening || finalCode;
              finalKegiatan = matchedSnp.original.subKegiatan || matchedSnp.original.kegiatan || finalKegiatan;`;

const replacement2 = `            if (matchedSnp) {
              finalCode = matchedSnp.original.kodeRekening || finalCode;
              
              // Menampilkan Kode Rekening, Uraian yang diambil dari Daftar SNP
              const matchedCode = matchedSnp.original.kodeRekening || '';
              const matchedUraian = matchedSnp.original.uraian || '';
              if (matchedCode || matchedUraian) {
                finalKegiatan = [matchedCode, matchedUraian].filter(Boolean).join(', ');
              } else {
                finalKegiatan = matchedSnp.original.subKegiatan || matchedSnp.original.kegiatan || finalKegiatan;
              }`;

content = content.replace(target1, replacement1);
content = content.replace(target2, replacement2);
fs.writeFileSync(file, content);
console.log('Patched');
