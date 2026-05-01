// Verify data format matches controller expectations
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

async function verifyDataFormat() {
  console.log('🧪 Verifying data format matches controller expectations...\n');

  try {
    // Test getProjects controller logic
    console.log('1️⃣  Testing getProjects controller:');
    console.log('   Query: SELECT * FROM projects WHERE is_active = true ORDER BY created_at DESC');
    const projects = await pool.query(
      'SELECT * FROM projects WHERE is_active = true ORDER BY created_at DESC LIMIT 10'
    );
    console.log('   Result:', JSON.stringify(projects.rows, null, 2).slice(0, 500) + '...');

    // Test getFeaturedProjects controller logic
    console.log('\n2️⃣  Testing getFeaturedProjects controller:');
    console.log('   Query: SELECT * FROM projects WHERE is_active = true AND is_featured = true');
    const featured = await pool.query(
      'SELECT * FROM projects WHERE is_active = true AND is_featured = true'
    );
    console.log('   Result:', JSON.stringify(featured.rows, null, 2));

    // Test findById logic  
    console.log('\n3️⃣  Testing getProject(id) controller:');
    console.log('   Query: SELECT * FROM projects WHERE id = 1');
    const projectById = await pool.query('SELECT * FROM projects WHERE id = 1');
    console.log('   Result:', JSON.stringify(projectById.rows[0], null, 2));

    // Test events
    console.log('\n4️⃣  Testing getEvents controller:');
    console.log('   Query: SELECT * FROM events WHERE is_active = true ORDER BY date DESC');
    const events = await pool.query(
      'SELECT * FROM events WHERE is_active = true ORDER BY date DESC LIMIT 10'
    );
    console.log('   Result:', JSON.stringify(events.rows, null, 2).slice(0, 500) + '...');

    // Test getPost BySlug
    console.log('\n5️⃣  Testing getPost(slug) controller:');
    console.log('   Query: SELECT * FROM posts WHERE slug = slug');
    const postBySlug = await pool.query(
      "SELECT * FROM posts WHERE slug = 'inauguración-de-nueva-sede'"
    );
    console.log('   Result:', JSON.stringify(postBySlug.rows[0], null, 2));

    // Test stats
    console.log('\n6️⃣  Testing getPublicStats:');
    const statsUserCount = await pool.query('SELECT COUNT(*) as count FROM users WHERE is_active = true');
    const statsProjectCount = await pool.query("SELECT COUNT(*) as count FROM projects WHERE is_active = true");
    const statsEventCount = await pool.query("SELECT COUNT(*) as count FROM events WHERE is_active = true");
    console.log('   Users:', statsUserCount.rows[0].count);
    console.log('   Projects:', statsProjectCount.rows[0].count);
    console.log('   Events:', statsEventCount.rows[0].count);

    console.log('\n✅ Data format verified!');

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await pool.end();
  }
}

verifyDataFormat();
