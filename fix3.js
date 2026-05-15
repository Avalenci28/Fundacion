const fs=require('fs');
let c=fs.readFileSync('frontend/src/app/contacto/page.tsx','utf8');
c=c.replace('+57 300 123 4567','312 5812294');
c=c.replace('hola@malambosonrie.org','malambosonrie@gmail.com');
const i=c.indexOf('setIsSubmitting(false);')+24;
const n='const socialLinks = [
    { label: 'Facebook', color: 'bg-blue-600', url: 'https://www.facebook.com/Malambosonrie' },
    { label: 'Instagram', color: 'bg-pink-600', url: 'https://www.instagram.com/malambosonrie' },
  ];'
c=c.slice(0,i)+n+c.slice(i);
fs.writeFileSync('frontend/src/app/contacto/page.tsx',c,'utf8');
console.log('done');