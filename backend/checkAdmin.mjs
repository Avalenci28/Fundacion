import pool from './config/database.js';

async function check() {
  const r = await pool.query('SELECT id, email, role, is_active FROM users WHERE email = $1', ['admin@fundacion.org']);
  console.log('Admin user:', JSON.stringify(r.rows[0], null, 2));
  process.exit(0);
}

check().catch(e => { console.error(e.message); process.exit(1); });