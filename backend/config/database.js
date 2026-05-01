import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Find and load .env file
const envPaths = [
  path.resolve(__dirname, '../.env'),
  path.resolve(__dirname, './.env'),
  path.resolve(__dirname, '../../.env'),
  path.resolve(process.cwd(), '.env'),
];

let envPath = null;
for (const p of envPaths) {
  if (fs.existsSync(p)) {
    envPath = p;
    console.log('✅ Found .env at:', p);
    break;
  }
}

if (envPath) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

// Supabase Session Pooler (IPv4) Configuration
// Connection Pool Settings for stability (max 15 connections for Nano plan)
const pool = new Pool({
  host: process.env.PGHOST || 'aws-1-us-west-2.pooler.supabase.com',
  user: process.env.PGUSER || 'postgres.fulgeedluudhpmglteqp',
  password: process.env.PGPASSWORD || '1044616328base',
  database: process.env.PGDATABASE || 'postgres',
  port: parseInt(process.env.PGPORT) || 5432,
  // Connection Pool Settings for stability (max 15 connections for Nano plan)
  max: 15,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  // SSL Configuration for security
  ssl: { 
    rejectUnauthorized: false,
    // Force TLS/SSL for Supabase
    require: true
  }
});

console.log('🔧 PostgreSQL pool configured for Supabase Session Pooler:');
console.log('   Host:', process.env.PGHOST || 'aws-1-us-west-2.pooler.supabase.com');
console.log('   User:', process.env.PGUSER || 'postgres.fulgeedluudhpmglteqp');
console.log('   Max Connections:', 15);

// Export getPool function to get the pool instance
export function getPool() {
  return pool;
}

// Export initPool for compatibility (returns the already initialized pool)
export function initPool() {
  return pool;
}

export default pool;
