/* DISABLED: Mongoose migrated to PostgreSQL (backend/db/query.js#gallery)

PG Schema:
CREATE TABLE gallery (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  thumbnail TEXT,
  type VARCHAR(20) DEFAULT 'image',
  category VARCHAR(50) DEFAULT 'otro',
  project_id INTEGER REFERENCES projects(id),
  event_id INTEGER REFERENCES events(id),
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

Use: import { gallery } from '../db/query.js';
*/

