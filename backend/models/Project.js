/* DISABLED: Mongoose migrated to PostgreSQL (backend/db/query.js#projects)

PG Schema:
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT,
  image TEXT[],
  status VARCHAR(50) DEFAULT 'Próximamente' CHECK (status IN ('Completado', 'En proceso', 'Próximamente')),
  category VARCHAR(50) DEFAULT 'social',
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  location VARCHAR(255),
  beneficiaries INTEGER DEFAULT 0,
  volunteers INTEGER[] , -- user_ids
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

Use: import { projects } from '../db/query.js';
*/

