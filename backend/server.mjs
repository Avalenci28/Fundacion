import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import hpp from 'hpp';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar .env ESM
dotenv.config({ path: new URL('./.env', import.meta.url).pathname });

const { validateAndConnectDB } = await import('./validateAndTestServer.js');

const app = express();

// ✅ Status Check
app.get('/status', (req, res) => {
  const readyState = mongoose.connection.readyState;
  
  if (readyState === 1) {
    res.json({
      status: 'ok',
      db: 'connected',
      host: mongoose.connection.host,
      dbName: mongoose.connection.name
    });
  } else {
    res.json({
      status: 'error',
      db: 'disconnected'
    });
  }
});

// ✅ Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const startServer = async () => {
  try {
    // ✅ Validación y conexión a la base de datos
// await validateAndConnectDB();
    
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

  } catch (error) {
    console.error('❌ Error iniciando servidor:', error);
    process.exit(1);
  }
};

startServer();
