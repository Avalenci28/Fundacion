// Script para crear el usuario admin en PostgreSQL
// Ejecutar: node scripts/createAdminUser.js

import pg from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const { Pool } = pg;

const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: process.env.PGPORT || 5432,
  database: process.env.PGDATABASE || 'malambo_sonrie',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'admin123'
});

async function createAdminUser() {
  try {
    console.log('🔄 Conectando a la base de datos...');
    
    // Verificar si el usuario ya existe
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      ['admin@malambosonrie.org']
    );
    
    if (existingUser.rows.length > 0) {
      console.log('⚠️  El usuario admin ya existe');
      
      // Verificar rol
      if (existingUser.rows[0].role === 'admin') {
        console.log('✅ El usuario ya tiene rol de admin');
      } else {
        // Actualizar rol a admin
        await pool.query(
          'UPDATE users SET role = $1, updated_at = NOW() WHERE email = $2',
          ['admin', 'admin@malambosonrie.org']
        );
        console.log('✅ Rol actualizado a admin');
      }
    } else {
      // Crear nuevo usuario admin
      const hashedPassword = await bcrypt.hash('Admin2024!', 12);
      
      await pool.query(
        `INSERT INTO users (name, email, password, role, created_at, updated_at, is_active) 
         VALUES ($1, $2, $3, $4, NOW(), NOW(), true)`,
        ['Administrador Malambo Sonríe', 'admin@malambosonrie.org', hashedPassword, 'admin']
      );
      
      console.log('✅ Usuario admin creado exitosamente');
    }
    
    // Mostrar información
    const user = await pool.query('SELECT id, name, email, role FROM users WHERE email = $1', ['admin@malambosonrie.org']);
    console.log('\n📋 Datos del usuario:');
    console.log(JSON.stringify(user.rows[0], null, 2));
    
    console.log('\n🔑 Credenciales de acceso:');
    console.log('   Email: admin@malambosonrie.org');
    console.log('   Password: Admin2024!');
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    await pool.end();
    process.exit(1);
  }
}

createAdminUser();
