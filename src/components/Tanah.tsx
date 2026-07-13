import React, { useState } from 'react';
import { Map, Save, Printer, FileText } from 'lucide-react';

export default function Tanah() {
  return (
    <div className="w-full h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
            <Map className="w-6 h-6 text-emerald-400" />
            Data Tanah & Bangunan
          </h1>
          <p className="text-slate-400 text-sm mt-1">Kelola data aset tanah dan bangunan milik sekolah.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors">
            <Save className="w-4 h-4" /> Simpan Data
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-colors">
            <Printer className="w-4 h-4" /> Cetak
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pb-10">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden text-slate-800">
          
          <div className="p-6 md:p-8 space-y-12">
            
            {/* Section A: TANAH */}
            <section>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2 border-b pb-2">
                <span className="bg-emerald-100 text-emerald-800 w-8 h-8 rounded flex items-center justify-center">A</span>
                TANAH
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-slate-300 text-sm">
                  <thead>
                    <tr className="bg-slate-100 text-center">
                      <th className="border border-slate-300 p-2 font-semibold">Status Kepemilikan</th>
                      <th className="border border-slate-300 p-2 font-semibold">Luasnya (m²)</th>
                      <th className="border border-slate-300 p-2 font-semibold">Darat / Sawah</th>
                      <th className="border border-slate-300 p-2 font-semibold">No. Persil</th>
                      <th className="border border-slate-300 p-2 font-semibold">Tahun Pembelian</th>
                      <th className="border border-slate-300 p-2 font-semibold">Harga (Rp.)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-slate-300 p-2 font-medium">Pemerintah</td>
                      <td className="border border-slate-300 p-2"><input type="number" defaultValue={862} className="w-full outline-none text-center bg-transparent" /></td>
                      <td className="border border-slate-300 p-2"><input type="text" defaultValue="-" className="w-full outline-none text-center bg-transparent" /></td>
                      <td className="border border-slate-300 p-2"><input type="text" defaultValue="-" className="w-full outline-none text-center bg-transparent" /></td>
                      <td className="border border-slate-300 p-2"><input type="text" defaultValue="1980" className="w-full outline-none text-center bg-transparent" /></td>
                      <td className="border border-slate-300 p-2"><input type="number" defaultValue={1500000} className="w-full outline-none text-right bg-transparent" /></td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 p-2 font-medium">Yayasan</td>
                      <td className="border border-slate-300 p-2"><input type="number" className="w-full outline-none text-center bg-transparent" /></td>
                      <td className="border border-slate-300 p-2"><input type="text" className="w-full outline-none text-center bg-transparent" /></td>
                      <td className="border border-slate-300 p-2"><input type="text" className="w-full outline-none text-center bg-transparent" /></td>
                      <td className="border border-slate-300 p-2"><input type="text" className="w-full outline-none text-center bg-transparent" /></td>
                      <td className="border border-slate-300 p-2"><input type="number" className="w-full outline-none text-right bg-transparent" /></td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 p-2 font-medium">Perseorangan</td>
                      <td className="border border-slate-300 p-2"><input type="number" className="w-full outline-none text-center bg-transparent" /></td>
                      <td className="border border-slate-300 p-2"><input type="text" className="w-full outline-none text-center bg-transparent" /></td>
                      <td className="border border-slate-300 p-2"><input type="text" className="w-full outline-none text-center bg-transparent" /></td>
                      <td className="border border-slate-300 p-2"><input type="text" className="w-full outline-none text-center bg-transparent" /></td>
                      <td className="border border-slate-300 p-2"><input type="number" className="w-full outline-none text-right bg-transparent" /></td>
                    </tr>
                    <tr className="bg-slate-50 font-bold">
                      <td className="border border-slate-300 p-2 text-center">Jumlah</td>
                      <td className="border border-slate-300 p-2 text-center">862</td>
                      <td className="border border-slate-300 p-2"></td>
                      <td className="border border-slate-300 p-2"></td>
                      <td className="border border-slate-300 p-2"></td>
                      <td className="border border-slate-300 p-2 text-right">1500000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section B: BANGUNAN */}
            <section>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2 border-b pb-2">
                <span className="bg-emerald-100 text-emerald-800 w-8 h-8 rounded flex items-center justify-center">B</span>
                BANGUNAN
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-slate-300 text-sm text-center">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="border border-slate-300 p-2 font-semibold align-middle" rowSpan={2}>Status Kepemilikan</th>
                      <th className="border border-slate-300 p-2 font-semibold" colSpan={2}>Baik</th>
                      <th className="border border-slate-300 p-2 font-semibold" colSpan={2}>Sedang</th>
                      <th className="border border-slate-300 p-2 font-semibold" colSpan={2}>Rusak</th>
                      <th className="border border-slate-300 p-2 font-semibold" colSpan={2}>Jumlah</th>
                    </tr>
                    <tr className="bg-slate-50 text-xs">
                      <th className="border border-slate-300 p-1">Bgn</th>
                      <th className="border border-slate-300 p-1">Rgn</th>
                      <th className="border border-slate-300 p-1">Bgn</th>
                      <th className="border border-slate-300 p-1">Rgn</th>
                      <th className="border border-slate-300 p-1">Bgn</th>
                      <th className="border border-slate-300 p-1">Rgn</th>
                      <th className="border border-slate-300 p-1">Bgn</th>
                      <th className="border border-slate-300 p-1">Rgn</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-slate-300 p-2 font-medium text-left">Pemerintah</td>
                      <td className="border border-slate-300 p-1"><input type="number" defaultValue={1} className="w-10 outline-none text-center bg-transparent" /></td>
                      <td className="border border-slate-300 p-1"><input type="number" defaultValue={6} className="w-10 outline-none text-center bg-transparent" /></td>
                      <td className="border border-slate-300 p-1"><input type="number" className="w-10 outline-none text-center bg-transparent" /></td>
                      <td className="border border-slate-300 p-1"><input type="number" className="w-10 outline-none text-center bg-transparent" /></td>
                      <td className="border border-slate-300 p-1"><input type="number" className="w-10 outline-none text-center bg-transparent" /></td>
                      <td className="border border-slate-300 p-1"><input type="number" className="w-10 outline-none text-center bg-transparent" /></td>
                      <td className="border border-slate-300 p-2 font-semibold">1</td>
                      <td className="border border-slate-300 p-2 font-semibold">6</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 p-2 font-medium text-left">Yayasan</td>
                      <td className="border border-slate-300 p-1"><input type="number" className="w-10 outline-none text-center bg-transparent" /></td>
                      <td className="border border-slate-300 p-1"><input type="number" className="w-10 outline-none text-center bg-transparent" /></td>
                      <td className="border border-slate-300 p-1"><input type="number" className="w-10 outline-none text-center bg-transparent" /></td>
                      <td className="border border-slate-300 p-1"><input type="number" className="w-10 outline-none text-center bg-transparent" /></td>
                      <td className="border border-slate-300 p-1"><input type="number" className="w-10 outline-none text-center bg-transparent" /></td>
                      <td className="border border-slate-300 p-1"><input type="number" className="w-10 outline-none text-center bg-transparent" /></td>
                      <td className="border border-slate-300 p-2 font-semibold">0</td>
                      <td className="border border-slate-300 p-2 font-semibold">0</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 p-2 font-medium text-left">Perseorangan</td>
                      <td className="border border-slate-300 p-1"><input type="number" className="w-10 outline-none text-center bg-transparent" /></td>
                      <td className="border border-slate-300 p-1"><input type="number" className="w-10 outline-none text-center bg-transparent" /></td>
                      <td className="border border-slate-300 p-1"><input type="number" className="w-10 outline-none text-center bg-transparent" /></td>
                      <td className="border border-slate-300 p-1"><input type="number" className="w-10 outline-none text-center bg-transparent" /></td>
                      <td className="border border-slate-300 p-1"><input type="number" className="w-10 outline-none text-center bg-transparent" /></td>
                      <td className="border border-slate-300 p-1"><input type="number" className="w-10 outline-none text-center bg-transparent" /></td>
                      <td className="border border-slate-300 p-2 font-semibold">0</td>
                      <td className="border border-slate-300 p-2 font-semibold">0</td>
                    </tr>
                    <tr className="bg-slate-50 font-bold">
                      <td className="border border-slate-300 p-2">Jumlah</td>
                      <td className="border border-slate-300 p-2">1</td>
                      <td className="border border-slate-300 p-2">6</td>
                      <td className="border border-slate-300 p-2">0</td>
                      <td className="border border-slate-300 p-2">0</td>
                      <td className="border border-slate-300 p-2">0</td>
                      <td className="border border-slate-300 p-2">0</td>
                      <td className="border border-slate-300 p-2 text-emerald-600">1</td>
                      <td className="border border-slate-300 p-2 text-emerald-600">6</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section D: JENIS, SIFAT BANGUNAN */}
            <section>
              <div className="flex flex-col sm:flex-row justify-between sm:items-end mb-4 border-b pb-2 gap-2">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <span className="bg-emerald-100 text-emerald-800 w-8 h-8 rounded flex items-center justify-center">D</span>
                  JENIS, SIFAT BANGUNAN
                </h2>
                <div className="text-xs text-slate-500 font-medium bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                  <span className="text-emerald-700 font-bold">P</span> = Permanen, <span className="text-emerald-700 font-bold">SP</span> = Semi Permanen, <span className="text-emerald-700 font-bold">DR</span> = Darurat
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-slate-300 text-sm">
                  <thead>
                    <tr className="bg-slate-100 text-center">
                      <th className="border border-slate-300 p-2 font-semibold align-middle text-left" rowSpan={2}>JENIS BANGUNAN</th>
                      <th className="border border-slate-300 p-2 font-semibold" colSpan={3}>Jumlah Bangunan</th>
                      <th className="border border-slate-300 p-2 font-semibold" colSpan={3}>Tahun Pendirian</th>
                      <th className="border border-slate-300 p-2 font-semibold align-middle" rowSpan={2}>Harga (Rp.)</th>
                    </tr>
                    <tr className="bg-slate-50 text-xs">
                      <th className="border border-slate-300 p-1 w-12 text-emerald-700 font-bold">P</th>
                      <th className="border border-slate-300 p-1 w-12 text-emerald-700 font-bold">SP</th>
                      <th className="border border-slate-300 p-1 w-12 text-emerald-700 font-bold">DR</th>
                      <th className="border border-slate-300 p-1 w-16 text-emerald-700 font-bold">P</th>
                      <th className="border border-slate-300 p-1 w-16 text-emerald-700 font-bold">SP</th>
                      <th className="border border-slate-300 p-1 w-16 text-emerald-700 font-bold">DR</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-slate-300 p-2 font-medium">a. Bangunan Sekolah</td>
                      <td className="border border-slate-300 p-1"><input type="number" defaultValue={1} className="w-full outline-none text-center bg-transparent" /></td>
                      <td className="border border-slate-300 p-1"><input type="number" defaultValue={0} className="w-full outline-none text-center bg-transparent" /></td>
                      <td className="border border-slate-300 p-1"><input type="number" defaultValue={0} className="w-full outline-none text-center bg-transparent" /></td>
                      <td className="border border-slate-300 p-1"><input type="text" defaultValue="1980" className="w-full outline-none text-center bg-transparent" /></td>
                      <td className="border border-slate-300 p-1"><input type="text" defaultValue="-" className="w-full outline-none text-center bg-transparent" /></td>
                      <td className="border border-slate-300 p-1"><input type="text" defaultValue="-" className="w-full outline-none text-center bg-transparent" /></td>
                      <td className="border border-slate-300 p-2"><input type="number" defaultValue={250000000} className="w-full outline-none text-right bg-transparent" /></td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 p-2 font-medium">b. Madrasah</td>
                      <td className="border border-slate-300 p-1"><input type="number" className="w-full outline-none text-center bg-transparent" /></td>
                      <td className="border border-slate-300 p-1"><input type="number" className="w-full outline-none text-center bg-transparent" /></td>
                      <td className="border border-slate-300 p-1"><input type="number" className="w-full outline-none text-center bg-transparent" /></td>
                      <td className="border border-slate-300 p-1"><input type="text" className="w-full outline-none text-center bg-transparent" /></td>
                      <td className="border border-slate-300 p-1"><input type="text" className="w-full outline-none text-center bg-transparent" /></td>
                      <td className="border border-slate-300 p-1"><input type="text" className="w-full outline-none text-center bg-transparent" /></td>
                      <td className="border border-slate-300 p-2"><input type="number" className="w-full outline-none text-right bg-transparent" /></td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 p-2 font-medium bg-slate-50" colSpan={8}>c. Rumah Dinas</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 p-2 pl-6">- Kepala Sekolah</td>
                      <td className="border border-slate-300 p-1"><input type="number" className="w-full outline-none text-center bg-transparent" /></td>
                      <td className="border border-slate-300 p-1"><input type="number" className="w-full outline-none text-center bg-transparent" /></td>
                      <td className="border border-slate-300 p-1"><input type="number" className="w-full outline-none text-center bg-transparent" /></td>
                      <td className="border border-slate-300 p-1"><input type="text" className="w-full outline-none text-center bg-transparent" /></td>
                      <td className="border border-slate-300 p-1"><input type="text" className="w-full outline-none text-center bg-transparent" /></td>
                      <td className="border border-slate-300 p-1"><input type="text" className="w-full outline-none text-center bg-transparent" /></td>
                      <td className="border border-slate-300 p-2"><input type="number" className="w-full outline-none text-right bg-transparent" /></td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 p-2 pl-6">- Guru</td>
                      <td className="border border-slate-300 p-1"><input type="number" className="w-full outline-none text-center bg-transparent" /></td>
                      <td className="border border-slate-300 p-1"><input type="number" className="w-full outline-none text-center bg-transparent" /></td>
                      <td className="border border-slate-300 p-1"><input type="number" className="w-full outline-none text-center bg-transparent" /></td>
                      <td className="border border-slate-300 p-1"><input type="text" className="w-full outline-none text-center bg-transparent" /></td>
                      <td className="border border-slate-300 p-1"><input type="text" className="w-full outline-none text-center bg-transparent" /></td>
                      <td className="border border-slate-300 p-1"><input type="text" className="w-full outline-none text-center bg-transparent" /></td>
                      <td className="border border-slate-300 p-2"><input type="number" className="w-full outline-none text-right bg-transparent" /></td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 p-2 pl-6">- Penjaga Sekolah</td>
                      <td className="border border-slate-300 p-1"><input type="number" className="w-full outline-none text-center bg-transparent" /></td>
                      <td className="border border-slate-300 p-1"><input type="number" className="w-full outline-none text-center bg-transparent" /></td>
                      <td className="border border-slate-300 p-1"><input type="number" className="w-full outline-none text-center bg-transparent" /></td>
                      <td className="border border-slate-300 p-1"><input type="text" className="w-full outline-none text-center bg-transparent" /></td>
                      <td className="border border-slate-300 p-1"><input type="text" className="w-full outline-none text-center bg-transparent" /></td>
                      <td className="border border-slate-300 p-1"><input type="text" className="w-full outline-none text-center bg-transparent" /></td>
                      <td className="border border-slate-300 p-2"><input type="number" className="w-full outline-none text-right bg-transparent" /></td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 p-2 font-medium">d. Lain-lain</td>
                      <td className="border border-slate-300 p-1"><input type="number" className="w-full outline-none text-center bg-transparent" /></td>
                      <td className="border border-slate-300 p-1"><input type="number" className="w-full outline-none text-center bg-transparent" /></td>
                      <td className="border border-slate-300 p-1"><input type="number" className="w-full outline-none text-center bg-transparent" /></td>
                      <td className="border border-slate-300 p-1"><input type="text" className="w-full outline-none text-center bg-transparent" /></td>
                      <td className="border border-slate-300 p-1"><input type="text" className="w-full outline-none text-center bg-transparent" /></td>
                      <td className="border border-slate-300 p-1"><input type="text" className="w-full outline-none text-center bg-transparent" /></td>
                      <td className="border border-slate-300 p-2"><input type="number" className="w-full outline-none text-right bg-transparent" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
            
          </div>
        </div>
      </div>
    </div>
  );
}
