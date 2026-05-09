/* DISABLED: Mongoose migrated to PostgreSQL (backend/db/query.js#events)

PG Schema:
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image TEXT,
  type VARCHAR(50) DEFAULT 'social',
  date TIMESTAMP NOT NULL,
  end_date TIMESTAMP,
  location VARCHAR(255) NOT NULL,
  capacity INTEGER DEFAULT 100,
  attendees JSONB DEFAULT '[]', -- [{user_id, registered_at}]
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  requires_registration BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

Use: import { events } from '../db/query.js';
*/

