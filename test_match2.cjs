const fs = require('fs');
const file = 'src/components/BkuArkas.tsx';
let content = fs.readFileSync(file, 'utf8');

console.log(content.substring(content.indexOf('// Find a matching item in the SNP list'), content.indexOf('newData.push({')));
