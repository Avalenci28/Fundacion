// Check if admin user exists in PostgreSQL (Supabase)
// Run: node scripts/checkAdminExists.mjs

import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const { Pool } = pg;

const pool = new Pool({
  host: process.env.PGHOST,
  port: parseInt(process.env.PGPORT),
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  ssl: { rejectUnauthorized: false }
});

const ADMIN_EMAIL = 'admin@fundacion.org';

async function checkAdminExists() {
  try {
    console.log('🔍 Buscando usuario admin:', ADMIN_EMAIL);
    
    const result = await pool.query(
      'SELECT email, password FROM users WHERE email = $1',
      [ADMIN_EMAIL]
    );

    if (result.rows.length === 0) {
      console.log('❌ NO existe el usuario admin');
      await pool.end();
      process.exit(1);
    }

    const user = result.rows[0];
    console.log('✅ Usuario encontrado:');
    console.log('   Email:', user.email);
    console.log('   Password (hash):', user.password.substring(0, 20) + '...');

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    await pool.end();
    process.exit(1);
  }
}

checkAdminExists();
