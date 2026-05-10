import pool from '../config/database.js';

async function test() {
  try {
    console.log('Testing submitContact directly...');

    const result = await pool.query(`
      INSERT INTO contacts (name, email, phone, subject, message, is_read, is_replied)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
    `, ['Direct Test', 'direct@test.com', '123', 'Test Subject', 'Test message', false, false]);

    console.log('Insert success:', result.rows[0].id);
  } catch (err) {
    console.log('Error:', err.message);
    console.log('Code:', err.code);
    console.log('Detail:', err.detail);
  }
  await pool.end();
}

test();
