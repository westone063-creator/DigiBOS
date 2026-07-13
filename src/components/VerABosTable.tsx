import React, { useMemo } from 'react';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
};

export default function VerABosTable({ 
  tanggalAwal, 
  tanggalAkhir,
  dependencies
}: { 
  tanggalAwal?: string; 
  tanggalAkhir?: string;
  dependencies?: any[];
}) {
  const depsString = JSON.stringify(dependencies);

  const { rows, totalBku, totalRincian, totalSelisih } = useMemo(() => {
    const bkuData = JSON.parse(localStorage.getItem('bkuData') || '[]');
    const bphData = JSON.parse(localStorage.getItem('bphData') || '[]');
    const belanjaData = JSON.parse(localStorage.getItem('belanjaData') || '[]');

    const isWithinDate = (dateStr: string) => {
      if (!tanggalAwal && !tanggalAkhir) return true;
      if (!dateStr) return true;
      const itemDate = new Date(dateStr);
      if (tanggalAwal && new Date(tanggalAwal) > itemDate) return false;
      if (tanggalAkhir && new Date(tanggalAkhir) < itemDate) return false;
      return true;
    };

    const getSummary = (jenisBelanja: string) => {
      const sumBku = bkuData
        .filter((d: any) => d.belanja === jenisBelanja && isWithinDate(d.tanggal))
        .reduce((acc: number, curr: any) => acc + (Number(curr.jumlah) || 0), 0);

      let sumRincian = 0;
      sumRincian += bphData
        .filter((d: any) => d.belanja === jenisBelanja && isWithinDate(d.tanggal))
        .reduce((acc: number, curr: any) => acc + ((Number(curr.jumlahBarang) || 0) * (Number(curr.hargaSatuan) || 0)), 0);
        
      sumRincian += belanjaData
        .filter((d: any) => d.belanja === jenisBelanja && isWithinDate(d.tanggal))
        .reduce((acc: number, curr: any) => acc + ((Number(curr.jumlahBarang) || 0) * (Number(curr.hargaSatuan) || 0)), 0);

      return {
        bku: sumBku,
        rincian: sumRincian,
        selisih: sumBku - sumRincian
      };
    };

    const labels = [
      'NON BARANG PAKAI HABIS',
      'BARANG PAKAI HABIS',
      'BARANG MODAL PERALATAN DAN MESIN',
      'BARANG MODAL ASET TETAP LAINNYA'
    ];

    let tBku = 0;
    let tRincian = 0;
    let tSelisih = 0;

    const summaryData = labels.map(label => {
      const data = getSummary(label);
      tBku += data.bku;
      tRincian += data.rincian;
      tSelisih += data.selisih;
      return { label, ...data };
    });

    return {
      rows: summaryData,
      totalBku: tBku,
      totalRincian: tRincian,
      totalSelisih: tSelisih
    };
  }, [tanggalAwal, tanggalAkhir, depsString]);

  return (
    <div className="overflow-x-auto scrollbar-hide">
      <table className="w-full text-xs text-left">
        <thead className="text-[10px] text-slate-400 uppercase bg-white/5 border-b border-white/10">
          <tr>
            <th className="px-3 py-2 font-medium">JENIS BELANJA</th>
            <th className="px-3 py-2 font-medium text-right">BKU</th>
            <th className="px-3 py-2 font-medium text-right">RINCIAN</th>
            <th className="px-3 py-2 font-medium text-right">SELISIH</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {rows.map(r => (
            <tr key={r.label} className="hover:bg-white/5 transition-colors">
              <td className="px-3 py-2 text-slate-300">{r.label}</td>
              <td className="px-3 py-2 text-right">{formatCurrency(r.bku)}</td>
              <td className="px-3 py-2 text-right">{formatCurrency(r.rincian)}</td>
              <td className="px-3 py-2 text-right">{formatCurrency(r.selisih)}</td>
            </tr>
          ))}
          <tr className="bg-white/10 font-bold border-t border-white/20">
            <td className="px-3 py-2 text-white">JUMLAH BKU</td>
            <td className="px-3 py-2 text-right">{formatCurrency(totalBku)}</td>
            <td className="px-3 py-2 text-right">{formatCurrency(totalRincian)}</td>
            <td className="px-3 py-2 text-right">{formatCurrency(totalSelisih)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
