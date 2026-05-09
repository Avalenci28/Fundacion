import { initPool } from './config/database.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Find and load .env file
const envPaths = [
  join(__dirname, '../.env'),
  join(__dirname, './.env'),
  join(__dirname, '../../.env'),
  join(process.cwd(), '.env'),
];

let envPath = null;
for (const p of envPaths) {
  if (fs.existsSync(p)) {
    envPath = p;
    console.log('✅ Found .env at:', p);
    break;
  }
}

if (envPath) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

export default async function validateAndConnectDB() {
  console.log('🔍 Validando y probando PostgreSQL...\n');
  console.log('PGHOST:', process.env.PGHOST || 'localhost');
  console.log('PGDATABASE:', process.env.PGDATABASE || 'postgres');
  console.log('');

  try {
    const pool = await initPool();
    const result = await pool.query('SELECT NOW()');

    console.log('✅ PostgreSQL Connected:', result.rows[0].now);
    console.log('📊 Database:', process.env.PGDATABASE || 'malambo_sonrie');

    return true;
  } catch (error) {
    console.log('❌ ERROR DE CONEXIÓN');
    console.log('Código:', error.code || 'N/A');
    console.log('Mensaje:', error.message);

    if (error.code === 'ENOTFOUND') {
      console.log('🔧 Verifica que PostgreSQL esté ejecutándose');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('🔧 Verifica host y puerto de PostgreSQL');
    } else if (error.code === '28P01') {
      console.log('🔧 Usuario o contraseña incorrectos');
    } else if (error.code === '3D000') {
      console.log('🔧 La base de datos no existe');
    }

    process.exit(1);
  }
}

// Named export (ESM) for any existing imports
export { validateAndConnectDB };

