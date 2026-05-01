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

// Load .env with explicit path BEFORE any other imports
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Debug: log JWT_SECRET loaded
console.log('🔑 JWT_SECRET:', process.env.JWT_SECRET ? '✅ Loaded' : '❌ NOT FOUND');

// Import pool from config
import { initPool, getPool } from './config/database.js';

// Import database validation
import validateAndConnectDB from './validateAndTestServer.js';

const app = express();

// ✅ Validación y conexión a la base de datos
await validateAndConnectDB();

// ✅ Configuración de middlewares centralizada
const configApp = (await import('./config/app.js')).default;
configApp(app);

// ✅ Rutas principales
app.use('/api/auth', (await import('./routes/auth.js')).default);
app.use('/api/projects', (await import('./routes/projects.js')).default);
app.use('/api/events', (await import('./routes/events.js')).default);
app.use('/api/posts', (await import('./routes/posts.js')).default);
app.use('/api/gallery', (await import('./routes/gallery.js')).default);
app.use('/api/contact', (await import('./routes/contact.js')).default);
app.use('/api/admin', (await import('./routes/admin.js')).default);
app.use('/api/stats', (await import('./routes/stats.js')).default);
app.use('/api/volunteers', (await import('./routes/volunteers.js')).default);

// ✅ Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ✅ Status Check - Using PostgreSQL
app.get('/status', async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.query('SELECT NOW()');
    res.json({
      status: 'ok',
      db: 'connected',
      time: result.rows[0].now
    });
  } catch (err) {
    res.json({
      status: 'error',
      db: 'disconnected',
      error: err.message
    });
  }
});

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
