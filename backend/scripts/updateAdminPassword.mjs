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

const { Pool } = pkg;

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

async function updateAdminPassword() {
  const adminEmail = 'admin@fundacion.org';
  const adminPassword = 'Admin2024!';
  
  try {
    // Verificar conexión
    console.log('🔌 Verificando conexión...');
    await pool.query('SELECT NOW()');
    console.log('✅ Conexión exitosa\n');

    // Verificar password actual del admin
    console.log('🔍 Verificando password del admin...');
    const checkResult = await pool.query(
      'SELECT id, email, password, role FROM users WHERE email = $1',
      [adminEmail]
    );

    if (checkResult.rows.length === 0) {
      console.log('❌ Usuario admin no existe. Ejecuta createAdminUser.mjs primero');
      await pool.end();
      process.exit(1);
    }

    const user = checkResult.rows[0];
    console.log('   ID:', user.id);
    console.log('   Email:', user.email);
    console.log('   Password actual:', user.password ? `'${user.password.substring(0, 20)}...'` : 'NULL o vacío');
    console.log('   Role:', user.role);

    // Verificar si necesita actualización
    if (!user.password || user.password === null || user.password === '') {
      console.log('\n⚠️  Password vacío/NULL - Necesita actualización');
    } else {
      // Verificar si el password actual funciona
      const isValid = await bcrypt.compare(adminPassword, user.password);
      if (isValid) {
        console.log('\n✅ Password ya está configurado correctamente');
        await pool.end();
        process.exit(0);
      } else {
        console.log('\n⚠️  Password no coincide - Actualizando');
      }
    }

    // Hashear nuevo password
    console.log('\n🔐 Hasheando nuevo password...');
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    console.log('✅ Password hasheado');

    // Actualizar password (sin updated_at - no existe en la tabla)
    console.log('\n💾 Actualizando password en la base de datos...');
    await pool.query(
      'UPDATE users SET password = $1 WHERE email = $2',
      [hashedPassword, adminEmail]
    );
    console.log('✅ Password actualizado');

    // Verificar actualización
    console.log('\n✅ Verificando actualización...');
    const verifyResult = await pool.query(
      'SELECT password FROM users WHERE email = $1',
      [adminEmail]
    );
    console.log('   Password actualizado:', verifyResult.rows[0].password ? 'SÍ' : 'NO');

    // Verificar que login funcione
    console.log('\n🔐 Verificando que login funcione...');
    const loginVerify = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [adminEmail]
    );
    const isMatch = await bcrypt.compare(adminPassword, loginVerify.rows[0].password);
    console.log('   Login verificado:', isMatch ? '✅ FUNCIONA' : '❌ FALLA');

    await pool.end();
    console.log('\n🎉 Proceso completado');
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    await pool.end();
    process.exit(1);
  }
}

updateAdminPassword();
