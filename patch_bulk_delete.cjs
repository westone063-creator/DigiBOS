const fs = require('fs');

function patchFile(filename, dataVarName, singularItemName) {
    let content = fs.readFileSync(filename, 'utf8');
    
    // Add selectedIds state and bulk handlers if not present
    if (!content.includes('const [selectedIds, setSelectedIds] = useState<number[]>([]);')) {
        const insertPos = content.indexOf(`  const confirmDelete = () => {`);
        if (insertPos !== -1) {
            const handlers = `
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredData.map((item: any) => item.id));
    } else {
      setSelectedIds([]);
    }
  };
  const handleSelect = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };
  const handleBulkDelete = () => {
    if (selectedIds.length > 0) {
      if (window.confirm(\`Apakah Anda yakin ingin menghapus \${selectedIds.length} data terpilih?\`)) {
        set${dataVarName.charAt(0).toUpperCase() + dataVarName.slice(1)}(${dataVarName}.filter((item: any) => !selectedIds.includes(item.id)));
        setSelectedIds([]);
      }
    }
  };
`;
            content = content.slice(0, insertPos) + handlers + content.slice(insertPos);
        }
    }

    // Add Bulk Delete button near the top right (search, print, add buttons)
    if (!content.includes('handleBulkDelete') || !content.includes('Hapus Terpilih')) {
        // Try finding the button container. Usually it's:
        // <div className="flex gap-3"> (inside some header) or something similar.
        // I'll search for <button \n onClick={handleOpenAdd}
        const regexAddBtn = /(<button[^>]*onClick={handleOpenAdd}[^>]*>[\s\S]*?<\/button>)/;
        if (regexAddBtn.test(content)) {
            const bulkDeleteBtn = `
            {selectedIds.length > 0 && (
              <button 
                onClick={handleBulkDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-sm font-medium rounded-xl transition-all"
              >
                <Trash2 className="w-4 h-4" />
                Hapus Terpilih
              </button>
            )}
            `;
            content = content.replace(regexAddBtn, `$1\n${bulkDeleteBtn}`);
        }
    }
    
    // Add Checkboxes to table header and body
    // Head: <tr> \n <th ...
    const headMatch = /<thead[^>]*>[\s\S]*?<tr>/;
    if (headMatch.test(content) && !content.includes('onChange={handleSelectAll}')) {
        content = content.replace(headMatch, (match) => {
            return match + `\n              <th className="px-6 py-4 font-medium w-12 text-center rounded-tl-2xl">\n                <input \n                  type="checkbox" \n                  className="rounded border-slate-600 bg-slate-800" \n                  checked={filteredData.length > 0 && selectedIds.length === filteredData.length}\n                  onChange={handleSelectAll}\n                />\n              </th>`;
        });
        // We also need to remove 'rounded-tl-2xl' from the next th, or we can just leave it.
    }
    
    // Body: <tr key={item.id}
    const rowMatch = /(<tr[^>]*key=\{[^}]*\}[^>]*>)/;
    if (rowMatch.test(content) && !content.includes('onChange={() => handleSelect(item.id)}')) {
        content = content.replace(rowMatch, (match) => {
            return match + `\n                    <td className="px-6 py-4 text-center">\n                      <input \n                        type="checkbox" \n                        className="rounded border-slate-600 bg-slate-800" \n                        checked={selectedIds.includes(item.id)}\n                        onChange={() => handleSelect(item.id)}\n                      />\n                    </td>`;
        });
    }

    fs.writeFileSync(filename, content);
}

patchFile('src/components/Pinbuk.tsx', 'data', 'Pinbuk');
patchFile('src/components/Kwitansi.tsx', 'data', 'Kwitansi');
patchFile('src/components/TandaTerima.tsx', 'data', 'Tanda Terima');
patchFile('src/components/RekeningKoran.tsx', 'data', 'Rekening Koran');
patchFile('src/components/StrukNota.tsx', 'data', 'Struk Nota');

console.log("Done");
