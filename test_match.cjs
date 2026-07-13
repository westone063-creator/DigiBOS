const fs = require('fs');
const file = 'src/components/BkuArkas.tsx';
let content = fs.readFileSync(file, 'utf8');

console.log(content.substring(content.indexOf('// Pre-normalize SNP codes'), content.indexOf('// Default column mapping if header')));
