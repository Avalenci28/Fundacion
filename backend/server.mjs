import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import hpp from 'hpp';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar .env ESM con ruta absoluta
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Debug: Verify JWT_SECRET is loaded
console.log('🔑 JWT_SECRET:', process.env.JWT_SECRET ? '✅ LOADED' : '❌ NOT FOUND');
console.log('⏰ JWT_EXPIRE:', process.env.JWT_EXPIRE || '7d (default)');

// Import functions from database
import { initPool, getPool } from './config/database.js';

const app = express();

// ✅ Status Check - PostgreSQL
app.get('/status', async (req, res) => {
  try {
    const pool = getPool();
    if (!pool) {
      return res.json({ status: "error", db: "not initialized" });
    }
    const result = await pool.query('SELECT NOW()');
    res.json({ status: "ok", db: "connected", time: result.rows[0].now });
  } catch (err) {
    res.json({ status: "error", db: "disconnected", error: err.message });
  }
});

// ✅ Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

async function startServer() {
  try {
    // Initialize PostgreSQL pool
    const pool = await initPool();
    
    // Test PostgreSQL connection
    const result = await pool.query('SELECT NOW()');
    console.log('✅ PostgreSQL Connected:', result.rows[0].now);
    
    // ✅ Configuración de middlewares centralizada
    const configApp = (await import('./config/app.js')).default;
    configApp(app);

// ✅ Rutas principales
    app.use('/api/auth', (await import('./routes/auth.js')).default);
    app.use('/api/projects', (await import('./routes/projects.js')).default);
    app.use('/api/events', (await import('./routes/events.js')).default);
    app.use('/api/gallery', (await import('./routes/gallery.js')).default);
    app.use('/api/contact', (await import('./routes/contact.js')).default);
    app.use('/api/participation', (await import('./routes/participation.js')).default);
    app.use('/api/admin', (await import('./routes/admin.js')).default);
    app.use('/api/stats', (await import('./routes/stats.js')).default);
    app.use('/api/volunteers', (await import('./routes/volunteers.js')).default);

    // ✅ Manejador de errores global
    const errorHandler = (await import('./middleware/errorHandler.js')).default;
    app.use(errorHandler);

    // ✅ Ruta no encontrada
    app.use((req, res) => {
      res.status(404).json({ success: false, message: 'Route not found' });
    });

    // ✅ Levantar servidor
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error('❌ Error iniciando servidor:', err);
    process.exit(1);
  }
}

startServer();
