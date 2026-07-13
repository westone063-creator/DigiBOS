const fs = require('fs');

function fixFile(filename) {
    let content = fs.readFileSync(filename, 'utf8');
    
    // Some files might not have filteredData defined but they map over data, filteredData, etc.
    // Let's check what they map over in tbody
    const matchMap = /\{([a-zA-Z0-9_]+)\.map\(\(item(,| |\))/;
    const matchSliceMap = /\{([a-zA-Z0-9_]+)\.slice\([^)]*\)\.map\(\(item(,| |\))/;
    
    let arrayName = 'data';
    const match = content.match(matchSliceMap) || content.match(matchMap);
    if (match) {
        arrayName = match[1];
    }
    
    content = content.replace(/setSelectedIds\(filteredData\.map\(\(item: any\) => item\.id\)\);/g, `setSelectedIds(${arrayName}.map((item: any) => item.id));`);
    content = content.replace(/checked=\{filteredData\.length > 0 && selectedIds\.length === filteredData\.length\}/g, `checked={${arrayName}.length > 0 && selectedIds.length === ${arrayName}.length}`);
    
    fs.writeFileSync(filename, content);
}

['src/components/Pinbuk.tsx', 'src/components/Kwitansi.tsx', 'src/components/TandaTerima.tsx', 'src/components/RekeningKoran.tsx', 'src/components/StrukNota.tsx'].forEach(fixFile);

console.log("Done");
