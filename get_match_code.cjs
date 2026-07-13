const fs = require('fs');
const file = 'src/components/BkuArkas.tsx';
let content = fs.readFileSync(file, 'utf8');
console.log(content.substring(content.indexOf('// Pre-normalize Rekening codes'), content.indexOf('newData.push({')));
