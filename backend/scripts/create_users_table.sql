-- Script SQL para crear la tabla "users" en PostgreSQL
-- Ejecutar este script directamente en pgAdmin opsql

-- Crear tabla users
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
);

-- Verificar que la tabla fue creada
SELECT * FROM users LIMIT 0;
