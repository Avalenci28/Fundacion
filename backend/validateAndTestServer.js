import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

export async function validateAndConnectDB() {
  console.log('🔍 Validando y probando MONGODB_URI...\n');
  console.log('MONGODB_URI:', process.env.MONGODB_URI || '🚫 NO DEFINIDO');
  console.log('');

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.log('❌ "MONGODB_URI no encontrada en backend/.env"');
    process.exit(1);
  }

  // Validación URI básica
  let isValid = true;
  const errors = [];

  const uriParams = new URLSearchParams(uri.split('?')[1] || '');
  const requiredParams = ['retryWrites=true', 'w=majority'];
  
  requiredParams.forEach(param => {
    const [key, value] = param.split('=');
    if (uriParams.get(key) !== value) {
      isValid = false;
      errors.push(`❌ Falta "${param}"`);
    }
  });

  if (!uri.includes('mongodb')) {
    isValid = false;
    errors.push('❌ Debe ser una URI MongoDB válida');
  }

  if (!isValid) {
    console.log('❌ "MONGODB_URI inválido - corrige backend/.env"');
    errors.forEach(error => console.log(error));
    console.log('\\n📋 URI actual: ' + uri);
    process.exit(1);
  }

  console.log('✅ URI válida - conectando...\n');

  // Conexión
  try {
    const conn = await mongoose.connect(uri, { family: 4 });
    
    console.log('✅ MongoDB Connected:', conn.connection.host);
    console.log('📊 DB Name:', conn.connection.name);
    
    await mongoose.connection.db.admin().ping();
    console.log('🏓 Ping OK');
    
    await mongoose.connection.close();
    console.log('🔌 Conexión de prueba cerrada');
    
    return conn.connection.host;
  } catch (error) {
    console.log('❌ ERROR DE CONEXIÓN');
    console.log('Código:', error.code || 'N/A');
    console.log('Mensaje:', error.message);
    
    if (error.code === 'ENOTFOUND') {
      console.log('🔧 Verifica IP whitelist Atlas (0.0.0.0/0)');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('🔧 IP whitelist Atlas o credenciales incorrectas');
    } else if (error.code === 'AuthenticationFailed') {
      console.log('🔧 Usuario/contraseña incorrectos');
    }
    process.exit(1);
  }
}
