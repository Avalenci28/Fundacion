// Add _id column (alias for id) and fix data for frontend compatibility
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

async function addFrontendCompatibility() {
  console.log('🔧 Adding frontend compatibility columns...\n');

  try {
    // 1. Add _id column (duplicate of id for frontend)
    console.log('1️⃣  Adding _id column to all tables...');
    
    const tables = ['users', 'projects', 'events', 'posts', 'gallery', 'contacts', 'volunteers', 'participations'];
    for (const table of tables) {
      try {
        await pool.query(`ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS _id TEXT`);
        await pool.query(`UPDATE ${table} SET _id = id::text WHERE _id IS NULL`);
        console.log(`   ✅ ${table}._id added`);
      } catch (e) { console.log(`   ⏭️ ${table}._id already exists`); }
    }

    // 2. Update project status to match frontend filters
    console.log('\n2️⃣  Updating project status for frontend...');
    await pool.query(`
      UPDATE projects SET status = 'En proceso' WHERE status = 'active'
    `);
    console.log('   ✅ Project status updated');

    // 3. Set featured projects
    console.log('\n3️⃣  Setting featured projects...');
    await pool.query(`
      UPDATE projects SET is_featured = true WHERE id = 1
    `);
    console.log('   ✅ Featured project set');

    // 4. Update event status to match frontend filters
    console.log('\n4️⃣  Updating event status for frontend...');
    await pool.query(`
      UPDATE events SET status = 'Próximamente' WHERE status = 'upcoming'
    `);
    console.log('   ✅ Event status updated');

    // 5. Set featured events
    console.log('\n5️⃣  Setting featured events...');
    await pool.query(`
      UPDATE events SET is_featured = true WHERE id = 1
    `);
    console.log('   ✅ Featured event set');

    console.log('\n✅ Frontend compatibility added!');

    // Verify final data
    console.log('\n📊 Final data verification:');
    
    const projects = await pool.query('SELECT id, _id, title, status, is_featured FROM projects');
    console.log('   Projects:');
    projects.rows.forEach(p => console.log(`      - ${p.id}: ${p.title} [${p.status}] featured: ${p.is_featured}`));

    const events = await pool.query('SELECT id, _id, title, status, is_featured FROM events');
    console.log('   Events:');
    events.rows.forEach(e => console.log(`      - ${e.id}: ${e.title} [${e.status}] featured: ${e.is_featured}`));

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await pool.end();
  }
}

addFrontendCompatibility();
