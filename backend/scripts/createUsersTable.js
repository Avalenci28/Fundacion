// Script para crear solo la tabla users
import pool from '../config/database.js';

async function createUsersTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password VARCHAR(200) NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        avatar VARCHAR(500) DEFAULT '',
        phone VARCHAR(50) DEFAULT '',
        bio VARCHAR(500) DEFAULT '',
        is_active BOOLEAN DEFAULT true,
        volunteer_info JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Tabla users creada correctamente');
    
    // Verificar
    const result = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users'");
    if (result.rows.length > 0) {
      console.log('✅ Tabla users verificada en la base de datos');
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    pool.end();
  }
}

createUsersTable();
