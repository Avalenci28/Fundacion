import pool from '../config/database.js';

async function fixProjectsTable() {
  try {
    console.log('🔧 Adding missing columns to projects table...');

    // Add short_description if it doesn't exist
    await pool.query(`
      ALTER TABLE projects ADD COLUMN IF NOT EXISTS short_description TEXT DEFAULT '';
    `);
    console.log('✅ short_description column added');

    // Add gallery if it doesn't exist (TEXT[] array for image URLs)
    await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'gallery') THEN
          ALTER TABLE projects ADD COLUMN gallery TEXT[] DEFAULT '[]';
        END IF;
      END $$;
    `);
    console.log('✅ gallery column added');

    // Verify the table structure
    const cols = await pool.query(`
      SELECT column_name, data_type FROM information_schema.columns
      WHERE table_name = 'projects' ORDER BY ordinal_position;
    `);
    console.log('\n📋 Current projects table columns:');
    cols.rows.forEach(r => console.log(`  - ${r.column_name} (${r.data_type})`));

    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    await pool.end();
    process.exit(1);
  }
}

fixProjectsTable();