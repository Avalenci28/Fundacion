// Quick test script to verify Supabase Session Pooler connection
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend directory
dotenv.config({ path: path.resolve(__dirname, '.env') });

const { Pool } = pg;

const pool = new Pool({
  host: process.env.PGHOST || 'aws-1-us-west-2.pooler.supabase.com',
  user: process.env.PGUSER || 'postgres.fulgeedluudhpmglteqp',
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE || 'postgres',
  port: parseInt(process.env.PGPORT) || 5432,
  max: 15,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  ssl: { 
    rejectUnauthorized: false,
    require: true
  }
});

console.log('🧪 Testing Supabase Session Pooler connection...');
console.log('   Host:', process.env.PGHOST);
console.log('   User:', process.env.PGUSER);
console.log('   Database:', process.env.PGDATABASE);

async function testConnection() {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✅ CONNECTION SUCCESSFUL!');
    console.log('   Database time:', result.rows[0].now);
    
    // Test a simple query
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
      LIMIT 10
    `);
    console.log('   Public tables found:', tables.rows.length);
    tables.rows.forEach(t => console.log('    -', t.table_name));
    
  } catch (err) {
    console.error('❌ CONNECTION FAILED:');
    console.error('   Error:', err.message);
    console.error('   Code:', err.code);
    
    if (err.message.includes('ENOTFOUND')) {
      console.error('   → DNS resolution failed - check hostname');
    } else if (err.message.includes('tenant')) {
      console.error('   → Tenant not found - check PGUSER suffix');
    } else if (err.message.includes('password')) {
      console.error('   → Authentication failed - check credentials');
    }
  } finally {
    await pool.end();
    console.log('🔌 Pool closed');
  }
}

testConnection();
