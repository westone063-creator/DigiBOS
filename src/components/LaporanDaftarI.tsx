import React, { useRef } from 'react';
import { getKopSurat } from '../utils/settings';
import { ArrowLeft, Printer } from 'lucide-react';

interface LaporanDaftarIProps {
  onBack: () => void;
}

export default function LaporanDaftarI({ onBack }: LaporanDaftarIProps) {
  const kopSurat = getKopSurat();
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Kembali ke Daftar</span>
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={handlePrint}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl backdrop-blur-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-all shadow-sm"
          >
            <Printer className="w-4 h-4" /> <span className="hidden sm:inline">Cetak Laporan</span>
          </button>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden p-6 md:p-10 shadow-2xl relative print:bg-transparent print:border-none print:shadow-none print:p-0">
        <div ref={componentRef} className="print:text-black print:bg-white max-w-[800px] mx-auto text-slate-200">
          <style dangerouslySetInnerHTML={{__html: `
            .daftar-1-container {
              font-family: 'Times New Roman', Times, serif;
              font-size: 12px;
              line-height: 1.4;
              color: black;
              background: white;
              padding: 20px;
            }
            .d1-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 15px;
            }
            .d1-table th, .d1-table td {
              border: 1px solid black;
              padding: 6px;
              text-align: center;
              vertical-align: middle;
            }
            .d1-text-left { text-align: left !important; }
            .d1-text-right { text-align: right !important; }
            .d1-bold { font-weight: bold; }
            .d1-section-title {
              font-weight: bold;
              margin-top: 15px;
              margin-bottom: 5px;
            }
            .d1-grid-2 {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
            }
            .d1-no-border {
              border: none !important;
              padding: 4px 0 !important;
            }
            @media print {
              .daftar-1-container {
                padding: 0;
              }
            }
          `}} />

          <div className="daftar-1-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginBottom: '20px' }}>
              <div style={{ fontSize: '14px', textDecoration: 'underline' }}>DAFTAR I</div>
              <div style={{ textAlign: 'center', fontSize: '14px' }}>
                LAPORAN STATISTIK SEKOLAH DASAR<br/>
                KEADAAN PADA AKHIR BULAN : MEI 2026
              </div>
              <div style={{ width: '50px' }}></div> {/* Spacer */}
            </div>

            <table className="d1-table" style={{ border: 'none', marginBottom: '20px' }}>
              <tbody>
                <tr>
                  <td className="d1-text-left d1-no-border" style={{ width: '15%' }}>Status Sekolah</td>
                  <td className="d1-text-left d1-no-border" style={{ width: '35%' }}>: <span className="d1-bold">Negeri Biasa</span></td>
                  <td className="d1-text-left d1-no-border" style={{ width: '15%' }}>Kecamatan</td>
                  <td className="d1-text-left d1-no-border" style={{ width: '35%' }}>: Klangenan</td>
                </tr>
                <tr>
                  <td className="d1-text-left d1-no-border">Nama Sekolah</td>
                  <td className="d1-text-left d1-no-border">: <span className="d1-bold">{kopSurat.kopBaris3}</span></td>
                  <td className="d1-text-left d1-no-border">Kab/Kota</td>
                  <td className="d1-text-left d1-no-border">: Cirebon</td>
                </tr>
                <tr>
                  <td className="d1-text-left d1-no-border">NSS / NPSN</td>
                  <td className="d1-text-left d1-no-border">: 101021719019 / 20215460</td>
                  <td className="d1-text-left d1-no-border">Provinsi</td>
                  <td className="d1-text-left d1-no-border">: Jawa Barat</td>
                </tr>
                <tr>
                  <td className="d1-text-left d1-no-border">Alamat</td>
                  <td className="d1-text-left d1-no-border">: Desa Slangit</td>
                  <td className="d1-text-left d1-no-border"></td>
                  <td className="d1-text-left d1-no-border"></td>
                </tr>
              </tbody>
            </table>

            <div className="d1-section-title">A. TANAH</div>
            <table className="d1-table">
              <tbody>
                <tr>
                  <td className="d1-text-left" style={{ width: '50%' }}>Luas Tanah: <span className="d1-bold">862 m²</span></td>
                  <td className="d1-text-left">Status Kepemilikan: <span className="d1-bold">Pemerintah</span></td>
                </tr>
              </tbody>
            </table>

            <div className="d1-section-title">B. BANYAKNYA MURID</div>
            <table className="d1-table">
              <thead>
                <tr>
                  <th rowSpan={2}>KELAS</th>
                  <th colSpan={3}>PENGHABISAN BLN LALU</th>
                  <th colSpan={3}>MASUK BULAN INI</th>
                  <th colSpan={3}>KELUAR BULAN INI</th>
                  <th colSpan={3}>JML AKHIR BLN INI</th>
                </tr>
                <tr>
                  <th>L</th><th>P</th><th>JML</th>
                  <th>L</th><th>P</th><th>JML</th>
                  <th>L</th><th>P</th><th>JML</th>
                  <th>L</th><th>P</th><th>JML</th>
                </tr>
              </thead>
              <tbody>
                {['I', 'II', 'III', 'IV', 'V', 'VI', 'JUMLAH'].map((kelas, idx) => (
                  <tr key={kelas}>
                    <td className={kelas === 'JUMLAH' ? 'd1-bold' : ''}>{kelas}</td>
                    <td></td><td></td><td></td>
                    <td></td><td></td><td></td>
                    <td></td><td></td><td></td>
                    <td></td><td></td><td></td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="d1-grid-2">
              <div>
                <div className="d1-section-title">C. BANGUNAN</div>
                <table className="d1-table">
                  <thead>
                    <tr>
                      <th>Kondisi Bangunan</th>
                      <th>Jumlah Ruang</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td className="d1-text-left">Baik</td><td></td></tr>
                    <tr><td className="d1-text-left">Rusak Sedang</td><td></td></tr>
                  </tbody>
                </table>

                <div className="d1-section-title">D. TAHUN PENDIRIAN & JENIS</div>
                <table className="d1-table">
                  <tbody>
                    <tr>
                      <td className="d1-text-left" style={{ width: '60%' }}>Tahun Pendirian</td>
                      <td className="d1-bold">1922 / 1985</td>
                    </tr>
                    <tr>
                      <td className="d1-text-left">Jenis Bangunan</td>
                      <td className="d1-bold">Permanen</td>
                    </tr>
                  </tbody>
                </table>

                <div className="d1-section-title">E. AIR BERSIH & ABSENSI</div>
                <table className="d1-table">
                  <tbody>
                    <tr>
                      <td className="d1-text-left" style={{ width: '60%' }}>Sumber Air Bersih</td>
                      <td>Ada</td>
                    </tr>
                    <tr>
                      <td className="d1-text-left">Absen Murid (G)</td>
                      <td className="d1-bold">0,0%</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div>
                <div className="d1-section-title">F. PERKAKAS (MUBLEIR)</div>
                <table className="d1-table">
                  <thead>
                    <tr>
                      <th>Jenis</th>
                      <th>Baik</th>
                      <th>Sedang</th>
                      <th>Rusak</th>
                      <th>Jml</th>
                    </tr>
                  </thead>
                  <tbody>
                    {['Bangku Murid', 'Meja Murid', 'Kursi Murid', 'Meja Guru', 'Kursi Guru', 'Lemari', 'Papan Tulis'].map(item => (
                      <tr key={item}>
                        <td className="d1-text-left">{item}</td>
                        <td></td><td></td><td></td><td></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="d1-section-title">H. DATA PEGAWAI</div>
            <table className="d1-table">
              <thead>
                <tr>
                  <th>Status Pegawai</th>
                  <th>L</th>
                  <th>P</th>
                  <th>Jumlah</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="d1-text-left">Kepala Sekolah</td><td></td><td></td><td className="d1-bold">1</td></tr>
                <tr><td className="d1-text-left">Guru PNS</td><td></td><td></td><td className="d1-bold">8</td></tr>
                <tr><td className="d1-text-left">Guru Honor</td><td></td><td></td><td className="d1-bold">8</td></tr>
                <tr><td className="d1-text-left">Tenaga Administrasi</td><td></td><td></td><td className="d1-bold">2</td></tr>
                <tr><td className="d1-text-left">Penjaga Sekolah</td><td></td><td></td><td className="d1-bold">2</td></tr>
                <tr className="d1-bold"><td className="d1-text-left">TOTAL</td><td></td><td></td><td>21</td></tr>
              </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '40px', textAlign: 'center' }}>
              <div>
                <p>Slangit, 31 Mei 2026</p>
                <p>Kepala Sekolah,</p>
                <br/><br/><br/><br/>
                <p style={{ fontWeight: 'bold', textDecoration: 'underline' }}>NAMA KEPALA SEKOLAH</p>
                <p>NIP. ..............................</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
