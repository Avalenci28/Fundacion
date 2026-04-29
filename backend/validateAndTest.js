const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: __dirname + '/.env' });

console.log('🔍 Validando y probando MONGODB_URI...\n');
console.log('MONGODB_URI:', process.env.MONGODB_URI || '🚫 NO DEFINIDO');
console.log('');

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.log('❌ MONGODB_URI no encontrada en backend/.env');
  process.exit(1);
}

// 3. Validación URI
let isValid = true;
const errors = [];

// mongodb:// (no +srv)
if (!uri.startsWith('mongodb://')) {
  isValid = false;
  errors.push('❌ Debe empezar con "mongodb://" (no "+srv")');
}

// 3 hosts cluster0-shard
const shardHosts = uri.match(/cluster0-shard-00-(00|01|02)\.1vkmhzt\.mongodb\.net/g);
if (!shardHosts || shardHosts.length < 3) {
  isValid = false;
  errors.push('❌ Debe contener 3 hosts: cluster0-shard-00-00/01/02.1vkmhzt.mongodb.net');
}

// Parámetros requeridos
const uriParams = new URLSearchParams(uri.split('?')[1] || '');
const requiredParams = ['ssl=true', 'authSource=admin', 'retryWrites=true', 'w=majority'];

requiredParams.forEach(param => {
  const [key, value] = param.split('=');
  if (!uriParams.get(key) === value) {
    isValid = false;
    errors.push(`❌ Falta "${param}"`);
  }
});

// replicaSet
if (!uri.includes('replicaSet=atlas-') || !uri.includes('-shard-0')) {
  isValid = false;
  errors.push('❌ Falta "replicaSet=atlas-<nombre>-shard-0"');
}

if (!isValid) {
  console.log('❌ "MONGODB_URI inválido - corrige backend/.env"');
  errors.forEach(error => console.log(error));
  console.log('\n📋 URI actual para diagnóstico:');
  console.log(uri);
  process.exit(1);
}

console.log('✅ URI válida - intentando conexión...\n');

// 5-8. Conexión si válida
const testConnection = async () => {
  try {
    console.log('🧪 Conectando con family: 4 (Windows Mongoose 7+)...');
    
    const conn = await mongoose.connect(uri, { family: 4 });
    
    console.log('✅ CONEXIÓN EXITOSA!');
    console.log('📡 Host:', conn.connection.host);
    console.log('📊 DB Name:', conn.connection.name);
    
    // Ping
    await mongoose.connection.db.admin().ping();
    console.log('🏓 Ping OK - DB responsive');
    
    // Cerrar
    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
    
  } catch (error) {
    console.log('❌ ERROR DE CONEXIÓN');
    console.log('Código:', error.code || 'N/A');
    console.log('Mensaje:', error.message);
    
    if (error.code === 'ENOTFOUND') {
      console.log('🔧 SOLUCIÓN: Verifica ReplicaSet en URI o IP whitelist Atlas (0.0.0.0/0)');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('🔧 SOLUCIÓN: IP whitelist Atlas (0.0.0.0/0) o credenciales incorrectas');
    } else if (error.code === 'AuthenticationFailed') {
      console.log('🔧 SOLUCIÓN: Usuario malambo_db_user o contraseña admin123 incorrecta');
    }
  }
};

testConnection();
