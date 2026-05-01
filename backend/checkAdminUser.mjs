// Verify and display admin user credentials
// Run: node checkAdminUser.mjs

import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

const { Pool } = pg;

const pool = new Pool({
  host: process.env.PGHOST,
  port: parseInt(process.env.PGPORT),
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  ssl: { rejectUnauthorized: false, require: true }
});

async function checkAdminUser() {
  try {
    console.log('🔍 Verificando usuario admin...\n');
    
    const result = await pool.query(
      "SELECT id, name, email, role, is_active FROM users WHERE role = 'admin'"
    );
    
    if (result.rows.length > 0) {
      console.log('✅ Usuarios admin encontrados:\n');
      result.rows.forEach(user => {
        console.log(`   ID: ${user.id}`);
        console.log(`   Nombre: ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Rol: ${user.role}`);
        console.log(`   Activo: ${user.is_active ? 'Sí' : 'No'}`);
        console.log('---');
      });
      
      console.log('\n🔑 Credenciales de acceso al panel admin:');
      console.log('   Email: admin@malambosonrie.org');
      console.log('   Password: Admin2024!\n');
    } else {
      console.log('⚠️  No hay usuarios admin. Ejecuta: node scripts/createAdminUser.js');
    }
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    await pool.end();
    process.exit(1);
  }
}

checkAdminUser();
