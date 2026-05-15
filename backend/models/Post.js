/* DISABLED: Mongoose migrated to PostgreSQL (backend/db/query.js#posts)

PG Schema:
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  image TEXT,
  author_id INTEGER REFERENCES users(id),
  category VARCHAR(50) DEFAULT 'blog',
  tags TEXT[],
  comments JSONB DEFAULT '[]', -- embedded comments
  likes INTEGER[] , -- user_ids
  views INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

Use: import { posts } from '../db/query.js';
*/

