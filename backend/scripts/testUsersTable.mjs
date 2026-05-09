import('../config/database.js').then(async (db) => {
  const pool = db.default;
  try {
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password VARCHAR(200) NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        avatar VARCHAR(500) DEFAULT '',
        phone VARCHAR(50) DEFAULT '',
        bio VARCHAR(500) DEFAULT '',
        is_active BOOLEAN DEFAULT true,
        volunteer_info JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )`);
    console.log('✅ Tabla users creada o ya existía');

    // Describe table using information_schema
    const descResult = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position`);
    console.log('📋 Estructura de la tabla:');
    descResult.rows.forEach(r => console.log('  -', r.column_name, r.data_type, r.is_nullable === 'YES' ? '(nullable)' : '(not null)'));

    // Insert test record
    await pool.query(`
      INSERT INTO users (name, email, password)
      VALUES ('Test User', 'test@example.com', '12345')
      ON CONFLICT (email) DO NOTHING`);
    console.log('✅ Registro de prueba insertado');

    // Select all
    const selectResult = await pool.query('SELECT * FROM users');
    console.log('📋 Todos los registros:');
    selectResult.rows.forEach(r => console.log('  -', r.name, '|', r.email, '|', r.role, '|', r.is_active));

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
});
