// Script to create initial tables in Supabase Session Pooler
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

async function createTables() {
  console.log('🗑️  Creating initial tables...\n');

  try {
    // Create users table
    console.log('1️⃣  Creating users table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('   ✅ users table created');

    // Create projects table
    console.log('2️⃣  Creating projects table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        image TEXT,
        goal_amount DECIMAL(10,2) DEFAULT 0,
        raised_amount DECIMAL(10,2) DEFAULT 0,
        status TEXT DEFAULT 'active',
        start_date TIMESTAMP DEFAULT NOW(),
        end_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('   ✅ projects table created');

    // Create events table
    console.log('3️⃣  Creating events table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        date TIMESTAMP NOT NULL,
        location TEXT,
        image TEXT,
        capacity INTEGER DEFAULT 100,
        registered_count INTEGER DEFAULT 0,
        status TEXT DEFAULT 'upcoming',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('   ✅ events table created');

    // Create contacts table
    console.log('4️⃣  Creating contacts table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT,
        phone TEXT,
        status TEXT DEFAULT 'unread',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('   ✅ contacts table created');

    // Create posts table (for blog)
    console.log('5️⃣  Creating posts table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT,
        image TEXT,
        author TEXT DEFAULT 'admin',
        status TEXT DEFAULT 'draft',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('   ✅ posts table created');

    // Create gallery table
    console.log('6️⃣  Creating gallery table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS gallery (
        id SERIAL PRIMARY KEY,
        title TEXT,
        image TEXT NOT NULL,
        category TEXT DEFAULT 'general',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('   ✅ gallery table created');

    // Create participations table
    console.log('7️⃣  Creating participations table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS participations (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        event_id INTEGER,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        status TEXT DEFAULT 'registered',
        created_at TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (event_id) REFERENCES events(id)
      );
    `);
    console.log('   ✅ participations table created');

    // Create volunteers table
    console.log('8️⃣  Creating volunteers table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS volunteers (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        availability TEXT,
        skills TEXT,
        status TEXT DEFAULT 'active',
        created_at TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `);
    console.log('   ✅ volunteers table created');

    // Verify tables created
    console.log('\n📋 Verifying tables...');
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('\n✅ Tables created successfully!');
    console.log('   Total tables:', tables.rows.length);
    tables.rows.forEach(t => console.log('    -', t.table_name));

  } catch (err) {
    console.error('❌ Error creating tables:', err.message);
  } finally {
    await pool.end();
  }
}

createTables();
