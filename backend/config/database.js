import { Pool, Client } from 'pg';
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

// Config
const config = {
  host: process.env.PGHOST || 'localhost',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'admin123',
  database: process.env.PGDATABASE || 'malambo_sonrie',
  port: parseInt(process.env.PGPORT) || 5432,
};

console.log('🔧 Using config:', {
  host: config.host,
  user: config.user,
  password: config.password ? '****' : 'EMPTY',
  database: config.database,
  port: config.port
});

// Function to create database if not exists
async function createDatabaseIfNotExists() {
  const client = new Client({
    host: config.host,
    user: config.user,
    password: config.password,
    database: 'postgres',
    port: config.port,
  });
  
  try {
    await client.connect();
    
    const res = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [config.database]
    );
    
    if (res.rows.length === 0) {
      console.log(`📦 Creating database: ${config.database}`);
      await client.query(`CREATE DATABASE ${config.database}`);
      console.log(`✅ Database ${config.database} created!`);
    } else {
      console.log(`✅ Database ${config.database} already exists`);
    }
  } catch (err) {
    console.error('❌ Error checking/creating database:', err.message);
  } finally {
    await client.end();
  }
}

// Initialize pool
let pool;

export async function initPool() {
  await createDatabaseIfNotExists();
  pool = new Pool(config);
  return pool;
}

// Export pool getter to avoid undefined
export function getPool() {
  return pool;
}

// Export default pool (may be undefined until initPool is called)
export default pool;
