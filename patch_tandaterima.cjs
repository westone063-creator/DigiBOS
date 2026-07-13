const fs = require('fs');
let code = fs.readFileSync('src/components/TandaTerima.tsx', 'utf8');

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
      setFormData(prev => ({ ...prev, kodeRekening: '', noBku: '', mataAnggaran: '' }));
      return;
    }

    let kodeRekList: string[] = [];
    let noBkuList: string[] = [];
    let uraianList: string[] = [];
    let tanggal = '';

    newSelected.forEach(selId => {
      const item = sumberOptions.find((d: any) => String(d.id) === selId);
      if (item) {
        if (!tanggal) tanggal = item.tanggal;
        
        let kodeRek = '';
        let noBku = item.noBku || item.noBukti || '';
        let uraian = item.uraian || item.kegiatan || '';

        if (sumberData === 'bku' || sumberData === 'bku_group' || sumberData === 'bph') {
          kodeRek = item.kodeRekening || item.belanja || '';
        } else if (sumberData === 'belanja') {
          kodeRek = item.kodeRekening || item.belanja || '';
        }

        if (kodeRek && !kodeRekList.includes(kodeRek)) kodeRekList.push(kodeRek);
        if (noBku && !noBkuList.includes(noBku)) noBkuList.push(noBku);
        if (uraian && !uraianList.includes(uraian)) uraianList.push(uraian);
      }
    });

    setFormData(prev => ({
      ...prev,
      tanggal: tanggal || prev.tanggal,
      kodeRekening: kodeRekList.join(', '),
      noBku: noBkuList.join(', '),
      mataAnggaran: uraianList.join(', ')
    }));
  };
`;

code = code.replace(
  /  const handlePilihSumber = [\s\S]*?    }\n  };\n/,
  newHandler
);

fs.writeFileSync('src/components/TandaTerima.tsx', code);
