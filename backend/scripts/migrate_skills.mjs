/**
 * Quick fix: Add skills column to participations table
 * Run with: node backend/scripts/migrate_skills.mjs
 */

import pool from '../config/database.js';

async function migrateSkills() {
  const client = await pool.connect();

  try {
    console.log('🔌 Connecting to Supabase PostgreSQL...');

    // Check current columns
    console.log('\n📋 Checking current columns in participations table...');
    const colsResult = await client.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'participations'
      ORDER BY column_name;
    `);

    console.log('\n📊 Current columns:');
    colsResult.rows.forEach(row => {
      console.log('   -', row.column_name);
    });

    // Check if skills column exists
    const hasSkills = colsResult.rows.some(r => r.column_name === 'skills');

    if (hasSkills) {
      console.log('\n✅ Column "skills" already exists - nothing to do!');
    } else {
      console.log('\n⚠️ Column "skills" does NOT exist - adding it now...');

      // Add the missing columns
      await client.query(`
        ALTER TABLE participations ADD COLUMN IF NOT EXISTS skills TEXT;
      `);
      console.log('✅ Added skills column');

      await client.query(`
        ALTER TABLE participations ADD COLUMN IF NOT EXISTS availability TEXT;
      `);
      console.log('✅ Added availability column');

      await client.query(`
        ALTER TABLE participations ADD COLUMN IF NOT EXISTS motivation TEXT;
      `);
      console.log('✅ Added motivation column');

      // Verify
      const verifyResult = await client.query(`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = 'participations'
        ORDER BY column_name;
      `);

      console.log('\n📊 Columns after migration:');
      verifyResult.rows.forEach(row => {
        console.log('   -', row.column_name);
      });
    }

    console.log('\n🎉 Migration complete!');
  } catch (error) {
    console.error('\n❌ Migration error:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

migrateSkills().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
