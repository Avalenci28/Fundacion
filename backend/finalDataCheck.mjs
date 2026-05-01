// Final check showing exact API response format
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

async function finalCheck() {
  console.log('📊 FINAL API RESPONSE FORMAT\n');
  console.log('==============================\n');

  try {
    // GET /api/projects - exact format
    console.log('GET /api/projects');
    console.log('Query: SELECT * FROM projects WHERE is_active = true ORDER BY created_at DESC');
    const projects = await pool.query(
      'SELECT * FROM projects WHERE is_active = true ORDER BY created_at DESC LIMIT 10'
    );
    console.log('Response:', JSON.stringify(projects.rows, null, 2));

    // GET /api/projects/featured
    console.log('\nGET /api/projects/featured');
    console.log('Query: SELECT * FROM projects WHERE is_active = true AND is_featured = true');
    const featured = await pool.query(
      'SELECT * FROM projects WHERE is_active = true AND is_featured = true'
    );
    console.log('Response:', JSON.stringify(featured.rows, null, 2));

    // GET /api/events
    console.log('\nGET /api/events');
    console.log('Query: SELECT * FROM events WHERE is_active = true ORDER BY date DESC');
    const events = await pool.query(
      'SELECT * FROM events WHERE is_active = true ORDER BY date DESC LIMIT 10'
    );
    console.log('Response:', JSON.stringify(events.rows, null, 2));

    // GET /api/posts
    console.log('\nGET /api/posts');
    console.log("Query: SELECT * FROM posts WHERE status = 'published' ORDER BY created_at DESC");
    const posts = await pool.query(
      "SELECT * FROM posts WHERE status = 'published' ORDER BY created_at DESC LIMIT 10"
    );
    console.log('Response:', JSON.stringify(posts.rows, null, 2));

    // GET /api/gallery
    console.log('\nGET /api/gallery');
    console.log('Query: SELECT * FROM gallery ORDER BY created_at DESC');
    const gallery = await pool.query(
      'SELECT * FROM gallery ORDER BY created_at DESC LIMIT 10'
    );
    console.log('Response:', JSON.stringify(gallery.rows, null, 2));

    // GET /api/stats/public
    console.log('\nGET /api/stats/public');
    const statsUsers = await pool.query('SELECT COUNT(*) as count FROM users WHERE is_active = true');
    const statsProjects = await pool.query("SELECT COUNT(*) as count, SUM(raised_amount) as total FROM projects WHERE is_active = true");
    const statsEvents = await pool.query('SELECT COUNT(*) as count FROM events WHERE is_active = true');
    const statsVolunteers = await pool.query("SELECT COUNT(*) as count FROM volunteers WHERE status = 'active'");
    console.log('Response:', JSON.stringify({
      users: statsUsers.rows[0].count,
      projects: statsProjects.rows[0].count,
      totalProjects: statsProjects.rows[0].total,
      events: statsEvents.rows[0].count,
      volunteers: statsVolunteers.rows[0].count
    }, null, 2));

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await pool.end();
  }
}

finalCheck();
