const fs = require('fs');
let c = fs.readFileSync('c:/Users/andre/OneDrive/Documentos/WEB FUNDACION/frontend/src/app/page.tsx', 'utf8');
c = c.replace(/'/g, String.fromCharCode(34));
fs.writeFileSync('c:/Users/andre/OneDrive/Documentos/WEB FUNDACION/frontend/src/app/page.tsx', c);
console.log('Done');
