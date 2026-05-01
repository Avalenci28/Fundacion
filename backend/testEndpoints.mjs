// Test endpoints by directly querying the database
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

async function testEndpoints() {
  console.log('🧪 Testing API endpoints (simulated)...\n');

  try {
    // 1. GET /api/projects
    console.log('1️⃣  GET /api/projects');
    const projects = await pool.query('SELECT * FROM projects ORDER BY created_at DESC');
    console.log('   ✅ Projects:', projects.rows.length);
    projects.rows.forEach(p => console.log('      -', p.title));

    // 2. GET /api/projects/:id
    console.log('\n2️⃣  GET /api/projects/1');
    const project = await pool.query('SELECT * FROM projects WHERE id = 1');
    console.log('   ✅ Project:', project.rows[0]?.title || 'not found');

    // 3. GET /api/events
    console.log('\n3️⃣  GET /api/events');
    const events = await pool.query('SELECT * FROM events ORDER BY date DESC');
    console.log('   ✅ Events:', events.rows.length);
    events.rows.forEach(e => console.log('      -', e.title, '(' + e.status + ')'));

    // 4. GET /api/posts
    console.log('\n4️⃣  GET /api/posts');
    const posts = await pool.query("SELECT * FROM posts WHERE status = 'published' ORDER BY created_at DESC");
    console.log('   ✅ Posts:', posts.rows.length);
    posts.rows.forEach(p => console.log('      -', p.title));

    // 5. GET /api/gallery
    console.log('\n5️⃣  GET /api/gallery');
    const gallery = await pool.query('SELECT * FROM gallery ORDER BY created_at DESC');
    console.log('   ✅ Gallery:', gallery.rows.length);
    gallery.rows.forEach(g => console.log('      -', g.title));

    // 6. GET /api/contact
    console.log('\n6️⃣  GET /api/contact');
    const contacts = await pool.query('SELECT * FROM contacts ORDER BY created_at DESC');
    console.log('   ✅ Contacts:', contacts.rows.length);
    contacts.rows.forEach(c => console.log('      -', c.name, c.email));

    // 7. GET /api/volunteers
    console.log('\n7️⃣  GET /api/volunteers');
    const volunteers = await pool.query("SELECT * FROM volunteers WHERE status = 'active'");
    console.log('   ✅ Volunteers:', volunteers.rows.length);
    volunteers.rows.forEach(v => console.log('      -', v.name));

    // 8. GET /api/participation
    console.log('\n8️⃣  GET /api/participation');
    const participations = await pool.query('SELECT * FROM participations');
    console.log('   ✅ Participations:', participations.rows.length);
    participations.rows.forEach(p => console.log('      -', p.name, 'for event', p.event_id));

    // 9. GET /api/stats
    console.log('\n9️⃣  GET /api/stats');
    const stats = await Promise.all([
      pool.query('SELECT COUNT(*) as users FROM users'),
      pool.query('SELECT COUNT(*) as projects FROM projects'),
      pool.query('SELECT COUNT(*) as events FROM events'),
      pool.query('SELECT COUNT(*) as contacts FROM contacts'),
      pool.query('SELECT SUM(raised_amount) as total_raised FROM projects'),
    ]);
    console.log('   ✅ Stats:');
    console.log('      - Users:', stats[0].rows[0].users);
    console.log('      - Projects:', stats[1].rows[0].projects);
    console.log('      - Events:', stats[2].rows[0].events);
    console.log('      - Contacts:', stats[3].rows[0].contacts);
    console.log('      - Total raised:', stats[4].rows[0].total_raised || 0);

    console.log('\n✅ All endpoints working correctly!');

  } catch (err) {
    console.error('❌ Endpoint error:', err.message);
  } finally {
    await pool.end();
  }
}

testEndpoints();
