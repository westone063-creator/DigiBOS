const fs = require('fs');
let code = fs.readFileSync('src/utils/settings.ts', 'utf8');
const newLogo = fs.readFileSync('notebook_logo.svg', 'utf8');
const base64Logo = Buffer.from(newLogo).toString('base64');
const dataUri = "data:image/svg+xml;base64," + base64Logo;
code = code.replace(/export const DEFAULT_LOGO = "[^"]*";/, 'export const DEFAULT_LOGO = "' + dataUri + '";');
fs.writeFileSync('src/utils/settings.ts', code);
