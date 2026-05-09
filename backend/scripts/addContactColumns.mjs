import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Pool } from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

const pool = new Pool({
  host: process.env.PGHOST || 'aws-1-us-west-2.pooler.supabase.com',
  user: process.env.PGUSER || 'postgres.fulgeedluudhpmglteqp',
  password: process.env.PGPASSWORD || '1044616328base',
  database: process.env.PGDATABASE || 'postgres',
  port: parseInt(process.env.PGPORT) || 5432,
  ssl: { rejectUnauthorized: false, require: true }
});

async function run() {
  try {
    await pool.query(`
      ALTER TABLE contacts ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT FALSE;
    `);
    console.log('✅ Columna is_read agregada a contacts');

    // Verify
    const cols = await pool.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'contacts'
      ORDER BY ordinal_position
    `);
    cols.rows.forEach(r => console.log(' -', r.column_name, '|', r.data_type));
  } catch(e) {
    console.error('❌ Error:', e.message);
  } finally {
    await pool.end();
  }
}
run();