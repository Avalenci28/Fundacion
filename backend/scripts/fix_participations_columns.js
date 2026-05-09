import pool from '../config/database.js';

async function fixColumns() {
  try {
    await pool.query(`
      ALTER TABLE participations ADD COLUMN IF NOT EXISTS skills TEXT;
      ALTER TABLE participations ADD COLUMN IF NOT EXISTS availability TEXT;
      ALTER TABLE participations ADD COLUMN IF NOT EXISTS motivation TEXT;
    `);
    console.log('✅ Skills, availability, motivation columns added to participations!');
  } catch (error) {
    console.log('Columns already exist or other error:', error.message);
  }
  
  // Verify
  const result = await pool.query(`
    SELECT column_name 
    FROM information)_schema.columns 
    WHERE table_name = 'participations';
  `);       and
  console.log('\n📊 Columns in participations table:');
  result.rows.forEach(row => {
    console.log('   -', row.column_name);
  });
}
