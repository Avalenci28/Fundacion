/**
 * Quick check: View participations in the database
 * Run with: node backend/scripts/check_participations.mjs
 */

import pool from '../config/database.js';

async function checkParticipations() {
  const client = await pool.connect();

  try {
    console.log('🔌 Connecting to Supabase PostgreSQL...');

    // Check all participations
    const result = await client.query(`
      SELECT id, name, email, phone, skills, availability, motivation, status, created_at
      FROM participations
      ORDER BY created_at DESC;
    `);

    console.log('\n📊 Participations in database:');
    if (result.rows.length === 0) {
      console.log('   ⚠️ No participations found');
    } else {
      result.rows.forEach(row => {
        console.log('\n   📝 ID:', row.id);
        console.log('   👤 Nombre:', row.name);
        console.log('   📧 Email:', row.email);
        console.log('   📱 Teléfono:', row.phone);
        console.log('   🛠️ Habilidades:', row.skills);
        console.log('   ⏰ Disponibilidad:', row.availability);
        console.log('   💬 Motivación:', row.motivation);
        console.log('   📌 Estado:', row.status);
        console.log('   📅 Creado:', row.created_at);
      });
    }

    console.log('\n✅ Total:', result.rows.length, 'participations');
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

checkParticipations().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
