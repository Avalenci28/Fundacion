import pool from '../config/database.js';

async function createTables() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100) UNIQUE,
        password VARCHAR(255),
        role VARCHAR(20) DEFAULT 'user',
        avatar VARCHAR(500) DEFAULT '',
        phone VARCHAR(50) DEFAULT '',
        bio VARCHAR(500) DEFAULT '',
        is_active BOOLEAN DEFAULT true,
        volunteer_info JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
      
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(100),
        description TEXT,
        short_description VARCHAR(200) DEFAULT '',
        image VARCHAR(500) DEFAULT '',
        gallery JSONB DEFAULT '[]',
        status VARCHAR(50) DEFAULT 'Próximamente',
        category VARCHAR(50) DEFAULT 'social',
        start_date TIMESTAMP DEFAULT NULL,
        end_date TIMESTAMP DEFAULT NULL,
        location VARCHAR(255) DEFAULT '',
        beneficiaries INTEGER DEFAULT 0,
        volunteers JSONB DEFAULT '[]',
        is_featured BOOLEAN DEFAULT false,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
      
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        title VARCHAR(100),
        description TEXT,
        image VARCHAR(500) DEFAULT '',
        type VARCHAR(50) DEFAULT 'social',
        date TIMESTAMP,
        end_date TIMESTAMP DEFAULT NULL,
        location VARCHAR(255),
        capacity INTEGER DEFAULT 100,
        attendees JSONB DEFAULT '[]',
        is_featured BOOLEAN DEFAULT false,
        is_active BOOLEAN DEFAULT true,
        requires_registration BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
      
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(150),
        slug VARCHAR(200) UNIQUE,
        excerpt VARCHAR(300) DEFAULT '',
        content TEXT,
        image VARCHAR(500) DEFAULT '',
        author_id INTEGER,
        category VARCHAR(50) DEFAULT 'blog',
        tags JSONB DEFAULT '[]',
        comments JSONB DEFAULT '[]',
        likes JSONB DEFAULT '[]',
        views INTEGER DEFAULT 0,
        is_published BOOLEAN DEFAULT true,
        is_featured BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
      
      CREATE TABLE IF NOT EXISTS gallery (
        id SERIAL PRIMARY KEY,
        title VARCHAR(100),
        description VARCHAR(500) DEFAULT '',
        url VARCHAR(500),
        thumbnail VARCHAR(500) DEFAULT '',
        type VARCHAR(20) DEFAULT 'image',
        category VARCHAR(50) DEFAULT 'otro',
        project_id INTEGER,
        event_id INTEGER,
        is_featured BOOLEAN DEFAULT false,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
      
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100),
        phone VARCHAR(50) DEFAULT '',
        subject VARCHAR(100),
        message TEXT,
        is_read BOOLEAN DEFAULT false,
        is_replied BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("✅ Tablas creadas correctamente");
  } catch (err) {
    console.error("❌ Error creando tablas:", err.message);
  } finally {
    pool.end();
  }
}

createTables();
