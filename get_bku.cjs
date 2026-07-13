const fs = require('fs');
const file = 'src/components/BkuArkas.tsx';
let content = fs.readFileSync(file, 'utf8');

console.log(content.substring(content.indexOf('// Load SNP list'), content.indexOf('// Helper to get string value from cell safely')));
