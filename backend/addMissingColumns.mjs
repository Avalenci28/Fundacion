// Add missing columns to match backend controller expectations
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

async function addMissingColumns() {
  console.log('🔧 Adding missing columns to match controllers...\n');

  try {
    // 1. Update users table - add missing columns
    console.log('1️⃣  Updating users table...');
    try {
      await pool.query(`
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
        ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user'
      `);
      console.log('   ✅ users columns added');
    } catch (e) {
      console.log('   ⏭️  users columns already exist');
    }

    // 2. Update projects table - add missing columns
    console.log('2️⃣  Updating projects table...');
    try {
      await pool.query(`
        ALTER TABLE projects 
        ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
        ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
        ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'general',
        ADD COLUMN IF NOT EXISTS beneficiaries INTEGER DEFAULT 0,
        ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW()
      `);
      
      // Update existing rows to set is_active = true where status = 'active'
      await pool.query(`
        UPDATE projects SET is_active = true, is_featured = false, category = 'general', beneficiaries = 0
        WHERE is_active IS NULL OR is_featured IS NULL
      `);
      console.log('   ✅ projects columns added');
    } catch (e) {
      console.log('   ⏭️  projects columns already exist');
    }

    // 3. Update events table - add missing columns
    console.log('3️⃣  Updating events table...');
    try {
      await pool.query(`
        ALTER TABLE events 
        ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
        ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
        ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'general',
        ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW()
      `);
      
      await pool.query(`
        UPDATE events SET is_active = true, is_featured = false, category = 'general'
        WHERE is_active IS NULL
      `);
      console.log('   ✅ events columns added');
    } catch (e) {
      console.log('   ⏭️  events columns already exist');
    }

    // 4. Update posts table - add missing columns
    console.log('4️⃣  Updating posts table...');
    try {
      await pool.query(`
        ALTER TABLE posts 
        ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
        ADD COLUMN IF NOT EXISTS slug TEXT,
        ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'general',
        ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW()
      `);
      
      // Generate slug from title for existing posts
      await pool.query(`
        UPDATE posts SET slug = LOWER(REPLACE(title, ' ', '-'))
        WHERE slug IS NULL
      `);
      console.log('   ✅ posts columns added');
    } catch (e) {
      console.log('   ⏭️  posts columns already exist');
    }

    // 5. Update gallery table - add missing columns
    console.log('5️⃣  Updating gallery table...');
    try {
      await pool.query(`
        ALTER TABLE gallery 
        ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
        ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
        ADD COLUMN IF NOT EXISTS slug TEXT,
        ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW()
      `);
      console.log('   ✅ gallery columns added');
    } catch (e) {
      console.log('   ⏭️  gallery columns already exist');
    }

    // 6. Update contacts table - add missing columns
    console.log('6️⃣  Updating contacts table...');
    try {
      await pool.query(`
        ALTER TABLE contacts 
        ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
        ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW()
      `);
      console.log('   ✅ contacts columns added');
    } catch (e) {
      console.log('   ⏭️  contacts columns already exist');
    }

    // 7. Update volunteers table - add missing columns
    console.log('7️⃣  Updating volunteers table...');
    try {
      await pool.query(`
        ALTER TABLE volunteers 
        ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
        ADD COLUMN IF NOT EXISTS bio TEXT,
        ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW()
      `);
      console.log('   ✅ volunteers columns added');
    } catch (e) {
      console.log('   ⏭️  volunteers columns already exist');
    }

    // 8. Update participations table - add missing columns
    console.log('8️⃣  Updating participations table...');
    try {
      await pool.query(`
        ALTER TABLE participations 
        ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
        ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW()
      `);
      console.log('   ✅ participations columns added');
    } catch (e) {
      console.log('   ⏭️  participations columns already exist');
    }

    console.log('\n✅ Schema updated successfully!');

    // Verify tables
    console.log('\n📊 Verifying tables...');
    const tables = ['users', 'projects', 'events', 'posts', 'gallery', 'contacts', 'volunteers', 'participations'];
    for (const table of tables) {
      const result = await pool.query(`SELECT COUNT(*) as count FROM ${table}`);
      console.log(`   ${table}: ${result.rows[0].count} rows`);
    }

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await pool.end();
  }
}

addMissingColumns();
