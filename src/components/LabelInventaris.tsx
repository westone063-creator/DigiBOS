import React, { useState } from 'react';
import { Package, Printer, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { getKopSurat } from '../utils/settings';

export default function LabelInventaris({ items, onClose }: { items: any[], onClose: () => void }) {
  const kopData = getKopSurat();

  // Ensure we have at least 8 items for a full page preview, or duplicate items to fill up to a multiple of 8
  const displayItems = [...items];
  while (displayItems.length > 0 && displayItems.length < 8) {
    displayItems.push(displayItems[displayItems.length - items.length]);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <style type="text/css">
        {`
          @media print {
            @page {
              size: 215.9mm 330.2mm; /* F4 / Legal Folio */
              margin: 15mm; 
            }
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .print-grid {
              display: grid !important;
              grid-template-columns: repeat(2, 1fr) !important;
              gap: 8mm 6mm !important;
              width: 100% !important;
            }
            .print-item {
              break-inside: avoid;
              page-break-inside: avoid;
              height: 65mm;
            }
            /* Force page break after every 8 items (4 rows x 2 cols) */
            .print-item:nth-child(8n) {
              page-break-after: always;
            }
          }
        `}
      </style>
      
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm print:hidden"
        onClick={onClose}
      />
      
      <div className="bg-[#0f172a] print:bg-white border border-white/10 w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden relative z-10 print:h-auto print:w-full print:block print:border-none print:shadow-none print:rounded-none print:overflow-visible">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/10 shrink-0 bg-white/5 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Cetak Label Inventaris (KIR)</h2>
              <p className="text-xs text-slate-400 mt-0.5">Format F4 (8 Label per Lembar)</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/20"
            >
              <Printer className="w-4 h-4" /> Cetak F4 (8 Label)
            </button>
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Settings Area (Print Hidden) */}
        <div className="p-4 bg-black/20 border-b border-white/10 print:hidden flex flex-col gap-3">
          <div className="flex gap-4 items-center flex-wrap">
             <span className="text-sm text-slate-300">Menampilkan {displayItems.length} label untuk preview (8 label / halaman).</span>
          </div>
          
          <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>
            <div>
              <p className="text-sm font-medium text-amber-500">Peringatan Pencetakan</p>
              <p className="text-xs text-amber-500/80 mt-0.5">Pastikan Anda mengatur ukuran kertas pada printer ke <strong>F4 / Folio (215.9 x 330.2 mm)</strong> atau <strong>Legal</strong> sebelum mencetak, dan atur margin ke <strong>Minimum / None</strong> agar label tercetak dengan pas 8 buah dalam 1 lembar.</p>
            </div>
          </div>
        </div>

        {/* Print Preview Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 print:p-0 bg-slate-900 print:bg-white print:overflow-visible">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto print-grid print:max-w-none print:mx-0">
            {displayItems.map((item, index) => (
              <div 
                key={index} 
                className="bg-white text-black border-[3px] border-black p-0 w-full flex flex-col print-item mx-auto max-w-[420px] print:max-w-none"
              >
                <div className="flex p-3 gap-3 print:gap-4 h-full">
                  {/* QR Code */}
                  <div className="w-[85px] h-[85px] sm:w-[90px] sm:h-[90px] print:w-[22mm] print:h-[22mm] shrink-0 border-2 border-black p-1 flex items-center justify-center self-center">
                    <QRCodeSVG 
                      value={item.kodeBarang || 'N/A'} 
                      size={100}
                      className="w-full h-full"
                      level="H"
                    />
                  </div>
                  
                  {/* Details */}
                  <div className="flex-1 text-[11px] sm:text-[12px] print:text-[10px] leading-[1.2] print:leading-[1.4] flex flex-col justify-center">
                    <table className="w-full">
                      <tbody>
                        <tr>
                          <td className="font-bold w-[85px] print:w-[24mm] py-0.5">Kode SKPD</td>
                          <td className="w-2">:</td>
                          <td className="font-semibold">{item.kodeSKPD || 'FEA'}</td>
                        </tr>
                        <tr>
                          <td className="font-bold py-0.5">Kode Barang</td>
                          <td>:</td>
                          <td className="font-semibold">{item.kodeBarang || '-'}</td>
                        </tr>
                        <tr>
                          <td className="font-bold py-0.5 align-top">Nama Barang</td>
                          <td className="align-top">:</td>
                          <td className="font-bold leading-tight line-clamp-2">{item.namaBarang || '-'}</td>
                        </tr>
                        <tr>
                          <td className="font-bold py-0.5">Merk / Type</td>
                          <td>:</td>
                          <td className="font-semibold">{item.merk || '-'}</td>
                        </tr>
                        <tr>
                          <td className="font-bold py-0.5">Sumber Dana</td>
                          <td>:</td>
                          <td className="font-semibold">{item.sumberDana || 'BOSP Reguler'}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* Footer Banner */}
                <div className="bg-[#ffb000] text-black text-center py-1.5 print:py-[3mm] font-extrabold text-[12px] print:text-[11px] border-t-[3px] border-black tracking-wider mt-auto w-full uppercase">
                  {kopData.kopBaris3 ? kopData.kopBaris3 : 'SD NEGERI 1 SLANGIT - KEC. KLANGENAN'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
