const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: __dirname + '/.env' });

console.log('🔍 Validando backend/.env...\n');
console.log('MONGODB_URI:', process.env.MONGODB_URI || '🚫 NO DEFINIDO');
console.log('');

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.log('❌ MONGODB_URI no encontrada en backend/.env');
  process.exit(1);
}

// Validaciones específicas
let isValid = true;
const errors = [];

// 1. Debe empezar con mongodb:// (no +srv)
if (!uri.startsWith('mongodb://')) {
  isValid = false;
  errors.push('❌ Debe empezar con "mongodb://" (no "+srv")');
}

// 2. Debe contener 3 hosts shard
const shardHosts = uri.match(/cluster0-shard-00-(00|01|02)\.1vkmhzt\.mongodb\.net/g);
if (!shardHosts || shardHosts.length < 3) {
  isValid = false;
  errors.push('❌ Debe contener 3 hosts: cluster0-shard-00-00, 00-01, 00-02');
}

// 3. Parámetros requeridos
const requiredParams = ['ssl=true', 'authSource=admin', 'retryWrites=true', 'w=majority'];
const uriParams = new URLSearchParams(uri.split('?')[1] || '');

requiredParams.forEach(param => {
  const [key] = param.split('=');
  if (!uriParams.has(key)) {
    isValid = false;
    errors.push(`❌ Falta parámetro: ${param}`);
  }
});

// 4. replicaSet presente
if (!uri.includes('replicaSet=atlas-')) {
  isValid = false;
  errors.push('❌ Falta "replicaSet=atlas-<nombre>-shard-0"');
}

if (isValid) {
  console.log('✅ MONGODB_URI válido y listo para conexión');
  console.log('🚀 Listo para usar en database.js');
} else {
  console.log('❌ MONGODB_URI inválido - corrige backend/.env');
  errors.forEach(error => console.log(error));
  console.log('\n📋 URI actual para diagnóstico:');
  console.log(uri);
}

console.log('');
