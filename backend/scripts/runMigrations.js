/**
 * Migration script to run SQL migrations against Supabase PostgreSQL
 * 
 * This script executes the SQL migration files directly using the pg library
 * Connect to Supabase PostgreSQL: db.fulgeedluudhpmglteqp.supabase.co
 */

import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase PostgreSQL configuration - Using Session Pooler (IPv4-compatible)
const pool = new Pool({
  host: process.env.PGHOST || 'aws-0-us-east-1.pooler.supabase.com',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || '104461638base',
  database: process.env.PGDATABASE || 'postgres',
  port: parseInt(process.env.PGPORT) || 5432,
  ssl: { rejectUnauthorized: false }
});

console.log('🔌 Connecting to Supabase PostgreSQL (Session Pooler)...');
console.log('   Host:', process.env.PGHOST || 'aws-0-us-east-1.pooler.supabase.com');
console.log('   User:', process.env.PGUSER || 'postgres');
console.log('   Note: Using Session Pooler (IPv4-compatible connection)');

async function runMigrations() {
  const client = await pool.connect();
  
  try {
    console.log('\n🚀 Starting migrations...\n');
    
    // Migration 1: Create users table
    console.log('📋 Running: create_users_table.sql');
    const createUsersSQL = fs.readFileSync(
      path.join(__dirname, 'create_users_table.sql'),
      'utf8'
    );
    await client.query(createUsersSQL);
    console.log('✅ users table created/verified\n');
    
    // Migration 2: Create participations table
    console.log('📋 Running: create_participations_table.sql');
    const createParticipationsSQL = fs.readFileSync(
      path.join(__dirname, 'create_participations_table.sql'),
      'utf8'
    );
    await client.query(createParticipationsSQL);
    console.log('✅ participations table created/verified\n');
    
    // Migration 3: Insert admin user
    console.log('📋 Running: create_admin_user.sql');
    const createAdminSQL = fs.readFileSync(
      path.join(__dirname, 'create_admin_user.sql'),
      'utf8'
    );
    await client.query(createAdminSQL);
    console.log('✅ admin user created/verified\n');
    
    // Verify tables exist
    console.log('🔍 Verifying tables...');
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);
    
    console.log('\n📊 Tables in database:');
    result.rows.forEach(row => {
      console.log('   -', row.table_name);
    });
    
    // Verify admin user exists
    const adminCheck = await client.query(
      "SELECT id, name, email, role FROM users WHERE email = 'admin@malambosonrie.org'"
    );
    
    if (adminCheck.rows.length > 0) {
      console.log('\n👤 Admin user:');
      console.log('   Name:', adminCheck.rows[0].name);
      console.log('   Email:', adminCheck.rows[0].email);
      console.log('   Role:', adminCheck.rows[0].role);
    } else {
      console.log('\n⚠️ Admin user not found (may have been already inserted)');
    }
    
    console.log('\n🎉 All migrations completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Migration error:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
