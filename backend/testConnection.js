const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/.env' });

console.log('🔍 Verificando .env...');
console.log('MONGODB_URI:', process.env.MONGODB_URI || '🚫 NO DEFINIDO');

const testConnection = async () => {
  try {
    console.log('🧪 Probando conexión MongoDB...');

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      family: 4, // 👈 único parámetro necesario en Mongoose 7+
    });

    console.log('✅ CONEXIÓN EXITOSA!');
    console.log('📡 Host:', conn.connection.host);
    console.log('📊 DB Name:', conn.connection.name);

    // Test query simple
    await mongoose.connection.db.admin().ping();
    console.log('🏓 Ping OK - DB responsive');

    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
  } catch (error) {
    console.log('❌ ERROR DE CONEXIÓN:');
    console.log('Código:', error.code || 'N/A');
    console.log('Mensaje:', error.message);

    if (error.code === 'ENOTFOUND') {
      console.log('🔧 SOLUCIÓN: Verifica ReplicaSet en MONGODB_URI o IP whitelist Atlas');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('🔧 SOLUCIÓN: MongoDB Atlas IP no autorizada (0.0.0.0/0) o credenciales incorrectas');
    } else if (!process.env.MONGODB_URI) {
      console.log('🔧 SOLUCIÓN: Crea .env con MONGODB_URI válido en backend/');
    }
  }
};

testConnection();
