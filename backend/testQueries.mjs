// Test queries from backend to Supabase
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
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: parseInt(process.env.PGPORT),
  ssl: { rejectUnauthorized: false, require: true }
});

async function testQueries() {
  console.log('🧪 Testing queries from backend...\n');

  try {
    // Test SELECT
    console.log('1️⃣  Testing SELECT...');
    const users = await pool.query('SELECT * FROM users');
    console.log('   ✅ SELECT - rows:', users.rows.length);

    // Test INSERT
    console.log('2️⃣  Testing INSERT...');
    await pool.query(`
      INSERT INTO users (name, email, password, role)
      VALUES ('Admin', 'admin@fundacion.org', 'hashed_password', 'admin')
    `);
    console.log('   ✅ INSERT successful');

    // Test SELECT after insert
    console.log('3️⃣  Testing SELECT after insert...');
    const newUsers = await pool.query('SELECT * FROM users');
    console.log('   ✅ SELECT - total users:', newUsers.rows.length);
    newUsers.rows.forEach(u => console.log('      -', u.name, u.email));

    // Test UPDATE
    console.log('4️⃣  Testing UPDATE...');
    await pool.query(`UPDATE users SET name = 'Administrator' WHERE email = 'admin@fundacion.org'`);
    console.log('   ✅ UPDATE successful');

    // Test DELETE
    console.log('5️⃣  Testing DELETE...');
    await pool.query(`DELETE FROM users WHERE email = 'admin@fundacion.org'`);
    console.log('   ✅ DELETE successful');

    // Verify all queries work
    console.log('\n✅ All queries working correctly!');
    console.log('   - SELECT ✅');
    console.log('   - INSERT ✅');
    console.log('   - UPDATE ✅');
    console.log('   - DELETE ✅');

  } catch (err) {
    console.error('❌ Query error:', err.message);
  } finally {
    await pool.end();
  }
}

testQueries();
