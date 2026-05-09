/* DISABLED: Mongoose migrated to PostgreSQL (backend/db/query.js#users)

PG Schema:
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  avatar TEXT DEFAULT '',
  phone VARCHAR(50) DEFAULT '',
  bio TEXT DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  volunteer_info JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

Use: import { users } from '../db/query.js'; users.create/update etc.
*/

