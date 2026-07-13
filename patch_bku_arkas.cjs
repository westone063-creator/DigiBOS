const fs = require('fs');
const file = 'src/components/BkuArkas.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add displayedBkuData
content = content.replace(
  "const [selectedIds, setSelectedIds] = useState<number[]>([]);",
  `const displayedBkuData = React.useMemo(() => {
    return bkuData.filter(item => item.noBukti && String(item.noBukti).trim() !== '');
  }, [bkuData]);

  const [selectedIds, setSelectedIds] = useState<number[]>([]);`
);

// Update handleSelectAll
content = content.replace(
  "setSelectedIds(bkuData.map(item => item.id));",
  "setSelectedIds(displayedBkuData.map(item => item.id));"
);

// Update select all checkbox
content = content.replace(
  "checked={bkuData.length > 0 && selectedIds.length === bkuData.length}",
  "checked={displayedBkuData.length > 0 && selectedIds.length === displayedBkuData.length}"
);

// Update table render
content = content.replace(
  "{bkuData.length > 0 ? (",
  "{displayedBkuData.length > 0 ? ("
);
content = content.replace(
  "bkuData.map((item, index) => (",
  "displayedBkuData.map((item, index) => ("
);

// Update footer count
content = content.replace(
  "<div>Showing {bkuData.length > 0 ? 1 : 0} to {bkuData.length} of {bkuData.length} entries</div>",
  "<div>Showing {displayedBkuData.length > 0 ? 1 : 0} to {displayedBkuData.length} of {displayedBkuData.length} entries</div>"
);

fs.writeFileSync(file, content);
