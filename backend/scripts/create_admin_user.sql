-- Script para crear el usuario admin en PostgreSQL
-- Ejecutar este SQL en tu base de datos PostgreSQL

-- Primero, crear el usuario admin (si la tabla users existe)
-- Nota: Necesitas tener la tabla users creada previamente

-- Insertar usuario admin (la contraseña debe ser hasheada)
-- Password: Admin2024! (hasheado con bcrypt12)
INSERT INTO users (name, email, password, role, created_at, updated_at)
VALUES (
  'Administrador Malambo Sonríe',
  'admin@malambosonrie.org',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYuN8.XN5Wq', -- bcrypt hash de "Admin2024!"
  'admin',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;
