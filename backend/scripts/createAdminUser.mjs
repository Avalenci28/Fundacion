import pkg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar .env desde backend/.env
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

console.log('📋 Variables de entorno cargadas:');
console.log('   PGHOST:', process.env.PGHOST || 'NO DEFINIDO');
console.log('   PGPORT:', process.env.PGPORT || 'NO DEFINIDO');
console.log('   PGUSER:', process.env.PGUSER || 'NO DEFINIDO');
console.log('   PGPASSWORD:', process.env.PGPASSWORD ? '***CARGADO***' : 'NO DEFINIDO');
console.log('   PGDATABASE:', process.env.PGDATABASE || 'NO DEFINIDO');

const { Pool } = pkg;

// Configurar pool con SSL para Supabase
const pool = new Pool({
  host: process.env.PGHOST,
  port: parseInt(process.env.PGPORT) || 5432,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  ssl: {
    rejectUnauthorized: false,
    require: true
  }
});

async function createAdminUser() {
  const adminEmail = 'admin@fundacion.org';
  const adminPassword = 'Admin2024!';
  
  try {
    // Verificar conexión primero
    console.log('\n🔌 Verificando conexión a la base de datos...');
    const connectionTest = await pool.query('SELECT NOW()');
    console.log('✅ Conexión exitosa:', connectionTest.rows[0].now);

    // Verificar si el usuario ya existe
    console.log('\n🔍 Verificando si el usuario admin ya existe...');
    const checkResult = await pool.query(
      'SELECT id, email FROM users WHERE email = $1',
      [adminEmail]
    );

    if (checkResult.rows.length > 0) {
      console.log('⚠️  El usuario admin@fundacion.org ya existe en la base de datos');
      console.log('   ID:', checkResult.rows[0].id);
      await pool.end();
      process.exit(0);
    }

    // Encriptar contraseña con bcrypt
    console.log('\n🔐 Encriptando contraseña...');
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    console.log('✅ Contraseña encriptada');

    // Insertar usuario admin
    console.log('\n➕ Insertando usuario admin...');
    const insertResult = await pool.query(
      `INSERT INTO users (name, email, password, role, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())
       RETURNING id, email`,
      ['Admin', adminEmail, hashedPassword, 'admin']
    );

    console.log('✅ Usuario admin creado correctamente:');
    console.log('   ID:', insertResult.rows[0].id);
    console.log('   Email:', insertResult.rows[0].email);
    console.log('   Password (sin encriptar):', adminPassword);
    
    await pool.end();
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.message.includes('SASL')) {
      console.error('   Error de autenticación SASL - verifica PGPASSWORD');
    }
    if (error.message.includes('ssl')) {
      console.error('   Error de SSL - verifica la configuración de SSL');
    }
    await pool.end();
    process.exit(1);
  }
}

createAdminUser();
