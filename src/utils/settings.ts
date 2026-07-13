export interface KopSurat {
  kopBaris1: string;
  kopBaris2: string;
  kopBaris3: string;
  kopBaris4: string;
}

const DEFAULT_KOP: KopSurat = {
  kopBaris1: 'PEMERINTAH PROVINSI JAWA BARAT',
  kopBaris2: 'DINAS PENDIDIKAN',
  kopBaris3: 'SMA NEGERI 1 CIREBON',
  kopBaris4: 'Jl. Dr. Wahidin Sudirohusodo No. 81, Cirebon, Jawa Barat 45122 | Telepon: (0231) 203301 | Email: info@sman1cirebon.sch.id | Website: www.sman1cirebon.sch.id',
};

export const getKopSurat = (): KopSurat => {
  try {
    const data = localStorage.getItem('kopSurat');
    if (data) {
      return { ...DEFAULT_KOP, ...JSON.parse(data) };
    }
  } catch (e) {
    console.error('Failed to parse kopSurat from localStorage', e);
  }
  return DEFAULT_KOP;
};

export const saveKopSurat = (kop: KopSurat) => {
  localStorage.setItem('kopSurat', JSON.stringify(kop));
};

export const getProfilSekolah = () => {
  return {
    kecamatan: localStorage.getItem('kecamatan') || 'Kejaksan',
    namaSekolah: getKopSurat().kopBaris3,
  };
};

export const getPenandaTangan = () => {
  return {
    namaKepsek: localStorage.getItem('namaKepsek') || 'Drs. H. Ahmad Sudirman, M.Pd.',
    nipKepsek: localStorage.getItem('nipKepsek') || '19700512 199512 1 003',
    pangkatKepsek: localStorage.getItem('pangkatKepsek') || 'Pembina Utama Muda, IV/c',
    jabatanKepsek: localStorage.getItem('jabatanKepsek') || 'Kepala Sekolah',
    ktpKepsek: localStorage.getItem('ktpKepsek') || '',
    alamatKepsek: localStorage.getItem('alamatKepsek') || '',
    namaBendahara: localStorage.getItem('namaBendahara') || 'Siti Aminah, S.E',
    nipBendahara: localStorage.getItem('nipBendahara') || '19850202 201001 2 002',
    ktpBendahara: localStorage.getItem('ktpBendahara') || '',
    alamatBendahara: localStorage.getItem('alamatBendahara') || '',
  };
};

export const getTitimangsa = () => {
  return localStorage.getItem('titimangsa') || 'Cirebon';
};

export const DEFAULT_LOGO = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iY292ZXItZ3JhZCIgeDE9IjAiIHkxPSIwIiB4Mj0iMSIgeTI9IjEiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMDJhNmYyIiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM1YTY3ZjIiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJiYWNrLWdyYWQiIHgxPSIwIiB5MT0iMCIgeDI9IjEiIHkyPSIxIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2UwZjJmZSIgLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjYmFlNmZkIiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgCiAgPCEtLSBCYWNrIHBhZ2VzIC0tPgogIDxwYXRoIGQ9Ik0gMjUgMTUgTCA4NSAxNSBDIDg3Ljc2MSAxNSA5MCAxNy4yMzkgOTAgMjAgTCA5MCA5MCBDIDkwIDkyLjc2MSA4Ny43NjEgOTUgODUgOTUgTCAyNSA5NSBaIiBmaWxsPSJ1cmwoI2JhY2stZ3JhZCkiIC8+CiAgCiAgPCEtLSBGcm9udCBjb3ZlciAoYW5nbGVkKSAtLT4KICA8cGF0aCBkPSJNIDI1IDI1IEwgNzUgMTAgQyA3Ny43NjEgOS4xNzIgODAuNjg2IDEwLjczOSA4MS41MTUgMTMuNSBMIDgxLjUxNSAxMy41IEwgODEuNTE1IDgzLjUgQyA4MS41MTUgODYuMjYxIDc5LjI3NyA4OC41IDc2LjUxNSA4OC41IEwgMjUgMTAwIEwgMjUgMjUgWiIgZmlsbD0idXJsKCNjb3Zlci1ncmFkKSIgLz4KICAKICA8IS0tIFdoaXRlIGxpbmVzIC0tPgogIDxwYXRoIGQ9Ik0gNDAgMjggTCA3MCAyMSIgc3Ryb2tlPSIjZTBmMmZlIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgLz4KICA8cGF0aCBkPSJNIDQwIDQzIEwgNzAgMzYiIHN0cm9rZT0iI2UwZjJmZSIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiIC8+CiAgPHBhdGggZD0iTSA0MCA1OCBMIDcwIDUxIiBzdHJva2U9IiNlMGYyZmUiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiAvPgogIDxwYXRoIGQ9Ik0gNDAgNzMgTCA3MCA2NiIgc3Ryb2tlPSIjZTBmMmZlIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgLz4KICAKICA8IS0tIFNwaXJhbHMgLS0+CiAgPHJlY3QgeD0iMTUiIHk9IjI1IiB3aWR0aD0iMjAiIGhlaWdodD0iNiIgcng9IjMiIGZpbGw9IiNlMGYyZmUiIC8+CiAgPHJlY3QgeD0iMTUiIHk9IjQwIiB3aWR0aD0iMjAiIGhlaWdodD0iNiIgcng9IjMiIGZpbGw9IiNlMGYyZmUiIC8+CiAgPHJlY3QgeD0iMTUiIHk9IjU1IiB3aWR0aD0iMjAiIGhlaWdodD0iNiIgcng9IjMiIGZpbGw9IiNlMGYyZmUiIC8+CiAgPHJlY3QgeD0iMTUiIHk9IjcwIiB3aWR0aD0iMjAiIGhlaWdodD0iNiIgcng9IjMiIGZpbGw9IiNlMGYyZmUiIC8+CiAgPHJlY3QgeD0iMTUiIHk9Ijg1IiB3aWR0aD0iMjAiIGhlaWdodD0iNiIgcng9IjMiIGZpbGw9IiNlMGYyZmUiIC8+Cjwvc3ZnPgo=";

export const getLogo = () => {
  return localStorage.getItem('logoInstansi') || DEFAULT_LOGO;
};

export const saveLogo = (logoBase64: string) => {
  localStorage.setItem('logoInstansi', logoBase64);
};

export const getFormatSurat = () => {
  return {
    prefix: localStorage.getItem('formatSuratPrefix') || '421.2',
    suffix: localStorage.getItem('formatSuratSuffix') || 'SD.01',
  };
};
