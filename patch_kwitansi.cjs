const fs = require('fs');
let code = fs.readFileSync('src/components/Kwitansi.tsx', 'utf8');

code = code.replace(
  "  const [selectedSumberId, setSelectedSumberId] = useState('');",
  "  const [selectedSumberIds, setSelectedSumberIds] = useState<string[]>([]);"
);

code = code.replace(
  "      setSelectedSumberId('');\n    }\n\n    let dataToLoad = [];",
  "      setSelectedSumberIds([]);\n    }\n\n    let dataToLoad = [];"
);

code = code.replace(
  "    setSumberOptions(dataToLoad);\n    setSelectedSumberId('');\n  }, [sumberData]);",
  "    setSumberOptions(dataToLoad);\n    setSelectedSumberIds([]);\n  }, [sumberData]);"
);

const newHandler = `
  const handleToggleSumber = (id: string, checked: boolean) => {
    let newSelected = [...selectedSumberIds];
    if (checked) {
      newSelected.push(String(id));
    } else {
      newSelected = newSelected.filter(s => s !== String(id));
    }
    setSelectedSumberIds(newSelected);

    if (newSelected.length === 0) {
      setFormData(prev => ({ ...prev, jumlah: '', untukPembayaran: '', kodeRekening: '' }));
      return;
    }

    let totalJumlah = 0;
    let kodeRekList: string[] = [];
    let uraianList: string[] = [];
    let tanggal = '';

    newSelected.forEach(selId => {
      const item = sumberOptions.find((d: any) => String(d.id) === selId);
      if (item) {
        if (!tanggal) tanggal = item.tanggal;
        
        let jumlah = 0;
        let kodeRek = '';
        let uraian = item.uraian || '';

        if (sumberData === 'bku' || sumberData === 'bku_group') {
          jumlah = Number(item.jumlah) || 0;
          kodeRek = item.belanja || '';
        } else if (sumberData === 'bph' || sumberData === 'belanja') {
          jumlah = (Number(item.jumlahBarang) || 0) * (Number(item.hargaSatuan) || 0);
          kodeRek = item.kodeRekening || item.belanja || '';
        }

        totalJumlah += jumlah;
        if (kodeRek && !kodeRekList.includes(kodeRek)) kodeRekList.push(kodeRek);
        if (uraian && !uraianList.includes(uraian)) uraianList.push(uraian);
      }
    });

    setFormData(prev => ({
      ...prev,
      tanggal: tanggal || prev.tanggal,
      kodeRekening: kodeRekList.join(', '),
      jumlah: totalJumlah ? String(totalJumlah) : prev.jumlah,
      untukPembayaran: uraianList.join(', ')
    }));
  };
`;

code = code.replace(
  /  const handlePilihSumber = [\s\S]*?    }\n  };\n/,
  newHandler
);

fs.writeFileSync('src/components/Kwitansi.tsx', code);
