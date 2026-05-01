// Seed script to populate initial data in Supabase
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

async function seedDatabase() {
  console.log('🌱 Seeding database with initial data...\n');

  try {
    // 1. Insert users
    console.log('1️⃣  Inserting users...');
    await pool.query(`
      INSERT INTO users (name, email, password, role) VALUES
      ('Administrador', 'admin@fundacion.org', '$2a$10$xYqKkN8xZqKkN8xZqKkN8.', 'admin'),
      ('Juan Pérez', 'juan@fundacion.org', '$2a$10$xYqKkN8xZqKkN8xZqKkN8.', 'user'),
      ('María Gómez', 'maria@fundacion.org', '$2a$10$xYqKkN8xZqKkN8xZqKkN8.', 'user'),
      ('Carlos López', 'carlos@fundacion.org', '$2a$10$xYqKkN8xZqKkN8xZqKkN8.', 'volunteer')
      ON CONFLICT (email) DO NOTHING
    `);
    console.log('   ✅ 4 users inserted');

    // 2. Insert projects
    console.log('2️⃣  Inserting projects...');
    await pool.query(`
      INSERT INTO projects (title, description, image, goal_amount, raised_amount, status) VALUES
      ('Construcción Biblioteca Rural', 'Proyecto para construir una biblioteca en la zona rural de Malambo, dotando de libros y espacios de lectura para niños y jóvenes.', 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800', 50000, 12500, 'active'),
      ('Programa de Alimentación Escolar', 'Proyecto de alimentación balanceada para estudiantes de escuelas rurales de Malambo.', 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800', 30000, 8750, 'active')
      ON CONFLICT DO NOTHING
    `);
    console.log('   ✅ 2 projects inserted');

    // 3. Insert events
    console.log('3️⃣  Inserting events...');
    await pool.query(`
      INSERT INTO events (title, description, date, location, image, capacity, registered_count, status) VALUES
      ('Feria del Libro 2024', 'Feria anual del libro con actividades para toda la familia, firmas de autores y talleres de lectura.', '2024-06-15 09:00:00', 'Parque Central Malambo', 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=800', 200, 45, 'upcoming'),
      ('Carrera Solidaria 5K', 'Carrera benéfica para recaudar fondos para el programa de alimentación escolar.', '2024-07-20 07:00:00', 'Estadio Municipal Malambo', 'https://images.unsplash.com/photo-1571008887538-b36bb32f4579?w=800', 500, 120, 'upcoming')
      ON CONFLICT DO NOTHING
    `);
    console.log('   ✅ 2 events inserted');

    // 4. Insert posts (blog)
    console.log('4️⃣  Inserting posts...');
    await pool.query(`
      INSERT INTO posts (title, content, image, author, status) VALUES
      ('Inauguración de nueva sede', 'Nos llena de alegría contarles que inauguramos nuestra nueva sede en Malambo. Este espacio nos permitirá atender a más familias y expandir nuestros programas sociales.', 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800', 'admin', 'published'),
      ('Éxito en última campaña educativa', 'Gracias a todos los voluntarios que participaron en nuestra campaña de reforestación. Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800', 'admin', 'published')
      ON CONFLICT DO NOTHING
    `);
    console.log('   ✅ 2 posts inserted');

    // 5. Insert contacts
    console.log('5️⃣  Inserting contacts...');
    await pool.query(`
      INSERT INTO contacts (name, email, message, phone, status) VALUES
      ('Ana Martínez', 'ana@example.com', 'Me gustaría ser voluntaria en el programa de alfabetización.', '+57 300 123 4567', 'read'),
      ('Pedro Sánchez', 'pedro@example.com', 'Quisiera información sobre cómo colaborar con la fundación.', '+57 301 987 6543', 'unread')
      ON CONFLICT DO NOTHING
    `);
    console.log('   ✅ 2 contacts inserted');

    // 6. Insert gallery images
    console.log('6️⃣  Inserting gallery images...');
    await pool.query(`
      INSERT INTO gallery (title, image, category) VALUES
      ('Niños leyendo en biblioteca', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0c?w=800', 'education'),
      ('Voluntarios en campaña', 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800', 'volunteers')
      ON CONFLICT DO NOTHING
    `);
    console.log('   ✅ 2 gallery images inserted');

    // 7. Insert participations
    console.log('7️⃣  Inserting participations...');
    await pool.query(`
      INSERT INTO participations (user_id, event_id, name, email, phone, status) VALUES
      (2, 1, 'Juan Pérez', 'juan@fundacion.org', '+57 300 111 2233', 'registered'),
      (3, 1, 'María Gómez', 'maria@fundacion.org', '+57 300 444 5566', 'registered'),
      (2, 2, 'Juan Pérez', 'juan@fundacion.org', '+57 300 111 2233', 'registered'),
      (4, 2, 'Carlos López', 'carlos@fundacion.org', '+57 300 777 8899', 'registered')
      ON CONFLICT DO NOTHING
    `);
    console.log('   ✅ 4 participations inserted');

    // 8. Insert volunteers
    console.log('8️⃣  Inserting volunteers...');
    await pool.query(`
      INSERT INTO volunteers (user_id, name, email, phone, availability, skills, status) VALUES
      (4, 'Carlos López', 'carlos@fundacion.org', '+57 300 777 8899', 'Fines de semana', 'Educación, Organización de eventos', 'active'),
      (2, 'Juan Pérez', 'juan@fundacion.org', '+57 300 111 2233', 'Lunes a viernes', 'Docencia, Tutoría', 'active')
      ON CONFLICT DO NOTHING
    `);
    console.log('   ✅ 2 volunteers inserted');

    // Verify all data
    console.log('\n📊 Verifying seeded data...');
    const tables = ['users', 'projects', 'events', 'posts', 'contacts', 'gallery', 'participations', 'volunteers'];
    
    for (const table of tables) {
      const result = await pool.query(`SELECT COUNT(*) as count FROM ${table}`);
      console.log(`   ${table}: ${result.rows[0].count} rows`);
    }

    console.log('\n✅ Database seeded successfully!');

  } catch (err) {
    console.error('❌ Seed error:', err.message);
  } finally {
    await pool.end();
  }
}

seedDatabase();
